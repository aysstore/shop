const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  payOrder,
  cancelOrder,
  getOrderStatus,
  trackOrder,
  requestReturn
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// مسیرهای عمومی
router.get('/track/:trackingCode', trackOrder);

// مسیرهای خصوصی
router.post('/', protect, createOrder);
router.get('/me', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, payOrder);
router.put('/:id/cancel', protect, cancelOrder);
router.get('/:id/status', protect, getOrderStatus);
router.post('/:id/return', protect, requestReturn);

// مسیرهای ادمین
// (می‌توانید مسیرهای مدیریتی را اینجا اضافه کنید)

module.exports = router;
