const spacexService = require('../services/spacexService');

const getLaunches = async (req, res, next) => {
  try {
    const launches = await spacexService.fetchUpcomingLaunches();
    res.status(200).json({ success: true, data: launches });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLaunches };
