import React from 'react';
import { Card, Badge, Button, Alert } from 'react-bootstrap';
import '../styles/components/ProfileOrders.css';

const ProfileOrders = () => {
  // Datos de ejemplo - en una aplicación real vendrían de la API
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'completed',
      total: 299990,
      items: 2
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 159990,
      items: 1
    },
    {
      id: 'ORD-003',
      date: '2024-01-25',
      status: 'pending',
      total: 89990,
      items: 1
    }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { variant: 'warning', text: 'Pendiente' },
      shipped: { variant: 'info', text: 'Enviado' },
      completed: { variant: 'success', text: 'Completado' },
      cancelled: { variant: 'danger', text: 'Cancelado' }
    };
    
    const statusInfo = statusMap[status] || { variant: 'secondary', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-orders">
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <i className="bi bi-bag me-2"></i>
            Mis Pedidos Recientes
          </h5>
        </Card.Header>
        <Card.Body>
          {orders.length === 0 ? (
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle display-4 d-block mb-3"></i>
              <h6>No tienes pedidos aún</h6>
              <p className="text-muted mb-3">
                Cuando realices tu primera compra, aparecerá aquí.
              </p>
              <Button variant="primary" href="/productos">
                <i className="bi bi-cart me-2"></i>
                Comenzar a Comprar
              </Button>
            </Alert>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-header">
                    <div className="order-info">
                      <h6 className="order-id">Pedido #{order.id}</h6>
                      <small className="text-muted">
                        {formatDate(order.date)}
                      </small>
                    </div>
                    <div className="order-status">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                  
                  <div className="order-details">
                    <div className="order-items">
                      <i className="bi bi-box me-1"></i>
                      {order.items} {order.items === 1 ? 'producto' : 'productos'}
                    </div>
                    <div className="order-total">
                      <strong>{formatPrice(order.total)}</strong>
                    </div>
                  </div>
                  
                  <div className="order-actions">
                    <Button variant="outline-primary" size="sm">
                      <i className="bi bi-eye me-1"></i>
                      Ver Detalles
                    </Button>
                    {order.status === 'completed' && (
                      <Button variant="outline-success" size="sm" className="ms-2">
                        <i className="bi bi-star me-1"></i>
                        Valorar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="text-center mt-3">
                <Button variant="outline-primary" href="/orders">
                  <i className="bi bi-list me-2"></i>
                  Ver Todos los Pedidos
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Información adicional */}
      <Card className="mt-3">
        <Card.Header>
          <h6 className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Información de Cuenta
          </h6>
        </Card.Header>
        <Card.Body>
          <div className="account-info">
            <div className="info-item">
              <i className="bi bi-person me-2"></i>
              <span>Miembro desde enero 2024</span>
            </div>
            <div className="info-item">
              <i className="bi bi-shield-check me-2"></i>
              <span>Cuenta verificada</span>
            </div>
            <div className="info-item">
              <i className="bi bi-geo-alt me-2"></i>
              <span>Chile</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileOrders;
