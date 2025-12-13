const express = require('express');
const router = express.Router();
const {
  getRecommendedBySection,
  getAllRecommended,
  addToRecommended
} = require('../controllers/recommended.controller');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllRecommended);
router.get('/:section', getRecommendedBySection);

// Admin routes
router.post('/:section', protect, authorize('admin'), addToRecommended);

module.exports = router;
