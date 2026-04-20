const { User, CodingProfile } = require('../models/user.model');
const { Friend, Submission, FriendRequest } = require('../models/friend.model');
const { supabase } = require('../config/db');

const fs = require('fs');
const path = require('path');

const logMsg = (msg) => {
    const line = `[${new Date().toISOString()}] [USER_CTRL] ${msg}\n`;
    const logPath = path.join(__dirname, '../debug.log');
    fs.appendFileSync(logPath, line);
};

const getProfile = async (req, res) => {
  const { username } = req.params;
  const viewerId = req.user ? req.user.userId : null;

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
  const username_param = req.params.username;
  
  logMsg(`STARTING UPDATE FOR USER: ${userId} (${username_param})`);

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
        portfolio_url: technical_profiles.portfolio_url || null,
        leetcode_url: technical_profiles.leetcode_url || null
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
    logMsg(`CRITICAL UPDATE ERROR: ${error.message} \nStack: ${error.stack}`);
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
    
    // Fetch all current operative's relevant requests to ensure absolute detection accuracy
    const { data: allRequests } = await supabase
      .from('friend_requests')
      .select('*')
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .order('created_at', { ascending: false }); // Prioritize newest records

    logMsg(`searchUsers allRequests for ${currentUserId}: ${JSON.stringify(allRequests)}`);

    const enrichedResults = operatives.map((op) => {
      // Definite local lookup for existing request (now picks newest due to sorting)
      const request = allRequests?.find(r => 
        (r.sender_id === currentUserId && r.receiver_id === op.id) || 
        (r.sender_id === op.id && r.receiver_id === currentUserId)
      );

      logMsg(`lookup op ${op.username} (${op.id}) - request found: ${JSON.stringify(request)}`);

      return { 
        ...op, 
        is_friend: false, 
        request_status: (request && request.status === 'pending') ? 'pending' : null,
        request_sender_id: request ? request.sender_id : null
      };
    });

    // Final friend status verification (parallel)
    await Promise.all(enrichedResults.map(async (res) => {
      res.is_friend = await Friend.isFriend(currentUserId, res.id);
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

const getLeetCodeStats = async (req, res) => {
  const { username } = req.params;
  
  const query = `
    query userSessionProgress($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        submissionCalendar
        profile {
          ranking
          reputation
        }
      }
      recentAcSubmissionList(username: $username, limit: 5) {
        title
        titleSlug
        timestamp
      }
    }
  `;

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query: query,
        variables: { username }
      })
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(404).json({ error: 'LeetCode user not found' });
    }

    const { matchedUser, allQuestionsCount } = data.data;
    if (!matchedUser) return res.status(404).json({ error: 'User not found' });

    // Format like the proxy API to maintain frontend compatibility
    const stats = {
      status: 'success',
      totalSolved: matchedUser.submitStats.acSubmissionNum.find(d => d.difficulty === 'All')?.count || 0,
      totalQuestions: allQuestionsCount.find(d => d.difficulty === 'All')?.count || 0,
      easySolved: matchedUser.submitStats.acSubmissionNum.find(d => d.difficulty === 'Easy')?.count || 0,
      mediumSolved: matchedUser.submitStats.acSubmissionNum.find(d => d.difficulty === 'Medium')?.count || 0,
      hardSolved: matchedUser.submitStats.acSubmissionNum.find(d => d.difficulty === 'Hard')?.count || 0,
      totalEasy: allQuestionsCount.find(d => d.difficulty === 'Easy')?.count || 0,
      totalMedium: allQuestionsCount.find(d => d.difficulty === 'Medium')?.count || 0,
      totalHard: allQuestionsCount.find(d => d.difficulty === 'Hard')?.count || 0,
      ranking: matchedUser.profile.ranking,
      submissionCalendar: matchedUser.submissionCalendar,
      recentSubmissions: data.data.recentAcSubmissionList || [],
      acceptanceRate: 0 
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch LeetCode data' });
  }
};

module.exports = { getProfile, updateProfile, deleteProfile, searchUsers, getCodingProfiles, getLeetCodeStats };
