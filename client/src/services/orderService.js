import api from './api';

// ثبت سفارش جدید
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در ثبت سفارش');
  }
};

// دریافت سفارشات کاربر
export const getUserOrders = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/orders/me?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت سفارشات');
  }
};

// دریافت یک سفارش با ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'سفارش یافت نشد');
  }
};

// تایید پرداخت سفارش
export const confirmPayment = async (orderId, paymentData) => {
  try {
    const response = await api.post(`/orders/${orderId}/pay`, paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در تایید پرداخت');
  }
};

// لغو سفارش
export const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در لغو سفارش');
  }
};

// دریافت وضعیت سفارش
export const getOrderStatus = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}/status`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت وضعیت سفارش');
  }
};

// پیگیری سفارش با کد رهگیری
export const trackOrder = async (trackingCode) => {
  try {
    const response = await api.get(`/orders/track/${trackingCode}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'کد رهگیری نامعتبر است');
  }
};

// دریافت فاکتور سفارش
export const getOrderInvoice = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت فاکتور');
  }
};

// درخواست بازگشت کالا
export const requestReturn = async (orderId, data) => {
  try {
    const response = await api.post(`/orders/${orderId}/return`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در درخواست بازگشت کالا');
  }
};
