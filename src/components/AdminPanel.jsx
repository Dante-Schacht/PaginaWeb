import React, { useState } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Button, Alert, Badge } from 'react-bootstrap';
import { useApp } from '../context/AppContext';
import ProductManager from './admin/ProductManager';
import OrderManager from './admin/OrderManager';
import Dashboard from './admin/Dashboard';
import '../styles/components/AdminPanel.css';

const AdminPanel = () => {
  const { user, isAdmin } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Verificar si el usuario es administrador
  if (!user || !isAdmin()) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>
            <i className="bi bi-shield-exclamation me-2"></i>
            Acceso Denegado
          </Alert.Heading>
          <p>
            No tienes permisos para acceder al panel de administración.
            Solo los administradores pueden acceder a esta sección.
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="admin-panel">
      <Container fluid className="py-4">
        <Row>
          <Col lg={12}>
            <Card className="admin-header mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="mb-1">
                      <i className="bi bi-gear-fill me-2"></i>
                      Panel de Administración
                    </h2>
                    <p className="text-muted mb-0">
                      Bienvenido, {user.name} - Gestiona tu tienda desde aquí
                    </p>
                  </div>
                  <div className="admin-stats">
                    <Badge bg="primary" className="me-2">
                      <i className="bi bi-person-check me-1"></i>
                      Admin
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={3}>
            <Card className="admin-sidebar">
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column admin-nav">
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'dashboard'}
                      onClick={() => setActiveTab('dashboard')}
                      className="admin-nav-link"
                    >
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'products'}
                      onClick={() => setActiveTab('products')}
                      className="admin-nav-link"
                    >
                      <i className="bi bi-box-seam me-2"></i>
                      Productos
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'orders'}
                      onClick={() => setActiveTab('orders')}
                      className="admin-nav-link"
                    >
                      <i className="bi bi-bag-check me-2"></i>
                      Órdenes
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            <Card className="admin-content">
              <Card.Body>
                <Tab.Content>
                  {activeTab === 'dashboard' && <Dashboard />}
                  {activeTab === 'products' && <ProductManager />}
                  {activeTab === 'orders' && <OrderManager />}
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminPanel;
