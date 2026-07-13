const crypto = require('crypto');

// کلید رمزنگاری (از محیط دریافت می‌شود)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-32chars';
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

// اطمینان از طول کلید
const getKey = () => {
  if (ENCRYPTION_KEY.length < 32) {
    return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
  }
  return Buffer.from(ENCRYPTION_KEY.slice(0, 32));
};

// رمزنگاری متن
exports.encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('خطا در رمزنگاری');
  }
};

// رمزگشایی متن
exports.decrypt = (encryptedText) => {
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('فرمت نامعتبر');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('خطا در رمزگشایی');
  }
};

// تولید هش با salt
exports.hash = (text, salt = null) => {
  try {
    const saltValue = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(text, saltValue, 1000, 64, 'sha512').toString('hex');
    return { hash, salt: saltValue };
  } catch (error) {
    console.error('Hashing error:', error);
    throw new Error('خطا در هش کردن');
  }
};

// تایید هش
exports.verifyHash = (text, hash, salt) => {
  try {
    const result = crypto.pbkdf2Sync(text, salt, 1000, 64, 'sha512').toString('hex');
    return result === hash;
  } catch (error) {
    console.error('Hash verification error:', error);
    return false;
  }
};

// تولید توکن امن
exports.generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// تولید کد یکبار مصرف (OTP)
exports.generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return otp;
};

// تولید کلید تصادفی
exports.generateRandomKey = (length = 32) => {
  return crypto.randomBytes(length).toString('base64');
};

// تولید شناسه یکتا
exports.generateUniqueId = () => {
  return crypto.randomUUID();
};

// هش کردن رمز عبور (با استفاده از bcrypt در مدل User استفاده می‌شود)
// اینجا فقط یک wrapper ساده است
exports.hashPassword = async (password) => {
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// مقایسه رمز عبور
exports.comparePassword = async (password, hashedPassword) => {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, hashedPassword);
};
