import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'react-bootstrap'
import '../styles/components/BackToTop.css'

const CartQuickButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [invert, setInvert] = useState(false)
  const btnRef = useRef(null)

  useEffect(() => {
    const toggleVisibility = () => {
      const show = window.pageYOffset > 300
      setIsVisible(show)
      if (show) updateInvert()
    }

    const updateInvert = () => {
      const el = btnRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const elems = document.elementsFromPoint(cx, cy) || []
      const darkClasses = ['hero-section', 'cta-section']
      const isDark = elems.some((node) => {
        if (!node || !node.classList) return false
        for (const cls of darkClasses) if (node.classList.contains(cls)) return true
        const style = window.getComputedStyle(node)
        const bg = style.backgroundImage || style.backgroundColor || ''
        return /#9C2007|#701705|#440E03/i.test(bg)
      })
      setInvert(isDark)
    }

    window.addEventListener('scroll', toggleVisibility)
    window.addEventListener('resize', updateInvert)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
      window.removeEventListener('resize', updateInvert)
    }
  }, [])

  const openCart = () => {
    const event = new CustomEvent('open-cart')
    window.dispatchEvent(event)
  }

  if (!isVisible) return null

  return (
    <Button
      variant="primary"
      className={`cart-quick-btn ${invert ? 'contrast-invert' : ''}`}
      onClick={openCart}
      aria-label="Abrir carrito"
      ref={btnRef}
    >
      <i className="bi bi-cart3"></i>
    </Button>
  )
}

export default CartQuickButton
