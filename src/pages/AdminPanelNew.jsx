// src/pages/AdminPanelNew.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminRoute from '../routes/AdminRoute';

const AdminPanelNew = () => {
  return (
    <AdminRoute>
      <Container className="py-5">
        <Row>
          <Col>
            <h1 className="mb-4">Panel de Administración</h1>
            {/* La gestión de usuarios ha sido eliminada según instrucciones */}
          </Col>
        </Row>
      </Container>
    </AdminRoute>
  );
};

export default AdminPanelNew;
