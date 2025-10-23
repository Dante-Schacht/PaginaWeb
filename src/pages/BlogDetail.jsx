import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { PLACEHOLDER_IMAGE } from '../lib/resolveImage';
import '../styles/pages/Blogs.css';

// Mapeo de imagen local por título (igual que en Blogs.jsx)
const getBlogImageForTitle = (title) => {
  const t = (title || '').toLowerCase();
  if (t.includes('mouse')) return '/img/mouses.png';
  if (t.includes('teclado')) return '/img/teclados.png';
  if (t.includes('monitor')) return '/img/monitores.png';
  if (t.includes('micrófono') || t.includes('microfono')) return '/img/microfonos.png';
  if (t.includes('smartwatch') || t.includes('wearable')) return '/img/smartwatches.png';
  if (t.includes('audífono') || t.includes('audifono') || t.includes('auricular') || t.includes('headset')) return '/img/audifonosInalambricos.jpg';
  return PLACEHOLDER_IMAGE;
};

// Contenido inventado por blog (puedes ajustar textos libremente)
const BLOGS = [
  {
    id: 1,
    title: 'Guía Completa de Mouses Gaming 2024',
    author: 'ElectroVerse Team',
    date: '2024-01-15',
    readTime: '5 min',
    category: 'Gaming',
    content: [
      'La evolución de los mouses gaming en 2024 ha estado marcada por mejoras en sensores ópticos, latencia ultra baja y ergonomía avanzada. Marcas líderes han presentado modelos con 26K DPI reales, aceleración controlada y switches ópticos que prolongan la vida útil.',
      'Si priorizas precisión para shooters, busca sensores de clase 20K+ DPI con tracking estable y polling de 1.000 Hz o superior. Para MOBAs o productividad, el confort y la distribución de botones laterales suele pesar más que el DPI máximo.',
      'En precio, el segmento medio ofrece una relación excelente: inalámbricos con latencia casi imperceptible y autonomía de 60–80 horas. Si eres creador, valora también ruedas con desplazamiento libre y perfiles configurables en memoria interna.'
    ]
  },
  {
    id: 2,
    title: 'Teclados Mecánicos: Todo lo que Necesitas Saber',
    author: 'Tech Expert',
    date: '2024-01-12',
    readTime: '7 min',
    category: 'Hardware',
    content: [
      'Los teclados mecánicos han dejado de ser un nicho para convertirse en estándar de calidad. La elección del switch (lineal, táctil o clicky) define la sensación: los lineales son suaves y silenciosos, los táctiles ofrecen un pequeño bache de confirmación y los clicky priorizan feedback sonoro.',
      'El formato 60%, TKL y completo impacta la postura y el espacio del escritorio. Para juegos competitivos, muchos optan por TKL o 75% para liberar espacio del mouse. Si programas o escribes mucho, un 96% puede dar el equilibrio entre tamaño y teclas dedicadas.',
      'La personalización con keycaps PBT, estabilizadores lubricados y distribución ANSI/ISO permite ajustar ruido y tacto. Considera la conexión triple (USB, 2.4G y Bluetooth) si lo usarás con múltiples dispositivos.'
    ]
  },
  {
    id: 3,
    title: 'Configuración de Monitor para Gaming',
    author: 'Gaming Pro',
    date: '2024-01-10',
    readTime: '6 min',
    category: 'Gaming',
    content: [
      'La clave del monitor gaming es sincronizar tasa de refresco con los FPS reales del juego. Tecnologías como G-Sync y FreeSync eliminan el tearing y mejoran la fluidez visual, especialmente entre 60 y 144 Hz.',
      'Ajusta el brillo y la gamma para evitar negros lavados y blancos sobreexpuestos. En paneles IPS prioriza el ajuste de overdrive para reducir el ghosting sin artefactos. En VA, cuida el blur en escenas oscuras.',
      'Si juegas competitivo, un panel 240 Hz con respuesta de 1 ms y modo de claridad de movimiento puede marcar diferencia. Para inmersión, los 34" ultrawide a 144 Hz con HDR moderado son una excelente opción.'
    ]
  },
  {
    id: 4,
    title: 'Micrófonos para Streaming: Guía 2024',
    author: 'Content Creator',
    date: '2024-01-08',
    readTime: '8 min',
    category: 'Streaming',
    content: [
      'Para streaming, la inteligibilidad de la voz es lo primero. Los micrófonos dinámicos rechazan mejor el ruido ambiente y son ideales para espacios no tratados. Los de condensador capturan más detalle, pero requieren control del entorno.',
      'Una interfaz de audio con preamplificadores limpios y filtros de paso alto mejora el resultado final. Considera brazos articulados y soportes shock mount para reducir vibraciones. La compresión ligera y el de-esser suavizan picos y sibilancias.',
      'No olvides el posicionamiento: a 10–15 cm de la boca, ligeramente en ángulo y con pop filter. Esto reduce plosivas y mantiene la voz centrada sin saturación.'
    ]
  },
  {
    id: 5,
    title: 'Audífonos Gaming: Inalámbricos vs Cableados',
    author: 'Audio Expert',
    date: '2024-01-05',
    readTime: '6 min',
    category: 'Audio',
    content: [
      'Los audífonos gaming inalámbricos han avanzado en latencia y autonomía, ofreciendo libertad de movimiento y múltiples dispositivos. Sin embargo, los cableados aún lideran en consistencia de audio y peso reducido.',
      'Valora el perfil sonoro: un V-shape moderado resalta graves y agudos para juegos, mientras que perfiles más planos ayudan en edición de audio. Los modelos con soporte para Spatial Audio o Dolby Atmos pueden mejorar la percepción direccional.',
      'Si juegas en equipo, presta atención al micrófono: cancelación de ruido efectiva y soporte para filtros en software de chat pueden mejorar notablemente la comunicación.'
    ]
  },
  {
    id: 6,
    title: 'Smartwatches para Deportistas',
    author: 'Fitness Tech',
    date: '2024-01-03',
    readTime: '5 min',
    category: 'Wearables',
    content: [
      'Los smartwatches deportivos han incorporado sensores más precisos de ritmo cardíaco y GPS multibanda. Para running y ciclismo, la precisión del track y el análisis de carga de entrenamiento son esenciales.',
      'La autonomía sigue siendo un factor diferenciador: modelos con modo ahorro extienden la vida útil sin perder métricas básicas. La compatibilidad con plataformas como Strava y Health facilita el análisis y seguimiento.',
      'Si haces triatlón o entrenamientos mixtos, busca perfiles de deporte específicos y métricas de recuperación basadas en HRV para planificar cargas sin sobreentrenar.'
    ]
  }
];

