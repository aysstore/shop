import api from './api';

// ثبت‌نام کاربر
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در ثبت‌نام');
  }
};

// ورود کاربر
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در ورود');
  }
};

// خروج کاربر
export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error(error.message || 'خطا در خروج');
  }
};

// دریافت اطلاعات کاربر جاری
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت اطلاعات کاربر');
  }
};

// بروزرسانی پروفایل کاربر
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در بروزرسانی پروفایل');
  }
};

// تغییر رمز عبور
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.put('/auth/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در تغییر رمز عبور');
  }
};

// فراموشی رمز عبور - ارسال ایمیل بازیابی
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در ارسال ایمیل بازیابی');
  }
};

// بازنشانی رمز عبور
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در بازنشانی رمز عبور');
  }
};

// تایید ایمیل
export const verifyEmail = async (token) => {
  try {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در تایید ایمیل');
  }
};

// دریافت توکن جدید با رفرش توکن
export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت توکن جدید');
  }
};
