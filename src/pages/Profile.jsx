import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useApp } from '../context/AppContext';
import ProfileInfo from '../components/ProfileInfo';
import ProfileOrders from '../components/ProfileOrders';
import '../styles/pages/Profile.css';

const Profile = () => {
  const { user, loading, error } = useApp();

  if (loading) {
    return (
      <div className="profile-page">
        <Container className="py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando perfil...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <Container className="py-5">
          <Alert variant="warning">
            <Alert.Heading>Acceso Requerido</Alert.Heading>
            <p>Necesitas iniciar sesión para acceder a tu perfil.</p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button variant="outline-primary" href="/login">
                Iniciar Sesión
              </Button>
            </div>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Container className="py-5">
        <Row>
          <Col lg={12}>
            <div className="profile-header mb-4">
              <h1 className="profile-title">Mi Perfil</h1>
              <p className="profile-subtitle">
                Gestiona tu información personal y revisa tu historial
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <ProfileInfo user={user} />
          </Col>
          
          <Col lg={4}>
            <ProfileOrders />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
