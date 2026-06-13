const weatherService = require('../services/weatherService');

const getSpaceWeather = async (req, res, next) => {
  try {
    const weather = await weatherService.fetchSpaceWeather();
    res.status(200).json(weather);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSpaceWeather };
