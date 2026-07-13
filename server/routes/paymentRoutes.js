const express = require('express');
const router = express.Router();
const {
  createPayment,
  verifyPayment,
  getPaymentStatus,
  getPaymentMethods,
  refundPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// مسیرهای عمومی
router.get('/methods', getPaymentMethods);

// مسیرهای خصوصی
router.post('/create', protect, createPayment);
router.post('/:paymentId/verify', protect, verifyPayment);
router.get('/:paymentId/status', protect, getPaymentStatus);
router.post('/:paymentId/refund', protect, refundPayment);

module.exports = router;
