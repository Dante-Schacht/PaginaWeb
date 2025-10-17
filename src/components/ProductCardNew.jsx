// src/components/ProductCardNew.jsx
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { resolveImageUrl } from '../lib/resolveImage';
import '../styles/components/ProductCard.css';

const ProductCardNew = ({ product, onClick }) => {
  // Resolver la imagen principal
  const mainImage = product?.images?.[0] ? resolveImageUrl(product.images[0]) : null;
  
  return (
    <Card className="product-card h-100" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="product-image-container">
        {mainImage ? (
          <Card.Img 
            variant="top" 
            src={mainImage} 
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder d-flex align-items-center justify-content-center">
            <div className="placeholder-content text-center">
              <i className="bi bi-image display-4 text-muted mb-2"></i>
              <p className="text-muted small mb-0">Sin imagen</p>
              <small className="text-muted">{product.name}</small>
            </div>
          </div>
        )}
        
        {/* Badges */}
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
        <Card.Title className="h6 mb-2">{product.name}</Card.Title>
        <Card.Text className="text-muted small mb-2">
          {product.description?.substring(0, 100)}...
        </Card.Text>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="h5 text-primary">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-muted text-decoration-line-through ms-2">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <Badge bg="secondary">{product.category}</Badge>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCardNew;
