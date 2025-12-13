const express = require('express');
const router = express.Router();
const {
  getInquiries,
  getInquiry,
  createInquiry,
  updateInquiry,
  deleteInquiry
} = require('../controllers/inquiry.controller');
const { protect, authorize } = require('../middleware/auth');
const { inquiryValidation, idValidation } = require('../middleware/validator');

// Public routes
router.post('/', inquiryValidation.create, createInquiry);

// Admin routes
router.get('/', protect, authorize('admin'), getInquiries);
router.get('/:id', protect, authorize('admin'), idValidation, getInquiry);
router.put('/:id', protect, authorize('admin'), idValidation, updateInquiry);
router.delete('/:id', protect, authorize('admin'), idValidation, deleteInquiry);

module.exports = router;
