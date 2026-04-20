const feedController = require('./feed.controller');
const requestController = require('./request.controller');
const socialController = require('./social.controller');

module.exports = {
  ...feedController,
  ...requestController,
  ...socialController
};
