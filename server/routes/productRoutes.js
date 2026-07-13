const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getNewProducts,
  getBestSellers,
  getRelatedProducts,
  searchProducts,
  getDiscountedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// مسیرهای عمومی
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new', getNewProducts);
router.get('/bestsellers', getBestSellers);
router.get('/discounted', getDiscountedProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

// مسیرهای خصوصی
router.post('/:id/reviews', protect, addReview);

// مسیرهای ادمین
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
