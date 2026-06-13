const issService = require('../services/issService');

const getISSLocation = async (req, res, next) => {
  try {
    const data = await issService.fetchISSLocation();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getISSLocation };