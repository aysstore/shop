import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

// کامپوننت‌های عمومی
import Header from './components/Header';
import Footer from './components/Footer';

// صفحات
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// استایل‌ها
import './styles/index.css';
import './styles/components.css';
import './styles/pages.css';

// کامپوننت محافظت شده برای مسیرهای خصوصی
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// کامپوننت محافظت شده برای مسیرهای عمومی (وقتی کاربر لاگین است)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

// کامپوننت اصلی App
const App = () => {
  const { user } = useAuth();
  const { loadCart } = useCart();

  // بارگذاری سبد خرید از localStorage در شروع
  useEffect(() => {
    // سبد خرید به طور خودکار در CartContext از localStorage بارگذاری می‌شود
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            {/* مسیرهای عمومی */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* مسیرهای احراز هویت (فقط برای کاربران غیرلاگین) */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
            {/* مسیرهای خصوصی (فقط برای کاربران لاگین) */}
            <Route 
              path="/dashboard/*" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } 
            />
            
            {/* مسیر ۴۰۴ */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

// کامپوننت صفحه ۴۰۴
const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h1>۴۰۴</h1>
          <h2>صفحه مورد نظر یافت نشد</h2>
          <p>صفحه‌ای که به دنبال آن هستید ممکن است حذف شده یا آدرس آن تغییر کرده باشد.</p>
          <a href="/" className="btn btn-primary">
            <i className="fas fa-home"></i>
            بازگشت به خانه
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
