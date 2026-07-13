import api from './api';

// دریافت لیست محصولات با فیلترها
export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت محصولات');
  }
};

// دریافت یک محصول با ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'محصول یافت نشد');
  }
};

// دریافت محصولات ویژه
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const response = await api.get(`/products/featured?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت محصولات ویژه');
  }
};

// دریافت محصولات جدید
export const getNewProducts = async (limit = 8) => {
  try {
    const response = await api.get(`/products/new?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت محصولات جدید');
  }
};

// دریافت محصولات پرفروش
export const getBestSellers = async (limit = 8) => {
  try {
    const response = await api.get(`/products/bestsellers?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت محصولات پرفروش');
  }
};

// دریافت محصولات مرتبط
export const getRelatedProducts = async (productId, limit = 4) => {
  try {
    const response = await api.get(`/products/${productId}/related?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت محصولات مرتبط');
  }
};

// دریافت دسته‌بندی‌ها
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت دسته‌بندی‌ها');
  }
};

// جستجوی پیشرفته محصولات
export const searchProducts = async (query, filters = {}) => {
  try {
    const params = new URLSearchParams({ q: query });
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    
    const response = await api.get(`/products/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در جستجوی محصولات');
  }
};

// دریافت محصولات با تخفیف
export const getDiscountedProducts = async (limit = 8) => {
  try {
    const response = await api.get(`/products/discounted?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت محصولات تخفیف‌دار');
  }
};
