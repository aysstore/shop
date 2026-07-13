const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'کاربر الزامی است']
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'تعداد باید حداقل ۱ باشد']
        },
        image: {
          type: String,
          default: ''
        }
      }
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, 'نام و نام خانوادگی الزامی است']
      },
      address: {
        type: String,
        required: [true, 'آدرس الزامی است']
      },
      city: {
        type: String,
        required: [true, 'شهر الزامی است']
      },
      postalCode: {
        type: String,
        required: [true, 'کد پستی الزامی است']
      },
      phone: {
        type: String,
        required: [true, 'شماره تلفن الزامی است']
      },
      country: {
        type: String,
        default: 'Iran'
      }
    },
    paymentMethod: {
      type: String,
      required: [true, 'روش پرداخت الزامی است'],
      enum: ['stripe', 'cod', 'zarinpal']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentId: {
      type: String
    },
    paidAt: {
      type: Date
    },
    shippingMethod: {
      type: String,
      enum: ['standard', 'express'],
      default: 'standard'
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    trackingCode: {
      type: String,
      unique: true,
      sparse: true
    },
    estimatedDelivery: {
      type: Date
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0
    },
    discountPrice: {
      type: Number,
      default: 0
    },
    shippingPrice: {
      type: Number,
      default: 0
    },
    taxPrice: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        },
        comment: String,
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    returnRequest: {
      requested: {
        type: Boolean,
        default: false
      },
      reason: String,
      items: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
          },
          quantity: Number,
          reason: String
        }
      ],
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
      },
      requestedAt: Date,
      approvedAt: Date,
      completedAt: Date
    },
    notes: {
      type: String,
      trim: true
    },
    adminNotes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// ایجاد کد رهگیری قبل از ذخیره
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.trackingCode) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.trackingCode = `AYS-${year}${month}${day}-${random}`;
    
    // محاسبه تاریخ تخمینی تحویل (۳ تا ۵ روز کاری بعد)
    const deliveryDate = new Date(date);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    this.estimatedDelivery = deliveryDate;
  }
  next();
});

// متد بروزرسانی وضعیت با تاریخچه
orderSchema.methods.updateStatus = function (newStatus, comment = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    comment,
    updatedAt: new Date()
  });
  return this.save();
};

// متد محاسبه مجدد قیمت کل
orderSchema.methods.calculateTotal = function () {
  this.itemsPrice = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  this.totalPrice = this.itemsPrice - this.discountPrice + this.shippingPrice + this.taxPrice;
  return this.totalPrice;
};

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
