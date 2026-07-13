/**
 * اعتبارسنجی ایمیل
 * @param {string} email - ایمیل
 * @returns {boolean} - معتبر یا نه
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * اعتبارسنجی شماره موبایل
 * @param {string} phone - شماره موبایل
 * @returns {boolean} - معتبر یا نه
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  const cleanPhone = phone.replace(/\s/g, '');
  const phoneRegex = /^(0|98)?9\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * اعتبارسنجی کد پستی
 * @param {string} postalCode - کد پستی
 * @returns {boolean} - معتبر یا نه
 */
export const validatePostalCode = (postalCode) => {
  if (!postalCode) return false;
  const clean = postalCode.replace(/\s/g, '');
  return /^\d{10}$/.test(clean);
};

/**
 * اعتبارسنجی رمز عبور (حداقل ۶ کاراکتر)
 * @param {string} password - رمز عبور
 * @returns {boolean} - معتبر یا نه
 */
export const validatePassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

/**
 * اعتبارسنجی رمز عبور قوی (حداقل ۸ کاراکتر با حروف و اعداد)
 * @param {string} password - رمز عبور
 * @returns {boolean} - معتبر یا نه
 */
export const validateStrongPassword = (password) => {
  if (!password) return false;
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

/**
 * اعتبارسنجی نام (حداقل ۳ کاراکتر)
 * @param {string} name - نام
 * @returns {boolean} - معتبر یا نه
 */
export const validateName = (name) => {
  if (!name) return false;
  return name.trim().length >= 3;
};

/**
 * اعتبارسنجی URL
 * @param {string} url - آدرس URL
 * @returns {boolean} - معتبر یا نه
 */
export const validateUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * اعتبارسنجی کد تخفیف
 * @param {string} code - کد تخفیف
 * @returns {boolean} - معتبر یا نه
 */
export const validateDiscountCode = (code) => {
  if (!code) return false;
  return /^[A-Z0-9]{6,}$/i.test(code);
};

/**
 * اعتبارسنجی شماره کارت بانکی
 * @param {string} cardNumber - شماره کارت
 * @returns {boolean} - معتبر یا نه
 */
export const validateCardNumber = (cardNumber) => {
  if (!cardNumber) return false;
  const clean = cardNumber.replace(/\s/g, '');
  if (!/^\d{16}$/.test(clean)) return false;
  
  // الگوریتم Luhn
  let sum = 0;
  let alternate = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let n = parseInt(clean[i]);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
};

/**
 * اعتبارسنجی تاریخ انقضای کارت (MM/YY)
 * @param {string} expiry - تاریخ انقضا
 * @returns {boolean} - معتبر یا نه
 */
export const validateCardExpiry = (expiry) => {
  if (!expiry) return false;
  const clean = expiry.replace(/\s/g, '');
  if (!/^\d{2}\/\d{2}$/.test(clean)) return false;
  
  const [month, year] = clean.split('/').map(Number);
  if (month < 1 || month > 12) return false;
  
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  
  return true;
};

/**
 * اعتبارسنجی CVV
 * @param {string} cvv - کد CVV
 * @returns {boolean} - معتبر یا نه
 */
export const validateCvv = (cvv) => {
  if (!cvv) return false;
  const clean = cvv.replace(/\s/g, '');
  return /^\d{3,4}$/.test(clean);
};

/**
 * اعتبارسنجی شماره حساب شبا
 * @param {string} iban - شماره شبا
 * @returns {boolean} - معتبر یا نه
 */
export const validateIban = (iban) => {
  if (!iban) return false;
  const clean = iban.replace(/\s/g, '').toUpperCase();
  if (!/^IR\d{24}$/.test(clean)) return false;
  
  // الگوریتم ساده شبا
  const ibanNumber = clean.substring(4) + clean.substring(0, 4);
  const numberString = ibanNumber.replace(/[A-Z]/g, (letter) => {
    return letter.charCodeAt(0) - 55;
  });
  
  // بررسی بخش‌پذیری بر ۹۷
  let remainder = 0;
  for (let i = 0; i < numberString.length; i++) {
    remainder = (remainder * 10 + parseInt(numberString[i])) % 97;
  }
  return remainder === 1;
};

/**
 * اعتبارسنجی فرم ثبت‌نام
 * @param {Object} data - داده‌های فرم
 * @returns {Object} - خطاها (اگر خطایی باشد)
 */
export const validateRegisterForm = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد';
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'ایمیل معتبر وارد کنید';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'رمز عبور و تکرار آن مطابقت ندارند';
  }

  return errors;
};

