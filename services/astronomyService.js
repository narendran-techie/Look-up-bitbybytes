const axios = require('axios');

const getAstronomyData = async (latitude = 0, longitude = 0) => {
  const apiKey = process.env.ASTRONOMY_API_KEY;
  const fallback = {
    date: new Date().toISOString(),
    sunrise: null,
    sunset: null,
    moonrise: null,
    moonset: null,
    moonPhase: 'Unknown',
    moonIllumination: 0,
    moonAge: 0,
    sunDistance: null,
    moonDistance: null,
    timezone: 'UTC'
  };

  try {
    if (!apiKey) throw new Error('ASTRONOMY_API_KEY not found');
    const response = await axios.get(
      `https://api.ipgeolocation.io/astronomy?apiKey=${apiKey}&lat=${latitude}&long=${longitude}`,
      { timeout: 10000 }
    );

    const data = response.data || {};
    const illumination = parseFloat(data.moon_illumination || data.moon_illumination_pct || data.moonIllumination || 0);

    return {
      date: data.date || new Date().toISOString(),
      sunrise: data.sunrise || null,
      sunset: data.sunset || null,
      moonrise: data.moonrise || null,
      moonset: data.moonset || null,
      moonPhase: data.moon_phase || data.moon_phase_name || 'Unknown',
      moonIllumination: Number.isFinite(illumination) ? illumination : 0,
      moonAge: parseFloat(data.moon_age || data.moonage || 0) || 0,
      sunDistance: parseFloat(data.sun_distance || 0) || 0,
      moonDistance: parseFloat(data.moon_distance || 0) || 0,
      timezone: data.timezone || data.timezone_name || 'UTC'
    };
  } catch (error) {
    console.error('[Astronomy Service Error]', error.message);
    return fallback;
  }
};

module.exports = { getAstronomyData };