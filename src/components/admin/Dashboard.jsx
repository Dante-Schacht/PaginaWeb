import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import useXano from '../../hooks/useXano';

const Dashboard = () => {
  const { user, products, cart } = useApp();
  const xano = useXano();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Cargar estadísticas desde Xano
      const [productsData, usersData, ordersData] = await Promise.all([
        xano.getProducts({ limit: 1000 }),
        xano.getUsers ? xano.getUsers() : Promise.resolve({ count: 0 }),
        xano.getOrders ? xano.getOrders() : Promise.resolve({ count: 0 })
      ]);

      setStats({
        totalProducts: productsData?.length || 0,
        totalUsers: usersData?.count || 0,
        totalOrders: ordersData?.count || 0,
        totalRevenue: ordersData?.totalRevenue || 0
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Usar datos locales como fallback
      setStats({
        totalProducts: products.length,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </h4>
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={loadDashboardData}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Actualizar
        </Button>
      </div>

      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-primary">
                  <i className="bi bi-box-seam"></i>
                </div>
                <div className="ms-3">
                  <h5 className="mb-0">{stats.totalProducts}</h5>
                  <p className="text-muted mb-0">Productos</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-success">
                  <i className="bi bi-people"></i>
                </div>
                <div className="ms-3">
                  <h5 className="mb-0">{stats.totalUsers}</h5>
                  <p className="text-muted mb-0">Usuarios</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-warning">
                  <i className="bi bi-bag-check"></i>
                </div>
                <div className="ms-3">
                  <h5 className="mb-0">{stats.totalOrders}</h5>
                  <p className="text-muted mb-0">Órdenes</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-info">
                  <i className="bi bi-currency-dollar"></i>
                </div>
                <div className="ms-3">
                  <h5 className="mb-0">{formatCurrency(stats.totalRevenue)}</h5>
                  <p className="text-muted mb-0">Ingresos</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Actividad Reciente
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="recent-activity">
                <div className="activity-item">
                  <div className="activity-icon bg-primary">
                    <i className="bi bi-plus"></i>
                  </div>
                  <div className="activity-content">
                    <p className="mb-1">Sistema iniciado correctamente</p>
                    <small className="text-muted">Hace unos momentos</small>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon bg-success">
                    <i className="bi bi-person-check"></i>
                  </div>
                  <div className="activity-content">
                    <p className="mb-1">Administrador {user.name} conectado</p>
                    <small className="text-muted">Hace unos momentos</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Información del Sistema
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="system-info">
                <div className="info-item">
                  <strong>Versión:</strong> 1.0.0
                </div>
                <div className="info-item">
                  <strong>Estado:</strong> 
                  <Badge bg="success" className="ms-2">Activo</Badge>
                </div>
                <div className="info-item">
                  <strong>Última actualización:</strong> 
                  <br />
                  <small className="text-muted">
                    {new Date().toLocaleDateString('es-CL')}
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
