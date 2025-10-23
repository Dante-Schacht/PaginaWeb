import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal, Alert, Badge, Table } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import useXano from '../../hooks/useXano';
import { uploadImages } from '../../lib/xanoEndpoints';

const ProductManager = () => {
  const { products, setProducts, productsLoaded } = useApp();
  const xano = useXano();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    image: '',
    stock: '',
    isNew: false,
    discount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    // Solo cargar si no hay productos cargados
    if (!productsLoaded) {
      loadProducts();
    }
  }, [productsLoaded]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('ProductManager: Cargando productos...');
      const productsData = await xano.getProducts();
      console.log('ProductManager: Productos cargados:', productsData);
      setProducts(productsData); // Esto actualiza el contexto global
    } catch (error) {
      console.error('ProductManager: Error loading products:', error);
      setError('Error al cargar productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la selección de imágenes
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar límite de 10 imágenes
    if (files.length > 10) {
      setError('Máximo 10 imágenes permitidas');
      return;
    }
    
    // Validar tipo de archivo
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Solo se permiten archivos de imagen');
      return;
    }
    
    // Validar tamaño (5MB máximo)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Algunas imágenes exceden el límite de 5MB');
      return;
    }
    
    setSelectedFiles(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
    setError(null);
  };

  // Función para limpiar previews
  const clearPreviews = () => {
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews([]);
    setSelectedFiles([]);
  };

  // Función para generar detalles automáticamente
  const generateProductDetails = (productName, category, brand) => {
    const detailsMap = {
      'Teclado': {
        features: ['Switches mecánicos', 'Retroiluminación RGB', 'Anti-ghosting', 'Cable desmontable'],
        specifications: {
          'Tipo de switch': 'Mecánico',
          'Retroiluminación': 'RGB personalizable',
          'Conectividad': 'USB-C',
          'Compatibilidad': 'Windows, Mac, Linux'
        }
      },
      'Mouse': {
        features: ['Sensor óptico de alta precisión', 'Botones programables', 'Peso ajustable', 'Cable flexible'],
        specifications: {
          'DPI': 'Hasta 12,000 DPI',
          'Polling Rate': '1000 Hz',
          'Conectividad': 'USB',
          'Botones': '6 botones programables'
        }
      },
      'Monitor': {
        features: ['Panel IPS', 'Alta frecuencia de actualización', 'Tecnología HDR', 'Ajuste de altura'],
        specifications: {
          'Tamaño': '27 pulgadas',
          'Resolución': '2560x1440',
          'Frecuencia': '144 Hz',
          'Tiempo de respuesta': '1ms'
        }
      },
      'Audífonos': {
        features: ['Cancelación de ruido activa', 'Audio de alta fidelidad', 'Micrófono integrado', 'Batería de larga duración'],
        specifications: {
          'Tipo': 'Over-ear',
          'Conectividad': 'Bluetooth 5.0',
          'Batería': 'Hasta 30 horas',
          'Cancelación de ruido': 'Activa'
        }
      },
      'Micrófono': {
        features: ['Patrón cardioide', 'Filtro de pop integrado', 'Conectividad USB', 'Control de ganancia'],
        specifications: {
          'Tipo': 'Condensador',
          'Patrón': 'Cardioide',
          'Frecuencia': '20Hz - 20kHz',
          'Conectividad': 'USB'
        }
      }
    };

    // Buscar coincidencias en el nombre del producto
    for (const [key, details] of Object.entries(detailsMap)) {
      if (productName.toLowerCase().includes(key.toLowerCase())) {
        return details;
      }
    }

    // Detalles genéricos si no hay coincidencia
    return {
      features: ['Alta calidad', 'Diseño ergonómico', 'Fácil instalación', 'Garantía extendida'],
      specifications: {
        'Marca': brand || 'ElectroVerse',
        'Categoría': category,
        'Garantía': '1 año',
        'Origen': 'Importado'
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let uploadedImages = [];
      
      // Si hay archivos seleccionados, subirlos primero
      if (selectedFiles.length > 0) {
        setUploadingImages(true);
        try {
          uploadedImages = await uploadImages(selectedFiles);
          console.log('Imágenes subidas:', uploadedImages);
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          setError('Error al subir las imágenes: ' + uploadError.message);
          return;
        } finally {
          setUploadingImages(false);
        }
      }
      
      // Preparar datos en el formato que espera Xano
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        brand: formData.brand,
        category: formData.category,
        images: uploadedImages, // Usar las imágenes subidas
        active: true
      };

      if (editingProduct) {
        // Actualizar producto existente
        await xano.updateProduct(editingProduct.id, productData);
        setSuccess('Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        await xano.createProduct(productData);
        setSuccess('Producto creado correctamente');
      }

      // Recargar productos
      await loadProducts();
      
      // Limpiar formulario y previews
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        brand: '',
        image: '',
        stock: '',
        isNew: false,
        discount: ''
      });
      clearPreviews();
      setEditingProduct(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      // Mostrar el mensaje exacto del backend si está disponible
      const errorMessage = error.message.includes('HTTP') ? 
        error.message.split('\n')[1] || error.message : 
        error.message;
      setError('Error al guardar el producto: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || '',
      brand: product.brand || '',
      image: product.image || '',
      stock: product.stock || '',
      isNew: product.isNew || false,
      discount: product.discount || ''
    });
    // Limpiar previews al editar
    clearPreviews();
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        setLoading(true);
        await xano.deleteProduct(productId);
        setSuccess('Producto eliminado correctamente');
        await loadProducts();
      } catch (error) {
        setError('Error al eliminar el producto: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Añadir toggle de activo/inactivo
  const handleToggleActive = async (product) => {
    try {
      setLoading(true);
      await xano.updateProduct(product.id, { active: !product.active });
      setSuccess(`Producto ${product.active ? 'desactivado' : 'activado'} correctamente`);
      await loadProducts();
    } catch (error) {
      setError('Error al actualizar estado: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    <div className="product-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="bi bi-box-seam me-2"></i>
          Gestión de Productos
        </h4>
        <Button
          variant="primary"
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              originalPrice: '',
              category: '',
              brand: '',
              image: '',
              stock: '',
              isNew: false,
              discount: ''
            });
            // Limpiar previews al agregar
            clearPreviews();
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus me-1"></i>
          Agregar Producto
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando productos...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img 
                          src={product.image || '/ImagenHome.png'} 
                          alt={product.name}
                          className="product-thumb"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <div>
                          <strong>{product.name}</strong>
                          {product.isNew && (
                            <Badge bg="success" className="ms-2">Nuevo</Badge>
                          )}
                        </div>
                        <small className="text-muted">{product.brand}</small>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        <div>
                          <strong>{formatPrice(product.price)}</strong>
                          {product.originalPrice && (
                            <div>
                              <small className="text-muted text-decoration-line-through">
                                {formatPrice(product.originalPrice)}
                              </small>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{product.stock || 0}</td>
                      <td>
                        <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
                          {product.stock > 0 ? 'Disponible' : 'Agotado'}
                        </Badge>
                        <div className="mt-1">
                          <Badge bg={product.active ? 'primary' : 'secondary'}>
                            {product.active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </td>
                      <td>
                        <Button
                          variant={product.active ? 'outline-success' : 'outline-warning'}
                          size="sm"
                          className="me-2"
                          onClick={() => handleToggleActive(product)}
                          disabled={loading}
                        >
                          <i className={product.active ? 'bi bi-toggle2-on' : 'bi bi-toggle2-off'}></i>
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(product)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal para agregar/editar producto */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Producto *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio Original</Form.Label>
                  <Form.Control
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Descuento (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Mouses">Mouses</option>
                    <option value="Teclados">Teclados</option>
                    <option value="Micrófonos">Micrófonos</option>
                    <option value="Monitores">Monitores</option>
                    <option value="Parlantes">Parlantes</option>
                    <option value="Televisores">Televisores</option>
                    <option value="Teléfonos">Teléfonos</option>
                    <option value="Audífonos">Audífonos</option>
                    <option value="Smartwatches">Smartwatches</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Imágenes del Producto (máximo 10)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="mb-2"
              />
              <Form.Text className="text-muted">
                Selecciona hasta 10 imágenes. Las imágenes se procesarán localmente para crear el producto.
              </Form.Text>
              
              {/* Preview de imágenes */}
              {previews.length > 0 && (
                <div className="mt-3">
                  <Form.Label className="text-muted">Vista previa:</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {previews.map((src, index) => (
                      <div key={index} className="position-relative">
                        <img 
                          src={src} 
                          alt={`Preview ${index + 1}`}
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #dee2e6'
                          }}
                        />
                        <Badge 
                          bg="secondary" 
                          className="position-absolute top-0 end-0 translate-middle"
                          style={{ fontSize: '0.7rem' }}
                        >
                          {index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isNew"
                label="Producto nuevo"
                checked={formData.isNew}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading || uploadingImages}>
              {loading || uploadingImages ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {uploadingImages ? 'Subiendo imágenes...' : (editingProduct ? 'Actualizando...' : 'Creando...')}
                </>
              ) : (
                editingProduct ? 'Actualizar Producto' : 'Crear Producto'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManager;
