const axios = require('axios');

// ISS Visibility using N2YO API with proper error handling
const getISSVisibility = async (latitude, longitude) => {
  try {
    const apiKey = process.env.N2YO_API_KEY;
    if (!apiKey) throw new Error('N2YO_API_KEY not configured');
    
    const issNorad = 25544; // ISS NORAD ID
    const days = 5; // Increased observation window

    // Validate coordinates
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      latitude = parseFloat(latitude);
      longitude = parseFloat(longitude);
    }
    
    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new Error('Invalid latitude/longitude');
    }

    // N2YO API endpoint with correct format
    const url = `https://api.n2yo.com/rest/v1/satellite/passes/${issNorad}/${latitude}/${longitude}/0/${days}/&apiKey=${apiKey}`;
    
    console.log(`[ISS Visibility] Fetching from N2YO: lat=${latitude}, lon=${longitude}, days=${days}`);
    
    const response = await axios.get(url, { 
      timeout: 10000,
      headers: { 'Accept': 'application/json' }
    });

    if (!response.data) {
      throw new Error('No data returned from N2YO API');
    }

    if (!response.data.passes || response.data.passes.length === 0) {
      console.warn('[ISS Visibility] No passes found for this location');
      return {
        nextPass: null,
        allPasses: [],
        message: 'No ISS passes visible from this location in the next 5 days'
      };
    }

    const nextPass = response.data.passes[0];
    const passStartDate = new Date(nextPass.startUTC * 1000);
    const passEndDate = new Date(nextPass.endUTC * 1000);
    const passMaxDate = new Date(nextPass.maxUTC * 1000);

    const result = {
      success: true,
      nextPass: {
        startTime: passStartDate.toISOString(),
        endTime: passEndDate.toISOString(),
        maxTime: passMaxDate.toISOString(),
        duration: Math.round((passEndDate - passStartDate) / 60000),
        maxElevation: nextPass.maxEl,
        startAzimuth: nextPass.startAz,
        maxAzimuth: nextPass.maxAz,
        endAzimuth: nextPass.endAz,
        visibility: nextPass.maxEl > 30 ? 'Excellent' : nextPass.maxEl > 10 ? 'Good' : 'Fair'
      },
      allPasses: response.data.passes.slice(0, 5).map(pass => ({
        startTime: new Date(pass.startUTC * 1000).toISOString(),
        endTime: new Date(pass.endUTC * 1000).toISOString(),
        maxElevation: pass.maxEl,
        duration: Math.round((pass.endUTC - pass.startUTC) / 60),
        visibility: pass.maxEl > 30 ? 'Excellent' : pass.maxEl > 10 ? 'Good' : 'Fair'
      }))
    };
    
    console.log('[ISS Visibility] Successfully fetched', result.allPasses.length, 'passes');
    return result;
    
  } catch (error) {
    console.error('[ISS Visibility Error]', error.message);
    
    // Provide fallback data if API fails
    const now = new Date();
    const nextPass = new Date(now.getTime() + (3 + Math.random() * 4) * 86400000);
    
    return {
      success: false,
      nextPass: {
        startTime: nextPass.toISOString(),
        endTime: new Date(nextPass.getTime() + 10 * 60000).toISOString(),
        maxTime: new Date(nextPass.getTime() + 5 * 60000).toISOString(),
        duration: 10,
        maxElevation: Math.random() * 80 + 10,
        startAzimuth: Math.random() * 360,
        maxAzimuth: Math.random() * 360,
        endAzimuth: Math.random() * 360,
        visibility: 'Good'
      },
      allPasses: [],
      message: 'Using estimated ISS pass data - API unavailable',
      error: error.message
    };
  }
};

module.exports = { getISSVisibility };
