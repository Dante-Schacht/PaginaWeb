import React, { useState } from 'react';
import { Navbar, Nav, Container, Badge, Offcanvas, Dropdown, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from './Logo';
import '../styles/components/Header.css';
import { resolveImageUrl, isUnwantedImage, PLACEHOLDER_IMAGE } from '../lib/resolveImage'

const Header = () => {
  const [show, setShow] = useState(false);
  const { cartItemsCount, user, logout, isAdmin } = useApp();
  const location = useLocation();
  
  // Debug logs temporales
  console.log('🔍 Header - User state:', user);
  console.log('🔍 Header - isAdmin():', isAdmin());
  console.log('🔍 Header - user?.role:', user?.role);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isActive = (path) => {
    return location.pathname === path;
  };

  React.useEffect(() => {
    const handler = () => setShow(true);
    window.addEventListener('open-cart', handler);
    return () => window.removeEventListener('open-cart', handler);
  }, []);

  return (
    <>
      <Navbar expand="lg" className="custom-navbar" variant="dark">
        <Container>
          <Navbar.Brand className="brand-logo">
            <Logo size="medium" className="logo-white" />
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                as={Link} 
                to="/" 
                className={isActive('/') ? 'active' : ''}
              >
                Inicio
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/productos" 
                className={isActive('/productos') ? 'active' : ''}
              >
                Productos
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/blogs" 
                className={isActive('/blogs') ? 'active' : ''}
              >
                Blogs
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/nosotros" 
                className={isActive('/nosotros') ? 'active' : ''}
              >
                Nosotros
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/contacto" 
                className={isActive('/contacto') ? 'active' : ''}
              >
                Contacto
              </Nav.Link>
            </Nav>
            
            <Nav>
              {/* Carrito */}
              <Nav.Link 
                onClick={handleShow}
                className="cart-link"
              >
                <i className="bi bi-cart3"></i>
                {cartItemsCount > 0 && (
                  <Badge bg="danger" className="cart-badge">
                    {cartItemsCount}
                  </Badge>
                )}
              </Nav.Link>
              
              {/* Autenticación */}
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle as={Nav.Link} className="user-dropdown">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      <i className="bi bi-person me-2"></i>
                      Mi Perfil
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/orders">
                      <i className="bi bi-bag me-2"></i>
                      Mis Pedidos
                    </Dropdown.Item>
                    {isAdmin() && (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to="/admin">
                          <i className="bi bi-gear me-2"></i>
                          Panel de Administración
                        </Dropdown.Item>
                      </>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Nav.Link as={Link} to="/login" className="auth-link">
                  <i className="bi bi-person me-1"></i>
                  Iniciar Sesión
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Carrito Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Mi Carrito</Offcanvas.Title>
        </Offcanvas.Header>
          <Offcanvas.Body>
          <CartContent onCheckout={() => setShow(false)} />
          </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

// Componente para el contenido del carrito
const CartContent = ({ onCheckout }) => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, user } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-cart-x display-1 text-muted"></i>
        <p className="text-muted">Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div>
      {cart.map(item => (
        <div key={item.id} className="cart-item d-flex align-items-center mb-3">
          <div className="cart-item-image me-3">
            {(() => {
              const candidate = item.image 
                || (Array.isArray(item.images) ? item.images[0] : null)
                || (Array.isArray(item.additionalImages) ? item.additionalImages[0] : null)
                || item.thumbnail 
                || item.image_url 
                || item.photo 
                || item.foto 
                || item.imagen;
              if (isUnwantedImage(candidate)) {
                return (
                  <div className="d-flex align-items-center justify-content-center img-thumbnail" style={{ width: '60px', height: '60px', background: '#fff' }}>
                    <i className="bi bi-image text-muted"></i>
                  </div>
                );
              }
              const src = resolveImageUrl(candidate);
              return (
                <img 
                  src={src} 
                  alt={item.name}
                  className="img-thumbnail"
                  loading="lazy"
                  style={{ width: '60px', height: '60px', objectFit: 'contain', objectPosition: 'center', background: '#fff' }}
                  onError={(e) => {
                    console.error('Cart: error cargando imagen', {
                      id: item?.id,
                      name: item?.name,
                      src: e.currentTarget?.src
                    });
                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                />
              );
            })()}
          </div>
          <div className="cart-item-details flex-grow-1">
            <h6 className="mb-1">{item.name}</h6>
            <p className="text-muted mb-1">${item.price}</p>
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
              >
                -
              </button>
              <span className="mx-2">{item.quantity}</span>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
              <button 
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={() => removeFromCart(item.id)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="cart-total mt-3 d-flex justify-content-between align-items-center">
        <strong>Total: ${cartTotal}</strong>
        <Button 
          variant="primary" 
          onClick={() => {
            const target = '/checkout';
            if (user) {
              navigate(target);
            } else {
              navigate('/login', { state: { redirectTo: target } });
            }
            if (onCheckout) onCheckout();
          }}
        >
          Proceder al Pago
        </Button>
      </div>
    </div>
  );
};

export default Header;
