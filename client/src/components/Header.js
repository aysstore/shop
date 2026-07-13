import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <span className="welcome-text">به فروشگاه آیس خوش آمدید</span>
            <div className="header-top-links">
              {user ? (
                <>
                  <Link to="/dashboard" className="top-link">
                    <i className="fas fa-user"></i> {user.name}
                  </Link>
                  <button onClick={handleLogout} className="top-link logout-btn">
                    <i className="fas fa-sign-out-alt"></i> خروج
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="top-link">
                    <i className="fas fa-sign-in-alt"></i> ورود
                  </Link>
                  <Link to="/register" className="top-link">
                    <i className="fas fa-user-plus"></i> ثبت‌نام
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <div className="header-main-content">
            <div className="logo">
              <Link to="/">
                <img src="/images/logo.png" alt="آیس" className="logo-img" />
                <span className="logo-text">آیس</span>
              </Link>
            </div>

            <div className={`search-box ${isSearchOpen ? 'active' : ''}`}>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="جستجوی محصولات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>

            <div className="header-actions">
              <button 
                className="icon-btn mobile-search"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <i className="fas fa-search"></i>
              </button>
              
              <Link to="/wishlist" className="icon-btn">
                <i className="fas fa-heart"></i>
                <span className="badge">0</span>
              </Link>
              
              <Link to="/cart" className="icon-btn cart-btn">
                <i className="fas fa-shopping-cart"></i>
                {cartCount > 0 && (
                  <span className="badge cart-badge">{cartCount}</span>
                )}
              </Link>
            </div>

            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>

      <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
        <div className="container">
          <ul className="nav-menu">
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>خانه</Link></li>
            <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>محصولات</Link></li>
            <li><Link to="/categories" onClick={() => setIsMenuOpen(false)}>دسته‌بندی</Link></li>
            <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>درباره ما</Link></li>
            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>تماس با ما</Link></li>
          </ul>
          <div className="nav-cart-mobile">
            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-shopping-cart"></i>
              سبد خرید ({cartCount})
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
