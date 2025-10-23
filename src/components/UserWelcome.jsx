import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useApp } from '../context/AppContext';

const UserWelcome = () => {
  const { user, justLoggedIn, dismissWelcome } = useApp();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Solo iniciar timers si es un login reciente
    if (!user || !justLoggedIn) return;

    // Iniciar desvanecimiento después de 5 segundos
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 5000);

    // Ocultar completamente después del desvanecimiento y limpiar flag
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      // Limpiar el flag para no volver a mostrar en visitas futuras
      dismissWelcome();
    }, 5500); // 500ms para la animación de desvanecimiento

    // Limpiar los timers si el componente se desmonta
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [user, justLoggedIn, dismissWelcome]);

  if (!user || !justLoggedIn || !isVisible) return null;

  return (
    <Alert 
      variant="success" 
      className={`user-welcome ${isFading ? 'fade-out' : ''}`}
    >
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
