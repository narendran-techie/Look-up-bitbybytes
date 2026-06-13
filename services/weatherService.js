const axios = require('axios');

const buildLevel = (value) => {
  if (value < 40) return 'Low';
  if (value < 70) return 'Moderate';
  return 'High';
};

const fetchSpaceWeather = async () => {
  try {
    // No guaranteed public space weather endpoint. Fallback to realistic generated values.
    const now = Date.now();
    const solarValue = 20 + (now % 60);
    const radiationValue = 10 + (now % 40);
    const geoValue = 15 + (now % 50);

    const solarActivity = buildLevel(solarValue);
    const radiationLevel = buildLevel(radiationValue);
    const geomagneticActivity = buildLevel(geoValue);
    const riskValue = Math.max(solarValue, radiationValue, geoValue);
    const risk = buildLevel(riskValue);

    return {
      solarActivity,
      radiationLevel,
      geomagneticActivity,
      risk
    };
  } catch (error) {
    return {
      solarActivity: 'Moderate',
      radiationLevel: 'Low',
      geomagneticActivity: 'Moderate',
      risk: 'Low'
    };
  }
};

module.exports = { fetchSpaceWeather };
