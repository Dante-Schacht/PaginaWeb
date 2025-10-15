import React from 'react';
import { Alert } from 'react-bootstrap';
import { useApp } from '../context/AppContext';

const UserWelcome = () => {
  const { user } = useApp();

  if (!user) return null;

  return (
    <Alert variant="success" className="user-welcome">
      <div className="d-flex align-items-center">
        <i className="bi bi-check-circle-fill me-2"></i>
        <div>
          <strong>¡Bienvenido, {user.name}!</strong>
          <br />
          <small>Has iniciado sesión correctamente.</small>
        </div>
      </div>
    </Alert>
  );
};

export default UserWelcome;
