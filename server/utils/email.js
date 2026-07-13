const nodemailer = require('nodemailer');
const path = require('path');

// ایجاد ترانسپورتر ایمیل
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// قالب‌های ایمیل
const templates = {
  'verify-email': (data) => ({
    subject: 'تایید ایمیل - فروشگاه آیس',
    html: `
      <div style="font-family: Vazirmatn, Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
        <h2 style="color: #e11d48;">فروشگاه آیس</h2>
        <h3>سلام ${data.name} عزیز!</h3>
        <p>از ثبت‌نام شما در فروشگاه آیس خوشحالیم. لطفاً برای تایید ایمیل خود روی لینک زیر کلیک کنید:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.link}" style="background-color: #e11d48; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            تایید ایمیل
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">اگر روی دکمه کار نمی‌کند، لینک زیر را در مرورگر خود کپی کنید:</p>
        <p style="font-size: 12px; color: #888; word-break: break-all;">${data.link}</p>
        <p style="font-size: 14px; color: #666;">این لینک تا ۲۴ ساعت معتبر است.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">فروشگاه آیس - ارائه بهترین محصولات با کیفیت</p>
      </div>
    `
  }),

  'reset-password': (data) => ({
    subject: 'بازنشانی رمز عبور - فروشگاه آیس',
    html: `
      <div style="font-family: Vazirmatn, Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
        <h2 style="color: #e11d48;">فروشگاه آیس</h2>
        <h3>سلام ${data.name} عزیز!</h3>
        <p>درخواست بازنشانی رمز عبور برای حساب کاربری شما ثبت شده است. برای تنظیم رمز جدید روی لینک زیر کلیک کنید:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.link}" style="background-color: #e11d48; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            بازنشانی رمز عبور
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">اگر شما این درخواست را ثبت نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.</p>
        <p style="font-size: 14px; color: #666;">این لینک تا ۱ ساعت معتبر است.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">فروشگاه آیس - ارائه بهترین محصولات با کیفیت</p>
      </div>
    `
  }),

  'order-confirmation': (data) => ({
    subject: `تایید سفارش #${data.orderId} - فروشگاه آیس`,
    html: `
      <div style="font-family: Vazirmatn, Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
        <h2 style="color: #e11d48;">فروشگاه آیس</h2>
        <h3>سلام ${data.name} عزیز!</h3>
        <p>سفارش شما با موفقیت ثبت شد. جزئیات سفارش:</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>شماره سفارش:</strong> #${data.orderId}</p>
          <p><strong>مبلغ کل:</strong> ${data.totalPrice.toLocaleString()} تومان</p>
          <h4>محصولات:</h4>
          <ul>
            ${data.items.map(item => `<li>${item.name} - ${item.quantity} عدد - ${(item.price * item.quantity).toLocaleString()} تومان</li>`).join('')}
          </ul>
        </div>
        <p>وضعیت سفارش خود را می‌توانید در پنل کاربری خود مشاهده کنید.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">فروشگاه آیس - ارائه بهترین محصولات با کیفیت</p>
      </div>
    `
  }),

  'payment-confirmation': (data) => ({
    subject: `تایید پرداخت سفارش #${data.orderId} - فروشگاه آیس`,
    html: `
      <div style="font-family: Vazirmatn, Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
        <h2 style="color: #e11d48;">فروشگاه آیس</h2>
        <h3>سلام ${data.name} عزیز!</h3>
        <p>پرداخت سفارش #${data.orderId} با موفقیت انجام شد.</p>
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #bbf7d0;">
          <p><strong>مبلغ پرداختی:</strong> ${data.totalPrice.toLocaleString()} تومان</p>
          <p><strong>وضعیت:</strong> پرداخت شده</p>
        </div>
        <p>سفارش شما در حال پردازش است و به زودی ارسال خواهد شد.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">فروشگاه آیس - ارائه بهترین محصولات با کیفیت</p>
      </div>
    `
  })
};

// تابع اصلی ارسال ایمیل
exports.sendEmail = async ({ to, subject, template, data = {} }) => {
  try {
    // انتخاب قالب
    const templateData = templates[template];
    if (!templateData) {
      throw new Error(`قالب ایمیل ${template} یافت نشد`);
    }

    const { subject: templateSubject, html } = templateData(data);

    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@ays-store.com',
      to,
      subject: subject || templateSubject,
      html
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('خطا در ارسال ایمیل');
  }
};

// ارسال ایمیل سفارشی
exports.sendCustomEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@ays-store.com',
      to,
      subject,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Custom email error:', error);
    throw new Error('خطا در ارسال ایمیل');
  }
};
