import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { addToCart } = useContext(CartContext);

  const {
    _id,
    name,
    price,
    images,
    category,
    rating = 0,
    numReviews = 0,
    stock = 0,
    discount = 0,
    isNew = false,
    isFeatured = false
  } = product;

  const originalPrice = price;
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const hasDiscount = discount > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, quantity: 1 });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInWishlist(!isInWishlist);
    // در اینجا می‌توانید درخواست API برای افزودن/حذف از علاقه‌مندی‌ها ارسال کنید
  };

  const productImage = images?.[0] || '/images/placeholder-product.jpg';

  return (
    <div className="product-card">
      <Link to={`/product/${_id}`} className="product-link">
        <div className="product-image-wrapper">
          <div className="product-image-container">
            {!isImageLoaded && (
              <div className="image-placeholder">
                <i className="fas fa-image"></i>
              </div>
            )}
            <img
              src={productImage}
              alt={name}
              className="product-image"
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
              style={{ display: isImageLoaded ? 'block' : 'none' }}
            />
            
            {hasDiscount && (
              <span className="product-badge discount-badge">
                {discount}% تخفیف
              </span>
            )}
            {isNew && (
              <span className="product-badge new-badge">جدید</span>
            )}
            {isFeatured && (
              <span className="product-badge featured-badge">پرفروش</span>
            )}
            {stock === 0 && (
              <span className="product-badge out-of-stock-badge">ناموجود</span>
            )}
          </div>
          
          <button 
            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
            onClick={handleWishlist}
            aria-label="افزودن به علاقه‌مندی‌ها"
          >
            <i className={`fas ${isInWishlist ? 'fa-heart' : 'fa-heart'}`}></i>
          </button>
        </div>

        <div className="product-info">
          <div className="product-category">{category?.name || 'دسته‌بندی نشده'}</div>
          <h3 className="product-name">{name}</h3>
          
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <i 
                  key={index}
                  className={`fas fa-star ${index < Math.round(rating) ? 'filled' : ''}`}
                ></i>
              ))}
            </div>
            <span className="rating-count">({numReviews})</span>
          </div>

          <div className="product-price">
            {hasDiscount ? (
              <>
                <span className="original-price">
                  {originalPrice.toLocaleString()} تومان
                </span>
                <span className="discounted-price">
                  {discountedPrice.toLocaleString()} تومان
                </span>
              </>
            ) : (
              <span className="price">
                {price.toLocaleString()} تومان
              </span>
            )}
          </div>

          <button 
            className={`add-to-cart-btn ${stock === 0 ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={stock === 0}
          >
            {stock === 0 ? (
              'ناموجود'
            ) : (
              <>
                <i className="fas fa-shopping-cart"></i>
                افزودن به سبد خرید
              </>
            )}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
