import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3 className="footer-title">درباره آیس</h3>
              <p className="footer-desc">
                فروشگاه اینترنتی آیس با هدف ارائه بهترین محصولات با کیفیت و قیمت مناسب 
                فعالیت خود را آغاز کرده است. ما با افتخار محصولات متنوعی را برای شما فراهم کرده‌ایم.
              </p>
              <div className="social-links">
                <a href="#" aria-label="اینستاگرام"><i className="fab fa-instagram"></i></a>
                <a href="#" aria-label="تلگرام"><i className="fab fa-telegram"></i></a>
                <a href="#" aria-label="یوتیوب"><i className="fab fa-youtube"></i></a>
                <a href="#" aria-label="توییتر"><i className="fab fa-twitter"></i></a>
              </div>
            </div>

            <div className="footer-col">
              <h3 className="footer-title">دسترسی سریع</h3>
              <ul className="footer-links">
                <li><Link to="/products">محصولات</Link></li>
                <li><Link to="/categories">دسته‌بندی</Link></li>
                <li><Link to="/about">درباره ما</Link></li>
                <li><Link to="/contact">تماس با ما</Link></li>
                <li><Link to="/faq">سوالات متداول</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-title">خدمات مشتریان</h3>
              <ul className="footer-links">
                <li><Link to="/returns">بازگشت کالا</Link></li>
                <li><Link to="/shipping">روش‌های ارسال</Link></li>
                <li><Link to="/privacy">حریم خصوصی</Link></li>
                <li><Link to="/terms">قوانین و مقررات</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-title">اطلاعات تماس</h3>
              <ul className="footer-contact">
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
                </li>
                <li>
                  <i className="fas fa-phone"></i>
                  <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>info@ays-store.com</span>
                </li>
                <li>
                  <i className="fas fa-clock"></i>
                  <span>شنبه تا پنجشنبه ۹:۰۰ تا ۲۱:۰۰</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {currentYear} فروشگاه اینترنتی آیس. تمامی حقوق محفوظ است.
            </p>
            <div className="payment-methods">
              <img src="/images/payment/visa.png" alt="ویزا" />
              <img src="/images/payment/mastercard.png" alt="مسترکارت" />
              <img src="/images/payment/paypal.png" alt="پی‌پال" />
              <img src="/images/payment/zarinpal.png" alt="زرین‌پال" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
