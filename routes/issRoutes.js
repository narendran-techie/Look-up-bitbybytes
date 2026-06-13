const express = require('express');
const router = express.Router();
const { getISSLocation } = require('../controllers/issController');

router.get('/', getISSLocation);

module.exports = router;