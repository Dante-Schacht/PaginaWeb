import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/Productos.css';

const Productos = () => {
  const { products, loading, setLoading, setProducts, categories } = useApp();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Solo cargar productos si no hay productos en el contexto
    if (products.length === 0) {
      setLoading(true);
      setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: 'Logitech G Pro X Superlight',
          price: 149990,
          originalPrice: 179990,
          image: '/ImagenHome.png',
          category: 'Mouses',
          description: 'Mouse gaming ultra ligero de 63g con sensor HERO 25K y 70 horas de batería',
          rating: 4.9,
          reviews: 2847,
          discount: 17,
          isNew: false,
          brand: 'Logitech'
        },
        {
          id: 2,
          name: 'Razer Huntsman Mini',
          price: 99990,
          originalPrice: 119990,
          image: '/ImagenHome.png',
          category: 'Teclados',
          description: 'Teclado mecánico compacto 60% con switches Razer Clicky y retroiluminación RGB',
          rating: 4.7,
          reviews: 1923,
          discount: 17,
          isNew: false,
          brand: 'Razer'
        },
        {
          id: 3,
          name: 'Sony WH-1000XM5',
          price: 399990,
          originalPrice: 449990,
          image: '/ImagenHome.png',
          category: 'Audífonos',
          description: 'Audífonos inalámbricos con cancelación de ruido líder en la industria',
          rating: 4.8,
          reviews: 3456,
          discount: 11,
          isNew: true,
          brand: 'Sony'
        },
        {
          id: 4,
          name: 'Apple AirPods Pro 2',
          price: 249990,
          originalPrice: 279990,
          image: '/ImagenHome.png',
          category: 'Audífonos',
          description: 'Earbuds inalámbricos con cancelación activa de ruido y audio espacial',
          rating: 4.6,
          reviews: 4123,
          discount: 11,
          isNew: true,
          brand: 'Apple'
        },
        {
          id: 5,
          name: 'Samsung Galaxy Watch 5 Pro',
          price: 449990,
          originalPrice: 499990,
          image: '/ImagenHome.png',
          category: 'Smartwatches',
          description: 'Smartwatch premium con GPS, monitor de salud avanzado y batería de larga duración',
          rating: 4.5,
          reviews: 1876,
          discount: 10,
          isNew: false,
          brand: 'Samsung'
        },
        {
          id: 6,
          name: 'Blue Yeti USB Microphone',
          price: 129990,
          originalPrice: 149990,
          image: '/ImagenHome.png',
          category: 'Micrófonos',
          description: 'Micrófono USB de condensador con 4 patrones de captación para streaming y podcasting',
          rating: 4.7,
          reviews: 2156,
          discount: 13,
          isNew: false,
          brand: 'Blue'
        },
        {
          id: 7,
          name: 'ASUS ROG Swift PG27UQ',
          price: 899990,
          originalPrice: 1099990,
          image: '/ImagenHome.png',
          category: 'Monitores',
          description: 'Monitor gaming 4K 27" con 144Hz, HDR y G-Sync Ultimate',
          rating: 4.8,
          reviews: 987,
          discount: 18,
          isNew: false,
          brand: 'ASUS'
        },
        {
          id: 8,
          name: 'Corsair K100 RGB',
          price: 199990,
          originalPrice: 229990,
          image: '/ImagenHome.png',
          category: 'Teclados',
          description: 'Teclado mecánico gaming con switches Cherry MX Speed y retroiluminación RGB',
          rating: 4.6,
          reviews: 1456,
          discount: 13,
          isNew: true,
          brand: 'Corsair'
        }
      ];
        // Pasar los productos al contexto global
        setProducts(mockProducts);
        setLoading(false);
      }, 1000);
    }
  }, [setLoading, setProducts, products.length]);

  // Leer parámetros de la URL y aplicar filtro automáticamente
  useEffect(() => {
    const categoriaParam = searchParams.get('categoria');
    if (categoriaParam) {
      // Mapear el parámetro de la URL a la categoría correcta
      const categoriaMap = {
        'mouses': 'Mouses',
        'teclados': 'Teclados',
        'microfonos': 'Micrófonos',
        'monitores': 'Monitores',
        'audifonos': 'Audífonos',
        'smartwatches': 'Smartwatches'
      };
      const categoria = categoriaMap[categoriaParam];
      if (categoria) {
        setSelectedCategory(categoria);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    console.log('Products from context:', products);
    let filtered = products;

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar productos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    console.log('Filtered products:', filtered);
    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy, searchTerm]);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  return (
    <div className="productos-page">
      <Container className="py-5">
        <Row>
          <Col lg={12}>
            <div className="page-header mb-5">
              <h1 className="page-title">Nuestros Productos</h1>
              <p className="page-subtitle">
                Descubre nuestra amplia gama de productos electrónicos de alta calidad
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Filtros Sidebar */}
          <Col lg={3} className="mb-4">
            <div className="filters-sidebar">
              <h5 className="filters-title">Filtros</h5>
              
              {/* Búsqueda */}
              <div className="filter-group mb-4">
                <Form.Label>Buscar</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Categorías */}
              <div className="filter-group mb-4">
                <Form.Label>Categorías</Form.Label>
                <div className="category-filters">
                  <Button
                    variant={selectedCategory === '' ? 'primary' : 'outline-secondary'}
                    size="sm"
                    className="category-filter-btn"
                    onClick={() => handleCategoryFilter('')}
                  >
                    Todas
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.name ? 'primary' : 'outline-secondary'}
                      size="sm"
                      className="category-filter-btn"
                      onClick={() => handleCategoryFilter(category.name)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Ordenar */}
              <div className="filter-group">
                <Form.Label>Ordenar por</Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Nombre A-Z</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="rating">Mejor Valorados</option>
                </Form.Select>
              </div>
            </div>
          </Col>

          {/* Productos */}
          <Col lg={9}>
            <div className="products-section">
              <div className="products-header mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="products-count">
                    {filteredProducts.length} productos encontrados
                    {selectedCategory && (
                      <span className="text-muted ms-2">
                        en la categoría <strong>{selectedCategory}</strong>
                      </span>
                    )}
                  </h5>
                  {selectedCategory && (
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg="primary" className="selected-category-badge">
                        {selectedCategory}
                      </Badge>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => setSelectedCategory('')}
                      >
                        <i className="bi bi-x"></i> Limpiar
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {loading ? (
                <LoadingSpinner text="Cargando productos..." />
              ) : filteredProducts.length === 0 ? (
                <div className="no-products text-center py-5">
                  <i className="bi bi-search display-1 text-muted"></i>
                  <h4 className="text-muted">No se encontraron productos</h4>
                  <p className="text-muted">Intenta ajustar tus filtros de búsqueda</p>
                </div>
              ) : (
                <Row>
                  {filteredProducts.map(product => (
                    <Col lg={4} md={6} key={product.id} className="mb-4">
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Productos;
