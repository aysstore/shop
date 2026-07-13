import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProducts, getProductById, getFeaturedProducts, getNewProducts } from '../services/productService';

// ایجاد کانتکست
const ProductContext = createContext();

// Hook سفارشی
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// کامپوننت Provider
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    search: ''
  });

  // بارگذاری محصولات
  const loadProducts = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(filters);
      setProducts(data);
      return data;
    } catch (err) {
      setError(err.message || 'خطا در بارگذاری محصولات');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // بارگذاری محصولات ویژه
  const loadFeaturedProducts = async () => {
    try {
      const data = await getFeaturedProducts();
      setFeaturedProducts(data);
      return data;
    } catch (err) {
      console.error('Error loading featured products:', err);
      return [];
    }
  };

  // بارگذاری محصولات جدید
  const loadNewProducts = async () => {
    try {
      const data = await getNewProducts();
      setNewProducts(data);
      return data;
    } catch (err) {
      console.error('Error loading new products:', err);
      return [];
    }
  };

  // دریافت یک محصول با ID
  const getProduct = async (id) => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      return data;
    } catch (err) {
      setError(err.message || 'محصول یافت نشد');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // اعمال فیلترها
  const applyFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    loadProducts({ ...filters, ...newFilters });
  };

  // پاک کردن فیلترها
  const clearFilters = () => {
    const defaultFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      search: ''
    };
    setFilters(defaultFilters);
    loadProducts(defaultFilters);
  };

  // مقداردهی context
  const value = {
    products,
    featuredProducts,
    newProducts,
    loading,
    error,
    filters,
    loadProducts,
    loadFeaturedProducts,
    loadNewProducts,
    getProduct,
    applyFilters,
    clearFilters
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
