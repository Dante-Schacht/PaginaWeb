import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import '../styles/components/BackToTop.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          variant="primary"
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="Volver arriba"
        >
          <i className="bi bi-arrow-up"></i>
        </Button>
      )}
    </>
  );
};

export default BackToTop;
