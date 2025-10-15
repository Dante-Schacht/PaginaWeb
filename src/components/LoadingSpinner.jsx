import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../styles/components/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', text = 'Cargando...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <Spinner 
          animation="border" 
          variant="primary" 
          size={size}
          className="loading-spinner"
        />
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
