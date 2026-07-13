// کلاس خطای سفارشی
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// مدیریت خطاهای ۴۰۴
exports.notFound = (req, res, next) => {
  const error = new AppError(`مسیر ${req.originalUrl} یافت نشد`, 404);
  next(error);
};

// مدیریت خطاهای عمومی
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // لاگ خطا
  console.error('Error:', {
    statusCode: err.statusCode || 500,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?._id
  });

  // خطای Mongoose - ObjectId نامعتبر
  if (err.name === 'CastError') {
    const message = `منبع با شناسه ${err.value} یافت نشد`;
    error = new AppError(message, 404);
  }

  // خطای تکراری بودن در Mongoose
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    const message = `${field} "${value}" قبلاً ثبت شده است`;
    error = new AppError(message, 400);
  }

  // خطای اعتبارسنجی Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    const message = messages.join('. ');
    error = new AppError(message, 400);
  }

  // خطای JWT
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('توکن نامعتبر است', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('توکن منقضی شده است', 401);
  }

  // خطای Multer (آپلود فایل)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('حجم فایل خیلی بزرگ است', 400);
  }

  // پاسخ خطا
  const statusCode = error.statusCode || 500;
  const message = error.message || 'خطای داخلی سرور';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

// صادر کردن کلاس AppError برای استفاده در سایر بخش‌ها
module.exports.AppError = AppError;
