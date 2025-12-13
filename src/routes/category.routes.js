const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');
const { protect, authorize } = require('../middleware/auth');
const { categoryValidation, idValidation } = require('../middleware/validator');

// Public routes
router.get('/', getCategories);
router.get('/:id', idValidation, getCategory);

// Admin routes
router.post(
  '/',
  protect,
  authorize('admin'),
  categoryValidation.create,
  createCategory
);
router.put('/:id', protect, authorize('admin'), idValidation, updateCategory);
router.delete('/:id', protect, authorize('admin'), idValidation, deleteCategory);

module.exports = router;
