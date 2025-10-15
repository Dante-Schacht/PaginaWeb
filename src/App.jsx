import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Blogs from './pages/Blogs';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import './styles/global/App.css';

function App() {
  return (
    <AppProvider>
      <ScrollToTop />
      <div className="App d-flex flex-column min-vh-100">
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <main className="flex-grow-1">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
        <BackToTop />
      </div>
    </AppProvider>
  );
}

export default App;
