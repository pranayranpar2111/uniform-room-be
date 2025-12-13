const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth');
const { productValidation, idValidation } = require('../middleware/validator');

// Public routes
router.get('/', getProducts);
router.get('/featured/list', getFeaturedProducts);
router.get('/:id', idValidation, getProduct);

// Admin routes
router.post(
  '/',
  protect,
  authorize('admin'),
  productValidation.create,
  createProduct
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  productValidation.update,
  updateProduct
);
router.delete('/:id', protect, authorize('admin'), idValidation, deleteProduct);

module.exports = router;
