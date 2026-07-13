// فایل خروجی برای سرویس‌ها
export { default as api, setAuthToken, removeAuthToken } from './api';

export * from './authService';
export * from './productService';
export * from './orderService';
export * from './paymentService';

// همچنین می‌توانید به صورت تکی هم صادر کنید
export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken
} from './authService';

export {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getNewProducts,
  getBestSellers,
  getRelatedProducts,
  getCategories,
  searchProducts,
  getDiscountedProducts
} from './productService';

export {
  createOrder,
  getUserOrders,
  getOrderById,
  confirmPayment,
  cancelOrder,
  getOrderStatus,
  trackOrder,
  getOrderInvoice,
  requestReturn
} from './orderService';

export {
  createPayment,
  verifyPayment,
  getPaymentStatus,
  getPaymentMethods,
  refundPayment
} from './paymentService';
