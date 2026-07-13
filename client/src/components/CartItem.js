import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useContext(CartContext);

  const {
    _id,
    name,
    price,
    images,
    quantity,
    stock = 0,
    discount = 0
  } = item;

  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const totalPrice = discountedPrice * quantity;
  const imageUrl = images?.[0] || '/images/placeholder-product.jpg';

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(_id);
    } else if (newQuantity <= stock) {
      updateQuantity(_id, newQuantity);
    } else {
      // نمایش پیام خطا به کاربر - در اینجا می‌توانید از toast استفاده کنید
      console.warn('موجودی کافی نیست');
    }
  };

  const handleRemove = () => {
    removeFromCart(_id);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <Link to={`/product/${_id}`}>
          <img src={imageUrl} alt={name} loading="lazy" />
        </Link>
      </div>

      <div className="cart-item-info">
        <Link to={`/product/${_id}`} className="cart-item-name">
          {name}
        </Link>
        
        {discount > 0 && (
          <div className="cart-item-discount">
            <span className="original-price">
              {price.toLocaleString()} تومان
            </span>
            <span className="discount-badge">{discount}%</span>
          </div>
        )}
        
        <div className="cart-item-price">
          <span className="price">
            {discountedPrice.toLocaleString()} تومان
          </span>
          <span className="total-price">
            جمع: {totalPrice.toLocaleString()} تومان
          </span>
        </div>

        <div className="cart-item-actions">
          <div className="quantity-control">
            <button 
              className="qty-btn"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <i className="fas fa-minus"></i>
            </button>
            
            <span className="quantity-display">{quantity}</span>
            
            <button 
              className="qty-btn"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= stock}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>

          <button 
            className="remove-btn"
            onClick={handleRemove}
            aria-label="حذف از سبد خرید"
          >
            <i className="fas fa-trash-alt"></i>
            حذف
          </button>
        </div>

        {stock > 0 && quantity >= stock && (
          <div className="stock-warning">
            <i className="fas fa-exclamation-triangle"></i>
            حداکثر موجودی انتخاب شده است
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
