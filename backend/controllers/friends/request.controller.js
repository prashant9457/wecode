const { Friend, FriendRequest } = require('../../models/friend.model');
const socketManager = require('../../src/socket');
const fs = require('fs');
const path = require('path');

const logMsg = (msg) => {
    const line = `[${new Date().toISOString()}] [FRIEND_REQ_CTRL] ${msg}\n`;
    fs.appendFileSync(path.join(__dirname, '../../debug.log'), line);
};

const sendFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;

  logMsg(`sendFriendRequest START - userId: ${userId}, friendId: ${friendId}`);

  if (!friendId) {
    logMsg(`ERROR: Missing friendId`);
    return res.status(400).json({ error: "Target operative ID missing from transmission" });
  }

  if (userId === friendId) {
    logMsg(`ERROR: Self-link attempt`);
    return res.status(400).json({ error: "You cannot initiate a link with yourself" });
  }

  try {
    logMsg(`Checking existing link...`);
    const isFriend = await Friend.isFriend(userId, friendId);
    if (isFriend) {
      logMsg(`WARN: Already friends`);
      return res.status(400).json({ error: "Neural link already established with this operative" });
    }

    logMsg(`Checking existing requests...`);
    const existingStatus = await FriendRequest.getRequestStatus(userId, friendId);
    if (existingStatus === 'pending') {
      logMsg(`WARN: Request pending`);
      return res.status(400).json({ error: "A neural invitation is already in transit for this operative" });
    }
    
    logMsg(`Transmitting new request via model...`);
    const data = await FriendRequest.sendRequest(userId, friendId);
    
    if (data) {
      logMsg(`SUCCESS: Request created, notifying receiver: ${friendId}`);
      socketManager.emitToUser(friendId, "friend_request_received", {
        sender_id: userId,
        request: data
      });
    }

    res.status(201).json({ message: 'Neural link request transmitted', data });
  } catch (error) {
    logMsg(`EXCEPTION: ${error.message}`);
    res.status(400).json({ error: error.message || 'Transmission failure at neural core' });
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

const getSentRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.getSentRequests(req.user.userId);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleRequestAction = async (req, res) => {
  const { requestId, action } = req.body;
  const userId = req.user.userId;

  if (!['accepted', 'rejected'].includes(action)) {
    return res.status(400).json({ error: 'Invalid tactical action' });
  }

  try {
    const data = await FriendRequest.updateRequestStatus(requestId, action, userId);
    
    if (action === 'accepted') {
      socketManager.emitToUser(data.sender_id, "friend_request_accepted", { friend_id: data.receiver_id });
      socketManager.emitToUser(data.receiver_id, "friend_request_accepted", { friend_id: data.sender_id });
    } else if (action === 'rejected') {
      socketManager.emitToUser(data.sender_id, "friend_request_rejected", { receiver_id: data.receiver_id });
    }

    res.status(200).json({ message: `Link request ${action}`, data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const cancelFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;

  try {
    await FriendRequest.cancelRequest(userId, friendId);
    socketManager.emitToUser(friendId, "friend_request_canceled", { sender_id: userId });
    res.status(200).json({ message: 'Neural invitation revoked' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { 
  sendFriendRequest, 
  getPendingRequests, 
  getSentRequests, 
  handleRequestAction, 
  cancelFriendRequest 
};
