import React, { useMemo, useEffect, useState } from 'react'
import { Container, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import xanoAPI from '../config/xano'
import { resolveImageUrl, PLACEHOLDER_IMAGE } from '../lib/resolveImage'

const Orders = () => {
  const orders = useMemo(() => {
    try {
      const raw = localStorage.getItem('electroverse-orders')
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }, [])

  const { addToCart, updateCartQuantity } = useApp()
  const [orderThumbs, setOrderThumbs] = useState({})

  const groupByDate = (list) => {
    const groups = new Map()
    list.forEach((o) => {
      const d = new Date(o.date)
      const key = d.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(o)
    })
    return Array.from(groups.entries()).sort((a, b) => {
      const da = new Date(a[1][0].date).getTime()
      const db = new Date(b[1][0].date).getTime()
      return db - da
    })
  }

  const fmtPrice = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(n || 0)
  const fmtDateTime = (s) => new Date(s).toLocaleString('es-CL')

  const buyAgain = (order) => {
    (order.items || []).forEach((it) => {
      addToCart({ id: it.id, name: it.name, price: it.price })
      if (it.quantity && it.quantity > 1) updateCartQuantity(it.id, it.quantity)
    })
  }

  useEffect(() => {
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
    const ordersList = orders || []
    const idsToFetch = new Set()
    ordersList.forEach((o) => (o.items || []).forEach((it) => { if (!it.image) idsToFetch.add(it.id) }))
    if (idsToFetch.size === 0) {
      const thumbs = {}
      ordersList.forEach((o) => {
        thumbs[o.id] = (o.items || []).map((it) => it.image).filter(Boolean).slice(0, 3)
      })
      setOrderThumbs(thumbs)
      return
    }
    Promise.all(Array.from(idsToFetch).map((pid) => xanoAPI.getProductById(pid).catch(() => null)))
      .then((results) => {
        const map = new Map()
        results.forEach((p) => { if (p && p.id != null) map.set(p.id, pickImage(p)) })
        const thumbs = {}
        ordersList.forEach((o) => {
          const imgs = (o.items || []).map((it) => it.image || map.get(it.id) || null).filter(Boolean).slice(0, 3)
          thumbs[o.id] = imgs
        })
        setOrderThumbs(thumbs)
      })
      .catch(() => {})
  }, [orders])

  return (
    <div className="orders-page">
      <Container className="py-5">
        {orders.length === 0 ? (
          <Card><Card.Body><div className="text-center text-muted">No hay pedidos</div></Card.Body></Card>
        ) : (
          groupByDate(orders).map(([dateLabel, list]) => (
            <Card key={dateLabel} className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{dateLabel}</h6>
              </Card.Header>
              <Card.Body>
                {list.map((o) => (
                  <div key={o.id} className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <div className="thumb-row me-3">
                        {(orderThumbs[o.id] && orderThumbs[o.id].length ? orderThumbs[o.id] : [null]).map((raw, idx) => (
                          <div key={idx} className="thumb-48">
                            {raw ? (
                              <img 
                                className="thumb-img" 
                                src={resolveImageUrl(raw)} 
                                alt={`Producto ${idx+1}`} 
                                onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
                              />
                            ) : (
                              <div className="thumb-img" style={{background:'#eee'}} />
                            )}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="text-success">Completado</div>
                        <div><strong>Pedido #{o.id}</strong></div>
                        <div className="text-muted small">{fmtDateTime(o.date)} · {o.items?.length || 0} productos</div>
                        <div className="text-muted small">{o.method === 'tarjeta' ? 'crédito/débito' : o.method}</div>
                      </div>
                    </div>
                    <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
                      <div className="order-total-label text-end text-sm-start"><strong>{fmtPrice(o.total)}</strong></div>
                      <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-sm-auto">
                        <Button as={Link} to={`/orders/${o.id}`} variant="primary" className="w-100 w-sm-auto">Ver compra</Button>
                        <Button variant="outline-primary" className="w-100 w-sm-auto" onClick={() => buyAgain(o)}>Volver a comprar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </div>
  )
}

export default Orders
