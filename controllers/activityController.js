const activityService = require('../services/activityService');

const getActivityFeed = async (req, res, next) => {
  try {
    const activity = await activityService.fetchActivityFeed();
    res.status(200).json(activity);
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivityFeed };
