const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'نام محصول الزامی است'],
      trim: true,
      index: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'توضیحات محصول الزامی است'],
      trim: true,
      minlength: [10, 'توضیحات باید حداقل ۱۰ کاراکتر باشد']
    },
    price: {
      type: Number,
      required: [true, 'قیمت محصول الزامی است'],
      min: [0, 'قیمت نمی‌تواند منفی باشد']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'تخفیف نمی‌تواند منفی باشد'],
      max: [100, 'تخفیف نمی‌تواند بیشتر از ۱۰۰ درصد باشد']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'دسته‌بندی محصول الزامی است']
    },
    stock: {
      type: Number,
      required: [true, 'موجودی محصول الزامی است'],
      min: [0, 'موجودی نمی‌تواند منفی باشد'],
      default: 0
    },
    images: [
      {
        type: String,
        required: [true, 'حداقل یک تصویر برای محصول الزامی است']
      }
    ],
    specifications: {
      type: Map,
      of: String,
      default: {}
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        name: {
          type: String,
          required: true
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
        },
        comment: {
          type: String,
          required: true,
          minlength: [3, 'نظر باید حداقل ۳ کاراکتر باشد']
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    views: {
      type: Number,
      default: 0
    },
    salesCount: {
      type: Number,
      default: 0
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
  },
  {
    timestamps: true
  }
);

// ایجاد اسلاگ از نام محصول
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s\-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// ایندکس برای جستجوی متن
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// متد محاسبه قیمت با تخفیف
productSchema.methods.getDiscountedPrice = function () {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
};

// متد محاسبه مبلغ تخفیف
productSchema.methods.getDiscountAmount = function () {
  return this.price - this.getDiscountedPrice();
};

// متد بررسی موجودی
productSchema.methods.isInStock = function (quantity = 1) {
  return this.stock >= quantity;
};

// متد کاهش موجودی
productSchema.methods.reduceStock = async function (quantity) {
  if (!this.isInStock(quantity)) {
    throw new Error('موجودی کافی نیست');
  }
  this.stock -= quantity;
  this.salesCount += quantity;
  await this.save();
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
