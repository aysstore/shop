const { body, param, query, validationResult } = require('express-validator');

// بررسی نتایج اعتبارسنجی
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// ============ اعتبارسنجی‌های احراز هویت ============

exports.registerValidation = [
  body('name')
    .notEmpty().withMessage('نام و نام خانوادگی الزامی است')
    .isLength({ min: 3 }).withMessage('نام باید حداقل ۳ کاراکتر باشد')
    .isLength({ max: 50 }).withMessage('نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد')
    .trim(),
  
  body('email')
    .notEmpty().withMessage('ایمیل الزامی است')
    .isEmail().withMessage('ایمیل نامعتبر است')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('رمز عبور الزامی است')
    .isLength({ min: 6 }).withMessage('رمز عبور باید حداقل ۶ کاراکتر باشد')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('رمز عبور باید شامل حروف و اعداد باشد'),
  
  body('phone')
    .notEmpty().withMessage('شماره تلفن الزامی است')
    .matches(/^(0|98)?9\d{9}$/).withMessage('شماره تلفن نامعتبر است'),
  
  this.validate
];

exports.loginValidation = [
  body('email')
    .notEmpty().withMessage('ایمیل الزامی است')
    .isEmail().withMessage('ایمیل نامعتبر است')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('رمز عبور الزامی است'),
  
  this.validate
];

exports.changePasswordValidation = [
  body('oldPassword')
    .notEmpty().withMessage('رمز عبور فعلی الزامی است'),
  
  body('newPassword')
    .notEmpty().withMessage('رمز عبور جدید الزامی است')
    .isLength({ min: 6 }).withMessage('رمز عبور جدید باید حداقل ۶ کاراکتر باشد'),
  
  this.validate
];

exports.forgotPasswordValidation = [
  body('email')
    .notEmpty().withMessage('ایمیل الزامی است')
    .isEmail().withMessage('ایمیل نامعتبر است'),
  
  this.validate
];

// ============ اعتبارسنجی‌های محصول ============

exports.productValidation = [
  body('name')
    .notEmpty().withMessage('نام محصول الزامی است')
    .isLength({ min: 3 }).withMessage('نام محصول باید حداقل ۳ کاراکتر باشد')
    .trim(),
  
  body('description')
    .notEmpty().withMessage('توضیحات محصول الزامی است')
    .isLength({ min: 10 }).withMessage('توضیحات باید حداقل ۱۰ کاراکتر باشد')
    .trim(),
  
  body('price')
    .notEmpty().withMessage('قیمت محصول الزامی است')
    .isNumeric().withMessage('قیمت باید عدد باشد')
    .custom(value => value >= 0).withMessage('قیمت نمی‌تواند منفی باشد'),
  
  body('category')
    .notEmpty().withMessage('دسته‌بندی محصول الزامی است')
    .isMongoId().withMessage('دسته‌بندی نامعتبر است'),
  
  body('stock')
    .optional()
    .isNumeric().withMessage('موجودی باید عدد باشد')
    .custom(value => value >= 0).withMessage('موجودی نمی‌تواند منفی باشد'),
  
  body('discount')
    .optional()
    .isNumeric().withMessage('تخفیف باید عدد باشد')
    .custom(value => value >= 0 && value <= 100).withMessage('تخفیف باید بین ۰ تا ۱۰۰ باشد'),
  
  body('images')
    .optional()
    .isArray().withMessage('تصاویر باید آرایه باشد')
    .custom(value => value.length > 0).withMessage('حداقل یک تصویر الزامی است'),
  
  this.validate
];

exports.reviewValidation = [
  body('rating')
    .notEmpty().withMessage('امتیاز الزامی است')
    .isNumeric().withMessage('امتیاز باید عدد باشد')
    .custom(value => value >= 1 && value <= 5).withMessage('امتیاز باید بین ۱ تا ۵ باشد'),
  
  body('comment')
    .notEmpty().withMessage('نظر الزامی است')
    .isLength({ min: 3 }).withMessage('نظر باید حداقل ۳ کاراکتر باشد')
    .trim(),
  
  this.validate
];

// ============ اعتبارسنجی‌های سفارش ============

exports.orderValidation = [
  body('items')
    .notEmpty().withMessage('سبد خرید خالی است')
    .isArray().withMessage('آیتم‌ها باید آرایه باشد')
    .custom(value => value.length > 0).withMessage('حداقل یک کالا باید انتخاب شود'),
  
  body('items.*.product')
    .notEmpty().withMessage('شناسه محصول الزامی است')
    .isMongoId().withMessage('شناسه محصول نامعتبر است'),
  
  body('items.*.quantity')
    .notEmpty().withMessage('تعداد الزامی است')
    .isNumeric().withMessage('تعداد باید عدد باشد')
    .custom(value => value > 0).withMessage('تعداد باید بزرگتر از صفر باشد'),
  
  body('shippingAddress')
    .notEmpty().withMessage('آدرس ارسال الزامی است'),
  
  body('shippingAddress.fullName')
    .notEmpty().withMessage('نام و نام خانوادگی الزامی است'),
  
  body('shippingAddress.address')
    .notEmpty().withMessage('آدرس الزامی است'),
  
  body('shippingAddress.city')
    .notEmpty().withMessage('شهر الزامی است'),
  
  body('shippingAddress.postalCode')
    .notEmpty().withMessage('کد پستی الزامی است')
    .matches(/^\d{10}$/).withMessage('کد پستی باید ۱۰ رقمی باشد'),
  
  body('shippingAddress.phone')
    .notEmpty().withMessage('شماره تلفن الزامی است')
    .matches(/^(0|98)?9\d{9}$/).withMessage('شماره تلفن نامعتبر است'),
  
  body('paymentMethod')
    .notEmpty().withMessage('روش پرداخت الزامی است')
    .isIn(['stripe', 'cod', 'zarinpal']).withMessage('روش پرداخت نامعتبر است'),
  
  this.validate
];

// ============ اعتبارسنجی‌های پرداخت ============

exports.paymentValidation = [
  body('orderId')
    .notEmpty().withMessage('شناسه سفارش الزامی است')
    .isMongoId().withMessage('شناسه سفارش نامعتبر است'),
  
  body('paymentMethod')
    .notEmpty().withMessage('روش پرداخت الزامی است')
    .isIn(['stripe', 'cod', 'zarinpal']).withMessage('روش پرداخت نامعتبر است'),
  
  this.validate
];

// ============ اعتبارسنجی پارامترهای URL ============

exports.idParamValidation = [
  param('id')
    .isMongoId().withMessage('شناسه نامعتبر است'),
  
  this.validate
];

// ============ اعتبارسنجی کوئری‌ها ============

exports.paginationValidation = [
  query('page')
    .optional()
    .isNumeric().withMessage('صفحه باید عدد باشد')
    .custom(value => value > 0).withMessage('صفحه باید بزرگتر از صفر باشد'),
  
  query('limit')
    .optional()
    .isNumeric().withMessage('تعداد باید عدد باشد')
    .custom(value => value > 0 && value <= 100).withMessage('تعداد باید بین ۱ تا ۱۰۰ باشد'),
  
  this.validate
];
