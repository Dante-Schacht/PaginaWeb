// src/pages/ProductDetailNew.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../lib/xanoEndpoints';
import ProductGallery from '../components/ProductGallery';
import '../styles/pages/ProductDetail.css';

const ProductDetailNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProduct(id);
        setProduct(productData);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h2>Producto no encontrado</h2>
          <Button variant="primary" onClick={() => navigate('/productos')}>
            Volver a Productos
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        {/* Galería de imágenes */}
        <Col lg={6} className="mb-4">
          <ProductGallery product={product} />
        </Col>

        {/* Información del producto */}
        <Col lg={6}>
          <div className="product-info">
            <div className="mb-3">
              <Badge bg="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="h2 mb-3">{product.name}</h1>
              
              {product.rating && (
                <div className="mb-3">
                  <span className="text-warning">
                    {'★'.repeat(Math.floor(product.rating))}
                    {'☆'.repeat(5 - Math.floor(product.rating))}
                  </span>
                  <span className="ms-2 text-muted">
                    {product.rating} ({product.reviews || 0} reseñas)
                  </span>
                </div>
              )}
            </div>

            <div className="price-section mb-4">
              <div className="d-flex align-items-center gap-3">
                <span className="h2 text-primary mb-0">{
                  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(product.price)
                }</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-muted text-decoration-line-through">
                    {
                      new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(product.originalPrice)
                    }
                  </span>
                )}
                {product.discount && (
                  <Badge bg="danger">-{product.discount}%</Badge>
                )}
              </div>
            </div>

            <div className="description mb-4">
              <p className="text-muted">{product.description}</p>
            </div>

            <div className="quantity-section mb-4">
              <label className="form-label">Cantidad:</label>
              <div className="d-flex align-items-center gap-2">
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="px-3">{quantity}</span>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="actions">
              <Button 
                variant="primary" 
                size="lg" 
                className="me-3"
                onClick={() => {
                  // Lógica para agregar al carrito
                  console.log('Agregar al carrito:', { product: product.id, quantity });
                }}
              >
                <i className="bi bi-cart-plus me-2"></i>
                Agregar al Carrito
              </Button>
              <Button variant="outline-primary" size="lg">
                <i className="bi bi-heart me-2"></i>
                Favorito
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailNew;
