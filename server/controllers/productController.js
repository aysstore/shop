const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    دریافت لیست محصولات
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    // ساخت فیلترها
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // مرتب‌سازی
    let sortOption = {};
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    // صفحه‌بندی
    const skip = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    // دریافت محصولات
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // تعداد کل محصولات
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محصولات',
      error: error.message
    });
  }
};

// @desc    دریافت یک محصول با ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description')
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد'
      });
    }

    // افزایش تعداد بازدید
    product.views = (product.views || 0) + 1;
    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محصول',
      error: error.message
    });
  }
};

// @desc    دریافت محصولات ویژه
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    
    const products = await Product.find({ isFeatured: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محصولات ویژه',
      error: error.message
    });
  }
};

// @desc    دریافت محصولات جدید
// @route   GET /api/products/new
// @access  Public
exports.getNewProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محصولات جدید',
      error: error.message
    });
  }
};

// @desc    دریافت محصولات پرفروش
// @route   GET /api/products/bestsellers
// @access  Public
exports.getBestSellers = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ salesCount: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محصولات پرفروش',
      error: error.message
    });
  }
};

// @desc    دریافت محصولات مرتبط
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 4;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد'
      });
    }

    const products = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    })
      .populate('category', 'name')
      .limit(limit);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محصولات مرتبط',
      error: error.message
    });
  }
};

// @desc    جستجوی محصولات
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'عبارت جستجو الزامی است'
      });
    }

    const filter = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در جستجوی محصولات',
      error: error.message
    });
  }
};

// @desc    دریافت محصولات تخفیف‌دار
// @route   GET /api/products/discounted
// @access  Public
exports.getDiscountedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    
    const products = await Product.find({
      discount: { $gt: 0 }
    })
      .populate('category', 'name')
      .sort({ discount: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محصولات تخفیف‌دار',
      error: error.message
    });
  }
};

// ============================================
// بخش ادمین (نیاز به احراز هویت و نقش ادمین)
// ============================================

// @desc    ایجاد محصول جدید (ادمین)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      images,
      discount,
      isFeatured,
      specifications
    } = req.body;

    // بررسی وجود دسته‌بندی
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'دسته‌بندی نامعتبر است'
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: images || [],
      discount: discount || 0,
      isFeatured: isFeatured || false,
      specifications: specifications || {}
    });

    res.status(201).json({
      success: true,
      message: 'محصول با موفقیت ایجاد شد',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد محصول',
      error: error.message
    });
  }
};

// @desc    بروزرسانی محصول (ادمین)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      images,
      discount,
      isFeatured,
      specifications
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد'
      });
    }

    // بروزرسانی فیلدها
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'دسته‌بندی نامعتبر است'
        });
      }
      product.category = category;
    }
    if (stock !== undefined) product.stock = stock;
    if (images) product.images = images;
    if (discount !== undefined) product.discount = discount;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (specifications) product.specifications = specifications;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'محصول با موفقیت بروزرسانی شد',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در بروزرسانی محصول',
      error: error.message
    });
  }
};

// @desc    حذف محصول (ادمین)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'محصول با موفقیت حذف شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در حذف محصول',
      error: error.message
    });
  }
};

// @desc    افزودن نظر برای محصول
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد'
      });
    }

    // بررسی خرید محصول توسط کاربر
    // (در اینجا می‌توانید بررسی کنید که کاربر این محصول را خریده است یا نه)

    // بررسی نظر تکراری
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'شما قبلاً برای این محصول نظر داده‌اید'
      });
    }

    // افزودن نظر
    product.reviews.push({
      user: req.user.id,
      rating: Number(rating),
      comment
    });

    // محاسبه میانگین امتیاز
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;
    product.numReviews = product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'نظر شما با موفقیت ثبت شد',
      rating: product.rating,
      numReviews: product.numReviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت نظر',
      error: error.message
    });
  }
};
