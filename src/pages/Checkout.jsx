import React, { useEffect, useMemo, useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useApp } from '../context/AppContext'
import xanoAPI from '../config/xano'
import { useNavigate } from 'react-router-dom'
import { resolveImageUrl, PLACEHOLDER_IMAGE } from '../lib/resolveImage'

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, user } = useApp()
  const [processing, setProcessing] = useState(false)
  const [method, setMethod] = useState('tarjeta')
  const [remoteCart, setRemoteCart] = useState([])
  const [displayCart, setDisplayCart] = useState([])

  useEffect(() => {
    const fetchRemote = async () => {
      try {
        if (user?.id) {
          const data = await xanoAPI.getCart(user.id)
          const mapped = Array.isArray(data) ? data.map((i) => ({ id: i.product_id || i.id, name: i.name, price: Number(i.price) || 0, quantity: Number(i.quantity) || 1, image: i.image || (Array.isArray(i.images) ? i.images[0] : null) })) : []
          console.log('[Checkout] Xano cart raw:', data)
          console.log('[Checkout] Xano cart mapped:', mapped)
          setRemoteCart(mapped)
        }
      } catch (e) {
        setRemoteCart([])
      }
    }
    fetchRemote()
  }, [user?.id])

  const localCart = useMemo(() => {
    try {
      const raw = localStorage.getItem('electroverse-cart')
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }, [])

  useEffect(() => {
    const base = cart?.length ? cart : (remoteCart?.length ? remoteCart : (localCart?.length ? localCart : []))
    const items = Array.isArray(base) ? base : []
    console.log('[Checkout] base items:', items)
    setDisplayCart(items)
    const toFetch = items.filter(i => !i.image).map(i => i.id)
    console.log('[Checkout] toFetch product ids for images:', toFetch)
    if (toFetch.length) {
      Promise.all(toFetch.map(id => xanoAPI.getProductById(id).catch(() => null)))
        .then(results => {
          console.log('[Checkout] fetched products:', results)
          const map = new Map()
          results.forEach(p => {
            if (p && p.id != null) {
              const img = p.image || (Array.isArray(p.images) ? p.images[0] : null)
              map.set(p.id, img)
            }
          })
          console.log('[Checkout] image map:', Object.fromEntries(map))
          setDisplayCart(prev => prev.map(it => ({ ...it, image: it.image || map.get(it.id) || null })))
        })
        .catch(() => {})
    }
    const candidates = items.map((it) => ({
      id: it.id,
      name: it.name,
      candidate: it.image || (Array.isArray(it.images) ? it.images[0] : null) || it.thumbnail || it.image_url || it.photo || it.foto || it.imagen
    }))
    console.table(candidates)
    const resolved = candidates.map((c) => ({ id: c.id, resolved: resolveImageUrl(c.candidate) }))
    console.table(resolved)
  }, [cart, remoteCart, localCart])

  useEffect(() => {
    console.log('[Checkout] displayCart updated:', displayCart)
  }, [displayCart])

  const displayTotal = useMemo(() => {
    return displayCart.reduce((t, i) => t + i.price * i.quantity, 0)
  }, [displayCart])

  

  return (
    <div className="checkout-page">
      <Container className="py-5">
        <Row className="g-4">
          <Col lg={7}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Datos de Despacho</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={async (e) => {
                  e.preventDefault()
                  if (processing) return
                  const fd = new FormData(e.currentTarget)
                  const name = fd.get('name')?.toString().trim()
                  const phone = fd.get('phone')?.toString().trim()
                  const address = fd.get('address')?.toString().trim()
                  const city = fd.get('city')?.toString().trim()
                  const region = fd.get('region')?.toString().trim()
                  if (!name || !phone || !address || !city || !region) {
                    alert('Completa todos los datos de despacho')
                    return
                  }
                  const payMethod = fd.get('method')?.toString() || method
                  const shipping = { name, phone, address, city, region }
                  try {
                    localStorage.setItem('electroverse-checkout-shipping', JSON.stringify({ shipping, method: payMethod }))
                  } catch {}
                  navigate('/checkout/payment', { state: { shipping, method: payMethod } })
                }}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control name="name" type="text" placeholder="Tu nombre" required disabled={processing} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control name="phone" type="tel" placeholder="Tu teléfono" required disabled={processing} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control name="address" type="text" placeholder="Calle, número, comuna" required disabled={processing} />
                  </Form.Group>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control name="city" type="text" placeholder="Ciudad" required disabled={processing} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Región</Form.Label>
                        <Form.Control name="region" type="text" placeholder="Región" required disabled={processing} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Método de Pago</Form.Label>
                    <Form.Select name="method" value={method} onChange={(e) => setMethod(e.target.value)} required disabled={processing}>
                      <option value="tarjeta">Tarjeta de crédito/débito</option>
                      <option value="transferencia">Transferencia</option>
                    </Form.Select>
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={processing}>Continuar</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={5}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Resumen de Compra</h5>
              </Card.Header>
              <Card.Body>
                {displayCart.map(item => (
                  <div key={item.id} className="d-flex align-items-center mb-3">
                    <div className="me-3 thumb-48">
                      {(() => {
                        const candidate = item.image 
                          || (Array.isArray(item.images) ? item.images[0] : null)
                          || item.thumbnail 
                          || item.image_url 
                          || item.photo 
                          || item.foto 
                          || item.imagen
                        if (!candidate) {
                          return <div className="thumb-img" style={{background:'#eee'}} />
                        }
                        const src = resolveImageUrl(candidate)
                        return (
                          <img 
                            src={src} 
                            alt={item.name} 
                            className="thumb-img" 
                            loading="lazy"
                            onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
                          />
                        )
                      })()}
                    </div>
                    <div className="flex-grow-1">
                      <strong>{item.name}</strong>
                      <div className="text-muted small">x{item.quantity}</div>
                    </div>
                    <div>${item.price * item.quantity}</div>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong>${displayTotal}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Checkout
