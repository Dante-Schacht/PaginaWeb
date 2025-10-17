// src/pages/AdminPanelNew.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import AdminRoute from '../routes/AdminRoute';
import UsersList from '../admin/UsersList';

const AdminPanelNew = () => {
  return (
    <AdminRoute>
      <Container className="py-5">
        <Row>
          <Col>
            <h1 className="mb-4">Panel de Administración</h1>
            
            <Card className="mb-4">
              <Card.Header>
                <h3 className="mb-0">Gestión de Usuarios</h3>
              </Card.Header>
              <Card.Body>
                <UsersList />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </AdminRoute>
  );
};

export default AdminPanelNew;
