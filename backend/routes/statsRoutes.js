const express = require('express');
const router = express.Router();
const { getSystemStats } = require('../controllers/statsController');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/stats
router.get('/', protect, adminOnly, getSystemStats);

module.exports = router;
