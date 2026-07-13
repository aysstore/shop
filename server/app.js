const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');

// بارگذاری متغیرهای محیطی
require('dotenv').config();

// ایجاد اپلیکیشن Express
const app = express();

// ============ میان‌افزارهای امنیتی ============

// هدرهای امنیتی
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.API_URL]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ============ میان‌افزارهای عمومی ============

// پارس کردن JSON و URL-encoded
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// پارس کردن کوکی‌ها
app.use(cookieParser());

// فشرده‌سازی
app.use(compression());

// لاگ (در محیط توسعه)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============ مسیرهای استاتیک ============

// فایل‌های استاتیک (تصاویر آپلودی)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============ محدودیت نرخ درخواست ============

const { defaultLimiter, authLimiter } = require('./middleware/rateLimiter');

// اعمال محدودیت عمومی روی همه مسیرها
app.use('/api', defaultLimiter);

// محدودیت سخت‌تر برای مسیرهای احراز هویت
app.use('/api/auth', authLimiter);

// ============ مسیرهای API ============

const routes = require('./routes');
app.use('/api', routes);

// ============ مدیریت خطاها ============

const { notFound, errorHandler } = require('./middleware/errorHandler');

// مسیر ۴۰۴
app.use(notFound);

// مدیریت خطاهای عمومی
app.use(errorHandler);

// ============ صادر کردن app ============

module.exports = app;
