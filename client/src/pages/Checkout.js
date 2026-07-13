import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const totalPrice = getTotalPrice();
  const shippingCost = shippingMethod === 'express' ? 35000 : 0;
  const finalTotal = totalPrice + shippingCost;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'نام و نام خانوادگی الزامی است';
    if (!formData.email) newErrors.email = 'ایمیل الزامی است';
    if (!formData.phone) newErrors.phone = 'شماره تلفن الزامی است';
    if (!formData.address) newErrors.address = 'آدرس الزامی است';
    if (!formData.city) newErrors.city = 'شهر الزامی است';
    if (!formData.postalCode) newErrors.postalCode = 'کد پستی الزامی است';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // در اینجا درخواست ثبت سفارش به API ارسال می‌شود
    setTimeout(() => {
      clearCart();
      navigate('/order-success');
    }, 2000);
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="page-header">
          <h1>تکمیل خرید</h1>
        </div>

        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h3>اطلاعات شخصی</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">ایمیل *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phone">شماره تلفن *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>آدرس ارسال</h3>
              <div className="form-group">
                <label htmlFor="address">آدرس دقیق *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">شهر *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">کد پستی *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={errors.postalCode ? 'error' : ''}
                  />
                  {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>نحوه ارسال</h3>
              <div className="shipping-options">
                <label className="shipping-option">
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                  />
                  <div className="option-content">
                    <span className="option-title">ارسال عادی</span>
                    <span className="option-desc">۳ تا ۵ روز کاری</span>
                    <span className="option-price">رایگان</span>
                  </div>
                </label>
                <label className="shipping-option">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                  />
                  <div className="option-content">
                    <span className="option-title">ارسال فوری</span>
                    <span className="option-desc">۲۴ تا ۴۸ ساعت</span>
                    <span className="option-price">۳۵,۰۰۰ تومان</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>روش پرداخت</h3>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                  />
                  <div className="option-content">
                    <i className="fas fa-credit-card"></i>
                    <span>پرداخت آنلاین (درگاه امن)</span>
                  </div>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="option-content">
                    <i className="fas fa-hand-holding-usd"></i>
                    <span>پرداخت در محل</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="notes">توضیحات اضافی (اختیاری)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="نکات خاص برای ارسال..."
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary submit-order"
              disabled={loading}
            >
              {loading ? 'در حال ثبت سفارش...' : 'ثبت سفارش'}
            </button>
          </form>

          <aside className="order-summary">
            <div className="summary-card">
              <h3>خلاصه سفارش</h3>
              
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item._id} className="summary-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">×{item.quantity}</span>
                    <span className="item-price">
                      {((item.discount > 0 ? item.price * (1 - item.discount/100) : item.price) * item.quantity).toLocaleString()} تومان
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>جمع کالاها</span>
                <span>{totalPrice.toLocaleString()} تومان</span>
              </div>
              
              <div className="summary-row">
                <span>هزینه ارسال</span>
                <span>{shippingCost === 0 ? 'رایگان' : shippingCost.toLocaleString() + ' تومان'}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-total">
                <span>قابل پرداخت</span>
                <span className="grand-total">{finalTotal.toLocaleString()} تومان</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
