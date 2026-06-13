const express = require('express');
const router = express.Router();
const { getLaunches } = require('../controllers/spacexController');

router.get('/launches', getLaunches);

module.exports = router;
