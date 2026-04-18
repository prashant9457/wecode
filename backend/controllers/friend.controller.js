const { Friend, Submission, FriendRequest } = require('../models/friend.model');

const getFeed = async (req, res) => {
  try {
    const friendIds = await Friend.getFriendIds(req.user.userId);
    const submissions = await Submission.getFeed([...friendIds, req.user.userId]);
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;

  if (userId === friendId) {
    return res.status(400).json({ error: "You cannot initiate a link with yourself" });
  }

  try {
    const data = await FriendRequest.sendRequest(userId, friendId);
    res.status(201).json({ message: 'Neural link request transmitted', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.getPendingRequests(req.user.userId);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleRequestAction = async (req, res) => {
  const { requestId, action } = req.body; // action: 'accepted' or 'rejected'
  const userId = req.user.userId;

  if (!['accepted', 'rejected'].includes(action)) {
    return res.status(400).json({ error: 'Invalid tactical action' });
  }

  try {
    const data = await FriendRequest.updateRequestStatus(requestId, action, userId);
    res.status(200).json({ message: `Link request ${action}`, data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFriendsList = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const friends = await Friend.getFriendsByUserId(userId);
    console.log(`FETCHED FRIENDS FOR ${userId}:`, friends.length);
    res.status(200).json(friends);
  } catch (error) {
    console.error('getFriendsList Error:', error);
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

module.exports = { 
  getFeed, 
  sendFriendRequest, 
  getPendingRequests, 
  handleRequestAction,
  getFriendsList, 
  getDashboardStats,
  removeFriend
};
