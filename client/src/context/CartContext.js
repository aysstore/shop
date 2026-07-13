import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

// ایجاد کانتکست
const CartContext = createContext();

// Hook سفارشی برای استفاده از CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// کامپوننت Provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // بارگذاری سبد خرید از localStorage در شروع
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error('Error loading cart:', err);
        setCartItems([]);
      }
    }
  }, []);

  // ذخیره سبد خرید در localStorage هنگام تغییر
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // محاسبه تعداد کل آیتم‌ها
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // محاسبه قیمت کل
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount > 0 
        ? item.price * (1 - item.discount / 100) 
        : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  // محاسبه تخفیف کل
  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item.discount > 0) {
        const discountAmount = item.price * (item.discount / 100);
        return total + discountAmount * item.quantity;
      }
      return total;
    }, 0);
  };

  // افزودن به سبد خرید
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // اگر محصول وجود دارد، تعداد را افزایش می‌دهیم
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          // اگر موجودی کافی نیست
          alert(`موجودی کافی نیست! حداکثر ${product.stock} عدد موجود است.`);
          return prevItems;
        }
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // اگر محصول جدید است
        if (quantity > product.stock) {
          alert(`موجودی کافی نیست! حداکثر ${product.stock} عدد موجود است.`);
          return prevItems;
        }
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // بروزرسانی تعداد یک محصول
  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        // اگر تعداد صفر یا منفی شد، محصول را حذف می‌کنیم
        return prevItems.filter(item => item._id !== productId);
      }
      
      return prevItems.map(item => {
        if (item._id === productId) {
          if (newQuantity > item.stock) {
            alert(`موجودی کافی نیست! حداکثر ${item.stock} عدد موجود است.`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  // حذف از سبد خرید
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  // خالی کردن سبد خرید
  const clearCart = () => {
    setCartItems([]);
  };

  // بررسی موجودی سبد خرید
  const checkStock = () => {
    const outOfStockItems = cartItems.filter(item => item.quantity > item.stock);
    if (outOfStockItems.length > 0) {
      const names = outOfStockItems.map(item => item.name).join('، ');
      alert(`موجودی برخی محصولات کافی نیست: ${names}`);
      return false;
    }
    return true;
  };

  // دریافت خلاصه سبد خرید برای تسویه
  const getCartSummary = () => {
    return {
      items: cartItems,
      totalItems: getTotalItems(),
      totalPrice: getTotalPrice(),
      totalDiscount: getTotalDiscount(),
      finalPrice: getTotalPrice()
    };
  };

  // مقداردهی context
  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getTotalDiscount,
    checkStock,
    getCartSummary,
    isEmpty: cartItems.length === 0,
    itemCount: cartItems.length
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
