import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Logo.css';

const Logo = ({ size = 'medium', showText = true, className = '', iconOnly = false }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'logo-small';
      case 'large':
        return 'logo-large';
      default:
        return 'logo-medium';
    }
  };

  return (
    <Link to="/" className={`logo-link ${getSizeClass()} ${className}`}>
      <div className="logo-container">
        <div className="logo-icon">
          <img 
            src="/logo.png" 
            alt="ElectroVerse Logo" 
            className="logo-image"
          />
        </div>
        {showText && !iconOnly && (
          <div className="logo-text">
            <div className="logo-main">
              <span className="logo-electro">Electro</span>
              <span className="logo-verse">Verse</span>
            </div>
            <div className="logo-subtitle">ELECTRONICS STORE</div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default Logo;
