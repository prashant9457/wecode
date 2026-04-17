const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/feed', authenticateToken, friendController.getFeed);
router.post('/friends/add', authenticateToken, friendController.sendFriendRequest);
router.get('/friends', authenticateToken, friendController.getFriendsList);
router.delete('/friends/remove', authenticateToken, friendController.removeFriend);
router.get('/requests/pending', authenticateToken, friendController.getPendingRequests);
router.post('/requests/action', authenticateToken, friendController.handleRequestAction);
router.get('/dashboard/stats', authenticateToken, friendController.getDashboardStats);

module.exports = router;
