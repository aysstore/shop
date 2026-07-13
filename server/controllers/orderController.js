const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendEmail } = require('../utils/email');

// @desc    ایجاد سفارش جدید
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      shippingMethod = 'standard'
    } = req.body;

    // بررسی وجود آیتم‌ها
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'سبد خرید خالی است'
      });
    }

    // محاسبه مبالغ
    let totalAmount = 0;
    let discountAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `محصول ${item.product} یافت نشد`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `موجودی ${product.name} کافی نیست`
        });
      }

      const price = product.discount > 0 
        ? product.price * (1 - product.discount / 100)
        : product.price;

      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;

      // محاسبه تخفیف
      if (product.discount > 0) {
        discountAmount += (product.price - price) * item.quantity;
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: price,
        quantity: item.quantity,
        image: product.images[0] || ''
      });

      // کاهش موجودی
      product.stock -= item.quantity;
      await product.save();
    }

    // محاسبه هزینه ارسال
    let shippingCost = 0;
    if (shippingMethod === 'express') {
      shippingCost = 35000;
    } else if (totalAmount < 500000) {
      shippingCost = 20000;
    }

    // ایجاد سفارش
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      shippingMethod,
      itemsPrice: totalAmount,
      discountPrice: discountAmount,
      shippingPrice: shippingCost,
      taxPrice: 0, // در صورت نیاز
      totalPrice: totalAmount + shippingCost - discountAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // ارسال ایمیل تایید سفارش
    await sendEmail({
      to: req.user.email,
      subject: 'تایید سفارش - فروشگاه آیس',
      template: 'order-confirmation',
      data: {
        name: req.user.name,
        orderId: order._id,
        totalPrice: order.totalPrice,
        items: orderItems
      }
    });

    res.status(201).json({
      success: true,
      message: 'سفارش با موفقیت ثبت شد',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت سفارش',
      error: error.message
    });
  }
};

// @desc    دریافت سفارشات کاربر
// @route   GET /api/orders/me
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت سفارشات',
      error: error.message
    });
  }
};

// @desc    دریافت یک سفارش با ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش یافت نشد'
      });
    }

    // بررسی دسترسی
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'شما دسترسی به این سفارش ندارید'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت سفارش',
      error: error.message
    });
  }
};

// @desc    پرداخت سفارش
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.payOrder = async (req, res) => {
  try {
    const { paymentId, paymentStatus = 'paid' } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش یافت نشد'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'این سفارش قبلاً پرداخت شده است'
      });
    }

    order.paymentStatus = paymentStatus;
    order.paymentId = paymentId;
    order.paidAt = new Date();
    order.status = 'processing';

    await order.save();

    // ارسال ایمیل تایید پرداخت
    await sendEmail({
      to: order.user.email,
      subject: 'تایید پرداخت - فروشگاه آیس',
      template: 'payment-confirmation',
      data: {
        name: order.user.name,
        orderId: order._id,
        totalPrice: order.totalPrice
      }
    });

    res.status(200).json({
      success: true,
      message: 'پرداخت با موفقیت انجام شد',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در پرداخت سفارش',
      error: error.message
    });
  }
};

// @desc    لغو سفارش
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش یافت نشد'
      });
    }

    // بررسی دسترسی
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'شما دسترسی به این سفارش ندارید'
      });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'سفارش تحویل داده شده و قابل لغو نیست'
      });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'این سفارش قبلاً لغو شده است'
      });
    }

    // برگرداندن موجودی
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'سفارش با موفقیت لغو شد',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در لغو سفارش',
      error: error.message
    });
  }
};

// @desc    دریافت وضعیت سفارش
// @route   GET /api/orders/:id/status
// @access  Private
exports.getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).select('status paymentStatus trackingCode');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش یافت نشد'
      });
    }

    res.status(200).json({
      success: true,
      status: order.status,
      paymentStatus: order.paymentStatus,
      trackingCode: order.trackingCode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت وضعیت سفارش',
      error: error.message
    });
  }
};

// @desc    پیگیری سفارش با کد رهگیری
// @route   GET /api/orders/track/:trackingCode
// @access  Public
exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ trackingCode: req.params.trackingCode })
      .populate('user', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'کد رهگیری نامعتبر است'
      });
    }

    res.status(200).json({
      success: true,
      order: {
        id: order._id,
        status: order.status,
        trackingCode: order.trackingCode,
        estimatedDelivery: order.estimatedDelivery,
        items: order.items,
        totalPrice: order.totalPrice
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در پیگیری سفارش',
      error: error.message
    });
  }
};

// @desc    درخواست بازگشت کالا
// @route   POST /api/orders/:id/return
// @access  Private
exports.requestReturn = async (req, res) => {
  try {
    const { reason, items } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش یافت نشد'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'شما دسترسی به این سفارش ندارید'
      });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'سفارش باید تحویل داده شده باشد تا بتوانید بازگشت کالا درخواست کنید'
      });
    }

    order.returnRequest = {
      requested: true,
      reason,
      items,
      status: 'pending',
      requestedAt: new Date()
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: 'درخواست بازگشت کالا با موفقیت ثبت شد',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در درخواست بازگشت کالا',
      error: error.message
    });
  }
};
