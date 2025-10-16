import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import useXano from '../hooks/useXano';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/Productos.css';

const Productos = () => {
  const { products, loading, setLoading, setProducts, categories, productsLoaded } = useApp();
  const xano = useXano();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Cargar productos desde Xano
    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log('Productos.jsx: Cargando productos...');
        const productsData = await xano.getProducts();
        console.log('Productos.jsx: Productos cargados:', productsData);
        setProducts(productsData);
      } catch (error) {
        console.error('Productos.jsx: Error loading products from Xano:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Solo cargar si no hay productos cargados
    if (!productsLoaded) {
      loadProducts();
    }
  }, [setLoading, setProducts, xano, productsLoaded]);


  // Leer parámetros de la URL y aplicar filtro automáticamente
  useEffect(() => {
    const categoriaParam = searchParams.get('categoria');
    if (categoriaParam) {
      // Mapear el parámetro de la URL a la categoría correcta
      const categoriaMap = {
        'mouse': 'Mouse',
        'teclado': 'Teclado',
        'microfono': 'Micrófono',
        'monitor': 'Monitor',
        'audifono': 'Audífono',
        'parlante': 'Parlante',
        'televisor': 'Televisor',
        'telefono': 'Teléfono',
        'smartwatch': 'Smartwatch'
      };
      const categoria = categoriaMap[categoriaParam];
      if (categoria) {
        setSelectedCategory(categoria);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    console.log('Productos.jsx: Products from context:', products);
    console.log('Productos.jsx: selectedCategory:', selectedCategory);
    console.log('Productos.jsx: searchTerm:', searchTerm);
    console.log('Productos.jsx: sortBy:', sortBy);
    
    let filtered = products;

    // Filtrar por categoría
    if (selectedCategory) {
      console.log('Productos.jsx: Filtrando por categoría:', selectedCategory);
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      console.log('Productos.jsx: Productos después de filtrar por categoría:', filtered);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      console.log('Productos.jsx: Filtrando por término de búsqueda:', searchTerm);
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('Productos.jsx: Productos después de filtrar por búsqueda:', filtered);
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

    console.log('Productos.jsx: Productos finales filtrados:', filtered);
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
