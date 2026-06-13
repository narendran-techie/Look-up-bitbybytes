const nasaService = require('../services/nasaService');

const getApod = async (req, res, next) => {
  try {
    const apod = await nasaService.fetchApod();
    res.status(200).json(apod);
  } catch (error) {
    next(error);
  }
};

const getAsteroids = async (req, res, next) => {
  try {
    const asteroids = await nasaService.fetchAsteroids();
    res.status(200).json(asteroids);
  } catch (error) {
    next(error);
  }
};

module.exports = { getApod, getAsteroids };
