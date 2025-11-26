import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import FloatingButtons from './components/FloatingButtons';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductDetail from './pages/ProductDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import CheckoutPayment from './pages/CheckoutPayment';
import Privacidad from './pages/Privacidad';
import Terminos from './pages/Terminos';
import './styles/global/App.css';

function App() {
  const location = useLocation();
  useEffect(() => {
    console.log('[Router] Cambio de ruta:', location.pathname);
  }, [location.pathname]);
  return (
    <AppProvider>
      <ScrollToTop />
      <div className="App d-flex flex-column min-vh-100">
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <main className="flex-grow-1">
          <ErrorBoundary>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/payment" element={<CheckoutPayment />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/privacidad" element={<Privacidad />} />
              <Route path="/terminos-condiciones" element={<Terminos />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
        <FloatingButtons />
      </div>
    </AppProvider>
  );
}

export default App;
