import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // در اینجا API واقعی را صدا بزنید
        // const response = await axios.get('/api/products');
        // setProducts(response.data);
        // setFilteredProducts(response.data);
        
        // داده‌های نمونه
        const sampleProducts = [
          { _id: '1', name: 'هدفون سونی WH-1000XM5', price: 12500000, images: ['/images/products/headphone.jpg'], category: { name: 'لوازم دیجیتال' }, rating: 4.8, numReviews: 124, stock: 15, discount: 10 },
          { _id: '2', name: 'ساعت اپل واچ سری ۹', price: 18500000, images: ['/images/products/watch.jpg'], category: { name: 'لوازم دیجیتال' }, rating: 4.9, numReviews: 89, stock: 8, discount: 5 },
          { _id: '3', name: 'کیف چرمی مردانه', price: 3450000, images: ['/images/products/bag.jpg'], category: { name: 'مد و پوشاک' }, rating: 4.6, numReviews: 45, stock: 20, discount: 0 },
          { _id: '4', name: 'عطر دیور ساواج', price: 4200000, images: ['/images/products/perfume.jpg'], category: { name: 'زیبایی و بهداشت' }, rating: 4.7, numReviews: 67, stock: 12, discount: 15 },
          { _id: '5', name: 'کفش نایک ایر مکس', price: 5600000, images: ['/images/products/shoes.jpg'], category: { name: 'مد و پوشاک' }, rating: 4.5, numReviews: 78, stock: 25, discount: 20 },
          { _id: '6', name: 'لپ‌تاپ ایسوس زنبوک ۱۴', price: 28700000, images: ['/images/products/laptop.jpg'], category: { name: 'لوازم دیجیتال' }, rating: 4.9, numReviews: 56, stock: 5, discount: 8 },
          { _id: '7', name: 'ساعت مچی کاسیو', price: 850000, images: ['/images/products/casio.jpg'], category: { name: 'لوازم دیجیتال' }, rating: 4.3, numReviews: 34, stock: 40, discount: 0 },
          { _id: '8', name: 'کوله پشتی مسافرتی', price: 2800000, images: ['/images/products/backpack.jpg'], category: { name: 'مد و پوشاک' }, rating: 4.4, numReviews: 23, stock: 18, discount: 5 }
        ];
        
        setProducts(sampleProducts);
        setFilteredProducts(sampleProducts);
        
        // استخراج دسته‌بندی‌ها
        const uniqueCategories = [...new Set(sampleProducts.map(p => p.category.name))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError('مشکلی در بارگذاری محصولات پیش آمد');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const applyFilters = () => {
    let result = [...products];

    // جستجو
    const searchQuery = searchParams.get('search') || '';
    if (searchQuery) {
      result = result.filter(p => 
        p.name.includes(searchQuery) || 
        p.category.name.includes(searchQuery)
      );
    }

    // دسته‌بندی
    if (filters.category) {
      result = result.filter(p => p.category.name === filters.category);
    }

    // محدوده قیمت
    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseInt(filters.maxPrice));
    }

    // مرتب‌سازی
    switch (filters.sort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        result.sort((a, b) => parseInt(b._id) - parseInt(a._id));
    }

    setFilteredProducts(result);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>در حال بارگذاری محصولات...</p>
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
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>محصولات</h1>
          <p>{filteredProducts.length} محصول یافت شد</p>
        </div>

        <div className="products-layout">
          {/* سایدبار فیلترها */}
          <aside className="filters-sidebar">
            <div className="filters-card">
              <h3>فیلترها</h3>
              
              <div className="filter-group">
                <label>دسته‌بندی</label>
                <select 
                  name="category" 
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">همه دسته‌ها</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>محدوده قیمت (تومان)</label>
                <div className="price-range">
                  <input 
                    type="number" 
                    name="minPrice"
                    placeholder="از"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                  <span>تا</span>
                  <input 
                    type="number" 
                    name="maxPrice"
                    placeholder="تا"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>مرتب‌سازی</label>
                <select 
                  name="sort" 
                  value={filters.sort}
                  onChange={handleFilterChange}
                >
                  <option value="newest">جدیدترین</option>
                  <option value="price-low">ارزان‌ترین</option>
                  <option value="price-high">گران‌ترین</option>
                  <option value="rating">محبوب‌ترین</option>
                </select>
              </div>

              <button className="clear-filters" onClick={clearFilters}>
                پاک کردن فیلترها
              </button>
            </div>
          </aside>

          {/* لیست محصولات */}
          <main className="products-content">
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <i className="fas fa-box-open"></i>
                <h3>محصولی یافت نشد</h3>
                <p>با فیلترهای دیگر امتحان کنید</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
