const express = require('express');
const router = express.Router();
const { getSatellites } = require('../controllers/satelliteController');

router.get('/', getSatellites);

module.exports = router;
