import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import useXano from '../hooks/useXano';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import UserWelcome from '../components/UserWelcome';
// (removido) componentes de prueba de Xano para producción
import '../styles/pages/Home.css';

const Home = () => {
  const { products, loading, setLoading, setProducts, productsLoaded } = useApp();
  const xano = useXano();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoadingFeatured(true);
        
        // Cargar productos desde Xano
        const productsData = await xano.getProducts();
        
        if (productsData && productsData.length > 0) {
          // Mostrar solo activos y limitar a 6
          const featured = productsData.filter(p => p.active).slice(0, 6);
          setFeaturedProducts(featured);
          
          // Sincronizar todos los productos con el contexto
          setProducts(productsData);
        } else {
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error('Error loading featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoadingFeatured(false);
      }
    };

    // Solo cargar si no hay productos cargados
    if (!productsLoaded) {
      loadFeaturedProducts();
    } else {
      // Usar productos ya cargados: solo activos y máximo 6
      const featured = products.filter(p => p.active).slice(0, 6);
      setFeaturedProducts(featured);
    }
  }, []); // Dependencias vacías para evitar bucles infinitos

  const categories = [
    { name: 'Mouse', icon: 'bi-mouse', link: '/productos?categoria=mouse', color: '#9C2007' },
    { name: 'Teclado', icon: 'bi-keyboard', link: '/productos?categoria=teclado', color: '#701705' },
    { name: 'Micrófono', icon: 'bi-mic', link: '/productos?categoria=microfono', color: '#440E03' },
    { name: 'Monitor', icon: 'bi-display', link: '/productos?categoria=monitor', color: '#180501' },
    { name: 'Audífono', icon: 'bi-headphones', link: '/productos?categoria=audifono', color: '#9C2007' },
    { name: 'Parlante', icon: 'bi-speaker', link: '/productos?categoria=parlante', color: '#701705' },
    { name: 'Televisor', icon: 'bi-tv', link: '/productos?categoria=televisor', color: '#440E03' },
    { name: 'Teléfono', icon: 'bi-phone', link: '/productos?categoria=telefono', color: '#180501' },
    { name: 'Smartwatch', icon: 'bi-smartwatch', link: '/productos?categoria=smartwatch', color: '#9C2007' }
  ];

  return (
    <div className="home-page">
      {/* User Welcome Message */}
      <UserWelcome />
      
      {/* Hero Section */}
      <section className="hero-section">
        {/* Transition gradient */}
        <div className="transition-gradient"></div>
        
        {/* Separation line */}
        <div className="separation-line"></div>
        
        {/* Floating elements */}
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        
        {/* Particle effects */}
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        
        {/* Wave effect */}
        <div className="wave"></div>
        
        
        {/* Sparkle effects */}
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        
        {/* Electric sparks */}
        <div className="electric-spark"></div>
        <div className="electric-spark"></div>
        <div className="electric-spark"></div>
        <div className="electric-spark"></div>
        
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="hero-title">
                  Bienvenido a <span className="brand-highlight">ElectroVerse</span>
                </h1>
                <p className="hero-subtitle">
                  Descubre la mejor selección de productos electrónicos para gamers, 
                  profesionales y entusiastas de la tecnología.
                </p>
                <div className="hero-buttons">
                  <Button as={Link} to="/productos" variant="primary" size="lg" className="me-3">
                    Ver Productos
                  </Button>
                  <Button as={Link} to="/nosotros" variant="outline-light" size="lg">
                    Conoce Más
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <div className="hero-placeholder">
                  <img 
                    src="/ImagenHome.png" 
                    alt="Productos Electrónicos ElectroVerse" 
                    className="hero-product-image"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-5">
        <Container>
          <h2 className="section-title text-center mb-5">Nuestras Categorías</h2>
          <Row>
            {categories.map((category, index) => (
              <Col lg={2} md={4} sm={6} key={index} className="mb-4">
                <Card as={Link} to={category.link} className="category-card h-100">
                  <Card.Body className="text-center">
                    <i className={`${category.icon} category-icon`}></i>
                    <h6 className="category-name">{category.name}</h6>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="section-title mb-0">Productos Destacados</h2>
            <Button as={Link} to="/productos" variant="outline-primary">
              Ver Todos
            </Button>
          </div>
          
          {loadingFeatured ? (
            <div className="text-center py-5">
              <LoadingSpinner text="Cargando productos destacados..." />
            </div>
          ) : featuredProducts.length > 0 ? (
            <Row>
              {featuredProducts.map(product => (
                <Col lg={4} md={6} key={product.id} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
              <h5 className="mt-3">No hay productos disponibles</h5>
              <p className="text-muted">
                No se pudieron cargar los productos desde la base de datos.
              </p>
              <Button 
                variant="outline-primary" 
                onClick={() => window.location.reload()}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Reintentar
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row>
            <Col lg={4} className="mb-4">
              <div className="feature-card text-center">
                <i className="bi bi-truck feature-icon"></i>
                <h5>Envío Gratis</h5>
                <p>En compras superiores a $100</p>
              </div>
            </Col>
            <Col lg={4} className="mb-4">
              <div className="feature-card text-center">
                <i className="bi bi-shield-check feature-icon"></i>
                <h5>Garantía</h5>
                <p>1 año de garantía en todos los productos</p>
              </div>
            </Col>
            <Col lg={4} className="mb-4">
              <div className="feature-card text-center">
                <i className="bi bi-headset feature-icon"></i>
                <h5>Soporte 24/7</h5>
                <p>Atención al cliente siempre disponible</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* componentes de prueba removidos del Home */}
    </div>
  );
};

export default Home;
