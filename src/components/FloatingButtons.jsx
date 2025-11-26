import React from 'react'
import { Button } from 'react-bootstrap'
import '../styles/components/FloatingButtons.css'

const FloatingButtons = () => {
  const scrollTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const openCart = () => {
    const event = new CustomEvent('open-cart')
    window.dispatchEvent(event)
  }

  return (
    <div className="floating-buttons">
      <Button
        variant="primary"
        className="floating-btn round"
        onClick={scrollTop}
        aria-label="Volver arriba"
      >
        <i className="bi bi-arrow-up"></i>
      </Button>
      <Button
        variant="primary"
        className="floating-btn square"
        onClick={openCart}
        aria-label="Abrir carrito"
      >
        <i className="bi bi-cart3"></i>
      </Button>
    </div>
  )
}

export default FloatingButtons

