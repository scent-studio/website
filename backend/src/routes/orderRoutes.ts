const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  claimGuestOrders,
} = require('../controllers/orderController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createOrderRules, updateStatusRules } = require('../validators/order');

// Guests may place and view their own order (order id acts as the access token)
router.post('/', optionalAuth, createOrderRules, validate, createOrder);

router.get('/my-orders', protect, getMyOrders);
router.post('/claim', protect, claimGuestOrders);

// Admin listing must be declared before the '/:id' param route
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateStatusRules, validate, updateOrderStatus);
router.put('/:id/payment', protect, authorize('admin'), updatePaymentStatus);

router.get('/:id', optionalAuth, getOrderById);
router.put('/:id/cancel', optionalAuth, cancelOrder);

module.exports = router;

export {};
