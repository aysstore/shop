const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'نام و نام خانوادگی الزامی است'],
      trim: true,
      minlength: [3, 'نام باید حداقل ۳ کاراکتر باشد'],
      maxlength: [50, 'نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد']
    },
    email: {
      type: String,
      required: [true, 'ایمیل الزامی است'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'ایمیل نامعتبر است']
    },
    password: {
      type: String,
      required: [true, 'رمز عبور الزامی است'],
      minlength: [6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'],
      select: false
    },
    phone: {
      type: String,
      required: [true, 'شماره تلفن الزامی است'],
      unique: true,
      trim: true,
      match: [/^(0|98)?9\d{9}$/, 'شماره تلفن نامعتبر است']
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'seller'],
      default: 'user'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    address: {
      address: String,
      city: String,
      postalCode: String,
      country: {
        type: String,
        default: 'Iran'
      }
    },
    profileImage: {
      type: String,
      default: ''
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    lastLogin: {
      type: Date,
      default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    refreshToken: String,
    refreshTokenExpire: Date
  },
  {
    timestamps: true
  }
);

// هش کردن رمز عبور قبل از ذخیره
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// متد مقایسه رمز عبور
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// متد برای حذف اطلاعات حساس
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  delete user.emailVerificationToken;
  delete user.emailVerificationExpire;
  delete user.refreshToken;
  delete user.refreshTokenExpire;
  return user;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
