import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // پاک کردن خطای فیلد هنگام تایپ
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }
    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || 'خطا در ورود. لطفاً دوباره تلاش کنید.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>ورود به حساب کاربری</h2>
              <p>به فروشگاه آیس خوش آمدید</p>
            </div>

            {errors.general && (
              <div className="alert alert-danger">
                <i className="fas fa-exclamation-circle"></i>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">ایمیل</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">رمز عبور</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="حداقل ۶ کاراکتر"
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" name="remember" />
                  <span>مرا به خاطر بسپار</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  رمز عبور را فراموش کرده‌اید؟
                </Link>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary auth-btn"
                disabled={loading}
              >
                {loading ? 'در حال ورود...' : 'ورود'}
              </button>

              <div className="auth-divider">
                <span>یا</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-btn google">
                  <i className="fab fa-google"></i>
                  ورود با گوگل
                </button>
                <button type="button" className="social-btn github">
                  <i className="fab fa-github"></i>
                  ورود با گیت‌هاب
                </button>
              </div>
            </form>

            <div className="auth-footer">
              <p>
                حساب کاربری ندارید؟{' '}
                <Link to="/register" className="auth-link">
                  ثبت‌نام کنید
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
