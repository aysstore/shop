import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // در اینجا API سفارشات را صدا بزنید
        // const response = await axios.get('/api/orders/user');
        // setOrders(response.data);
        
        // داده‌های نمونه
        setOrders([
          {
            _id: 'ORD-001',
            date: '۱۴۰۲/۱۲/۱۵',
            total: 12500000,
            status: 'تحویل داده شده',
            items: 3
          },
          {
            _id: 'ORD-002',
            date: '۱۴۰۲/۱۲/۱۰',
            total: 5600000,
            status: 'در حال ارسال',
            items: 2
          },
          {
            _id: 'ORD-003',
            date: '۱۴۰۲/۱۲/۰۵',
            total: 4200000,
            status: 'پرداخت شده',
            items: 1
          }
        ]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      'در انتظار پرداخت': 'warning',
      'پرداخت شده': 'info',
      'در حال ارسال': 'primary',
      'تحویل داده شده': 'success',
      'لغو شده': 'danger'
    };
    return `badge ${statusMap[status] || 'secondary'}`;
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="page-header">
          <h1>پنل کاربری</h1>
          <span className="welcome-msg">خوش آمدید، {user?.name}</span>
        </div>

        <div className="dashboard-layout">
          {/* سایدبار */}
          <aside className="dashboard-sidebar">
            <div className="user-card">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <h3 className="user-name">{user?.name}</h3>
              <p className="user-email">{user?.email}</p>
            </div>

            <nav className="dashboard-nav">
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="fas fa-user-circle"></i>
                پروفایل
              </button>
              <button 
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="fas fa-shopping-bag"></i>
                سفارشات
              </button>
              <button 
                className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                <i className="fas fa-heart"></i>
                علاقه‌مندی‌ها
              </button>
              <button 
                className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <i className="fas fa-map-marker-alt"></i>
                آدرس‌ها
              </button>
              <Link to="/" className="nav-item">
                <i className="fas fa-store"></i>
                بازگشت به فروشگاه
              </Link>
            </nav>
          </aside>

          {/* محتوای اصلی */}
          <main className="dashboard-content">
            {activeTab === 'profile' && (
              <div className="tab-panel">
                <h2>اطلاعات پروفایل</h2>
                <div className="profile-card">
                  <div className="profile-row">
                    <span className="label">نام و نام خانوادگی</span>
                    <span className="value">{user?.name}</span>
                  </div>
                  <div className="profile-row">
                    <span className="label">ایمیل</span>
                    <span className="value">{user?.email}</span>
                  </div>
                  <div className="profile-row">
                    <span className="label">تاریخ عضویت</span>
                    <span className="value">۱۴۰۲/۰۹/۰۱</span>
                  </div>
                  <button className="btn btn-secondary">
                    ویرایش اطلاعات
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="tab-panel">
                <h2>سفارشات من</h2>
                {loading ? (
                  <p>در حال بارگذاری...</p>
                ) : orders.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-shopping-bag"></i>
                    <p>هنوز سفارشی ثبت نکرده‌اید</p>
                    <Link to="/products" className="btn btn-primary">
                      شروع خرید
                    </Link>
                  </div>
                ) : (
                  <div className="orders-table">
                    <table>
                      <thead>
                        <tr>
                          <th>شماره سفارش</th>
                          <th>تاریخ</th>
                          <th>تعداد کالا</th>
                          <th>مبلغ</th>
                          <th>وضعیت</th>
                          <th>جزئیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.date}</td>
                            <td>{order.items}</td>
                            <td>{order.total.toLocaleString()} تومان</td>
                            <td>
                              <span className={getStatusBadge(order.status)}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <Link to={`/orders/${order._id}`} className="btn btn-sm">
                                مشاهده
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="tab-panel">
                <h2>علاقه‌مندی‌ها</h2>
                <div className="empty-state">
                  <i className="fas fa-heart"></i>
                  <p>هیچ محصولی در علاقه‌مندی‌ها نیست</p>
                  <Link to="/products" className="btn btn-primary">
                    مشاهده محصولات
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="tab-panel">
                <h2>آدرس‌های من</h2>
                <div className="empty-state">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>هیچ آدرسی ثبت نشده است</p>
                  <button className="btn btn-primary">
                    افزودن آدرس جدید
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
