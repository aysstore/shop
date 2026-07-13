import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

// ایجاد ریشه React
const root = ReactDOM.createRoot(document.getElementById('root'));

// رندر کردن برنامه با Providerها
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <App />
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