const BlogDetail = () => {
  const { id } = useParams();
  const blogId = Number(id);
  const blog = BLOGS.find(b => b.id === blogId);

  if (!blog) {
    return (
      <div className="blogs-page">
        <Container className="py-5">
          <Row>
            <Col>
              <Card className="p-4">
                <h2 className="mb-3">Artículo no encontrado</h2>
                <p>El artículo que buscas no existe o fue movido.</p>
                <Button as={Link} to="/blogs" variant="primary">Volver al Blog</Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const imgSrc = getBlogImageForTitle(blog.title);

  return (
    <div className="blogs-page">
      <Container className="py-5">
        <Row>
          <Col lg={12}>
            <div className="page-header mb-4">
              <h1 className="page-title">{blog.title}</h1>
              <div className="blog-meta mb-2">
                <span className="blog-author">
                  <i className="bi bi-person"></i> {blog.author}
                </span>
                <span className="blog-date">
                  <i className="bi bi-calendar"></i> {new Date(blog.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="blog-read-time">
                  <i className="bi bi-clock"></i> {blog.readTime}
                </span>
                <Badge bg="secondary" className="ms-2">{blog.category}</Badge>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col lg={12}>
            <Card className="featured-blog-card">
              <div className="featured-blog-image">
                <img 
                  src={imgSrc}
                  alt={blog.title}
                  className="img-fluid h-100"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                />
              </div>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <Card className="p-4">
              {blog.content.map((p, idx) => (
                <p key={idx} className="mb-3" style={{ lineHeight: 1.7 }}>{p}</p>
              ))}
              <div className="d-flex gap-2 mt-3">
                <Button as={Link} to="/blogs" variant="outline-primary">Volver</Button>
                <Button as={Link} to="/productos" variant="primary">Ver Productos Relacionados</Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogDetail;