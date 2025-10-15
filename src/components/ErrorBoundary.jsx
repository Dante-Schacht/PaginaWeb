import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Registra el error
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>
              <i className="bi bi-exclamation-triangle me-2"></i>
              ¡Oops! Algo salió mal
            </Alert.Heading>
            <p>
              La aplicación encontró un error inesperado. Por favor, intenta recargar la página.
            </p>
            <hr />
            <div className="d-flex justify-content-center gap-2">
              <Button variant="outline-danger" onClick={this.handleReset}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Intentar de nuevo
              </Button>
              <Button variant="danger" onClick={this.handleReload}>
                <i className="bi bi-arrow-repeat me-1"></i>
                Recargar página
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-3">
                <summary>Detalles del error (solo en desarrollo)</summary>
                <pre className="mt-2 text-start">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
