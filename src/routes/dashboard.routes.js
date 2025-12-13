const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSalesAnalytics,
} = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes are admin only
router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/analytics', getSalesAnalytics);

module.exports = router;
