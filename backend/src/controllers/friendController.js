const friendService = require('../services/friendService');
const socketManager = require('../socket');

exports.sendRequest = async (req, res) => {
  try {
    const { receiver_id } = req.body;
    const sender_id = req.user.id || req.user.userId;

    if (!receiver_id) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }

    const data = await friendService.sendRequest(sender_id, receiver_id);
    
    // Emit real-time event to receiver
    socketManager.emitToUser(receiver_id, "friend_request_received", {
      sender_id,
      request: data
    });

    res.status(201).json({ message: "Request sent successfully", data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { request_id } = req.body;

    if (!request_id) {
      return res.status(400).json({ error: "Request ID is required" });
    }

    const request = await friendService.acceptRequest(request_id);
    
    // Emit real-time event to the original sender
    socketManager.emitToUser(request.sender_id, "friend_request_accepted", {
      friend_id: request.receiver_id,
      message: "Your friend request was accepted!"
    });

    // Also notify the current user (receiver) in case they have multiple tabs
    socketManager.emitToUser(request.receiver_id, "friend_request_accepted", {
      friend_id: request.sender_id,
      message: "You accepted a friend request!"
    });

    res.status(200).json({ message: "Request accepted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { request_id } = req.body;

    if (!request_id) {
      return res.status(400).json({ error: "Request ID is required" });
    }

    await friendService.rejectRequest(request_id);
    res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getIncoming = async (req, res) => {
  try {
    const user_id = req.user.id || req.user.userId;
    const requests = await friendService.getIncoming(user_id);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const user_id = req.user.id || req.user.userId;
    const friendsData = await friendService.getFriends(user_id);
    res.status(200).json(friendsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
