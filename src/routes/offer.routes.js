const express = require('express');
const router = express.Router();
const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  getDiscounts,
  verifyDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount
} = require('../controllers/offer.controller');
const { protect, authorize } = require('../middleware/auth');
const { idValidation } = require('../middleware/validator');

// Banner routes
router.get('/banners', getBanners);
router.get('/banners/:id', idValidation, getBanner);
router.post('/banners', protect, authorize('admin'), createBanner);
router.put('/banners/:id', protect, authorize('admin'), idValidation, updateBanner);
router.delete(
  '/banners/:id',
  protect,
  authorize('admin'),
  idValidation,
  deleteBanner
);

// Discount routes
router.get('/discounts', getDiscounts);
router.post('/discounts/verify', verifyDiscount);
router.post('/discounts', protect, authorize('admin'), createDiscount);
router.put(
  '/discounts/:id',
  protect,
  authorize('admin'),
  idValidation,
  updateDiscount
);
router.delete(
  '/discounts/:id',
  protect,
  authorize('admin'),
  idValidation,
  deleteDiscount
);

module.exports = router;
