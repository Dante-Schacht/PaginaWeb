import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import '../styles/components/FloatingButtons.css'

const FloatingButtons = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop || 0
      const nav = document.querySelector('.custom-navbar')
      const navRect = nav ? nav.getBoundingClientRect() : null
      const navInView = navRect ? navRect.bottom > 0 : false
      const shouldShow = y > 200 && !navInView
      setVisible(shouldShow)
    }
    updateVisibility()
    window.addEventListener('scroll', updateVisibility)
    window.addEventListener('resize', updateVisibility)
    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  const scrollTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const openCart = () => {
    const event = new CustomEvent('open-cart')
    window.dispatchEvent(event)
  }

  if (!visible) return null

  return (
    <div className="floating-buttons" aria-hidden={!visible}>
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
