const friendService = require('../services/friendService');

exports.sendRequest = async (req, res) => {
  try {
    const { receiver_id } = req.body;
    const sender_id = req.user.id || req.user.userId;

    if (!receiver_id) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }

    const data = await friendService.sendRequest(sender_id, receiver_id);
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

    await friendService.acceptRequest(request_id);
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
