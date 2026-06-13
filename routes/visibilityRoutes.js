const express = require('express');
const router = express.Router();
const {
  getLocationInfo,
  getISSVisibilityInfo,
  getPlanetsVisibility,
  getMoonInfo,
  getEclipses,
  getConditions,
  getEvents,
  getVisibilitySummary
} = require('../controllers/visibilityController');
const { getSatellites } = require('../controllers/satelliteController');

// Location information
router.get('/location', getLocationInfo);

// ISS visibility from location
router.get('/iss', getISSVisibilityInfo);

// Planet visibility from location
router.get('/planets', getPlanetsVisibility);

// Moon phase and information
router.get('/moon', getMoonInfo);

// Eclipse information
router.get('/eclipse', getEclipses);

// Observation conditions (weather)
router.get('/conditions', getConditions);
router.get('/weather', getConditions);

// Astronomical events
router.get('/events', getEvents);

// Satellite sources and visibility layers
router.get('/satellites', getSatellites);

// Complete visibility summary for a location
router.get('/summary', getVisibilitySummary);

module.exports = router;
