import React, { useMemo, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Card, Button } from 'react-bootstrap'
import xanoAPI from '../config/xano'
import { resolveImageUrl, PLACEHOLDER_IMAGE } from '../lib/resolveImage'

const OrderDetail = () => {
  const { id } = useParams()
  const order = useMemo(() => {
    try {
      const raw = localStorage.getItem('electroverse-orders')
      const parsed = raw ? JSON.parse(raw) : []
      return parsed.find((o) => o.id === id) || null
    } catch {
      return null
    }
  }, [id])

  const [items, setItems] = useState(() => order?.items || [])

  useEffect(() => {
    if (!order) return
    setItems(order.items || [])
    const missing = (order.items || []).filter((it) => !it.image).map((it) => it.id)
    if (!missing.length) return
    console.log('[OrderDetail] need images for product ids:', missing)
    Promise.all(missing.map((pid) => xanoAPI.getProductById(pid).catch(() => null)))
      .then((results) => {
        console.log('[OrderDetail] fetched products:', results)
        const pickImage = (p) => {
          if (!p) return null
          const direct = p.image || p.image_url || p.thumbnail || p.photo || p.foto || p.imagen
          if (direct) return direct
          if (Array.isArray(p.images) && p.images.length) {
            const first = p.images[0]
            if (typeof first === 'string') return first
            if (first && (first.url || first.image || first.src || first.path)) return first.url || first.image || first.src || first.path
          }
          if (p.media && (p.media.url || p.media.image)) return p.media.url || p.media.image
          return null
        }
        const map = new Map()
        results.forEach((p) => {
          if (p && p.id != null) map.set(p.id, pickImage(p))
        })
        console.log('[OrderDetail] image map:', Object.fromEntries(map))
        setItems((prev) => prev.map((it) => ({ ...it, image: it.image || map.get(it.id) || null })))
      })
      .catch(() => {})
  }, [order])

  const fmtPrice = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(n || 0)
  const fmtDate = (s) => new Date(s).toLocaleString('es-CL')

  if (!order) {
    return (
      <Container className="py-5">
        <div className="text-center text-muted">Pedido no encontrado</div>
        <div className="text-center mt-3">
          <Button as={Link} to="/orders" variant="primary">Volver a pedidos</Button>
        </div>
      </Container>
    )
  }

  return (
    <div className="order-detail-page">
      <Container className="py-5">
        <Card>
          <Card.Header>
            <h5 className="mb-0">Pedido #{order.id}</h5>
          </Card.Header>
          <Card.Body>
            <div className="mb-3 text-muted">{fmtDate(order.date)}</div>
            <div className="mb-4">
              <h6>Productos</h6>
              {items?.map((it) => (
                <div key={it.id} className="d-flex align-items-center mb-2">
                  <div className="me-3 thumb-48">
                    {(() => {
                      const candidate = it.image 
                        || (Array.isArray(it.images) ? it.images[0] : null)
                        || it.thumbnail 
                        || it.image_url 
                        || it.photo 
                        || it.foto 
                        || it.imagen
                      if (!candidate) return <div className="thumb-img" style={{background:'#eee'}} />
                      const src = resolveImageUrl(candidate)
                      return (
                        <img 
                          src={src} 
                          alt={it.name} 
                          className="thumb-img" 
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
                        />
                      )
                    })()}
                  </div>
                  <div className="flex-grow-1">{it.name} × {it.quantity}</div>
                  <div>{fmtPrice(it.price * it.quantity)}</div>
                </div>
              ))}
              <div className="d-flex justify-content-between mt-2">
                <strong>Total</strong>
                <strong>{fmtPrice(order.total)}</strong>
              </div>
            </div>
            <div className="mb-4">
              <h6>Despacho</h6>
              <div>{order.shipping?.name}</div>
              <div>{order.shipping?.address}</div>
              <div>{order.shipping?.city}, {order.shipping?.region}</div>
              <div>{order.shipping?.phone}</div>
            </div>
            <div className="mb-4">
              <h6>Pago</h6>
              <div>Método: {order.method === 'tarjeta' ? 'crédito/débito' : order.method}</div>
              {order.payment?.cardLast4 && <div>Tarjeta terminada en {order.payment.cardLast4}</div>}
              {order.payment?.transferRef && <div>Referencia: {order.payment.transferRef}</div>}
            </div>
            <div className="d-flex">
              <Button as={Link} to="/orders" variant="outline-primary">Volver a pedidos</Button>
              <Button as={Link} to="/productos" variant="primary" className="ms-2">Seguir comprando</Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default OrderDetail
