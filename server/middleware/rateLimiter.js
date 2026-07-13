const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

// ایجاد کلاینت Redis (اختیاری - در صورت نبود Redis از حافظه استفاده می‌کند)
let redisClient = null;
try {
  if (process.env.REDIS_URL) {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });
    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });
    redisClient.connect();
  }
} catch (error) {
  console.warn('Redis not available, using memory store');
}

// تنظیمات پیش‌فرض محدودیت
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ۱۵ دقیقه
  max: 100, // حداکثر ۱۰۰ درخواست در هر ۱۵ دقیقه
  message: {
    success: false,
    message: 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً بعداً تلاش کنید.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // استفاده از IP کاربر یا userId در صورت وجود
    return req.user?._id || req.ip;
  },
  skip: (req) => {
    // رد کردن محدودیت برای مسیرهای خاص
    const skipPaths = ['/api/health', '/api/payments/webhook'];
    return skipPaths.includes(req.path);
  }
});

// محدودیت سخت‌تر برای مسیرهای حساس (ورود، ثبت‌نام)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ۱ ساعت
  max: 5, // حداکثر ۵ درخواست در هر ساعت
  message: {
    success: false,
    message: 'تعداد تلاش‌های شما بیش از حد مجاز است. لطفاً ۱ ساعت دیگر تلاش کنید.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip
});

// محدودیت برای API‌های عمومی
const publicLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // ۵ دقیقه
  max: 30, // حداکثر ۳۰ درخواست
  message: {
    success: false,
    message: 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً بعداً تلاش کنید.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// محدودیت برای API‌های ادمین
const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'تعداد درخواست‌های مدیریتی بیش از حد مجاز است'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// محدودیت برای آپلود فایل
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ۱ ساعت
  max: 10, // حداکثر ۱۰ آپلود
  message: {
    success: false,
    message: 'تعداد آپلودهای شما بیش از حد مجاز است'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// صادر کردن انواع محدودیت‌ها
module.exports = {
  defaultLimiter,
  authLimiter,
  publicLimiter,
  adminLimiter,
  uploadLimiter
};
