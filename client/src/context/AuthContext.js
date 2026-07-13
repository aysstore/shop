import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/authService';

// ایجاد کانتکست
const AuthContext = createContext();

// Hook سفارشی برای استفاده از AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// کامپوننت Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // بررسی وضعیت احراز هویت در بارگذاری اولیه
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // تابع ورود
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const data = await loginUser(email, password);
      const { token, user } = data;
      
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true, user };
    } catch (err) {
      setError(err.message || 'خطا در ورود');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // تابع ثبت‌نام
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const data = await registerUser(userData);
      const { token, user } = data;
      
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true, user };
    } catch (err) {
      setError(err.message || 'خطا در ثبت‌نام');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // تابع خروج
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // تابع بروزرسانی پروفایل
  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  // مقداردهی context
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
