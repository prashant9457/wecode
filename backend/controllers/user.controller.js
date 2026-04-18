const { User, CodingProfile } = require('../models/user.model');
const { Friend, Submission, FriendRequest } = require('../models/friend.model');
const { supabase } = require('../config/db');

const fs = require('fs');
const path = require('path');

const getProfile = async (req, res) => {
  const { username } = req.params;
  const viewerId = req.user ? req.user.userId : null;

  const logMsg = (msg) => {
      const line = `[${new Date().toISOString()}] ${msg}\n`;
      fs.appendFileSync(path.join(__dirname, '../debug.log'), line);
  };

  logMsg(`FETCHING PROFILE FOR: ${username}`);

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      logMsg(`USER NOT FOUND: ${username}`);
      return res.status(404).json({ error: 'Profile not found' });
    }

    logMsg(`USER FOUND: ${user.id}, fetching extra data...`);

    user.coding_profiles = await CodingProfile.findByUserId(user.id);
    user.solved_count = await Submission.getTotalSolved(user.id);
    
    // Fetch Extended Profile Data
    logMsg(`Fetching from tables...`);
    const results = await Promise.all([
      supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('academic_details').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('technical_profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('user_skills').select('skills(id, name)').eq('user_id', user.id)
    ]);

    const userProfile = results[0].data;
    const academicDetails = results[1].data;
    const technicalProfiles = results[2].data;
    const userSkillsData = results[3].data;

    if (results.some(r => r.error)) {
        logMsg(`Supabase Error detected: ${JSON.stringify(results.map(r => r.error))}`);
    }
    
    // Attach to user object for ProfilePage
    user.extended_profile = userProfile || null;
    user.academic_details = academicDetails || null;
    user.technical_profiles = technicalProfiles || null;
    user.skills = userSkillsData ? userSkillsData.filter(s => s.skills).map(s => s.skills) : [];
    
    // Check friendship status if viewer is logged in and not looking at self
    if (viewerId && viewerId !== user.id) {
      user.is_friend = await Friend.isFriend(viewerId, user.id);
      user.request_status = await FriendRequest.getRequestStatus(viewerId, user.id);
    }

    logMsg(`PROFILE FETCH COMPLETE FOR: ${username}`);
    res.status(200).json(user);
  } catch (error) {
    logMsg(`PROFILE FETCH ERROR: ${error.stack}`);
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const { 
    username, 
    extra_data, 
    profile_picture, 
    coding_profiles, 
    extended_profile, 
    academic_details, 
    technical_profiles, 
    skills 
  } = req.body;

  try {
    // 1. Update Base User Table
    const updatePayload = {};
    if (username) updatePayload.username = username;
    if (extra_data) updatePayload.extra_data = extra_data;
    if (profile_picture) updatePayload.profile_picture = profile_picture;

    const user = Object.keys(updatePayload).length > 0 
      ? await User.updateUser(userId, updatePayload)
      : await User.findByUsername(req.params.username);

    // 2. Update Coding Profiles
    if (coding_profiles && Array.isArray(coding_profiles)) {
      await CodingProfile.updateProfiles(userId, coding_profiles);
    }

    // 3. Upsert Extended Profile (user_id is PK)
    if (extended_profile) {
      const { error: extErr } = await supabase.from('user_profiles').upsert({
        user_id: userId,
        full_name: extended_profile.full_name || null,
        bio: extended_profile.bio || null,
        avatar_url: extended_profile.avatar_url || null
      });
      if (extErr) throw extErr;
    }

    // 4. Upsert Academic Details
    if (academic_details) {
      // Look for existing record to get its ID if we need to update
      const { data: existing } = await supabase.from('academic_details')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      const academicPayload = {
        user_id: userId,
        college_name: academic_details.college_name || null,
        degree: academic_details.degree || null,
        branch: academic_details.branch || null,
        year_of_study: academic_details.year_of_study || null,
        cgpa: academic_details.cgpa || null
      };

      if (existing) {
        const { error } = await supabase.from('academic_details').update(academicPayload).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('academic_details').insert(academicPayload);
        if (error) throw error;
      }
    }

    // 5. Upsert Technical Profiles
    if (technical_profiles) {
      const { data: existing } = await supabase.from('technical_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      const techPayload = {
        user_id: userId,
        github_url: technical_profiles.github_url || null,
        linkedin_url: technical_profiles.linkedin_url || null,
        portfolio_url: technical_profiles.portfolio_url || null
      };

      if (existing) {
        const { error } = await supabase.from('technical_profiles').update(techPayload).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('technical_profiles').insert(techPayload);
        if (error) throw error;
      }
    }

    // 6. Update Skills
    if (skills && Array.isArray(skills)) {
      await supabase.from('user_skills').delete().eq('user_id', userId);

      if (skills.length > 0) {
        // Find existing skills
        const { data: existingSkills } = await supabase.from('skills')
          .select('id, name')
          .in('name', skills);
        
        const existingSkillNames = existingSkills ? existingSkills.map(s => s.name) : [];
        const existingSkillIds = existingSkills ? existingSkills.map(s => s.id) : [];

        // Insert new skills
        const missingSkillNames = skills.filter(s => !existingSkillNames.includes(s));
        let newSkillIds = [];
        
        if (missingSkillNames.length > 0) {
          const { data: insertedSkills, error: insErr } = await supabase.from('skills')
            .insert(missingSkillNames.map(name => ({ name })))
            .select('id');
          if (insErr) throw insErr;
          if (insertedSkills) {
            newSkillIds = insertedSkills.map(s => s.id);
          }
        }

        const allSkillIdsToLink = [...existingSkillIds, ...newSkillIds];

        if (allSkillIdsToLink.length > 0) {
          const { error: linkErr } = await supabase.from('user_skills').insert(
            allSkillIdsToLink.map(skill_id => ({ user_id: userId, skill_id }))
          );
          if (linkErr) throw linkErr;
        }
      }
    }

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  const { username } = req.params;
  if (req.user.username !== username) {
    return res.status(403).json({ error: 'Unauthorized to delete this profile' });
  }

  try {
    await User.deleteByUsername(username);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ... (other controllers)

const searchUsers = async (req, res) => {
  const { q } = req.query;
  const currentUserId = req.user?.userId;

  if (!q || q.trim().length < 2) {
    return res.status(200).json([]);
  }

  try {
    const operatives = await User.searchUsers(q.trim(), currentUserId);
    
    const enrichedResults = await Promise.all(operatives.map(async (op) => {
      const isFriend = await Friend.isFriend(currentUserId, op.id);
      const requestStatus = await FriendRequest.getRequestStatus(currentUserId, op.id);
      return { 
        ...op, 
        is_friend: isFriend,
        request_status: requestStatus // 'pending', 'accepted', 'rejected' or null
      };
    }));

    res.status(200).json(enrichedResults);
  } catch (error) {
    console.error('SEARCH FAILURE:', error.message);
    res.status(500).json({ error: 'Search operation failed' });
  }
};

const getCodingProfiles = async (req, res) => {
  try {
    const profiles = await CodingProfile.findByUserId(req.user.userId);
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProfile, updateProfile, deleteProfile, searchUsers, getCodingProfiles };
