const express = require('express');
const router = express.Router();
const {
  getColors,
  createColor,
  updateColor,
  deleteColor,
  getSizes,
  createSize,
  updateSize,
  deleteSize
} = require('../controllers/variant.controller');
const { protect, authorize } = require('../middleware/auth');
const { idValidation } = require('../middleware/validator');

// Color routes
router.get('/colors', getColors);
router.post('/colors', protect, authorize('admin'), createColor);
router.put('/colors/:id', protect, authorize('admin'), idValidation, updateColor);
router.delete(
  '/colors/:id',
  protect,
  authorize('admin'),
  idValidation,
  deleteColor
);

// Size routes
router.get('/sizes', getSizes);
router.post('/sizes', protect, authorize('admin'), createSize);
router.put('/sizes/:id', protect, authorize('admin'), idValidation, updateSize);
router.delete('/sizes/:id', protect, authorize('admin'), idValidation, deleteSize);

module.exports = router;
