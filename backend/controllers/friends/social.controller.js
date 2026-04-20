const { Friend, Submission, FriendRequest } = require('../../models/friend.model');
const fs = require('fs');
const path = require('path');

const getFriendsList = async (req, res) => {
  const userId = req.user.id || req.user.userId;
  const logPath = path.join(__dirname, '../../debug.log');
  fs.appendFileSync(logPath, `[${new Date().toISOString()}] [SOCIAL_CTRL] getFriendsList START for: ${userId}\n`);

  try {
    const friends = await Friend.getFriendsByUserId(userId);
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] [SOCIAL_CTRL] getFriendsList SUCCESS: Found ${friends.length} agents\n`);
    res.status(200).json(friends);
  } catch (error) {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] [SOCIAL_CTRL] getFriendsList ERROR: ${error.message}\n`);
    res.status(500).json({ error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const friends = await Friend.getFriendsByUserId(userId);
    const pendingRequests = await FriendRequest.getPendingRequests(userId);
    const totalSolved = await Submission.getTotalSolved(userId);
    const recentSolved = await Submission.getRecentSolved(userId);
    
    res.status(200).json({
      totalFriends: friends.length,
      pendingCount: pendingRequests.length,
      friends: friends.slice(0, 5),
      totalSolved,
      recentSolved
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFriend = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;

  try {
    await Friend.removeFriend(userId, friendId);
    res.status(200).json({ message: 'Neural link severed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getFriendsList, getDashboardStats, removeFriend };
