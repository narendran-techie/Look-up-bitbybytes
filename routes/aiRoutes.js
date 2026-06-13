const express = require('express');
const router = express.Router();
const { askGemini } = require('../controllers/aiController');

router.post('/', askGemini);

module.exports = router;
