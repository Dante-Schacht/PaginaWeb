# 🚀 Guía de Integración con Xano - ElectroVerse

## ✅ **Estado Actual:**
Tienes configurados los endpoints básicos de autenticación en Xano:
- ✅ POST auth/login
- ✅ GET auth/me  
- ✅ POST auth/signup

## 🔧 **Configuración Necesaria:**

### **1. Variables de Entorno**
Crea un archivo `.env` en la raíz de tu proyecto:

```env
REACT_APP_XANO_BASE_URL=https://tu-workspace.xano.io/api:tu-api-group
```

**Para encontrar tu URL:**
1. Ve a tu workspace de Xano
2. Copia la URL que aparece en la parte superior
3. Debe verse como: `https://tu-workspace.xano.io/api:tu-api-group`

### **2. Configurar CORS en Xano**
1. Ve a Settings > API en tu workspace
2. Habilita CORS
3. Agrega: `http://localhost:3000`
4. Para producción: `https://tu-dominio.com`

### **3. Estructura de Respuesta Esperada**

#### **Login (POST /auth/login)**
```json
{
  "authToken": "tu-jwt-token-aqui",
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "first_name": "Juan",
    "last_name": "Pérez",
    "role": "user",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### **Signup (POST /auth/signup)**
```json
{
  "authToken": "tu-jwt-token-aqui",
  "user": {
    "id": 2,
    "email": "nuevo@email.com",
    "first_name": "María",
    "last_name": "García",
    "role": "user",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### **Profile (GET /auth/me)**
```json
{
  "id": 1,
  "email": "usuario@email.com",
  "first_name": "Juan",
  "last_name": "Pérez",
  "role": "user",
  "phone": "+1234567890",
  "avatar": null,
  "created_at": "2024-01-01T00:00:00Z"
}
```

## 🧪 **Probar la Integración:**

### **1. Verificar Configuración**
```javascript
// En la consola del navegador
console.log('Xano URL:', process.env.REACT_APP_XANO_BASE_URL);
```

### **2. Probar Login**
1. Ve a `http://localhost:3000/login`
2. Usa credenciales válidas
3. Verifica que se redirija a la página principal
4. Verifica que el header muestre el nombre del usuario

### **3. Probar Registro**
1. Ve a `http://localhost:3000/register`
2. Completa el formulario
3. Verifica que se cree el usuario
4. Verifica que se inicie sesión automáticamente

### **4. Verificar en DevTools**
1. Abre DevTools > Network
2. Haz login/registro
3. Verifica que las peticiones lleguen a Xano
4. Verifica que las respuestas tengan la estructura correcta

## 🔍 **Debugging:**

### **Si no funciona el login:**
1. Verifica la URL de Xano en `.env`
2. Verifica que CORS esté habilitado
3. Revisa la consola del navegador para errores
4. Verifica que el endpoint `/auth/login` exista

### **Si no funciona el registro:**
1. Verifica que el endpoint `/auth/signup` exista
2. Verifica que los campos coincidan con tu base de datos
3. Revisa los logs de Xano

### **Si no se mantiene la sesión:**
1. Verifica que el token se guarde en localStorage
2. Verifica que el endpoint `/auth/me` funcione
3. Verifica que el token sea válido

## 📊 **Estructura de Base de Datos Recomendada:**

### **Tabla: users**
```sql
- id (Auto-increment, Primary Key)
- email (Text, unique, required)
- password (Text, hashed, required)
- first_name (Text, required)
- last_name (Text, required)
- phone (Text, nullable)
- role (Text, default: 'user') -- 'admin', 'user', 'vendedor'
- avatar (Text, nullable)
- is_active (Boolean, default: true)
- created_at (DateTime, auto)
- updated_at (DateTime, auto)
```

## 🎯 **Próximos Pasos:**

### **Endpoints Adicionales (Opcionales):**
- POST /auth/logout
- PUT /auth/update-profile
- POST /auth/change-password
- POST /auth/forgot-password

### **Funcionalidades por Rol:**
- **user**: Ver productos, comprar, gestionar perfil
- **vendedor**: + Estadísticas de ventas
- **admin**: + Gestión completa del sistema

## 🆘 **Solución de Problemas:**

### **Error: "Network Error"**
- Verifica la URL de Xano
- Verifica que CORS esté configurado
- Verifica que el endpoint exista

### **Error: "Unauthorized"**
- Verifica que el token sea válido
- Verifica que el usuario esté activo
- Verifica que el endpoint sea privado

### **Error: "Token Expired"**
- El sistema debería manejar esto automáticamente
- Si no funciona, el usuario debe hacer login nuevamente

## 📞 **Soporte:**

Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica la configuración de Xano
3. Revisa los logs del servidor
4. Consulta la documentación de Xano

---

¡Tu integración con Xano está lista para probar! 🎉
