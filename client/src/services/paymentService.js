import api from './api';

// ایجاد درخواست پرداخت
export const createPayment = async (orderId, paymentMethod) => {
  try {
    const response = await api.post('/payments/create', {
      orderId,
      paymentMethod
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در ایجاد پرداخت');
  }
};

// تایید پرداخت
export const verifyPayment = async (paymentId, data) => {
  try {
    const response = await api.post(`/payments/${paymentId}/verify`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در تایید پرداخت');
  }
};

// دریافت وضعیت پرداخت
export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}/status`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت وضعیت پرداخت');
  }
};

// دریافت روش‌های پرداخت موجود
export const getPaymentMethods = async () => {
  try {
    const response = await api.get('/payments/methods');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در دریافت روش‌های پرداخت');
  }
};

// بازگشت وجه
export const refundPayment = async (paymentId, reason) => {
  try {
    const response = await api.post(`/payments/${paymentId}/refund`, { reason });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطا در بازگشت وجه');
  }
};
