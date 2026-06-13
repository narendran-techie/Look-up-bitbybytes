const axios = require('axios');

// Get observation conditions from weather API
const getObservationConditions = async (latitude, longitude) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return getSimulatedWeatherData();
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`,
      { timeout: 10000 }
    );

    const data = response.data;
    const cloudCover = data.clouds?.all || 0;
    const humidity = data.main?.humidity || 50;
    const visibility = data.visibility || 10000;

    const skyQuality = Math.max(0, 100 - cloudCover - (humidity - 50) * 0.5);

    return {
      cloudCover: cloudCover,
      humidity: humidity,
      visibility: visibility,
      temperature: data.main?.temp || 20,
      windSpeed: data.wind?.speed || 0,
      condition: data.weather?.[0]?.main || 'Clear',
      description: data.weather?.[0]?.description || 'Clear sky',
      skyQuality: Math.round(skyQuality),
      observationRating: getObservationRating(cloudCover, humidity),
      recommendation: getObservationRecommendation(cloudCover, humidity),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Weather Error]', error.message);
    return getSimulatedWeatherData();
  }
};

const getSimulatedWeatherData = () => ({
  cloudCover: Math.random() * 50,
  humidity: 40 + Math.random() * 30,
  visibility: 8 + Math.random() * 2,
  temperature: 15 + Math.random() * 15,
  windSpeed: Math.random() * 10,
  condition: 'Partly Cloudy',
  description: 'Partly cloudy sky',
  skyQuality: 70 + Math.random() * 25,
  observationRating: 'Good',
  recommendation: 'Excellent viewing conditions expected',
  source: 'Simulated'
});

const getObservationRating = (cloudCover, humidity) => {
  if (cloudCover < 20 && humidity < 60) return 'Excellent';
  if (cloudCover < 40 && humidity < 70) return 'Good';
  if (cloudCover < 60 && humidity < 80) return 'Fair';
  return 'Poor';
};

const getObservationRecommendation = (cloudCover, humidity) => {
  if (cloudCover < 20 && humidity < 60) return 'Perfect conditions for observation';
  if (cloudCover < 40 && humidity < 70) return 'Good conditions, light clouds may interfere';
  if (cloudCover < 60 && humidity < 80) return 'Moderate clouds, patience recommended';
  return 'Poor conditions, consider observing tomorrow';
};

module.exports = { getObservationConditions };
