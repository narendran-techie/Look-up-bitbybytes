const { getLocationDetails } = require('../services/locationService');
const { getISSVisibility } = require('../services/issVisibilityService');
const { getPlanetVisibility } = require('../services/planetVisibilityService');
const { getAstronomyData } = require('../services/astronomyService');
const { getEclipseData } = require('../services/eclipseService');
const { getObservationConditions } = require('../services/observationConditionsService');
const { getAstronomicalEvents } = require('../services/astronomyEventsService');

const parseLatLng = (latitude, longitude) => {
  if (latitude === undefined || longitude === undefined) return null;
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
};

// Helper to get coords from query or URL params
const getCoordinates = (req) => {
  // Try URL params first (e.g., /api/location/:lat/:lng)
  if (req.params && req.params.lat !== undefined && req.params.lng !== undefined) {
    return parseLatLng(req.params.lat, req.params.lng);
  }
  // Fall back to query params (e.g., ?latitude=...&longitude=...)
  const { latitude, longitude } = req.query;
  return parseLatLng(latitude, longitude);
};

const getLocationInfo = async (req, res, next) => {
  try {
    const coords = getCoordinates(req);

    if (!coords) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude required or invalid'
      });
    }

    const { lat, lng } = coords;

    const location = await getLocationDetails(lat, lng);
    res.json({ success: true, data: location });
  } catch (error) {
    console.error('[Location Controller Error]', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get ISS visibility
const getISSVisibilityInfo = async (req, res, next) => {
  try {
    const coords = getCoordinates(req);

    if (!coords) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude required or invalid'
      });
    }

    const { lat, lng } = coords;

    const issData = await getISSVisibility(lat, lng);
    res.json({ success: true, data: issData });
  } catch (error) {
    console.error('[ISS Visibility Controller Error]', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get planet visibility
const getPlanetsVisibility = async (req, res, next) => {
  try {
    const coords = getCoordinates(req);

    if (!coords) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude required or invalid'
      });
    }

    const { lat, lng } = coords;

    const planetsData = await getPlanetVisibility(lat, lng);
    res.json({ success: true, data: planetsData });
  } catch (error) {
    console.error('[Planets Controller Error]', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get moon phase and astronomy details
const getMoonInfo = async (req, res, next) => {
  try {
    const coords = getCoordinates(req);
    const lat = coords?.lat || 0;
    const lng = coords?.lng || 0;
    
    const moonData = await getAstronomyData(lat, lng);
    res.json({ success: true, data: moonData });
  } catch (error) {
    console.error('[Moon Controller Error]', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get eclipse data
const getEclipses = async (req, res, next) => {
  try {
    const coords = getCoordinates(req);

    if (!coords) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude required or invalid'
      });
    }

    const { lat, lng } = coords;

    const eclipseData = await getEclipseData(lat, lng);
    res.json({ success: true, data: eclipseData });
  } catch (error) {
    console.error('[Eclipse Controller Error]', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get observation conditions
const getConditions = async (req, res, next) => {
  try {
    const coords = getCoordinates(req);

    if (!coords) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude required or invalid'
      });
    }

    const { lat, lng } = coords;

    const conditions = await getObservationConditions(lat, lng);
    res.json({ success: true, data: conditions });
  } catch (error) {
    console.error('[Conditions Controller Error]', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get astronomical events
const getEvents = async (req, res, next) => {
  try {
    const events = await getAstronomicalEvents();
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('[Events Controller Error]', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get full visibility summary
const getVisibilitySummary = async (req, res, next) => {
  try {
    const coords = getCoordinates(req);

    if (!coords) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude required or invalid'
      });
    }

    const { lat, lng } = coords;

    const location = await getLocationDetails(lat, lng);
    const iss = await getISSVisibility(lat, lng);
    const planets = await getPlanetVisibility(lat, lng);
    const astronomy = await getAstronomyData(lat, lng);
    const eclipse = await getEclipseData(lat, lng);
    const conditions = await getObservationConditions(lat, lng);
    const events = await getAstronomicalEvents();

    const visibleObjects = [];
    
    if (iss.nextPass?.visibility === 'Excellent' || iss.nextPass?.visibility === 'Good') {
      visibleObjects.push('ISS');
    }
    
    planets.planets?.forEach(p => {
      if (p.visible) visibleObjects.push(p.name);
    });

    const summary = {
      location: location,
      visibleObjects: visibleObjects,
      bestViewingWindow: iss.nextPass ? {
        startTime: iss.nextPass.startTime,
        endTime: iss.nextPass.endTime,
        duration: iss.nextPass.duration
      } : null,
      observationRating: conditions.observationRating,
      cloudCover: conditions.cloudCover,
      moonIllumination: astronomy.moonIllumination,
      moonPhase: astronomy.moonPhase,
      sunrise: astronomy.sunrise,
      sunset: astronomy.sunset,
      moonrise: astronomy.moonrise,
      moonset: astronomy.moonset,
      recommendedDuration: calculateRecommendedDuration(conditions),
      recommendation: generateRecommendation(visibleObjects, conditions, astronomy),
      detailedData: {
        location,
        iss,
        planets,
        astronomy,
        eclipse,
        conditions,
        events
      }
    };

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('[Visibility Summary Error]', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const calculateRecommendedDuration = (conditions) => {
  if (conditions.skyQuality > 80) return '60 minutes';
  if (conditions.skyQuality > 60) return '45 minutes';
  if (conditions.skyQuality > 40) return '30 minutes';
  return '20 minutes';
};

const generateRecommendation = (visibleObjects, conditions, astronomy) => {
  let recommendation = `Tonight from ${conditions.temperature}°C: `;

  if (visibleObjects.length > 0) {
    recommendation += `Visible: ${visibleObjects.join(', ')}. `;
  }

  recommendation += `Cloud Cover: ${Math.round(conditions.cloudCover)}%. `;
  recommendation += `Moon Illumination: ${Math.round(astronomy.moonIllumination)}%. `;
  recommendation += conditions.recommendation;

  return recommendation;
};

module.exports = {
  getLocationInfo,
  getISSVisibilityInfo,
  getPlanetsVisibility,
  getMoonInfo,
  getEclipses,
  getConditions,
  getEvents,
  getVisibilitySummary
};
