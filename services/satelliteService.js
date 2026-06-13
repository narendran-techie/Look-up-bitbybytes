const axios = require('axios');
const { N2YO_BASE_URL, SAMPLE_SATELLITES } = require('../config/constants');

const fetchSatellites = async (latitude = 0, longitude = 0, altitude = 0) => {
  const apiKey = process.env.N2YO_API_KEY;
  
  if (!apiKey) {
    console.warn('[Satellites] N2YO_API_KEY not configured, using sample data');
    return SAMPLE_SATELLITES;
  }

  try {
    // Validate inputs
    latitude = parseFloat(latitude) || 0;
    longitude = parseFloat(longitude) || 0;
    altitude = parseFloat(altitude) || 0;

    const url = `${N2YO_BASE_URL}/above/${latitude}/${longitude}/${altitude}/45/0/&apiKey=${apiKey}`;
    
    console.log('[Satellites] Fetching from N2YO:', { latitude, longitude, altitude });
    
    const response = await axios.get(url, { 
      timeout: 10000,
      headers: { 'Accept': 'application/json' }
    });

    if (!response.data) {
      throw new Error('No response from N2YO API');
    }

    const satellites = response.data.above;

    if (!Array.isArray(satellites) || satellites.length === 0) {
      console.warn('[Satellites] No satellites returned from N2YO, using sample data');
      return SAMPLE_SATELLITES;
    }

    const mapped = satellites.slice(0, 12).map((sat) => ({
      name: sat.satname || 'Unknown Satellite',
      satid: sat.satid,
      lat: parseFloat(sat.satlat) || 0,
      lng: parseFloat(sat.satlng) || 0,
      altitude: parseFloat(sat.satalt) || 0,
      velocity: parseFloat(sat.satvel) || 0,
      type: determineSatelliteType(sat.satname || ''),
      noradId: sat.satid,
      timestamp: new Date().toISOString()
    }));

    console.log('[Satellites] Successfully fetched', mapped.length, 'satellites');
    return mapped;
    
  } catch (error) {
    console.error('[Satellites Error]', error.message);
    console.log('[Satellites] Falling back to sample data');
    return SAMPLE_SATELLITES;
  }
};

const determineSatelliteType = (satname) => {
  const name = (satname || '').toLowerCase();
  if (name.includes('hubble')) return 'Telescope';
  if (name.includes('iss')) return 'Space Station';
  if (name.includes('terra') || name.includes('aqua')) return 'Earth Observatory';
  if (name.includes('noaa')) return 'Meteorology';
  if (name.includes('gps') || name.includes('glonass') || name.includes('galileo')) return 'Navigation';
  if (name.includes('starlink')) return 'Communications';
  return 'Satellite';
};

module.exports = { fetchSatellites };
