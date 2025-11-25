import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useApp } from '../context/AppContext';

const UserWelcome = () => {
  const { user, justLoggedIn, dismissWelcome } = useApp();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!user || !justLoggedIn) return;

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2500);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      dismissWelcome();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [user, justLoggedIn, dismissWelcome]);

  if (!user || !justLoggedIn || !isVisible) return null;

  return (
    <Alert 
      variant="light"
      className={`user-welcome ${isFading ? 'fade-out' : ''}`}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1050,
        background: '#fff',
        color: '#333',
        border: '1px solid #eee',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        borderRadius: '10px',
        width: 320,
        maxWidth: '90vw',
        padding: '12px 16px',
        margin: 0,
        opacity: isFading ? 0 : 1,
        transition: 'opacity 300ms ease'
      }}
    >
      <div className="d-flex align-items-center">
        <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745' }}></i>
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