/**
 * اعتبارسنجی فرم ورود
 * @param {Object} data - داده‌های فرم
 * @returns {Object} - خطاها (اگر خطایی باشد)
 */
export const validateLoginForm = (data) => {
  const errors = {};

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'ایمیل معتبر وارد کنید';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
  }

  return errors;
};

/**
 * اعتبارسنجی فرم تسویه حساب
 * @param {Object} data - داده‌های فرم
 * @returns {Object} - خطاها (اگر خطایی باشد)
 */
export const validateCheckoutForm = (data) => {
  const errors = {};

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.fullName = 'نام و نام خانوادگی الزامی است';
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'ایمیل معتبر وارد کنید';
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.phone = 'شماره موبایل معتبر وارد کنید';
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.address = 'آدرس دقیق را وارد کنید';
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'شهر را وارد کنید';
  }

  if (!data.postalCode || !validatePostalCode(data.postalCode)) {
    errors.postalCode = 'کد پستی ۱۰ رقمی وارد کنید';
  }

  return errors;
};

/**
 * اعتبارسنجی فرم محصول (برای ادمین)
 * @param {Object} data - داده‌های محصول
 * @returns {Object} - خطاها (اگر خطایی باشد)
 */
export const validateProductForm = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'نام محصول الزامی است';
  }

  if (!data.price || data.price <= 0) {
    errors.price = 'قیمت باید بزرگتر از صفر باشد';
  }

  if (!data.category || data.category.trim().length < 2) {
    errors.category = 'دسته‌بندی الزامی است';
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'توضیحات باید حداقل ۱۰ کاراکتر باشد';
  }

  if (data.stock !== undefined && data.stock < 0) {
    errors.stock = 'موجودی نمی‌تواند منفی باشد';
  }

  if (data.discount !== undefined && (data.discount < 0 || data.discount > 100)) {
    errors.discount = 'تخفیف باید بین ۰ تا ۱۰۰ باشد';
  }

  return errors;
};

/**
 * اعتبارسنجی فرم تغییر رمز عبور
 * @param {Object} data - داده‌های فرم
 * @returns {Object} - خطاها (اگر خطایی باشد)
 */
export const validateChangePassword = (data) => {
  const errors = {};

  if (!data.oldPassword || data.oldPassword.length < 6) {
    errors.oldPassword = 'رمز عبور فعلی را وارد کنید';
  }

  if (!data.newPassword || data.newPassword.length < 6) {
    errors.newPassword = 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد';
  }

  if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = 'رمز عبور جدید و تکرار آن مطابقت ندارند';
  }

  if (data.oldPassword === data.newPassword) {
    errors.newPassword = 'رمز عبور جدید نمی‌تواند با قبلی یکسان باشد';
  }

  return errors;
};

/**
 * اعتبارسنجی فرم بازگشت کالا
 * @param {Object} data - داده‌های فرم
 * @returns {Object} - خطاها (اگر خطایی باشد)
 */
export const validateReturnForm = (data) => {
  const errors = {};

  if (!data.reason || data.reason.trim().length < 5) {
    errors.reason = 'دلیل بازگشت باید حداقل ۵ کاراکتر باشد';
  }

  if (!data.items || data.items.length === 0) {
    errors.items = 'حداقل یک کالا را انتخاب کنید';
  }

  return errors;
};

/**
 * اعتبارسنجی فرم نظر
 * @param {Object} data - داده‌های فرم
 * @returns {Object} - خطاها (اگر خطایی باشد)
 */
export const validateReviewForm = (data) => {
  const errors = {};

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'امتیاز باید بین ۱ تا ۵ باشد';
  }

  if (!data.comment || data.comment.trim().length < 10) {
    errors.comment = 'نظر باید حداقل ۱۰ کاراکتر باشد';
  }

  return errors;
};

/**
 * پاک کردن خطاهای یک فیلد خاص
 * @param {Object} errors - شیء خطاها
 * @param {string} fieldName - نام فیلد
 * @returns {Object} - شیء خطاهای جدید
 */
export const clearFieldError = (errors, fieldName) => {
  const newErrors = { ...errors };
  delete newErrors[fieldName];
  return newErrors;
};

/**
 * بررسی وجود خطا در فرم
 * @param {Object} errors - شیء خطاها
 * @returns {boolean} - وجود خطا یا نه
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * دریافت پیام خطای اول از شیء خطاها
 * @param {Object} errors - شیء خطاها
 * @returns {string|null} - اولین پیام خطا
 */
export const getFirstErrorMessage = (errors) => {
  const firstKey = Object.keys(errors)[0];
  return firstKey ? errors[firstKey] : null;
};
