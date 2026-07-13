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
        message: 'سفارش تحویل داده شده و قابل لغو
