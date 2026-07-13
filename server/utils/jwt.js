const jwt = require('jsonwebtoken');

// تولید توکن اصلی
exports.generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// تولید رفرش توکن
exports.generateRefreshToken = (payload, expiresIn = '30d') => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn });
};

// تایید توکن
exports.verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

// تایید رفرش توکن
exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// دیکود توکن بدون تایید (فقط برای خواندن اطلاعات)
exports.decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

// بررسی انقضای توکن
exports.isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

// دریافت زمان باقی‌مانده تا انقضا (به ثانیه)
exports.getTokenRemainingTime = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return 0;
    const remaining = decoded.exp - Math.floor(Date.now() / 1000);
    return remaining > 0 ? remaining : 0;
  } catch (error) {
    return 0;
  }
};

// تولید توکن یکبار مصرف (برای ایمیل و ...)
exports.generateOneTimeToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, process.env.JWT_OTP_SECRET || process.env.JWT_SECRET, { expiresIn });
};

// تایید توکن یکبار مصرف
exports.verifyOneTimeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_OTP_SECRET || process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
