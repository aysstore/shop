const jwt = require('jsonwebtoken');
const User = require('../models/User');

// محافظت از مسیرها - بررسی توکن
exports.protect = async (req, res, next) => {
  try {
    let token;

    // دریافت توکن از هدر
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // اگر توکن وجود نداشت
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'شما به این مسیر دسترسی ندارید. لطفاً وارد شوید.'
      });
    }

    try {
      // تایید توکن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // پیدا کردن کاربر
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'کاربر یافت نشد'
        });
      }

      // بررسی فعال بودن کاربر
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'حساب کاربری شما غیرفعال شده است'
        });
      }

      // اضافه کردن کاربر به req
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'توکن نامعتبر است'
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'توکن منقضی شده است. لطفاً مجدداً وارد شوید.'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در احراز هویت',
      error: error.message
    });
  }
};

// بررسی نقش ادمین
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'شما دسترسی ادمین ندارید'
    });
  }
};

// بررسی نقش فروشنده
exports.seller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'شما دسترسی فروشنده ندارید'
    });
  }
};

// بررسی چند نقش
exports.hasRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'شما دسترسی لازم برای این عمل را ندارید'
      });
    }
  };
};

// بررسی مالکیت (مثلاً کاربر فقط به اطلاعات خودش دسترسی داشته باشد)
exports.ownsResource = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'منبع مورد نظر یافت نشد'
        });
      }

      // اگر ادمین است یا مالک منبع است
      if (req.user.role === 'admin' || resource.user.toString() === req.user.id) {
        req.resource = resource;
        next();
      } else {
        res.status(403).json({
          success: false,
          message: 'شما دسترسی به این منبع ندارید'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'خطا در بررسی مالکیت',
        error: error.message
      });
    }
  };
};

// بررسی تایید ایمیل
exports.isVerified = (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'لطفاً ابتدا ایمیل خود را تایید کنید'
    });
  }
};

// محدودیت نرخ درخواست (تکمیل شده با rateLimiter)
// اینجا فقط یک wrapper ساده است
exports.rateLimit = (options = {}) => {
  return (req, res, next) => {
    // این تابع توسط rateLimiter.js کامل می‌شود
    next();
  };
};
