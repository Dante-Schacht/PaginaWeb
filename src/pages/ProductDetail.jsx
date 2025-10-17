import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Carousel, Card, Spinner, Collapse } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import useXano from '../hooks/useXano';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import useImageLoader from '../hooks/useImageLoader';
import { formatPrice, calculateDiscount } from '../utils/dataAdapter';
import '../styles/pages/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useApp();
  const xano = useXano();
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  
  // Usar la imagen seleccionada del carrusel en lugar de la imagen principal
  const currentImageSrc = product?.additionalImages?.[selectedImageIndex] || product?.image;
  const { imageSrc, isLoading } = useImageLoader(currentImageSrc);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        // Validar que el ID sea válido
        if (!id || isNaN(parseInt(id))) {
          setProduct(null);
          setLoading(false);
          return;
        }
        
        // Buscar en productos ya cargados del contexto
        const foundProduct = products.find(p => p.id === parseInt(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Obtener productos recomendados de la misma categoría
          const recommended = products
            .filter(p => p.category === foundProduct.category && p.id !== parseInt(id))
            .slice(0, 4);
          setRecommendedProducts(recommended);
        } else {
          setProduct(null);
        }
        
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    // Solo cargar si tenemos un ID válido
    if (id) {
      loadProduct();
    } else {
      setLoading(false);
      setProduct(null);
    }
  }, [id, products]);

  const handleAddToCart = () => {
    try {
      if (product && addToCart) {
        for (let i = 0; i < quantity; i++) {
          addToCart(product);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Container className="py-5">
          <LoadingSpinner text="Cargando producto..." />
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Container className="py-5">
          <div className="text-center">
            <h3>Producto no encontrado</h3>
            <p>El producto que buscas no está disponible.</p>
            <div className="mt-4">
              <Button 
                variant="primary" 
                onClick={() => navigate('/productos')}
                className="me-3"
              >
                Ver todos los productos
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/')}
              >
                Ir al inicio
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Usar las imágenes adicionales del producto
  const additionalImages = product?.additionalImages?.length > 0 
    ? product.additionalImages 
    : product?.image 
      ? [product.image] 
      : [];

  return (
    <div className="product-detail-page">
      <Container className="py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/productos">Productos</Link>
            </li>
            {product.category && (
              <li className="breadcrumb-item">
                <Link to={`/productos?categoria=${product.category.toLowerCase()}`}>
                  {product.category}
                </Link>
              </li>
            )}
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <Row className="mb-5">
          {/* Imagen principal y carrusel */}
          <Col lg={6} className="mb-4">
            <div className="product-images">
              {/* Imagen principal - Muestra la imagen seleccionada del carrusel */}
              <div className="main-image-container mb-3">
                {isLoading ? (
                  <div className="main-image-loading d-flex align-items-center justify-content-center">
                    <Spinner animation="border" />
                  </div>
                ) : imageSrc ? (
                  <img 
                    key={`${selectedImageIndex}-${imageSrc}`}
                    src={imageSrc} 
                    alt={`${product.name} - Imagen ${selectedImageIndex + 1}`}
                    className="main-image"
                    style={{
                      animation: 'fadeIn 0.3s ease-in-out'
                    }}
                  />
                ) : (
                  <div className="main-image-placeholder d-flex align-items-center justify-content-center">
                    <div className="placeholder-content text-center">
                      <i className="bi bi-image display-1 text-muted mb-3"></i>
                      <h5 className="text-muted">Sin imagen disponible</h5>
                      <p className="text-muted">{product.name}</p>
                    </div>
                  </div>
                )}
                {product.discount && (
                  <Badge bg="danger" className="discount-badge">
                    -{product.discount}%
                  </Badge>
                )}
                {product.isNew && (
                  <Badge bg="success" className="new-badge">
                    Nuevo
                  </Badge>
                )}
                
                {/* Indicador de imagen actual si hay múltiples */}
                {additionalImages.length > 1 && (
                  <div className="image-counter">
                    <span className="badge bg-dark">
                      {selectedImageIndex + 1} / {additionalImages.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Navegación de imágenes - Solo mostrar si hay múltiples imágenes */}
              {additionalImages.length > 1 && (
                <div className="image-navigation">
                  {/* Controles de navegación */}
                  <div className="navigation-controls d-flex justify-content-between align-items-center mb-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                      disabled={selectedImageIndex === 0}
                    >
                      <i className="bi bi-chevron-left"></i> Anterior
                    </Button>
                    
                    <span className="text-muted">
                      Imagen {selectedImageIndex + 1} de {additionalImages.length}
                    </span>
                    
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setSelectedImageIndex(Math.min(additionalImages.length - 1, selectedImageIndex + 1))}
                      disabled={selectedImageIndex === additionalImages.length - 1}
                    >
                      Siguiente <i className="bi bi-chevron-right"></i>
                    </Button>
                  </div>

                  {/* Miniaturas */}
                  <div className="image-thumbnails">
                    {additionalImages.map((image, index) => (
                      <button
                        key={index}
                        className={`thumbnail-btn ${selectedImageIndex === index ? 'active' : ''}`}
                        onClick={() => setSelectedImageIndex(index)}
                        title={`Ver imagen ${index + 1}`}
                      >
                        <img 
                          src={image} 
                          alt={`Miniatura ${index + 1}`}
                          className="thumbnail-image"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Col>

          {/* Información del producto */}
          <Col lg={6}>
            <div className="product-info">
              <div className="product-category mb-2">
                <Badge bg="secondary">{product.category}</Badge>
              </div>
              
              <h1 className="product-title mb-3">
                {product.name}
              </h1>
              
              <div className="product-rating mb-3">
                {[...Array(5)].map((_, index) => (
                  <i 
                    key={index}
                    className={`bi bi-star${index < Math.floor(product.rating) ? '-fill' : ''}`}
                  ></i>
                ))}
                <span className="rating-text ms-2">
                  {product.rating} ({product.reviews} reseñas)
                </span>
              </div>
              
              <div className="product-price mb-4">
                {product.originalPrice && (
                  <span className="original-price me-3">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="current-price">
                  {formatPrice(product.price)}
                </span>
                {product.discount && (
                  <Badge bg="success" className="ms-2">
                    Ahorras {formatPrice(product.originalPrice - product.price)}
                  </Badge>
                )}
              </div>
              
              {/* Características del producto - Solo las principales */}
              {product?.features && Array.isArray(product.features) && product.features.length > 0 && (
                <div className="product-features mb-4">
                  <h5>Características Principales</h5>
                  <ul className="features-list">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="feature-item">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="product-actions">
                <div className="quantity-selector mb-3">
                  <label className="form-label">Cantidad:</label>
                  <div className="quantity-controls d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </Button>
                    <span className="quantity-display mx-2">{quantity}</span>
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock || quantity >= 10}
                      className="quantity-btn"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  variant="primary"
                  className="add-to-cart-btn w-100"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Sección expandible con detalles adicionales */}
        <Row className="mt-5">
          <Col lg={12}>
            <div className="product-details-section">
              <div className="details-header mb-3">
                <h4>Detalles del Producto</h4>
                <Button
                  variant="outline-primary"
                  onClick={() => setShowDetails(!showDetails)}
                  className="toggle-details-btn"
                >
                  <i className={`bi bi-chevron-${showDetails ? 'up' : 'down'} me-2`}></i>
                  {showDetails ? 'Ver menos' : 'Ver más detalles'}
                </Button>
              </div>
              
              <Collapse in={showDetails}>
                <div className="details-content">
                  {/* Descripción completa */}
                  <div className="product-description mb-4">
                    <h5>Descripción</h5>
                    <p>{product.detailedDescription || product.description}</p>
                  </div>
                  
                  {/* Especificaciones técnicas */}
                  {product?.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0 && (
                    <div className="product-specifications mb-4">
                      <h5>Especificaciones Técnicas</h5>
                      <div className="specifications-table">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="spec-row">
                            <span className="spec-label">{key}:</span>
                            <span className="spec-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Información de envío */}
                  {product?.shippingInfo && typeof product.shippingInfo === 'object' && (
                    <div className="shipping-info mb-4">
                      <h5>Información de Envío</h5>
                      <div className="shipping-details">
                        <div className="shipping-item">
                          <i className="bi bi-truck me-2"></i>
                          <span>
                            {product.shippingInfo.freeShipping ? 'Envío GRATIS' : 'Envío con costo adicional'}
                          </span>
                        </div>
                        <div className="shipping-item">
                          <i className="bi bi-clock me-2"></i>
                          <span>Entrega estimada: {product.shippingInfo.estimatedDelivery || 'No especificado'}</span>
                        </div>
                        <div className="shipping-item">
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          <span>{product.shippingInfo.returnPolicy || 'No especificado'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Collapse>
            </div>
          </Col>
        </Row>

        {/* Recommended Products Section */}
        {recommendedProducts.length > 0 && (
          <section className="recommended-products mt-5">
            <h3 className="recommended-title mb-4">Productos Recomendados</h3>
            <Row xs={1} md={2} lg={4} className="g-4">
              {recommendedProducts.map((recProduct) => (
                <Col key={recProduct.id}>
                  <ProductCard product={recProduct} />
                </Col>
              ))}
            </Row>
          </section>
        )}
      </Container>
    </div>
  );
};

export default ProductDetail;