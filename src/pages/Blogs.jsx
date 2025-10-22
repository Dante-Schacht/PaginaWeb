import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/Blogs.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de blogs
    setTimeout(() => {
      const mockBlogs = [
        {
          id: 1,
          title: 'Guía Completa de Mouses Gaming 2024',
          excerpt: 'Descubre los mejores mouses gaming del mercado y cómo elegir el perfecto para tu setup.',
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop&crop=center',
          author: 'ElectroVerse Team',
          date: '2024-01-15',
          readTime: '5 min',
          category: 'Gaming',
          featured: true
        },
        {
          id: 2,
          title: 'Teclados Mecánicos: Todo lo que Necesitas Saber',
          excerpt: 'Una guía completa sobre switches, tipos de teclados mecánicos y recomendaciones.',
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop&crop=center',
          author: 'Tech Expert',
          date: '2024-01-12',
          readTime: '7 min',
          category: 'Hardware'
        },
        {
          id: 3,
          title: 'Configuración de Monitor para Gaming',
          excerpt: 'Optimiza tu experiencia gaming con la configuración perfecta de monitores.',
          image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop&crop=center',
          author: 'Gaming Pro',
          date: '2024-01-10',
          readTime: '6 min',
          category: 'Gaming'
        },
        {
          id: 4,
          title: 'Micrófonos para Streaming: Guía 2024',
          excerpt: 'Los mejores micrófonos para streamers y content creators.',
          image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop&crop=center',
          author: 'Content Creator',
          date: '2024-01-08',
          readTime: '8 min',
          category: 'Streaming'
        },
        {
          id: 5,
          title: 'Audífonos Gaming: Inalámbricos vs Cableados',
          excerpt: 'Comparativa detallada entre audífonos gaming inalámbricos y cableados.',
          image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&h=600&fit=crop&crop=center',
          author: 'Audio Expert',
          date: '2024-01-05',
          readTime: '6 min',
          category: 'Audio'
        },
        {
          id: 6,
          title: 'Smartwatches para Deportistas',
          excerpt: 'Los mejores smartwatches para monitorear tu actividad física.',
          image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&h=600&fit=crop&crop=center',
          author: 'Fitness Tech',
          date: '2024-01-03',
          readTime: '5 min',
          category: 'Wearables'
        }
      ];
      setBlogs(mockBlogs);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredBlog = blogs.find(blog => blog.featured);
  const regularBlogs = blogs.filter(blog => !blog.featured);

  return (
    <div className="blogs-page">
      <Container className="py-5">
        <Row>
          <Col lg={12}>
            <div className="page-header mb-5">
              <h1 className="page-title">Blog ElectroVerse</h1>
              <p className="page-subtitle">
                Mantente al día con las últimas tendencias en tecnología y gaming
              </p>
            </div>
          </Col>
        </Row>

        {loading ? (
          <LoadingSpinner text="Cargando artículos del blog..." />
        ) : (
          <>
            {/* Featured Blog */}
            {featuredBlog && (
              <Row className="mb-5">
                <Col lg={12}>
                  <Card className="featured-blog-card">
                    <Row className="g-0">
                      <Col md={6}>
                        <div className="featured-blog-image">
                          <img 
                            src={featuredBlog.image} 
                            alt={featuredBlog.title}
                            className="img-fluid h-100"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <Card.Body className="featured-blog-content">
                          <div className="featured-badge mb-2">
                            <Badge bg="primary">Destacado</Badge>
                          </div>
                          <Card.Title className="featured-blog-title">
                            {featuredBlog.title}
                          </Card.Title>
                          <Card.Text className="featured-blog-excerpt">
                            {featuredBlog.excerpt}
                          </Card.Text>
                          <div className="blog-meta mb-3">
                            <span className="blog-author">
                              <i className="bi bi-person"></i> {featuredBlog.author}
                            </span>
                            <span className="blog-date">
                              <i className="bi bi-calendar"></i> {formatDate(featuredBlog.date)}
                            </span>
                            <span className="blog-read-time">
                              <i className="bi bi-clock"></i> {featuredBlog.readTime}
                            </span>
                          </div>
                          <Button variant="primary" size="lg">
                            Leer Más
                          </Button>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            )}

            {/* Regular Blogs */}
            <Row>
              <Col lg={12}>
                <h3 className="section-title mb-4">Últimos Artículos</h3>
              </Col>
            </Row>
            
            <Row>
              {regularBlogs.map(blog => (
                <Col lg={4} md={6} key={blog.id} className="mb-4">
                  <Card className="blog-card h-100">
                    <div className="blog-image-container">
                      <Card.Img 
                        variant="top" 
                        src={blog.image} 
                        alt={blog.title}
                        className="blog-image"
                      />
                      <Badge bg="secondary" className="blog-category-badge">
                        {blog.category}
                      </Badge>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="blog-title">
                        {blog.title}
                      </Card.Title>
                      <Card.Text className="blog-excerpt">
                        {blog.excerpt}
                      </Card.Text>
                      <div className="blog-meta mb-3">
                        <span className="blog-author">
                          <i className="bi bi-person"></i> {blog.author}
                        </span>
                        <span className="blog-date">
                          <i className="bi bi-calendar"></i> {formatDate(blog.date)}
                        </span>
                        <span className="blog-read-time">
                          <i className="bi bi-clock"></i> {blog.readTime}
                        </span>
                      </div>
                      <Button variant="outline-primary" className="mt-auto">
                        Leer Más
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Blogs;
