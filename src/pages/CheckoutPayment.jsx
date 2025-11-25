import React, { useEffect, useMemo, useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useApp } from '../context/AppContext'
import xanoAPI from '../config/xano'
import { useLocation, useNavigate } from 'react-router-dom'
import { resolveImageUrl, PLACEHOLDER_IMAGE } from '../lib/resolveImage'

const CheckoutPayment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart, clearCart, user } = useApp()
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [purchased, setPurchased] = useState([])
  const [method, setMethod] = useState('tarjeta')
  const [remoteCart, setRemoteCart] = useState([])
  const [displayCart, setDisplayCart] = useState([])
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [shipping, setShipping] = useState(null)

  useEffect(() => {
    const s = location.state?.shipping
    const m = location.state?.method
    if (s) setShipping(s)
    if (m) setMethod(m)
    if (!s) {
      try {
        const saved = JSON.parse(localStorage.getItem('electroverse-checkout-shipping') || '{}')
        if (saved?.shipping) setShipping(saved.shipping)
        if (saved?.method) setMethod(saved.method)
      } catch {}
    }
  }, [location.state])

  useEffect(() => {
    const fetchRemote = async () => {
      try {
        if (user?.id) {
          const data = await xanoAPI.getCart(user.id)
          const mapped = Array.isArray(data) ? data.map((i) => ({ id: i.product_id || i.id, name: i.name, price: Number(i.price) || 0, quantity: Number(i.quantity) || 1, image: i.image || (Array.isArray(i.images) ? i.images[0] : null) })) : []
          console.log('[Payment] Xano cart raw:', data)
          console.log('[Payment] Xano cart mapped:', mapped)
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
    const base = result?.success ? purchased : (cart?.length ? cart : (remoteCart?.length ? remoteCart : (localCart?.length ? localCart : [])))
    const items = Array.isArray(base) ? base : []
    console.log('[Payment] base items:', items)
    setDisplayCart(items)
    const toFetch = items.filter(i => !i.image).map(i => i.id)
    console.log('[Payment] toFetch product ids for images:', toFetch)
    if (toFetch.length) {
      Promise.all(toFetch.map(id => xanoAPI.getProductById(id).catch(() => null)))
        .then(results => {
          console.log('[Payment] fetched products:', results)
          const map = new Map()
          results.forEach(p => {
            if (p && p.id != null) {
              const img = p.image || (Array.isArray(p.images) ? p.images[0] : null)
              map.set(p.id, img)
            }
          })
          console.log('[Payment] image map:', Object.fromEntries(map))
          setDisplayCart(prev => prev.map(it => ({ ...it, image: it.image || map.get(it.id) || null })))
        })
        .catch(() => {})
    }
  }, [result?.success, purchased, cart, remoteCart, localCart])

  useEffect(() => {
    console.log('[Payment] displayCart updated:', displayCart)
  }, [displayCart])

  const displayTotal = useMemo(() => {
    return displayCart.reduce((t, i) => t + i.price * i.quantity, 0)
  }, [displayCart])

  const submitPayment = async (e) => {
    e.preventDefault()
    if (processing) return
    if (!shipping) {
      alert('Faltan los datos de despacho. Regresa al paso anterior.')
      navigate('/checkout')
      return
    }
    const fd = new FormData(e.currentTarget)
    const payMethod = method
    let cardLast4 = null
    let transferRef = null
    if (payMethod === 'tarjeta') {
      const cardRaw = fd.get('cardNumber')?.toString() || cardNumber
      const digitsOnly = cardRaw.replace(/\s+/g, '')
      const expiryVal = fd.get('expiry')?.toString().trim() || expiry
      const cvvVal = fd.get('cvv')?.toString().trim() || cvv
      const validExpiry = /^\d{2}\/\d{2}$/.test(expiryVal)
      const validCvv = /^\d{3}$/.test(cvvVal)
      if (!digitsOnly || digitsOnly.length < 12 || !validExpiry || !validCvv) {
        setResult({ success: false, message: 'Completa los datos de tarjeta' })
        return
      }
      const mm = parseInt(expiryVal.slice(0,2), 10)
      const yy = parseInt(expiryVal.slice(3,5), 10)
      const now = new Date()
      const cMM = now.getMonth() + 1
      const cYY = now.getFullYear() % 100
      if (mm < 1 || mm > 12) {
        setResult({ success: false, message: 'Mes de expiración inválido' })
        return
      }
      if (yy < cYY || (yy === cYY && mm < cMM)) {
        setResult({ success: false, message: 'La tarjeta está vencida' })
        return
      }
      cardLast4 = digitsOnly.slice(-4)
    }
    if (payMethod === 'transferencia') {
      transferRef = fd.get('transferRef')?.toString().trim() || null
    }
    setResult(null)
    setProcessing(true)
    await new Promise((res) => setTimeout(res, 1200))
    const ok = true
    if (ok) {
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000)
      const source = displayCart
      const snapshot = source.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image || null }))
      setPurchased(snapshot)
      const order = {
        id: orderId,
        date: new Date().toISOString(),
        status: 'completed',
        total: displayTotal,
        items: snapshot,
        shipping,
        method: payMethod,
        payment: { cardLast4, transferRef }
      }
      try {
        const prev = JSON.parse(localStorage.getItem('electroverse-orders') || '[]')
        const next = [order, ...prev]
        localStorage.setItem('electroverse-orders', JSON.stringify(next))
      } catch {}
      clearCart()
      setResult({ success: true, message: `Pago confirmado (${payMethod}). Orden ${orderId}` })
      setTimeout(() => navigate(`/orders/${orderId}`), 800)
    } else {
      setResult({ success: false, message: 'Pago rechazado. Intenta nuevamente o cambia el método de pago.' })
    }
    setProcessing(false)
  }

  return (
    <div className="checkout-payment-page">
      <Container className="py-5">
        <Row className="g-4">
          <Col lg={7}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Pago</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={submitPayment}>
                  <Form.Group className="mb-3">
                    <Form.Label>Método de Pago</Form.Label>
                    <Form.Select value={method} onChange={(e) => setMethod(e.target.value)} disabled={processing}>
                      <option value="tarjeta">Tarjeta de crédito/débito</option>
                      <option value="transferencia">Transferencia</option>
                    </Form.Select>
                  </Form.Group>
                  {method === 'tarjeta' && (
                    <Row className="mb-3">
                      <Col md={8}>
                        <Form.Group>
                          <Form.Label>Número de tarjeta</Form.Label>
                          <Form.Control 
                            name="cardNumber"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            inputMode="numeric"
                            value={cardNumber}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '').slice(0,16)
                              const grouped = digits.match(/.{1,4}/g)?.join(' ') || ''
                              setCardNumber(grouped)
                            }}
                            disabled={processing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>Expira</Form.Label>
                          <Form.Control 
                            name="expiry"
                            type="text"
                            placeholder="MM/AA"
                            inputMode="numeric"
                            maxLength={5}
                            value={expiry}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
                              const formatted = digits.length <= 2 ? digits : `${digits.slice(0,2)}/${digits.slice(2)}`
                              setExpiry(formatted)
                            }}
                            disabled={processing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>CVV</Form.Label>
                          <Form.Control 
                            name="cvv"
                            type="password"
                            placeholder="***"
                            inputMode="numeric"
                            maxLength={3}
                            value={cvv}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '').slice(0,3)
                              setCvv(digits)
                            }}
                            disabled={processing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  )}
                  {method === 'transferencia' && (
                    <Card className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <div>
                            <div><strong>Banco:</strong> Banco Estado</div>
                            <div><strong>Cuenta:</strong> 12-345-6789</div>
                            <div><strong>Tipo:</strong> Cuenta Corriente</div>
                            <div><strong>RUT:</strong> 12.345.678-9</div>
                            <div><strong>Nombre:</strong> Electroverse SpA</div>
                            <div><strong>Email:</strong> pagos@electroverse.cl</div>
                          </div>
                          <Button variant="outline-primary" type="button" onClick={() => navigator.clipboard?.writeText('Banco Estado | CC 12-345-6789 | RUT 12.345.678-9 | Electroverse SpA | pagos@electroverse.cl')}>Copiar</Button>
                        </div>
                        <Form.Group className="mt-3">
                          <Form.Label>Referencia de transferencia</Form.Label>
                          <Form.Control name="transferRef" type="text" placeholder="Opcional" disabled={processing} />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  )}
                  <Button variant="primary" type="submit" disabled={processing}>
                    {processing ? (<><Spinner size="sm" className="me-2" />Procesando...</>) : (method === 'transferencia' ? 'Confirmar pago' : 'Pagar ahora')}
                  </Button>
                </Form>
                {result && (
                  <Alert className="mt-3" variant={result.success ? 'success' : 'danger'}>
                    {result.message}
                  </Alert>
                )}
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
                {shipping && (
                  <>
                    <h6 className="mt-3 mb-2">Datos de Despacho</h6>
                    <div className="text-muted small">
                      <div>{shipping.name}</div>
                      <div>{shipping.address}</div>
                      <div>{shipping.city}, {shipping.region}</div>
                      <div>{shipping.phone}</div>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CheckoutPayment
