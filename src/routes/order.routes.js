const express = require('express');
const router = express.Router();
const {
  getOrders,
  getMyOrders,
  getOrder,
  createOrder,
  updateOrderStatus
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth');
const { idValidation } = require('../middleware/validator');

// User routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, idValidation, getOrder);

// Admin routes
router.get('/', protect, authorize('admin'), getOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
