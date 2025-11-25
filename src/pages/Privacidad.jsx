import React from 'react'
import { Container, Row, Col, Card, Badge } from 'react-bootstrap'

const Privacidad = () => {
  const updated = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
  return (
    <div className="privacy-page">
      <Container className="py-5">
        <Row>
          <Col lg={12} className="mb-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h1 className="mb-1">Política de Privacidad</h1>
                <p className="text-muted mb-0">Protegemos tus datos con transparencia y seguridad.</p>
              </div>
              <Badge bg="light" text="dark" className="border">Actualizada: {updated}</Badge>
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
                    <li>Recopilamos datos para ofrecer y mejorar el servicio.</li>
                    <li>Usamos, conservamos y protegemos tus datos conforme a esta política.</li>
                    <li>Compartimos datos con proveedores bajo contrato y medidas de seguridad.</li>
                    <li>Respetamos tus derechos: acceso, rectificación, cancelación, oposición, limitación y portabilidad.</li>
                  </ul>

                  <h5 className="mt-4">1. Introducción</h5>
                  <p>ElectroVerse respeta tu privacidad y se compromete a proteger la información personal que nos confías. Esta política explica qué datos recopilamos, cómo los usamos, con quién los compartimos, cuánto tiempo los conservamos y qué derechos tienes.</p>
                  <ul>
                    <li>La presente política aplica a la web, procesos de compra y soporte.</li>
                    <li>Publicamos la versión vigente con su fecha de actualización.</li>
                  </ul>

                  <h5 className="mt-4">2. Responsable del tratamiento</h5>
                  <p>ElectroVerse SpA, Chile. Contacto: privacidad@electroverse.cl.</p>
                  <ul>
                    <li>Gestionamos datos como responsables y seleccionamos encargados con garantías adecuadas.</li>
                    <li>Establecemos acuerdos de procesamiento con proveedores.</li>
                  </ul>

                  <h5 className="mt-4">3. Datos que recolectamos</h5>
                  <ul>
                    <li>Identificación: nombre, email, teléfono.</li>
                    <li>Cuenta: credenciales de acceso y preferencias.</li>
                    <li>Compras: productos, importes, métodos de pago, dirección de despacho.</li>
                    <li>Soporte: mensajes y comunicaciones.</li>
                    <li>Técnicos: uso del sitio, cookies, IP, dispositivo, navegador.</li>
                  </ul>

                  <h5 className="mt-4">4. Finalidades del tratamiento</h5>
                  <ul>
                    <li>Gestionar cuenta y autenticación.</li>
                    <li>Procesar compras, pagos y despachos.</li>
                    <li>Brindar soporte y atención al cliente.</li>
                    <li>Enviar comunicaciones relevantes sobre pedidos.</li>
                    <li>Mejorar el sitio, seguridad y prevenir fraude.</li>
                    <li>Marketing opcional si otorgas consentimiento.</li>
                  </ul>

                  <h5 className="mt-4">5. Base legal</h5>
                  <ul>
                    <li>Contrato: necesario para completar compras.</li>
                    <li>Consentimiento: comunicaciones comerciales y cookies no esenciales.</li>
                    <li>Interés legítimo: seguridad, mejora del servicio y prevención de abuso.</li>
                    <li>Obligación legal: requisitos contables y tributarios.</li>
                  </ul>

                  <h5 className="mt-4">6. Conservación</h5>
                  <p>Conservamos tus datos sólo el tiempo necesario para las finalidades y obligaciones legales.</p>
                  <ul>
                    <li>Una vez cumplidos los plazos, anonimizamos o eliminamos de forma segura.</li>
                    <li>Los plazos pueden variar por tipo de dato y exigencias regulatorias.</li>
                  </ul>

                  <h5 className="mt-4">7. Derechos</h5>
                  <p>Puedes ejercer acceso, rectificación, cancelación, oposición, limitación y portabilidad.</p>
                  <ul>
                    <li>Solicita a privacidad@electroverse.cl desde el email asociado a tu cuenta.</li>
                    <li>Podemos pedir verificación de identidad para proteger tu información.</li>
                  </ul>

                  <h5 className="mt-4">8. Cookies y tecnologías similares</h5>
                  <p>Usamos cookies necesarias y, con tu consentimiento, analíticas y de preferencia.</p>
                  <ul>
                    <li>Puedes configurar o revocar tu consentimiento desde el navegador.</li>
                    <li>Las cookies ayudan a recordar tu sesión y mejorar la experiencia.</li>
                  </ul>

                  <h5 className="mt-4">9. Compartición con terceros</h5>
                  <p>Compartimos datos con proveedores que nos ayudan a operar el servicio.</p>
                  <ul>
                    <li>Pasarelas de pago, logística, soporte y alojamiento.</li>
                    <li>Procesan datos bajo nuestras instrucciones y con medidas de seguridad.</li>
                  </ul>

                  <h5 className="mt-4">10. Transferencias internacionales</h5>
                  <p>Si un proveedor procesa datos fuera de tu país, aplicamos salvaguardias adecuadas.</p>
                  <ul>
                    <li>Contratos y estándares reconocidos para protección equivalente.</li>
                    <li>Evaluación de riesgo y medidas complementarias cuando corresponda.</li>
                  </ul>

                  <h5 className="mt-4">11. Seguridad</h5>
                  <p>Aplicamos controles técnicos y organizativos para proteger tus datos contra acceso no autorizado, pérdida o alteración.</p>
                  <ul>
                    <li>Recomendaciones: contraseñas robustas y dispositivos actualizados.</li>
                    <li>Ningún sistema es infalible; respondemos ante incidentes conforme a la ley.</li>
                  </ul>

                  <h5 className="mt-4">12. Menores de edad</h5>
                  <p>Los servicios no están dirigidos a menores sin autorización.</p>
                  <ul>
                    <li>Si detectamos datos de menores sin consentimiento, los eliminaremos.</li>
                  </ul>

                  <h5 className="mt-4">13. Cambios a esta política</h5>
                  <p>Podemos actualizar esta política para reflejar mejoras o cambios regulatorios.</p>
                  <ul>
                    <li>Publicamos la versión vigente con su fecha de actualización.</li>
                    <li>Informaremos cambios relevantes cuando corresponda.</li>
                  </ul>

                  <h5 className="mt-4">14. Contacto</h5>
                  <p>Para consultas de privacidad, escríbenos a privacidad@electroverse.cl.</p>
                  <ul>
                    <li>Incluye información suficiente para verificar tu identidad.</li>
                    <li>Si deseas ejercer tus derechos, indica el tipo de solicitud.</li>
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

export default Privacidad
