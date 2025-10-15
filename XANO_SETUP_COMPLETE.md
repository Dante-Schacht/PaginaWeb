# Configuración Completa de Xano para ElectroVerse

## 🗄️ **Paso 1: Crear Tablas en Xano**

### **Tabla: `users`**
```sql
- id (Auto-increment, Primary Key)
- email (Text, unique, required)
- password (Text, hashed, required)
- first_name (Text, required)
- last_name (Text, required)
- phone (Text, nullable)
- role (Text, default: 'user') -- 'admin', 'user', 'vendedor'
- avatar (Text, nullable) -- URL de imagen
- is_active (Boolean, default: true)
- email_verified (Boolean, default: false)
- created_at (DateTime, auto)
- updated_at (DateTime, auto)
- last_login (DateTime, nullable)
```

### **Tabla: `user_sessions`** (Opcional - para manejo de sesiones)
```sql
- id (Auto-increment, Primary Key)
- user_id (Integer, Foreign Key to users)
- token (Text, unique)
- expires_at (DateTime)
- created_at (DateTime, auto)
```

## 🔧 **Paso 2: Configurar Variables de Entorno**

Crea un archivo `.env` en la raíz de tu proyecto:

```env
# Configuración de Xano
REACT_APP_XANO_BASE_URL=https://tu-workspace.xano.io/api:tu-api-group
REACT_APP_XANO_API_KEY=tu-api-key-opcional

# Configuración de la aplicación
REACT_APP_APP_NAME=ElectroVerse
REACT_APP_APP_VERSION=1.0.0
REACT_APP_APP_URL=http://localhost:3000

# Configuración de desarrollo
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=info
```

## 🛠️ **Paso 3: Crear Endpoints en Xano**

### **Autenticación**
1. **POST /auth/login**
   - Input: `{ email, password }`
   - Output: `{ success: true, data: { user, access_token, refresh_token } }`

2. **POST /auth/register**
   - Input: `{ first_name, last_name, email, password, role }`
   - Output: `{ success: true, data: { user, access_token, refresh_token } }`

3. **POST /auth/logout**
   - Headers: `Authorization: Bearer {token}`
   - Output: `{ success: true, message: "Logged out successfully" }`

4. **GET /auth/profile**
   - Headers: `Authorization: Bearer {token}`
   - Output: `{ success: true, data: { user } }`

5. **PUT /auth/update-profile**
   - Headers: `Authorization: Bearer {token}`
   - Input: `{ first_name, last_name, phone, avatar }`
   - Output: `{ success: true, data: { user } }`

6. **POST /auth/change-password**
   - Headers: `Authorization: Bearer {token}`
   - Input: `{ current_password, new_password }`
   - Output: `{ success: true, message: "Password changed successfully" }`

7. **POST /auth/forgot-password**
   - Input: `{ email }`
   - Output: `{ success: true, message: "Reset email sent" }`

8. **POST /auth/reset-password**
   - Input: `{ token, password }`
   - Output: `{ success: true, message: "Password reset successfully" }`

9. **POST /auth/verify-email**
   - Input: `{ token }`
   - Output: `{ success: true, message: "Email verified successfully" }`

10. **POST /auth/refresh**
    - Input: `{ refresh_token }`
    - Output: `{ success: true, data: { access_token, refresh_token } }`

## 🎯 **Paso 4: Configurar CORS en Xano**

1. Ve a tu workspace de Xano
2. Settings > API
3. Habilita CORS
4. Agrega tu dominio local: `http://localhost:3000`
5. Para producción, agrega tu dominio: `https://tu-dominio.com`

## 🔐 **Paso 5: Configurar Autenticación JWT**

En Xano, configura:
1. **JWT Secret**: Una clave secreta fuerte
2. **Token Expiration**: 24 horas para access token
3. **Refresh Token Expiration**: 30 días
4. **Algorithm**: HS256

## 📊 **Paso 6: Datos de Ejemplo**

