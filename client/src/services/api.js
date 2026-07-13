import axios from 'axios';

// ایجاد نمونه Axios با تنظیمات پایه
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 ثانیه
});

// Interceptor برای اضافه کردن توکن به هدر درخواست‌ها
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor برای مدیریت پاسخ‌ها و خطاها
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // اگر خطای 401 (Unauthorized) بود و توکن منقضی شده
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // تلاش برای رفرش توکن
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
            { refreshToken }
          );
          
          const { token } = response.data;
          localStorage.setItem('token', token);
          
          // تکرار درخواست اصلی با توکن جدید
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // اگر رفرش توکن ناموفق بود، کاربر را خارج می‌کنیم
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // مدیریت خطاهای خاص
    if (error.response) {
      // سرور پاسخ داده با خطا
      const status = error.response.status;
      const message = error.response.data?.message || 'خطا در ارتباط با سرور';

      switch (status) {
        case 400:
          console.error('Bad Request:', message);
          break;
        case 401:
          console.error('Unauthorized:', message);
          break;
        case 403:
          console.error('Forbidden:', message);
          break;
        case 404:
          console.error('Not Found:', message);
          break;
        case 500:
          console.error('Server Error:', message);
          break;
        default:
          console.error('Error:', message);
      }

      error.message = message;
    } else if (error.request) {
      // درخواست ارسال شده اما پاسخی دریافت نشده
      error.message = 'ارتباط با سرور برقرار نشد';
      console.error('No response from server');
    } else {
      // خطا در تنظیم درخواست
      error.message = 'خطا در ارسال درخواست';
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

// متدهای کمکی برای راحتی کار
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

export default api;
