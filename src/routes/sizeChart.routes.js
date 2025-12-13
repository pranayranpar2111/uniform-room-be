const express = require('express');
const router = express.Router();
const {
  getSizeCharts,
  getSizeChart,
  createSizeChart,
  updateSizeChart,
  deleteSizeChart
} = require('../controllers/sizeChart.controller');
const { protect, authorize } = require('../middleware/auth');
const { idValidation } = require('../middleware/validator');

// Public routes
router.get('/', getSizeCharts);
router.get('/:id', idValidation, getSizeChart);

// Admin routes
router.post('/', protect, authorize('admin'), createSizeChart);
router.put('/:id', protect, authorize('admin'), idValidation, updateSizeChart);
router.delete('/:id', protect, authorize('admin'), idValidation, deleteSizeChart);

module.exports = router;
