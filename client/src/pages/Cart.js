import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, clearCart, getTotalPrice, getTotalItems } = useContext(CartContext);
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <i className="fas fa-shopping-cart"></i>
            <h2>سبد خرید شما خالی است</h2>
            <p>به فروشگاه آیس خوش آمدید! محصولات متنوعی برای شما آماده شده است.</p>
            <Link to="/products" className="btn btn-primary">
              شروع خرید
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>سبد خرید</h1>
          <span className="cart-items-count">{totalItems} کالا</span>
        </div>

        <div className="cart-layout">
          {/* لیست کالاها */}
          <div className="cart-items-list">
            {cartItems.map(item => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>

          {/* خلاصه سبد خرید */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>خلاصه سبد خرید</h3>
              
              <div className="summary-row">
                <span>تعداد کالاها</span>
                <span>{totalItems} عدد</span>
              </div>
              
              <div className="summary-row">
                <span>قیمت کل</span>
                <span className="total-price">{totalPrice.toLocaleString()} تومان</span>
              </div>
              
              <div className="summary-row discount">
                <span>تخفیف</span>
                <span>۰ تومان</span>
              </div>
              
              <div className="summary-row shipping">
                <span>هزینه ارسال</span>
                <span>محاسبه در مرحله بعد</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-total">
                <span>جمع کل</span>
                <span className="grand-total">{totalPrice.toLocaleString()} تومان</span>
              </div>

              <button className="btn btn-primary checkout-btn">
                ادامه فرآیند خرید
              </button>
              
              <button className="btn btn-secondary clear-cart-btn" onClick={clearCart}>
                <i className="fas fa-trash-alt"></i>
                خالی کردن سبد خرید
              </button>
              
              <Link to="/products" className="continue-shopping">
                <i className="fas fa-arrow-right"></i>
                ادامه خرید
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
