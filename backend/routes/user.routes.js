const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/profile/:username', userController.getProfile);
router.put('/profile/:username', authenticateToken, userController.updateProfile);
router.delete('/profile/:username', authenticateToken, userController.deleteProfile);
router.get('/users/search', authenticateToken, userController.searchUsers);
router.get('/profile/leetcode/:username', userController.getLeetCodeStats);
router.get('/coding-profiles', authenticateToken, userController.getCodingProfiles);

module.exports = router;
