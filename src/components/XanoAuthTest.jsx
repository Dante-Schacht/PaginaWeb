import React, { useState } from 'react';
import { Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useApp } from '../context/AppContext';

const XanoAuthTest = () => {
  const { user, login, register, logout, isAdmin } = useApp();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runAuthTests = async () => {
    setLoading(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Probar login con admin@electroverse.com',
        test: async () => {
          try {
            const result = await login('admin@electroverse.com', 'admin123456');
            return {
              success: result.success,
              message: result.success ? 'Login exitoso' : result.error,
              data: result
            };
          } catch (error) {
            return {
              success: false,
              message: error.message,
              data: error
            };
          }
        }
      },
      {
        name: 'Verificar datos del usuario',
        test: async () => {
          if (user) {
            return {
              success: true,
              message: `Usuario: ${user.name} (${user.email}) - Rol: ${user.role}`,
              data: user
            };
          } else {
            return {
              success: false,
              message: 'No hay usuario logueado',
              data: null
            };
          }
        }
      },
      {
        name: 'Verificar si es admin',
        test: async () => {
          const admin = isAdmin();
          return {
            success: true,
            message: `Es admin: ${admin}`,
            data: { isAdmin: admin }
          };
        }
      },
      {
        name: 'Probar logout',
        test: async () => {
          try {
            await logout();
            return {
              success: true,
              message: 'Logout exitoso',
              data: null
            };
          } catch (error) {
            return {
              success: false,
              message: error.message,
              data: error
            };
          }
        }
      }
    ];

    for (const test of tests) {
      try {
        console.log(`🧪 Ejecutando: ${test.name}`);
        const result = await test.test();
        setTestResults(prev => [...prev, {
          name: test.name,
          success: result.success,
          message: result.message,
          data: result.data
        }]);
      } catch (error) {
        console.log(`❌ Error en: ${test.name}`, error);
        setTestResults(prev => [...prev, {
          name: test.name,
          success: false,
          message: error.message,
          data: error
        }]);
      }
    }

    setLoading(false);
  };

  return (
    <Container className="py-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header>
              <h4>🧪 Pruebas de Autenticación con Xano</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <Button 
                  variant="primary" 
                  onClick={runAuthTests}
                  disabled={loading}
                >
                  {loading ? 'Ejecutando...' : 'Ejecutar Pruebas de Autenticación'}
                </Button>
              </div>

              {user && (
                <Alert variant="info" className="mb-3">
                  <strong>Usuario actual:</strong> {user.name} ({user.email}) - Rol: {user.role}
                </Alert>
              )}

              {testResults.map((result, index) => (
                <Alert
                  key={index}
                  variant={result.success ? 'success' : 'danger'}
                  className="mb-2"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{result.name}</strong>
                      <br />
                      <small>{result.message}</small>
                    </div>
                    <div>
                      {result.success ? (
                        <i className="bi bi-check-circle-fill text-success"></i>
                      ) : (
                        <i className="bi bi-x-circle-fill text-danger"></i>
                      )}
                    </div>
                  </div>
                  {result.data && (
                    <details className="mt-2">
                      <summary>Ver datos de respuesta</summary>
                      <pre className="mt-2 mb-0">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default XanoAuthTest;
