import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import '../styles/pages/Contacto.css';

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    setTimeout(() => {
      setShowAlert(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Ocultar alerta después de 5 segundos
      setTimeout(() => setShowAlert(false), 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: 'bi-geo-alt',
      title: 'Dirección',
      content: 'Av. Principal 123, Ciudad, País',
      description: 'Visítanos en nuestra tienda física'
    },
    {
      icon: 'bi-telephone',
      title: 'Teléfono',
      content: '+1 (555) 123-4567',
      description: 'Lun - Vie: 9:00 - 18:00'
    },
    {
      icon: 'bi-envelope',
      title: 'Email',
      content: 'info@electroverse.com',
      description: 'Respuesta en 24 horas'
    },
    {
      icon: 'bi-clock',
      title: 'Horarios',
      content: 'Lun - Vie: 9:00 - 18:00',
      description: 'Sáb: 10:00 - 16:00'
    }
  ];

  const faqs = [
    {
      question: '¿Cuáles son los métodos de pago disponibles?',
      answer: 'Aceptamos tarjetas de crédito, débito, PayPal y transferencias bancarias.'
    },
    {
      question: '¿Ofrecen envío internacional?',
      answer: 'Sí, realizamos envíos a toda Latinoamérica con costos variables según el destino.'
    },
    {
      question: '¿Cuánto tiempo tarda el envío?',
      answer: 'Los envíos nacionales tardan 2-3 días hábiles, internacionales 5-10 días hábiles.'
    },
    {
      question: '¿Qué garantía tienen los productos?',
      answer: 'Todos nuestros productos tienen garantía de 1 año contra defectos de fabricación.'
    }
  ];

  return (
    <div className="contacto-page">
      <Container className="py-5">
        <Row>
          <Col lg={12}>
            <div className="page-header mb-5">
              <h1 className="page-title">Contáctanos</h1>
              <p className="page-subtitle">
                ¿Tienes alguna pregunta? Estamos aquí para ayudarte
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Contact Form */}
          <Col lg={8} className="mb-5">
            <Card className="contact-form-card">
              <Card.Body>
                <h3 className="form-title">Envíanos un Mensaje</h3>
                <p className="form-subtitle">
                  Completa el formulario y nos pondremos en contacto contigo pronto
                </p>

                {showAlert && (
                  <Alert variant="success" className="mb-4">
                    <i className="bi bi-check-circle me-2"></i>
                    ¡Mensaje enviado correctamente! Te contactaremos pronto.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre Completo *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Tu nombre completo"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="tu@email.com"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Asunto *</Form.Label>
                        <Form.Select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecciona un asunto</option>
                          <option value="consulta">Consulta General</option>
                          <option value="soporte">Soporte Técnico</option>
                          <option value="ventas">Información de Ventas</option>
                          <option value="garantia">Garantía</option>
                          <option value="devolucion">Devolución</option>
                          <option value="otro">Otro</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Mensaje *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Info */}
          <Col lg={4}>
            <div className="contact-info-section">
              <h3 className="info-title">Información de Contacto</h3>
              <p className="info-subtitle">
                Múltiples formas de contactarnos
              </p>

              {contactInfo.map((info, index) => (
                <Card key={index} className="info-card mb-3">
                  <Card.Body>
                    <div className="info-content">
                      <i className={`${info.icon} info-icon`}></i>
                      <div className="info-details">
                        <h6 className="info-title-text">{info.title}</h6>
                        <p className="info-content-text">{info.content}</p>
                        <small className="info-description">{info.description}</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}

              {/* Social Media */}
              <Card className="social-card">
                <Card.Body>
                  <h6 className="social-title">Síguenos</h6>
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
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* FAQ Section */}
        <Row className="mt-5">
          <Col lg={12}>
            <h3 className="faq-title text-center mb-5">Preguntas Frecuentes</h3>
          </Col>
        </Row>
        
        <Row>
          {faqs.map((faq, index) => (
            <Col lg={6} key={index} className="mb-4">
              <Card className="faq-card">
                <Card.Body>
                  <h6 className="faq-question">{faq.question}</h6>
                  <p className="faq-answer">{faq.answer}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Contacto;
