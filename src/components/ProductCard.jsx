import React from 'react';
import { Card, Button, Badge, Spinner } from 'react-bootstrap';
import { useApp } from '../context/AppContext';
import useImageLoader from '../hooks/useImageLoader';
import '../styles/components/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useApp();
  const { imageSrc, isLoading } = useImageLoader(product.image);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="product-card h-100">
      <div className="product-image-container">
        {isLoading ? (
          <div className="product-image-loading d-flex align-items-center justify-content-center">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <Card.Img 
            variant="top" 
            src={imageSrc} 
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
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
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="product-category">
          <small className="text-muted">{product.category}</small>
        </div>
        
        <Card.Title className="product-title">
          {product.name}
        </Card.Title>
        
        <Card.Text className="product-description">
          {product.description}
        </Card.Text>
        
        <div className="product-rating mb-2">
          {[...Array(5)].map((_, index) => (
            <i 
              key={index}
              className={`bi bi-star${index < product.rating ? '-fill' : ''}`}
            ></i>
          ))}
          <span className="rating-text">({product.reviews})</span>
        </div>
        
        <div className="product-price mb-3">
          {product.originalPrice && (
            <span className="original-price">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="current-price">
            {formatPrice(product.price)}
          </span>
        </div>
        
        <div className="product-actions mt-auto">
          <Button 
            variant="primary" 
            className="add-to-cart-btn w-100"
            onClick={handleAddToCart}
          >
            <i className="bi bi-cart-plus me-2"></i>
            Agregar al Carrito
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
