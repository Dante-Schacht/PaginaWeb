import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/pages/Nosotros.css';

const Nosotros = () => {
  const teamMembers = [
    {
      name: 'Dante Schacht',
      position: 'CEO & Fundador',
      emoji: '🧑‍💼',
      gender: 'male',
      description: 'Lidera la visión y estrategia de ElectroVerse para ofrecer tecnología accesible y confiable.'
    },
    {
      name: 'Sofía Pérez',
      position: 'COO',
      emoji: '👩‍💼',
      gender: 'female',
      description: 'Optimiza operaciones y servicio al cliente para una experiencia impecable.'
    },
    {
      name: 'Mateo Rojas',
      position: 'CTO',
      emoji: '👨‍💻',
      gender: 'male',
      description: 'Encabeza la tecnología, pruebas de hardware y selección de productos.'
    },
    {
      name: 'Valentina Núñez',
      position: 'Marketing',
      emoji: '👩‍🎨',
      gender: 'female',
      description: 'Comunica la marca con campañas creativas y contenido útil para la comunidad.'
    }
  ];

  const values = [
    {
      icon: 'bi-shield-check',
      title: 'Calidad Garantizada',
      description: 'Todos nuestros productos pasan por rigurosos controles de calidad.'
    },
    {
      icon: 'bi-people',
      title: 'Atención Personalizada',
      description: 'Nuestro equipo está siempre dispuesto a ayudarte con tus necesidades.'
    },
    {
      icon: 'bi-lightning',
      title: 'Innovación Constante',
      description: 'Siempre a la vanguardia de las últimas tecnologías del mercado.'
    },
    {
      icon: 'bi-heart',
      title: 'Pasión por la Tecnología',
      description: 'Amamos lo que hacemos y eso se refleja en nuestro servicio.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Clientes Satisfechos' },
    { number: '500+', label: 'Productos Disponibles' },
    { number: '5+', label: 'Años de Experiencia' },
    { number: '24/7', label: 'Soporte Técnico' }
  ];

  return (
    <div className="nosotros-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="hero-title">
                  Conoce a <span className="brand-highlight">ElectroVerse</span>
                </h1>
                <p className="hero-subtitle">
                  Tecnología, gaming e innovación.
                  Productos confiables y asesoría honesta para armar tu setup sin complicaciones.
                  Probamos, comparamos y recomendamos lo mejor para tu presupuesto.
                  Guías claras y soporte postventa cuando más lo necesitas.
                </p>
                <div className="hero-buttons">
                  <Button as={Link} to="/productos" variant="primary" size="lg" className="me-3">
                    Ver Productos
                  </Button>
                  <Button as={Link} to="/contacto" variant="outline-light" size="lg">
                    Contáctanos
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <div className="hero-placeholder">
                  <i className="bi bi-people display-3"></i>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <Container>
          <Row>
            {stats.map((stat, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <div className="stat-card text-center">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section className="about-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="about-content">
                <h2 className="section-title">Nuestra Historia</h2>
                <p className="about-text">
                  ElectroVerse nació en 2019 con una visión clara: democratizar el acceso 
                  a la mejor tecnología del mercado. Lo que comenzó como un pequeño proyecto 
                  de dos amigos apasionados por el gaming, se ha convertido en una de las 
                  tiendas de electrónicos más confiables de la región.
                </p>
                <p className="about-text">
                  Nuestro compromiso siempre ha sido ofrecer productos de la más alta calidad 
                  a precios justos, acompañados de un servicio al cliente excepcional. 
                  Creemos que la tecnología debe ser accesible para todos.
                </p>
                <div className="about-features">
                  <div className="feature-item">
                    <i className="bi bi-check-circle"></i>
                    <span>Productos 100% originales</span>
                  </div>
                  <div className="feature-item">
                    <i className="bi bi-check-circle"></i>
                    <span>Garantía extendida</span>
                  </div>
                  <div className="feature-item">
                    <i className="bi bi-check-circle"></i>
                    <span>Envio gratis en compras mayores a $100</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-image">
                <div className="about-placeholder">
                  <i className="bi bi-building display-1"></i>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section className="values-section py-5">
        <Container>
          <Row>
            <Col lg={12}>
              <h2 className="section-title text-center mb-5">Nuestros Valores</h2>
            </Col>
          </Row>
          <Row>
            {values.map((value, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card className="value-card h-100">
                  <Card.Body className="text-center">
                    <i className={`${value.icon} value-icon`}></i>
                    <h5 className="value-title">{value.title}</h5>
                    <p className="value-description">{value.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="team-section py-5">
        <Container>
          <Row>
            <Col lg={12}>
              <h2 className="section-title text-center mb-5">Nuestro Equipo</h2>
            </Col>
          </Row>
          <Row>
            {teamMembers.map((member, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card className="team-card h-100">
                  <div className="team-image-container">
                    <div className="team-emoji">{member.emoji}</div>
                  </div>
                  <Card.Body className="text-center">
                    <h5 className="team-name">{member.name}</h5>
                    <p className="team-position">{member.position}</p>
                    <p className="team-description">{member.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

    </div>
  );
};

export default Nosotros;
