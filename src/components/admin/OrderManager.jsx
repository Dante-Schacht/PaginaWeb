import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Alert, Badge, Table, Form } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import useXano from '../../hooks/useXano';

const OrderManager = () => {
  const { user } = useApp();
  const xano = useXano();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Simular carga de órdenes (reemplazar con llamada real a Xano)
      const mockOrders = [
        {
          id: 1,
          order_number: 'ORD-001',
          customer_name: 'Juan Pérez',
          customer_email: 'juan@example.com',
          total: 149990,
          status: 'pending',
          created_at: '2024-01-15T10:30:00Z',
          items: [
            { name: 'Logitech G Pro X Superlight', quantity: 1, price: 149990 }
          ]
        },
        {
          id: 2,
          order_number: 'ORD-002',
          customer_name: 'María González',
          customer_email: 'maria@example.com',
          total: 99990,
          status: 'shipped',
          created_at: '2024-01-20T14:15:00Z',
          items: [
            { name: 'Razer Huntsman Mini', quantity: 1, price: 99990 }
          ]
        },
        {
          id: 3,
          order_number: 'ORD-003',
          customer_name: 'Carlos López',
          customer_email: 'carlos@example.com',
          total: 399990,
          status: 'delivered',
          created_at: '2024-01-25T09:45:00Z',
          items: [
            { name: 'Sony WH-1000XM5', quantity: 1, price: 399990 }
          ]
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      // Simular actualización de estado
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      setError('Error al actualizar el estado de la orden');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'Pendiente' },
      processing: { variant: 'info', text: 'Procesando' },
      shipped: { variant: 'primary', text: 'Enviado' },
      delivered: { variant: 'success', text: 'Entregado' },
      cancelled: { variant: 'danger', text: 'Cancelado' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  return (
    <div className="order-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="bi bi-bag-check me-2"></i>
          Gestión de Órdenes
        </h4>
        <div className="d-flex gap-2">
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">Todas las órdenes</option>
            <option value="pending">Pendientes</option>
            <option value="processing">Procesando</option>
            <option value="shipped">Enviadas</option>
            <option value="delivered">Entregadas</option>
            <option value="cancelled">Canceladas</option>
          </Form.Select>
          <Button variant="outline-primary" onClick={loadOrders}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Actualizar
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando órdenes...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Número de Orden</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.order_number}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{order.customer_name}</strong>
                          <br />
                          <small className="text-muted">{order.customer_email}</small>
                        </div>
                      </td>
                      <td>
                        <strong>{formatPrice(order.total)}</strong>
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>
                        {new Date(order.created_at).toLocaleDateString('es-CL')}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {order.status === 'pending' && (
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleStatusChange(order.id, 'processing')}
                            >
                              <i className="bi bi-play"></i>
                            </Button>
                          )}
                          {order.status === 'processing' && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleStatusChange(order.id, 'shipped')}
                            >
                              <i className="bi bi-truck"></i>
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleStatusChange(order.id, 'delivered')}
                            >
                              <i className="bi bi-check"></i>
                            </Button>
                          )}
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                              // Mostrar detalles de la orden
                              alert(`Detalles de la orden ${order.order_number}:\n\nProductos:\n${order.items.map(item => `- ${item.name} x${item.quantity}`).join('\n')}\n\nTotal: ${formatPrice(order.total)}`);
                            }}
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {filteredOrders.length === 0 && !loading && (
        <Card>
          <Card.Body className="text-center py-5">
            <i className="bi bi-bag-x display-1 text-muted"></i>
            <h5 className="mt-3">No hay órdenes</h5>
            <p className="text-muted">
              {filterStatus === 'all' 
                ? 'No hay órdenes registradas aún.' 
                : `No hay órdenes con estado "${filterStatus}".`
              }
            </p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default OrderManager;
