const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/email');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

// @desc    ثبت‌نام کاربر جدید
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // بررسی وجود کاربر
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'این ایمیل یا شماره تلفن قبلاً ثبت شده است'
      });
    }

    // ایجاد کاربر جدید
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    // ارسال ایمیل تایید
    const verificationToken = generateToken({ id: user._id }, '1d');
    await sendEmail({
      to: user.email,
      subject: 'تایید ایمیل - فروشگاه آیس',
      template: 'verify-email',
      data: {
        name: user.name,
        link: `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`
      }
    });

    // تولید توکن
    const token = generateToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.status(201).json({
      success: true,
      message: 'ثبت‌نام با موفقیت انجام شد. ایمیل تایید برای شما ارسال شد.',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت‌نام',
      error: error.message
    });
  }
};

// @desc    ورود کاربر
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // یافتن کاربر
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ایمیل یا رمز عبور نادرست است'
      });
    }

    // بررسی رمز عبور
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'ایمیل یا رمز عبور نادرست است'
      });
    }

    // بررسی تایید ایمیل
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'لطفاً ابتدا ایمیل خود را تایید کنید'
      });
    }

    // بروزرسانی آخرین ورود
    user.lastLogin = new Date();
    await user.save();

    // تولید توکن
    const token = generateToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.status(200).json({
      success: true,
      message: 'ورود با موفقیت انجام شد',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ورود',
      error: error.message
    });
  }
};

// @desc    خروج کاربر
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'خروج با موفقیت انجام شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در خروج',
      error: error.message
    });
  }
};

// @desc    دریافت اطلاعات کاربر جاری
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات کاربر',
      error: error.message
    });
  }
};

// @desc    بروزرسانی پروفایل کاربر
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // بروزرسانی فیلدها
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'پروفایل با موفقیت بروزرسانی شد',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در بروزرسانی پروفایل',
      error: error.message
    });
  }
};

// @desc    تغییر رمز عبور
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // بررسی رمز فعلی
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'رمز عبور فعلی نادرست است'
      });
    }

    // تنظیم رمز جدید
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'رمز عبور با موفقیت تغییر یافت'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در تغییر رمز عبور',
      error: error.message
    });
  }
};

// @desc    فراموشی رمز عبور
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربری با این ایمیل یافت نشد'
      });
    }

    // تولید توکن بازنشانی
    const resetToken = generateToken({ id: user._id }, '1h');
    
    // ذخیره توکن در دیتابیس
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 ساعت
    await user.save();

    // ارسال ایمیل
    await sendEmail({
      to: user.email,
      subject: 'بازنشانی رمز عبور - فروشگاه آیس',
      template: 'reset-password',
      data: {
        name: user.name,
        link: `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
      }
    });

    res.status(200).json({
      success: true,
      message: 'ایمیل بازنشانی رمز عبور ارسال شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در ارسال ایمیل بازنشانی',
      error: error.message
    });
  }
};

// @desc    بازنشانی رمز عبور
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // یافتن کاربر با توکن معتبر
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'توکن نامعتبر یا منقضی شده است'
      });
    }

    // تنظیم رمز جدید
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'رمز عبور با موفقیت بازنشانی شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در بازنشانی رمز عبور',
      error: error.message
    });
  }
};

// @desc    تایید ایمیل
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    // تایید توکن
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: 'توکن نامعتبر یا منقضی شده است'
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'ایمیل قبلاً تایید شده است'
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'ایمیل با موفقیت تایید شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در تایید ایمیل',
      error: error.message
    });
  }
};

// @desc    دریافت توکن جدید با رفرش توکن
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'رفرش توکن الزامی است'
      });
    }

    // تایید رفرش توکن
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'رفرش توکن نامعتبر یا منقضی شده است'
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // تولید توکن جدید
    const token = generateToken({ id: user._id });

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت توکن جدید',
      error: error.message
    });
  }
};

// @desc    ارسال مجدد ایمیل تایید
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربری با این ایمیل یافت نشد'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'ایمیل قبلاً تایید شده است'
      });
    }

    // تولید توکن جدید
    const verificationToken = generateToken({ id: user._id }, '1d');
    
    // ارسال ایمیل
    await sendEmail({
      to: user.email,
      subject: 'تایید ایمیل - فروشگاه آیس',
      template: 'verify-email',
      data: {
        name: user.name,
        link: `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`
      }
    });

    res.status(200).json({
      success: true,
      message: 'ایمیل تایید مجدداً ارسال شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در ارسال ایمیل تایید',
      error: error.message
    });
  }
};
