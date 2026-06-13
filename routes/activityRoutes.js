const express = require('express');
const router = express.Router();
const { getActivityFeed } = require('../controllers/activityController');

router.get('/', getActivityFeed);

module.exports = router;
