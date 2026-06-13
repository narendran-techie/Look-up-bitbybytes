const express = require('express');
const router = express.Router();
const { getApod, getAsteroids } = require('../controllers/nasaController');

router.get('/apod', getApod);
router.get('/asteroids', getAsteroids);

module.exports = router;
