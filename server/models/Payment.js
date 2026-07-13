const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'سفارش الزامی است']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'کاربر الزامی است']
    },
    amount: {
      type: Number,
      required: [true, 'مبلغ الزامی است'],
      min: [0, 'مبلغ نمی‌تواند منفی باشد']
    },
    currency: {
      type: String,
      default: 'IRR'
    },
    method: {
      type: String,
      required: [true, 'روش پرداخت الزامی است'],
      enum: ['stripe', 'cod', 'zarinpal', 'wallet']
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    paidAt: {
      type: Date
    },
    refundData: {
      refundId: String,
      reason: String,
      refundedAt: Date
    },
    ip: String,
    userAgent: String,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// ایندکس‌ها
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
