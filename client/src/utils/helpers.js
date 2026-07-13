/**
 * تبدیل اعداد فارسی به انگلیسی
 * @param {string} str - رشته حاوی اعداد فارسی
 * @returns {string} - رشته با اعداد انگلیسی
 */
export const persianToEnglish = (str) => {
  if (!str) return '';
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return str.replace(/[۰-۹]/g, (char) => {
    return englishNumbers[persianNumbers.indexOf(char)];
  });
};

/**
 * تبدیل اعداد انگلیسی به فارسی
 * @param {number|string} num - عدد یا رشته حاوی اعداد انگلیسی
 * @returns {string} - رشته با اعداد فارسی
 */
export const toPersianNumber = (num) => {
  if (num === undefined || num === null) return '';
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const str = String(num);
  return str.replace(/[0-9]/g, (char) => {
    return persianNumbers[englishNumbers.indexOf(char)];
  });
};

/**
 * فرمت کردن قیمت به تومان
 * @param {number} price - قیمت به تومان
 * @param {boolean} withUnit - نمایش واحد تومان
 * @returns {string} - قیمت فرمت شده
 */
export const formatPrice = (price, withUnit = true) => {
  if (!price && price !== 0) return '۰';
  const formatted = toPersianNumber(price.toLocaleString());
  return withUnit ? `${formatted} تومان` : formatted;
};

/**
 * محاسبه قیمت با تخفیف
 * @param {number} price - قیمت اصلی
 * @param {number} discount - درصد تخفیف
 * @returns {number} - قیمت پس از تخفیف
 */
export const calculateDiscountedPrice = (price, discount) => {
  if (!discount || discount === 0) return price;
  return price * (1 - discount / 100);
};

/**
 * محاسبه مبلغ تخفیف
 * @param {number} price - قیمت اصلی
 * @param {number} discount - درصد تخفیف
 * @returns {number} - مبلغ تخفیف
 */
export const calculateDiscountAmount = (price, discount) => {
  if (!discount || discount === 0) return 0;
  return price * (discount / 100);
};

/**
 * کوتاه کردن متن
 * @param {string} text - متن اصلی
 * @param {number} maxLength - حداکثر طول
 * @param {string} suffix - پسوند انتهای متن
 * @returns {string} - متن کوتاه شده
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};

/**
 * تاریخ شمسی از تاریخ میلادی
 * @param {Date|string} date - تاریخ میلادی
 * @param {string} format - فرمت خروجی
 * @returns {string} - تاریخ شمسی
 */
export const toPersianDate = (date, format = 'YYYY/MM/DD') => {
  if (!date) return '';
  try {
    const d = new Date(date);
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d);
    return persianDate;
  } catch (err) {
    return String(date);
  }
};

/**
 * تاریخ و زمان شمسی
 * @param {Date|string} date - تاریخ میلادی
 * @returns {string} - تاریخ و زمان شمسی
 */
export const toPersianDateTime = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return formatter.format(d);
  } catch (err) {
    return String(date);
  }
};

/**
 * دریافت زمان نسبی (مثلاً ۲ دقیقه پیش)
 * @param {Date|string} date - تاریخ میلادی
 * @returns {string} - زمان نسبی
 */
export const timeAgo = (date) => {
  if (!date) return '';
  try {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffYear > 0) return `${toPersianNumber(diffYear)} سال پیش`;
    if (diffMonth > 0) return `${toPersianNumber(diffMonth)} ماه پیش`;
    if (diffWeek > 0) return `${toPersianNumber(diffWeek)} هفته پیش`;
    if (diffDay > 0) return `${toPersianNumber(diffDay)} روز پیش`;
    if (diffHour > 0) return `${toPersianNumber(diffHour)} ساعت پیش`;
    if (diffMin > 0) return `${toPersianNumber(diffMin)} دقیقه پیش`;
    return 'لحظاتی پیش';
  } catch (err) {
    return '';
  }
};

/**
 * تولید کد تصادفی
 * @param {number} length - طول کد
 * @returns {string} - کد تصادفی
 */
export const generateRandomCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * کپی متن در کلیپ‌بورد
 * @param {string} text - متن برای کپی
 * @returns {Promise<boolean>} - موفقیت یا شکست
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // روش جایگزین برای مرورگرهای قدیمی
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
};

/**
 * استخراج دامنه از URL
 * @param {string} url - آدرس URL
 * @returns {string} - دامنه
 */
export const getDomainFromUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url;
  }
};

/**
 * بررسی آیا رشته ایمیل معتبر است
 * @param {string} email - ایمیل
 * @returns {boolean} - معتبر یا نه
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * بررسی آیا رشته شماره موبایل معتبر است
 * @param {string} phone - شماره موبایل
 * @returns {boolean} - معتبر یا نه
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(0|98)?9\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * بررسی آیا رشته کد پستی معتبر است
 * @param {string} postalCode - کد پستی
 * @returns {boolean} - معتبر یا نه
 */
export const isValidPostalCode = (postalCode) => {
  const postalRegex = /^\d{10}$/;
  return postalRegex.test(postalCode.replace(/\s/g, ''));
};

