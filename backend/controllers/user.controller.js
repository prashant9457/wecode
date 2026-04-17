const { User, CodingProfile } = require('../models/user.model');
const { Friend, Submission, FriendRequest } = require('../models/friend.model');

const getProfile = async (req, res) => {
  const { username } = req.params;
  const viewerId = req.user ? req.user.userId : null;

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    user.coding_profiles = await CodingProfile.findByUserId(user.id);
    user.solved_count = await Submission.getTotalSolved(user.id);
    
    // Check friendship status if viewer is logged in and not looking at self
    if (viewerId && viewerId !== user.id) {
      user.is_friend = await Friend.isFriend(viewerId, user.id);
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const { username, extra_data, profile_picture, coding_profiles } = req.body;

  try {
    const updatePayload = {};
    if (username) updatePayload.username = username;
    if (extra_data) updatePayload.extra_data = extra_data;
    if (profile_picture) updatePayload.profile_picture = profile_picture;

    const user = await User.updateUser(userId, updatePayload);

    let updatedCodingProfiles = [];
    if (coding_profiles && Array.isArray(coding_profiles)) {
      updatedCodingProfiles = await CodingProfile.updateProfiles(userId, coding_profiles);
    } else {
      updatedCodingProfiles = await CodingProfile.findByUserId(userId);
    }

    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user, 
      coding_profiles: updatedCodingProfiles 
    });
  } catch (error) {
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
