const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const { authenticateToken } = require('../../middleware/auth.middleware');

router.use(authenticateToken);

router.post('/request', friendController.sendRequest);
router.post('/accept', friendController.acceptRequest);
router.post('/reject', friendController.rejectRequest);
router.get('/requests/incoming', friendController.getIncoming);
router.get('/', friendController.getFriends);

module.exports = router;
