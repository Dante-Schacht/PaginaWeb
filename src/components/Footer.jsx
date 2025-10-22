import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="custom-footer">
      <Container>
        <Row className="py-5">
          <Col lg={4} md={6} className="mb-4">
            <h5 className="footer-title">ElectroVerse</h5>
            <p className="footer-description">
              Tu tienda de confianza para productos electrónicos de alta calidad. 
              Desde mouses gaming hasta smartwatches, tenemos todo lo que necesitas 
              para tu setup perfecto.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-link">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <h6 className="footer-subtitle">Enlaces Rápidos</h6>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4">
            <h6 className="footer-subtitle">Categorías</h6>
            <ul className="footer-links">
              <li><Link to="/productos?categoria=mouses">Mouses</Link></li>
              <li><Link to="/productos?categoria=teclados">Teclados</Link></li>
              <li><Link to="/productos?categoria=microfonos">Micrófonos</Link></li>
              <li><Link to="/productos?categoria=monitores">Monitores</Link></li>
              <li><Link to="/productos?categoria=audifonos">Audífonos</Link></li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4">
            <h6 className="footer-subtitle">Contacto</h6>
            <div className="contact-info">
              <div className="contact-item">
                <i className="bi bi-geo-alt"></i>
                <span>Calle Tecnológica 456, Distrito Digital</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-telephone"></i>
                <span>+52 (55) 1234-5678</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-envelope"></i>
                <span>info@electroverse.com</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-clock"></i>
                <span>Lun - Vie: 9:00 - 18:00</span>
              </div>
            </div>
          </Col>
        </Row>
        
        <hr className="footer-divider" />
        
        <Row className="py-3">
          <Col md={6}>
            <p className="footer-copyright">
              © 2024 ElectroVerse. Todos los derechos reservados.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="footer-legal">
              <Link to="/politica-privacidad" className="legal-link">
                Política de Privacidad
              </Link>
              <Link to="/terminos-condiciones" className="legal-link">
                Términos y Condiciones
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
