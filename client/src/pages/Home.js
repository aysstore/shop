import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // در اینجا API واقعی را صدا بزنید
        // const response = await axios.get('/api/products/home');
        // setFeaturedProducts(response.data.featured);
        // setNewProducts(response.data.new);
        // setBestSellers(response.data.bestSellers);
        
        // داده‌های نمونه برای تست
        const sampleProducts = [
          {
            _id: '1',
            name: 'هدفون بی‌سیم سونی WH-1000XM5',
            price: 12500000,
            images: ['/images/products/headphone.jpg'],
            category: { name: 'لوازم دیجیتال' },
            rating: 4.8,
            numReviews: 124,
            stock: 15,
            discount: 10,
            isNew: true,
            isFeatured: true
          },
          {
            _id: '2',
            name: 'ساعت هوشمند اپل واچ سری ۹',
            price: 18500000,
            images: ['/images/products/watch.jpg'],
            category: { name: 'لوازم دیجیتال' },
            rating: 4.9,
            numReviews: 89,
            stock: 8,
            discount: 5,
            isNew: true,
            isFeatured: true
          },
          {
            _id: '3',
            name: 'کیف چرمی مردانه برند لاکچری',
            price: 3450000,
            images: ['/images/products/bag.jpg'],
            category: { name: 'مد و پوشاک' },
            rating: 4.6,
            numReviews: 45,
            stock: 20,
            discount: 0,
            isNew: false,
            isFeatured: true
          },
          {
            _id: '4',
            name: 'عطر دیور ساواج ۱۰۰ml',
            price: 4200000,
            images: ['/images/products/perfume.jpg'],
            category: { name: 'زیبایی و بهداشت' },
            rating: 4.7,
            numReviews: 67,
            stock: 12,
            discount: 15,
            isNew: false,
            isFeatured: false
          },
          {
            _id: '5',
            name: 'کفش اسپرت نایک ایر مکس',
            price: 5600000,
            images: ['/images/products/shoes.jpg'],
            category: { name: 'مد و پوشاک' },
            rating: 4.5,
            numReviews: 78,
            stock: 25,
            discount: 20,
            isNew: true,
            isFeatured: false
          },
          {
            _id: '6',
            name: 'لپ‌تاپ ایسوس زنبوک ۱۴',
            price: 28700000,
            images: ['/images/products/laptop.jpg'],
            category: { name: 'لوازم دیجیتال' },
            rating: 4.9,
            numReviews: 56,
            stock: 5,
            discount: 8,
            isNew: false,
            isFeatured: true
          }
        ];

        setFeaturedProducts(sampleProducts.filter(p => p.isFeatured));
        setNewProducts(sampleProducts.filter(p => p.isNew));
        setBestSellers(sampleProducts.slice(0, 4));
        setError(null);
      } catch (err) {
        setError('مشکلی در بارگذاری محصولات پیش آمد');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>تلاش مجدد</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* بنر اصلی */}
      <section className="hero-banner">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                به فروشگاه <span className="highlight">آیس</span> خوش آمدید
              </h1>
              <p className="hero-subtitle">
                بهترین محصولات با کیفیت و قیمت مناسب را از ما تهیه کنید
              </p>
              <div className="hero-buttons">
                <Link to="/products" className="btn btn-primary">
                  مشاهده محصولات
                </Link>
                {!user && (
                  <Link to="/register" className="btn btn-secondary">
                    عضویت رایگان
                  </Link>
                )}
              </div>
            </div>
            <div className="hero-image">
              <img src="/images/hero-banner.png" alt="فروشگاه آیس" />
            </div>
          </div>
        </div>
      </section>

      {/* ویژگی‌های برتر */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <i className="fas fa-truck-fast"></i>
              <h3>ارسال سریع</h3>
              <p>ارسال رایگان برای سفارشات بالای ۵۰۰ هزار تومان</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-shield-halved"></i>
              <h3>ضمانت کیفیت</h3>
              <p>ضمانت بازگشت کالا تا ۷ روز</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-headset"></i>
              <h3>پشتیبانی ۲۴/۷</h3>
              <p>تیم پشتیبانی آماده پاسخگویی به سوالات شما</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-wallet"></i>
              <h3>پرداخت امن</h3>
              <p>پرداخت از طریق درگاه‌های امن و معتبر</p>
            </div>
          </div>
        </div>
      </section>

      {/* محصولات ویژه */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">محصولات ویژه</h2>
            <Link to="/products" className="view-all">
              مشاهده همه <i className="fas fa-arrow-left"></i>
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* محصولات جدید */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">جدیدترین محصولات</h2>
            <Link to="/products" className="view-all">
              مشاهده همه <i className="fas fa-arrow-left"></i>
            </Link>
          </div>
          <div className="products-grid">
            {newProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* بنر تبلیغاتی */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <div className="promo-text">
              <h2>تخفیف ویژه تابستانه</h2>
              <p>تا ۳۰٪ تخفیف برای تمام محصولات منتخب</p>
              <Link to="/products" className="btn btn-primary">
                خرید از تخفیف‌ها
              </Link>
            </div>
            <div className="promo-code">
              <span>کد تخفیف: SUMMER30</span>
            </div>
          </div>
        </div>
      </section>

      {/* پرفروش‌ترین‌ها */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">پرفروش‌ترین محصولات</h2>
            <Link to="/products" className="view-all">
              مشاهده همه <i className="fas fa-arrow-left"></i>
            </Link>
          </div>
          <div className="products-grid">
            {bestSellers.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ایمیل‌نیوزلتر */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>عضو خبرنامه شوید</h2>
            <p>از جدیدترین تخفیف‌ها و محصولات با خبر شوید</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="ایمیل خود را وارد کنید" 
                className="newsletter-input"
                required
              />
              <button type="submit" className="btn btn-primary">
                عضویت
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
