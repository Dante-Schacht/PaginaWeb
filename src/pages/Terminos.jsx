import React from 'react'
import { Container, Row, Col, Card, Badge } from 'react-bootstrap'

const Terminos = () => {
  const updated = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
  return (
    <div className="terms-page">
      <Container className="py-5">
        <Row>
          <Col lg={12} className="mb-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h1 className="mb-1">Términos y Condiciones</h1>
                <p className="text-muted mb-0">Reglas claras para usar nuestros servicios y comprar en ElectroVerse.</p>
              </div>
              <Badge bg="light" text="dark" className="border">Actualizados: {updated}</Badge>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body>
                <div className="text-muted">
                  <p className="mb-2"><strong>Versión vigente:</strong> {updated}</p>
                  <h5 className="mt-4">Resumen</h5>
                  <ul>
                    <li>ElectroVerse ofrece servicios de comercio electrónico y pago.</li>
                    <li>Las Personas Usuarias pueden comprar productos y recibir despacho.</li>
                    <li>Existen políticas de precios, envíos, devoluciones y garantías.</li>
                    <li>El uso del sitio implica aceptación de estos términos.</li>
                  </ul>

                  <h5 className="mt-4">1. Introducción</h5>
                  <p>Al acceder y utilizar ElectroVerse, aceptas estos Términos y Condiciones. Si no estás de acuerdo con alguna parte, no uses el sitio ni nuestros servicios. Estos términos regulan el acceso, navegación, registro y las operaciones comerciales realizadas dentro de la plataforma.</p>
                  <ul>
                    <li>El uso del sitio implica la lectura y aceptación de esta política.</li>
                    <li>Podremos solicitar aceptación explícita en momentos clave del flujo de compra.</li>
                    <li>La versión vigente se publica y se identifica con su fecha de actualización.</li>
                  </ul>

                  <h5 className="mt-4">2. Definiciones</h5>
                  <p>Para claridad, empleamos las siguientes definiciones en el documento:</p>
                  <ul>
                    <li><strong>ElectroVerse:</strong> plataforma y empresa responsable del servicio.</li>
                    <li><strong>Persona Usuaria:</strong> quien accede al sitio con o sin cuenta.</li>
                    <li><strong>Cliente:</strong> Persona Usuaria que realiza compras en el sitio.</li>
                    <li><strong>Contenido:</strong> textos, imágenes, precios, especificaciones, reseñas y funcionalidades.</li>
                    <li><strong>Servicios:</strong> funcionalidades de navegación, autenticación, compra, pago, despacho y soporte.</li>
                  </ul>

                  <h5 className="mt-4">3. Alcance del servicio</h5>
                  <p>Ofrecemos productos electrónicos y accesorios y servicios asociados.</p>
                  <ul>
                    <li>La publicación de productos no constituye oferta irrevocable; puede ser corregida.</li>
                    <li>Los catálogos, precios y disponibilidad están sujetos a cambios sin previo aviso.</li>
                    <li>Podemos realizar mejoras y ajustes de usabilidad, seguridad y rendimiento.</li>
                  </ul>

                  <h5 className="mt-4">4. Registro y cuenta</h5>
                  <p>Para comprar, debes crear y mantener una cuenta válida.</p>
                  <ul>
                    <li>Eres responsable de la confidencialidad de tus credenciales.</li>
                    <li>Debes mantener tus datos exactos y actualizados.</li>
                    <li>Podremos realizar verificaciones antifraude y suspender cuentas por actividad sospechosa.</li>
                    <li>El acceso simultáneo irregular, el uso de identidades falsas o la cesión no autorizada de la cuenta está prohibido.</li>
                  </ul>

                  <h5 className="mt-4">5. Compras y precios</h5>
                  <p>Los precios se muestran en CLP salvo indicación distinta.</p>
                  <ul>
                    <li>Nos esforzamos por publicar información precisa; pueden existir errores materiales.</li>
                    <li>Si detectamos un error evidente, podremos cancelar la orden y proponer alternativas.</li>
                    <li>Promociones y descuentos tienen vigencia y condiciones específicas.</li>
                    <li>Los precios pueden variar por región, disponibilidad y costos logísticos.</li>
                  </ul>

                  <h5 className="mt-4">6. Pago</h5>
                  <p>Aceptamos métodos mostrados en el checkout y podemos usar pasarelas de pago de terceros.</p>
                  <ul>
                    <li>Las transacciones pueden requerir preautorización y validación adicional.</li>
                    <li>En caso de rechazo bancario o inconsistencias, la orden puede ser cancelada.</li>
                    <li>Reembolsos se procesan por el mismo medio cuando es posible y según plazos de cada proveedor.</li>
                  </ul>

                  <h5 className="mt-4">7. Envío y entrega</h5>
                  <p>Los plazos estimados se informan en el checkout y pueden variar.</p>
                  <ul>
                    <li>La entrega depende de la dirección, disponibilidad y operadores logísticos.</li>
                    <li>Debes proporcionar datos completos y correctos para evitar demoras.</li>
                    <li>Eventos de fuerza mayor pueden afectar las fechas de entrega.</li>
                    <li>El seguimiento, reintentos y retiro en sucursal se gestionan según políticas del operador.</li>
                  </ul>

                  <h5 className="mt-4">8. Devoluciones y garantías</h5>
                  <p>Aplicamos garantías legales y del fabricante según corresponda.</p>
                  <ul>
                    <li>Para devoluciones, contacta soporte con número de orden y motivo.</li>
                    <li>Podremos solicitar evaluación técnica y fotografías del producto.</li>
                    <li>El producto debe incluir accesorios, empaques y estar en buen estado salvo fallas técnicas.</li>
                    <li>Los plazos y condiciones pueden variar por categoría y marca.</li>
                  </ul>

                  <h5 className="mt-4">9. Responsabilidad</h5>
                  <p>El sitio se ofrece “tal cual”. No garantizamos disponibilidad ininterrumpida ni ausencia total de errores.</p>
                  <ul>
                    <li>La responsabilidad se limita al monto pagado por el producto relacionado.</li>
                    <li>No somos responsables por daños indirectos, lucro cesante o pérdida de datos.</li>
                    <li>Las recomendaciones técnicas y de compatibilidad son orientativas.</li>
                  </ul>

                  <h5 className="mt-4">10. Propiedad intelectual</h5>
                  <p>Todo el contenido del sitio es propiedad de ElectroVerse o licenciatarios y está protegido por la normativa vigente.</p>
                  <ul>
                    <li>No puedes copiar, modificar, distribuir ni reutilizar el contenido sin autorización.</li>
                    <li>Las marcas y logos exhibidos no confieren licencia de uso.</li>
                  </ul>

                  <h5 className="mt-4">11. Uso aceptable</h5>
                  <p>Se prohíbe el uso del sitio para actividades que afecten la seguridad, integridad o experiencia de otros.</p>
                  <ul>
                    <li>Intentos de intrusión, explotación de vulnerabilidades o ingeniería inversa.</li>
                    <li>Automatización abusiva, scraping masivo o saturación de servicios.</li>
                    <li>Publicación de contenidos ilícitos, difamatorios o que vulneren derechos de terceros.</li>
                  </ul>

                  <h5 className="mt-4">12. Terminación</h5>
                  <p>Podemos suspender o cancelar cuentas ante incumplimientos o actividades sospechosas.</p>
                  <ul>
                    <li>Fraude, suplantación, uso indebido de medios de pago.</li>
                    <li>Incumplimiento reiterado de políticas de compra, envío y devoluciones.</li>
                    <li>Requerimientos legales o regulatorios.</li>
                  </ul>

                  <h5 className="mt-4">13. Modificaciones</h5>
                  <p>Podemos actualizar estos términos por razones operativas, tecnológicas o regulatorias y publicaremos la versión vigente.</p>
                  <ul>
                    <li>En cambios relevantes, informaremos con anticipación razonable cuando corresponda.</li>
                    <li>Las modificaciones no afectan retrospectivamente operaciones ya finalizadas.</li>
                  </ul>

                  <h5 className="mt-4">14. Ley aplicable y jurisdicción</h5>
                  <p>Estos términos se rigen por las leyes de Chile.</p>
                  <ul>
                    <li>Las controversias se someterán a los tribunales competentes, salvo acuerdos alternativos.</li>
                    <li>La nulidad de una cláusula no afectará la validez del resto.</li>
                  </ul>

                  <h5 className="mt-4">15. Contacto</h5>
                  <p>Si tienes preguntas sobre estos términos, escribe a legal@electroverse.cl.</p>
                  <ul>
                    <li>Incluye tu nombre completo y medio de contacto.</li>
                    <li>Adjunta número de orden si tu consulta está relacionada con una compra.</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Terminos
