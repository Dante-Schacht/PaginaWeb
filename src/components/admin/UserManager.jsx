import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal, Alert, Badge, Table } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import useXano from '../../hooks/useXano';
import xanoAPI from '../../config/xano';

const UserManager = () => {
  const { user } = useApp();
  const xano = useXano();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'user',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener token del usuario actual
      const token = localStorage.getItem('electroverse-token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      // Cargar usuarios reales desde Xano
      try {
        console.log('Cargando usuarios desde Xano...');
        const usersData = await xanoAPI.getUsers({}, token);
        
        console.log('Datos de usuarios recibidos:', usersData);
        
        if (usersData && Array.isArray(usersData)) {
          setUsers(usersData);
          setError(null);
          console.log('Usuarios cargados exitosamente:', usersData.length);
          return;
        } else if (usersData && usersData.items && Array.isArray(usersData.items)) {
          setUsers(usersData.items);
          setError(null);
          console.log('Usuarios cargados exitosamente (con paginación):', usersData.items.length);
          return;
        } else {
          console.log('Formato de datos inesperado:', usersData);
          setError('Formato de datos inesperado del servidor');
          setUsers([]);
          return;
        }
      } catch (apiError) {
        console.error('Error al cargar usuarios desde Xano:', apiError);
        
        // Si es error 401, el token puede estar expirado
        if (apiError.message.includes('401')) {
          setError('Error de autenticación. Por favor, inicia sesión nuevamente.');
        } else if (apiError.message.includes('404')) {
          setError('Endpoint de usuarios no encontrado. Verifica la configuración de Xano.');
        } else {
          setError('Error al cargar usuarios: ' + apiError.message);
        }
        setUsers([]);
      }
      
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error al cargar usuarios: ' + error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Obtener token del usuario actual
      const token = localStorage.getItem('electroverse-token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      if (editingUser) {
        // Actualizar usuario existente
        try {
          await xanoAPI.updateUser(editingUser.id, formData, token);
          setSuccess('Usuario actualizado correctamente');
        } catch (updateError) {
          console.log('Endpoint de actualización no disponible:', updateError);
          setError('Funcionalidad de actualización no disponible. El endpoint no está configurado en Xano.');
          return;
        }
      } else {
        // Crear nuevo usuario
        try {
          const userData = {
            ...formData,
            password_confirmation: formData.password
          };
          await xanoAPI.createUser(userData, token);
          setSuccess('Usuario creado correctamente');
        } catch (createError) {
          console.log('Endpoint de creación no disponible:', createError);
          setError('Funcionalidad de creación no disponible. El endpoint POST /user no está configurado en Xano.');
          return;
        }
      }

      // Recargar usuarios
      await loadUsers();
      
      // Limpiar formulario
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'user',
        is_active: true
      });
      setEditingUser(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Error al guardar el usuario: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      password: '', // No mostrar contraseña existente
      role: user.role || 'user',
      is_active: user.is_active !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener token del usuario actual
        const token = localStorage.getItem('electroverse-token');
        if (!token) {
          throw new Error('No hay token de autenticación');
        }
        
        // Eliminar usuario desde Xano
        await xanoAPI.deleteUser(userId, token);
        setSuccess('Usuario eliminado correctamente');
        await loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Error al eliminar el usuario: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { variant: 'danger', text: 'Administrador' },
      vendedor: { variant: 'warning', text: 'Vendedor' },
      user: { variant: 'primary', text: 'Usuario' }
    };
    
    const config = roleConfig[role] || roleConfig.user;
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="user-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="bi bi-people me-2"></i>
          Gestión de Usuarios
        </h4>
        <Button 
          variant="primary"
          onClick={() => {
            setEditingUser(null);
            setFormData({
              first_name: '',
              last_name: '',
              email: '',
              password: '',
              role: 'user',
              is_active: true
            });
            setShowModal(true);
          }}
        >
          <i className="bi bi-person-plus me-1"></i>
          Agregar Usuario
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
              <p className="mt-2">Cargando usuarios...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Fecha de Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div>
                          <strong>{user.first_name} {user.last_name}</strong>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>
                        <Badge bg={user.is_active ? 'success' : 'secondary'}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td>
                        {new Date(user.created_at).toLocaleDateString('es-CL')}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(user)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.id === 1} // No permitir eliminar al admin principal
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

      {/* Modal para agregar/editar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido *</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Contraseña {editingUser ? '(dejar vacío para mantener la actual)' : '*'}
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña del usuario'}
                required={!editingUser}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rol *</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="user">Usuario</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="admin">Administrador</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="is_active"
                    value={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : (editingUser ? 'Actualizar' : 'Crear')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManager;
