const axios = require('axios');

const fetchUpcomingLaunches = async () => {
  try {
    const response = await axios.get('https://api.spacexdata.com/v5/launches/upcoming', { timeout: 10000 });
    return response.data.map(launch => ({
      id: launch.id,
      name: launch.name,
      date_utc: launch.date_utc,
      date_unix: launch.date_unix,
      details: launch.details || 'No details available yet.',
      flight_number: launch.flight_number,
      success: launch.success,
      launchpad: launch.launchpad // Could fetch launchpad details separately, but keep it simple
    }));
  } catch (error) {
    console.error('SpaceX API Error:', error.message);
    throw new Error('Failed to fetch SpaceX launches');
  }
};

module.exports = { fetchUpcomingLaunches };
