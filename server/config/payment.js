const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// تنظیمات Stripe
const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  publicKey: process.env.STRIPE_PUBLIC_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  currency: 'IRR',
  paymentMethods: ['card', 'bank_transfer']
};

// تنظیمات زرین‌پال
const zarinpalConfig = {
  merchantId: process.env.ZARINPAL_MERCHANT_ID,
  callbackUrl: process.env.ZARINPAL_CALLBACK_URL,
  sandbox: process.env.ZARINPAL_SANDBOX === 'true'
};

// تنظیمات پرداخت در محل
const codConfig = {
  enabled: true,
  maxAmount: 10000000, // حداکثر مبلغ برای پرداخت در محل
  additionalFee: 0 // هزینه اضافی
};

// تنظیمات عمومی پرداخت
const paymentConfig = {
  defaultMethod: 'stripe',
  supportedMethods: ['stripe', 'zarinpal', 'cod'],
  minAmount: 1000, // حداقل مبلغ قابل پرداخت
  maxAmount: 100000000, // حداکثر مبلغ قابل پرداخت
  timeout: 30, // زمان انتظار برای پرداخت (دقیقه)
  retryLimit: 3 // تعداد تلاش مجاز
};

// تابع پرداخت با Stripe
const createStripePayment = async (amount, currency = 'IRR', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // مقدار باید به کوچکترین واحد پول باشد
      currency: currency.toLowerCase(),
      metadata,
      payment_method_types: stripeConfig.paymentMethods
    });

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    };
  } catch (error) {
    console.error('Stripe payment creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// تابع تایید پرداخت با Stripe
const verifyStripePayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      paymentIntent
    };
  } catch (error) {
    console.error('Stripe payment verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// تابع بازگشت وجه با Stripe
const refundStripePayment = async (paymentIntentId, amount = null) => {
  try {
    const refundParams = { payment_intent: paymentIntentId };
    if (amount) {
      refundParams.amount = amount;
    }

    const refund = await stripe.refunds.create(refundParams);
    
    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status
    };
  } catch (error) {
    console.error('Stripe refund error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// تابع ایجاد پرداخت با زرین‌پال
const createZarinpalPayment = async (amount, description, metadata = {}) => {
  try {
    // اینجا باید API زرین‌پال را پیاده‌سازی کنید
    // به دلیل پیچیدگی، فقط یک شبیه‌سازی ساده انجام می‌دهیم
    return {
      success: true,
      paymentUrl: `${process.env.CLIENT_URL}/payment/zarinpal`,
      authority: `ZP-${Date.now()}`,
      amount
    };
  } catch (error) {
    console.error('Zarinpal payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// تابع تایید پرداخت زرین‌پال
const verifyZarinpalPayment = async (authority, status) => {
  try {
    // شبیه‌سازی تایید
    if (status === 'OK') {
      return {
        success: true,
        refId: `REF-${Date.now()}`
      };
    }
    return {
      success: false,
      error: 'پرداخت ناموفق بود'
    };
  } catch (error) {
    console.error('Zarinpal verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// تابع اعتبارسنجی پرداخت در محل
const validateCOD = (order) => {
  if (!codConfig.enabled) {
    return { valid: false, message: 'پرداخت در محل فعال نیست' };
  }

  if (order.totalPrice > codConfig.maxAmount) {
    return { valid: false, message: `مبلغ سفارش بیشتر از حداکثر مجاز (${codConfig.maxAmount.toLocaleString()} تومان) است` };
  }

  return { valid: true };
};

// صادر کردن تمام تنظیمات و توابع
module.exports = {
  stripeConfig,
  zarinpalConfig,
  codConfig,
  paymentConfig,
  createStripePayment,
  verifyStripePayment,
  refundStripePayment,
  createZarinpalPayment,
  verifyZarinpalPayment,
  validateCOD,
  stripe
};
