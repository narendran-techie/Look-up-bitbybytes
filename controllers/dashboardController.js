const issService = require('../services/issService');
const weatherService = require('../services/weatherService');
const satelliteService = require('../services/satelliteService');
const activityService = require('../services/activityService');
const nasaService = require('../services/nasaService');

const getDashboardOverview = async (req, res, next) => {
  try {
    const [iss, weather, satellites, activity, asteroids] = await Promise.all([
      issService.fetchISSLocation(),
      weatherService.fetchSpaceWeather(),
      satelliteService.fetchSatellites(),
      activityService.fetchActivityFeed(),
      nasaService.fetchAsteroids()
    ]);

    const activeAlerts = asteroids.filter((item) => item.hazardous).length;

    res.status(200).json({
      iss,
      spaceWeather: weather,
      satelliteCount: satellites.length,
      activeAlerts,
      latestActivity: activity.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardOverview };
