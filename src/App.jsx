import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Blogs from './pages/Blogs';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import './styles/global/App.css';

function App() {
  return (
    <AppProvider>
      <ScrollToTop />
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </AppProvider>
  );
}

export default App;
