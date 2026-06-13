const express = require('express');
const router = express.Router();
const { getLocationDetails } = require('../services/locationService');

// Get location info by coordinates
router.get('/', async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude required'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        error: 'Invalid latitude or longitude'
      });
    }

    const location = await getLocationDetails(lat, lng);
    res.json({
      success: true,
      data: location,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Location Route Error]', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