/**
 * اسلاگ‌سازی متن (برای URL)
 * @param {string} text - متن
 * @returns {string} - اسلاگ
 */
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s\-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * گروه‌بندی آرایه بر اساس کلید
 * @param {Array} array - آرایه ورودی
 * @param {string} key - کلید گروه‌بندی
 * @returns {Object} - شیء گروه‌بندی شده
 */
export const groupBy = (array, key) => {
  if (!array || !Array.isArray(array)) return {};
  return array.reduce((result, item) => {
    const groupKey = item[key] || 'undefined';
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * مرتب‌سازی آرایه بر اساس فیلد
 * @param {Array} array - آرایه ورودی
 * @param {string} field - فیلد مرتب‌سازی
 * @param {string} order - ترتیب ('asc' یا 'desc')
 * @returns {Array} - آرایه مرتب شده
 */
export const sortBy = (array, field, order = 'asc') => {
  if (!array || !Array.isArray(array)) return [];
  return [...array].sort((a, b) => {
    const aVal = a[field] ?? '';
    const bVal = b[field] ?? '';
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return order === 'asc' ? aVal - bVal : bVal - aVal;
  });
};

/**
 * تاخیر (برای تست یا شبیه‌سازی)
 * @param {number} ms - میلی‌ثانیه
 * @returns {Promise} - پرامیس
 */
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * دریافت اندازه فایل به صورت خوانا
 * @param {number} bytes - اندازه به بایت
 * @returns {string} - اندازه فرمت شده
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '۰ بایت';
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${toPersianNumber(size.toFixed(1))} ${sizes[i]}`;
};

/**
 * تطابق URL با الگو
 * @param {string} url - آدرس URL
 * @param {string} pattern - الگو
 * @returns {boolean} - تطابق یا نه
 */
export const matchUrlPattern = (url, pattern) => {
  try {
    const regex = new RegExp(pattern);
    return regex.test(url);
  } catch {
    return url === pattern;
  }
};

/**
 * استخراج پارامترهای URL
 * @param {string} url - آدرس URL
 * @returns {Object} - پارامترها
 */
export const getUrlParams = (url) => {
  try {
    const parsed = new URL(url);
    const params = {};
    parsed.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch {
    return {};
  }
};

/**
 * ساخت URL با پارامترها
 * @param {string} baseUrl - آدرس پایه
 * @param {Object} params - پارامترها
 * @returns {string} - URL ساخته شده
 */
export const buildUrl = (baseUrl, params = {}) => {
  try {
    const url = new URL(baseUrl);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, String(params[key]));
      }
    });
    return url.toString();
  } catch {
    return baseUrl;
  }
};

/**
 * گرفتن مکان‌نما با GPS
 * @returns {Promise<{lat: number, lng: number}>} - مختصات
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('مرورگر از موقعیت‌یابی پشتیبانی نمی‌کند'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error('خطا در دریافت موقعیت'));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};

/**
 * کاهش (Debounce) برای بهینه‌سازی فراخوانی‌های مکرر
 * @param {Function} func - تابع
 * @param {number} wait - زمان تاخیر (ms)
 * @returns {Function} - تابع کاهش یافته
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * گاز (Throttle) برای محدود کردن فراخوانی‌ها
 * @param {Function} func - تابع
 * @param {number} limit - زمان محدودیت (ms)
 * @returns {Function} - تابع گاز شده
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * بررسی خالی بودن شیء
 * @param {Object} obj - شیء
 * @returns {boolean} - خالی یا نه
 */
export const isEmptyObject = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

/**
 * حذف مقادیر تکراری از آرایه
 * @param {Array} array - آرایه ورودی
 * @returns {Array} - آرایه بدون تکرار
 */
export const uniqueArray = (array) => {
  return [...new Set(array)];
};

/**
 * ترکیب دو شیء (عمیق)
 * @param {Object} target - هدف
 * @param {Object} source - منبع
 * @returns {Object} - شیء ترکیبی
 */
export const deepMerge = (target, source) => {
  const result = { ...target };
  Object.keys(source).forEach((key) => {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  });
  return result;
};

/**
 * گرفتن مقدار از شیء با مسیر (مثل 'user.name.first')
 * @param {Object} obj - شیء
 * @param {string} path - مسیر
 * @param {*} defaultValue - مقدار پیش‌فرض
 * @returns {*} - مقدار
 */
export const getNestedValue = (obj, path, defaultValue = undefined) => {
  try {
    return path.split('.').reduce((current, key) => current[key], obj);
  } catch {
    return defaultValue;
  }
};

/**
 * تنظیم مقدار در شیء با مسیر
 * @param {Object} obj - شیء
 * @param {string} path - مسیر
 * @param {*} value - مقدار
 * @returns {Object} - شیء جدید
 */
export const setNestedValue = (obj, path, value) => {
  const result = { ...obj };
  const keys = path.split('.');
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return result;
};

/**
 * تولید شناسه یکتا (UUID)
 * @returns {string} - UUID
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
