import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { useApp } from '../context/AppContext';
import '../styles/components/ProfileInfo.css';

const ProfileInfo = ({ user }) => {
  const { updateProfile, changePassword, loading } = useApp();
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateInfoForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El usuario es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInfoForm()) {
      return;
    }
    
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess('Perfil actualizado exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Error al actualizar el perfil' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        setSuccess('Contraseña cambiada exitosamente');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Error al cambiar la contraseña' });
    }
  };

  return (
    <div className="profile-info">
      {/* Tabs */}
      <div className="profile-tabs mb-4">
        <Button
          variant={activeTab === 'info' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('info')}
          className="me-2"
        >
          <i className="bi bi-person me-2"></i>
          Información Personal
        </Button>
        <Button
          variant={activeTab === 'password' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('password')}
        >
          <i className="bi bi-lock me-2"></i>
          Cambiar Contraseña
        </Button>
      </div>

      {/* Success Message */}
      {success && (
        <Alert variant="success" className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          {success}
        </Alert>
      )}

      {/* Error Message */}
      {errors.general && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {errors.general}
        </Alert>
      )}

      {/* Información Personal */}
      {activeTab === 'info' && (
        <Card>
          <Card.Header>
            <h5 className="mb-0">
              <i className="bi bi-person me-2"></i>
              Información Personal
            </h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleInfoSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      isInvalid={!!errors.name}
                      disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      isInvalid={!!errors.email}
                      disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check me-2"></i>
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Cambiar Contraseña */}
      {activeTab === 'password' && (
        <Card>
          <Card.Header>
            <h5 className="mb-0">
              <i className="bi bi-lock me-2"></i>
              Cambiar Contraseña
            </h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handlePasswordSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña Actual</Form.Label>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!errors.currentPassword}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nueva Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!errors.newPassword}
                  disabled={loading}
                  placeholder="Mínimo 8 caracteres"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!errors.confirmPassword}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Cambiando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-key me-2"></i>
                      Cambiar Contraseña
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ProfileInfo;
