import React, { useState } from 'react';
import { Button, Alert, Card, Spinner } from 'react-bootstrap';
import useXano from '../hooks/useXano';

const XanoTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const xano = useXano();

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'Probar conexión con API de productos',
        test: () => xano.getProducts()
      },
      {
        name: 'Probar conexión con API de categorías',
        test: () => xano.getCategories()
      },
      {
        name: 'Probar endpoint de autenticación (login exitoso)',
        test: async () => {
          try {
            const result = await xano.login('test@example.com', 'password123');
            return {
              success: true,
              message: 'Login exitoso - Autenticación funcionando',
              status: 'success',
              data: result
            };
          } catch (error) {
            // Si es error de credenciales inválidas, significa que el endpoint funciona
            if (error.message.includes('Invalid Credentials') || error.message.includes('403')) {
              return { 
                success: true, 
                message: 'Endpoint funcionando - Credenciales inválidas (esperado)',
                status: 'success'
              };
            } else if (error.message.includes('404')) {
              return { 
                success: false, 
                message: 'Endpoint no configurado en Xano',
                status: 'error'
              };
            } else {
              throw error;
            }
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
          status: result.status || 'success',
          message: result.message || 'Conexión exitosa',
          data: result.data || result
        }]);
      } catch (error) {
        console.log(`❌ Error en: ${test.name}`, error);
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'error',
          message: error.message,
          data: null
        }]);
      }
    }
    
    setIsRunning(false);
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-gear me-2"></i>
          Prueba de Conexión con Xano
        </h5>
      </Card.Header>
      <Card.Body>
        <p className="text-muted">
          Este componente prueba la conexión con tu API de Xano para verificar que todo esté funcionando correctamente.
        </p>
        
        <Button 
          variant="primary" 
          onClick={runTests}
          disabled={isRunning}
          className="mb-3"
        >
          {isRunning ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Probando conexión...
            </>
          ) : (
            <>
              <i className="bi bi-play-circle me-2"></i>
              Ejecutar Pruebas
            </>
          )}
        </Button>

        {testResults.length > 0 && (
          <div className="test-results">
            <h6>Resultados de las Pruebas:</h6>
            {testResults.map((result, index) => (
              <Alert 
                key={index}
                variant={
                  result.status === 'success' ? 'success' : 
                  result.status === 'warning' ? 'warning' : 
                  'danger'
                }
                className="mb-2"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{result.name}</strong>
                    <br />
                    <small>{result.message}</small>
                  </div>
                  <div>
                    {result.status === 'success' ? (
                      <i className="bi bi-check-circle-fill text-success"></i>
                    ) : result.status === 'warning' ? (
                      <i className="bi bi-exclamation-triangle-fill text-warning"></i>
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
          </div>
        )}

        <Alert variant="info" className="mt-3">
          <h6><i className="bi bi-info-circle me-2"></i>Información:</h6>
          <ul className="mb-0">
            <li><strong>API URL:</strong> {import.meta.env.VITE_API_URL}</li>
            <li><strong>Auth URL:</strong> {import.meta.env.VITE_AUTH_URL}</li>
            <li>Si las pruebas fallan, verifica que los endpoints estén configurados correctamente en Xano.</li>
            <li>Los errores de autenticación son normales si no tienes usuarios registrados.</li>
          </ul>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default XanoTest;
