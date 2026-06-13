const express = require('express');
const router = express.Router();
const { getSpaceWeather } = require('../controllers/weatherController');

router.get('/', getSpaceWeather);

module.exports = router;
