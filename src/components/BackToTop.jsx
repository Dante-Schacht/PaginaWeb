import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import '../styles/components/BackToTop.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [invert, setInvert] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    const toggleVisibility = () => {
      const show = window.pageYOffset > 300;
      setIsVisible(show);
      if (show) updateInvert();
    };

    const updateInvert = () => {
      const el = btnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const elems = document.elementsFromPoint(cx, cy) || [];
      const darkClasses = ['hero-section', 'cta-section'];
      const isDark = elems.some((node) => {
        if (!node || !node.classList) return false;
        for (const cls of darkClasses) if (node.classList.contains(cls)) return true;
        const style = window.getComputedStyle(node);
        const bg = style.backgroundImage || style.backgroundColor || '';
        return /#9C2007|#701705|#440E03/i.test(bg);
      });
      setInvert(isDark);
    };

    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('resize', updateInvert);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', updateInvert);
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
          className={`back-to-top-btn ${invert ? 'contrast-invert' : ''}`}
          onClick={scrollToTop}
          aria-label="Volver arriba"
          ref={btnRef}
        >
          <i className="bi bi-arrow-up"></i>
        </Button>
      )}
    </>
  );
};

export default BackToTop;
