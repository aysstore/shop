// این فایل برای تعریف مسیرهای اصلی و مدیریت آنهاست
// در App.js از آن استفاده می‌شود

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  DASHBOARD_ORDERS: '/dashboard/orders',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_WISHLIST: '/dashboard/wishlist',
  DASHBOARD_ADDRESSES: '/dashboard/addresses',
  NOT_FOUND: '/404',
};

// مسیرهای عمومی (نیاز به احراز هویت ندارند)
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.PRODUCTS,
  ROUTES.PRODUCT_DETAIL,
  ROUTES.CART,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
];

// مسیرهای خصوصی (نیاز به احراز هویت دارند)
export const PRIVATE_ROUTES = [
  ROUTES.CHECKOUT,
  ROUTES.DASHBOARD,
  ROUTES.DASHBOARD_ORDERS,
  ROUTES.DASHBOARD_PROFILE,
  ROUTES.DASHBOARD_WISHLIST,
  ROUTES.DASHBOARD_ADDRESSES,
];

// مسیرهای ادمین
export const ADMIN_ROUTES = [
  '/admin',
  '/admin/products',
  '/admin/orders',
  '/admin/users',
  '/admin/categories',
  '/admin/discounts',
];

// تابع کمکی برای ساخت مسیر با پارامتر
export const buildRoute = (route, params = {}) => {
  let path = route;
  Object.keys(params).forEach((key) => {
    path = path.replace(`:${key}`, params[key]);
  });
  return path;
};

// تابع کمکی برای ساخت مسیر محصول
export const productRoute = (id) => {
  return buildRoute(ROUTES.PRODUCT_DETAIL, { id });
};

// تابع کمکی برای بررسی مسیر عمومی
export const isPublicRoute = (path) => {
  return PUBLIC_ROUTES.some((route) => {
    if (route.includes(':')) {
      // مسیرهای با پارامتر را بررسی می‌کنیم
      const pattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    }
    return route === path;
  });
};

// تابع کمکی برای بررسی مسیر خصوصی
export const isPrivateRoute = (path) => {
  return PRIVATE_ROUTES.some((route) => {
    if (route.includes(':')) {
      const pattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    }
    return route === path || path.startsWith(route + '/');
  });
};