### **Usuarios de Prueba**
```json
[
  {
    "first_name": "Admin",
    "last_name": "User",
    "email": "admin@electroverse.com",
    "password": "admin123",
    "role": "admin"
  },
  {
    "first_name": "Vendedor",
    "last_name": "User",
    "email": "vendedor@electroverse.com",
    "password": "vendedor123",
    "role": "vendedor"
  },
  {
    "first_name": "Usuario",
    "last_name": "Normal",
    "email": "user@electroverse.com",
    "password": "user123",
    "role": "user"
  }
]
```

## 🧪 **Paso 7: Probar la Integración**

### **1. Verificar Configuración**
```javascript
// En la consola del navegador
console.log('Xano URL:', process.env.REACT_APP_XANO_BASE_URL);
```

### **2. Probar Login**
1. Ve a `/login`
2. Usa las credenciales de prueba
3. Verifica que se redirija a la página principal
4. Verifica que el header muestre el nombre del usuario

### **3. Probar Registro**
1. Ve a `/register`
2. Completa el formulario
3. Verifica que se cree el usuario
4. Verifica que se inicie sesión automáticamente

### **4. Probar Roles**
```javascript
// En la consola del navegador
const { isAdmin, isVendedor, hasRole } = useApp();
console.log('Is Admin:', isAdmin());
console.log('Is Vendedor:', isVendedor());
console.log('Has Role User:', hasRole('user'));
```

## 🚀 **Paso 8: Funcionalidades por Rol**

### **Usuario Normal (role: 'user')**
- ✅ Ver productos
- ✅ Agregar al carrito
- ✅ Realizar compras
- ✅ Ver su perfil
- ✅ Actualizar perfil

### **Vendedor (role: 'vendedor')**
- ✅ Todas las funciones de usuario
- ✅ Ver estadísticas de ventas
- ✅ Gestionar productos (futuro)
- ✅ Ver órdenes de clientes

### **Admin (role: 'admin')**
- ✅ Todas las funciones de vendedor
- ✅ Gestionar usuarios
- ✅ Gestionar productos
- ✅ Ver todas las estadísticas
- ✅ Configurar sistema

## 🔧 **Paso 9: Optimizaciones**

### **Cache de Tokens**
Los tokens se almacenan automáticamente en localStorage y se refrescan cuando es necesario.

### **Manejo de Errores**
Todos los errores se manejan de forma consistente con mensajes de usuario amigables.

### **Seguridad**
- Contraseñas hasheadas en el servidor
- Tokens JWT seguros
- Validación de entrada
- CORS configurado

## 📱 **Paso 10: Testing**

### **Casos de Prueba**
1. **Login exitoso** con credenciales válidas
2. **Login fallido** con credenciales inválidas
3. **Registro exitoso** con datos válidos
4. **Registro fallido** con email duplicado
5. **Logout** y limpieza de datos
6. **Actualización de perfil**
7. **Cambio de contraseña**
8. **Recuperación de contraseña**

### **Verificar en Red**
- Abre DevTools > Network
- Verifica que las peticiones lleguen a Xano
- Verifica que las respuestas sean correctas
- Verifica que los tokens se manejen correctamente

## 🆘 **Solución de Problemas**

### **Error: "Network Error"**
- Verifica la URL de Xano
- Verifica que CORS esté configurado
- Verifica que el endpoint exista

### **Error: "Unauthorized"**
- Verifica que el token sea válido
- Verifica que el usuario esté activo
- Verifica que el rol sea correcto

### **Error: "Token Expired"**
- El sistema debería refrescar automáticamente
- Si no funciona, el usuario debe hacer login nuevamente

## 📞 **Soporte**

Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica la configuración de Xano
3. Revisa los logs del servidor
4. Consulta la documentación de Xano: [docs.xano.com](https://docs.xano.com)

---

¡Tu sistema de autenticación con Xano está listo! 🎉
