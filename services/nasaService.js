const axios = require('axios');
const { NASA_APOD_URL, NASA_NEO_URL } = require('../config/constants');

const buildDistance = (kilometers) => {
  const value = Number(kilometers) / 1000000;
  return `${value.toFixed(2)} million km`;
};

const fetchApod = async () => {
  const apiKey = process.env.NASA_API_KEY;
  console.log('NASA_API_KEY present:', Boolean(apiKey));
  console.log('NASA APOD URL:', NASA_APOD_URL);

  if (!apiKey) {
    return {
      title: 'Stargazing at Dawn',
      image: 'https://space.com/images/default-apod.jpg',
      description: 'A vivid snapshot of Earth’s horizon as the day begins in low orbit.'
    };
  }

  try {
    const response = await axios.get(NASA_APOD_URL, {
      params: { api_key: apiKey },
      timeout: 9000
    });

    return {
      title: response.data.title || 'Astronomy Picture of the Day',
      image: response.data.url || response.data.hdurl || '',
      date: response.data.date || new Date().toISOString().split('T')[0],
      description: response.data.explanation || 'NASA Astronomy Picture of the Day.'
    };
  } catch (error) {
    const message = error.response
      ? `NASA APOD failed: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
      : `NASA APOD failed: ${error.message}`;
    const err = new Error(message);
    err.statusCode = error.response?.status || 500;
    throw err;
  }
};

const fetchAsteroids = async () => {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    return [
      { name: '2025 AB', hazardous: false, distance: '2.30 million km' },
      { name: '2026 ZX', hazardous: true, distance: '5.48 million km' },
      { name: '2027 LW', hazardous: false, distance: '8.10 million km' }
    ];
  }

  const today = new Date().toISOString().split('T')[0];
  try {
    const response = await axios.get(NASA_NEO_URL, {
      params: { api_key: apiKey, start_date: today, end_date: today },
      timeout: 10000
    });

    const neos = response.data.near_earth_objects?.[today] || [];
    if (!Array.isArray(neos) || neos.length === 0) {
      return [
        { name: '2025 AB', hazardous: false, distance: '2.30 million km' }
      ];
    }

    return neos.slice(0, 8).map((item) => {
      const approach = item.close_approach_data?.[0] || {};
      return {
        name: item.name || 'Unknown',
        hazardous: Boolean(item.is_potentially_hazardous_asteroid),
        distance: buildDistance(approach.miss_distance?.kilometers || '0'),
        velocity: approach.relative_velocity?.kilometers_per_second ? `${Number(approach.relative_velocity.kilometers_per_second).toFixed(2)} km/s` : 'Unknown',
        approachTime: approach.close_approach_date_full || approach.close_approach_date || 'Unknown'
      };
    });
  } catch (error) {
    const message = error.response
      ? `NASA NEO feed failed: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
      : `NASA NEO feed failed: ${error.message}`;
    const err = new Error(message);
    err.statusCode = error.response?.status || 500;
    throw err;
  }
};

module.exports = { fetchApod, fetchAsteroids };
