const { Friend, Submission } = require('../../models/friend.model');

const getFeed = async (req, res) => {
  try {
    const friendIds = await Friend.getFriendIds(req.user.userId);
    const submissions = await Submission.getFeed([...friendIds, req.user.userId]);
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getFeed };
