import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // در اینجا API واقعی را صدا بزنید
        // const response = await axios.get(`/api/products/${id}`);
        // setProduct(response.data);
        
        // داده‌های نمونه
        const sampleProduct = {
          _id: id,
          name: 'هدفون بی‌سیم سونی WH-1000XM5',
          price: 12500000,
          images: [
            '/images/products/headphone-1.jpg',
            '/images/products/headphone-2.jpg',
            '/images/products/headphone-3.jpg'
          ],
          category: { name: 'لوازم دیجیتال' },
          rating: 4.8,
          numReviews: 124,
          stock: 15,
          discount: 10,
          description: 'هدفون بی‌سیم سونی WH-1000XM5 با کیفیت صدای فوق‌العاده و قابلیت حذف نویز پیشرفته، تجربه‌ای بی‌نظیر از گوش دادن به موسیقی را برای شما فراهم می‌کند. این هدفون با طراحی ارگونومیک و وزن کم، برای استفاده طولانی مدت بسیار مناسب است.',
          specifications: {
            'نوع اتصال': 'بی‌سیم (بلوتوث 5.2)',
            'عمر باتری': 'تا 30 ساعت',
            'قابلیت حذف نویز': 'بله (پیشرفته)',
            'وزن': '250 گرم',
            'رنگ': 'مشکی'
          }
        };
        
        setProduct(sampleProduct);
        
        // محصولات مرتبط
        const related = [
          { _id: '2', name: 'ساعت اپل واچ سری ۹', price: 18500000, images: ['/images/products/watch.jpg'], category: { name: 'لوازم دیجیتال' }, rating: 4.9, numReviews: 89, stock: 8, discount: 5 },
          { _id: '3', name: 'لپ‌تاپ ایسوس زنبوک ۱۴', price: 28700000, images: ['/images/products/laptop.jpg'], category: { name: 'لوازم دیجیتال' }, rating: 4.9, numReviews: 56, stock: 5, discount: 8 }
        ];
        setRelatedProducts(related);
      } catch (err) {
        setError('مشکلی در بارگذاری محصول پیش آمد');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  const discountedPrice = product?.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error || 'محصول یافت نشد'}</p>
        <Link to="/products">بازگشت به محصولات</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* مسیر راهنما */}
        <div className="breadcrumb">
          <Link to="/">خانه</Link>
          <i className="fas fa-chevron-left"></i>
          <Link to="/products">محصولات</Link>
          <i className="fas fa-chevron-left"></i>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-main">
          {/* گالری تصاویر */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
            </div>
            <div className="thumbnails">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`تصویر ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* اطلاعات محصول */}
          <div className="product-info-detail">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < Math.round(product.rating) ? 'filled' : ''}`}></i>
                  ))}
                </div>
                <span>({product.numReviews} نظر)</span>
              </div>
              <span className="product-category">{product.category.name}</span>
            </div>

            <div className="product-price-detail">
              {product.discount > 0 ? (
                <>
                  <span className="original-price">
                    {product.price.toLocaleString()} تومان
                  </span>
                  <span className="discounted-price">
                    {discountedPrice.toLocaleString()} تومان
                  </span>
                  <span className="discount-badge">{product.discount}% تخفیف</span>
                </>
              ) : (
                <span className="price">{product.price.toLocaleString()} تومان</span>
              )}
            </div>

            <div className="product-stock">
              <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? '✓ موجود در انبار' : '✗ ناموجود'}
              </span>
              {product.stock > 0 && (
                <span className="stock-count">{product.stock} عدد موجود</span>
              )}
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label>تعداد:</label>
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
                    disabled={quantity >= product.stock}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              <button 
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <i className="fas fa-shopping-cart"></i>
                {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد خرید'}
              </button>
            </div>

            <div className="product-extra-links">
              <button className="wishlist-btn-detail">
                <i className="far fa-heart"></i>
                افزودن به علاقه‌مندی‌ها
              </button>
              <button className="share-btn">
                <i className="fas fa-share-alt"></i>
                اشتراک‌گذاری
              </button>
            </div>
          </div>
        </div>

        {/* توضیحات و نظرات */}
        <div className="product-tabs">
          <div className="tab-headers">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              توضیحات
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              مشخصات فنی
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              نظرات ({product.numReviews})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <p>{product.description}</p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="tab-panel">
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td className="spec-key">{key}</td>
                        <td className="spec-value">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <div className="reviews-summary">
                  <div className="average-rating">
                    <span className="rating-number">{product.rating}</span>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star ${i < Math.round(product.rating) ? 'filled' : ''}`}></i>
                      ))}
                    </div>
                    <span className="reviews-count">از {product.numReviews} نظر</span>
                  </div>
                </div>
                <p className="no-reviews">هنوز نظری برای این محصول ثبت نشده است.</p>
              </div>
            )}
          </div>
        </div>

        {/* محصولات مرتبط */}
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2 className="section-title">محصولات مرتبط</h2>
            <div className="products-grid">
              {relatedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
