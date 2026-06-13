const satelliteService = require('../services/satelliteService');

const getSatellites = async (req, res, next) => {
  try {
    const { latitude, longitude, altitude } = req.query;
    
    const lat = parseFloat(latitude) || 0;
    const lng = parseFloat(longitude) || 0;
    const alt = parseFloat(altitude) || 0;
    
    console.log('[Satellite Controller] Request:', { lat, lng, alt });
    
    const satellites = await satelliteService.fetchSatellites(lat, lng, alt);
    
    res.status(200).json({
      success: true,
      count: satellites.length,
      data: satellites,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Satellite Controller Error]', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { getSatellites };
