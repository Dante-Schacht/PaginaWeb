import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/Home.css';

const Home = () => {
  const { products, loading, setLoading } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Simular carga de productos destacados
    setLoading(true);
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: 'Logitech G Pro X Superlight',
          price: 149990,
          originalPrice: 179990,
          image: '/ImagenHome.png',
          category: 'Mouses',
          description: 'Mouse gaming ultra ligero de 63g con sensor HERO 25K y 70 horas de batería',
          rating: 4.9,
          reviews: 2847,
          discount: 17,
          isNew: false,
          brand: 'Logitech'
        },
        {
          id: 2,
          name: 'Razer Huntsman Mini',
          price: 99990,
          originalPrice: 119990,
          image: '/ImagenHome.png',
          category: 'Teclados',
          description: 'Teclado mecánico compacto 60% con switches Razer Clicky y retroiluminación RGB',
          rating: 4.7,
          reviews: 1923,
          discount: 17,
          isNew: false,
          brand: 'Razer'
        },
        {
          id: 3,
          name: 'Sony WH-1000XM5',
          price: 399990,
          originalPrice: 449990,
          image: '/ImagenHome.png',
          category: 'Audífonos',
          description: 'Audífonos inalámbricos con cancelación de ruido líder en la industria',
          rating: 4.8,
          reviews: 3456,
          discount: 11,
          isNew: true,
          brand: 'Sony'
        }
      ];
      setFeaturedProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, [setLoading]);

  const categories = [
    { name: 'Mouses', icon: 'bi-mouse', link: '/productos?categoria=mouses', color: '#9C2007' },
    { name: 'Teclados', icon: 'bi-keyboard', link: '/productos?categoria=teclados', color: '#701705' },
    { name: 'Micrófonos', icon: 'bi-mic', link: '/productos?categoria=microfonos', color: '#440E03' },
    { name: 'Monitores', icon: 'bi-display', link: '/productos?categoria=monitores', color: '#180501' },
    { name: 'Audífonos', icon: 'bi-headphones', link: '/productos?categoria=audifonos', color: '#9C2007' },
    { name: 'Smartwatches', icon: 'bi-smartwatch', link: '/productos?categoria=smartwatches', color: '#701705' }
  ];

  return (
    <div className="home-page">
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
          
          {loading ? (
            <LoadingSpinner text="Cargando productos destacados..." />
          ) : (
            <Row>
              {featuredProducts.map(product => (
                <Col lg={4} md={6} key={product.id} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
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
    </div>
  );
};

export default Home;
