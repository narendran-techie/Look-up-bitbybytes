const axios = require('axios');
const { OPEN_NOTIFY_API_URL } = require('../config/constants');

const fetchISSLocation = async () => {
  try {
    const apiKey = process.env.N2YO_API_KEY;
    if (!apiKey) throw new Error('N2YO_API_KEY missing');

    const url = `https://api.n2yo.com/rest/v1/satellite/positions/25544/0/0/0/1/&apiKey=${apiKey}`;
    const response = await axios.get(url, { timeout: 10000 });
    const payload = response.data;

    if (!payload || !payload.positions || payload.positions.length === 0) {
      throw new Error('Invalid N2YO ISS response');
    }

    const pos = payload.positions[0];
    const latitude = parseFloat(pos.satlatitude);
    const longitude = parseFloat(pos.satlongitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Invalid ISS coordinates');
    }

    return {
      success: true,
      name: 'ISS',
      latitude: latitude,
      longitude: longitude,
      lat: latitude,
      lng: longitude,
      altitude: parseFloat(pos.sataltitude) || 408,
      velocity: 28000, 
      timestamp: new Date(pos.timestamp * 1000).toISOString(),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('[ISS Location Error]', error.message);
    
    // Return fallback with simulated realistic data
    return {
      success: false,
      name: 'ISS',
      latitude: 51.6 + (Math.random() - 0.5) * 10,
      longitude: -0.1 + (Math.random() - 0.5) * 10,
      altitude: 408,
      velocity: 27600,
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      error: 'Failed to fetch ISS location',
      message: 'Using simulated data'
    };
  }
};

module.exports = { fetchISSLocation };