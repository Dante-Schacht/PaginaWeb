# 🔐 Configuración de Autenticación en Xano

## ❌ **Problema Actual:**
- Error 403 en endpoint `/auth/login`
- El endpoint existe pero no tiene permisos configurados

## 🛠️ **Solución: Configurar Endpoints de Autenticación**

### **1. Crear Tabla de Usuarios (si no existe):**

Ve a tu workspace de Xano y crea la tabla `users`:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'vendedor', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **2. Crear Endpoint POST /auth/login:**

1. Ve a **API** → **Endpoints** en Xano
2. Crea nuevo endpoint: `POST /auth/login`
3. Configura la query:
```sql
SELECT * FROM users 
WHERE email = :email 
AND password = :password 
AND is_active = true
```
4. Configura los parámetros:
   - `email` (string, required)
   - `password` (string, required)
5. Habilita **CORS** para tu dominio
6. Configura **permisos** como público

### **3. Crear Endpoint POST /auth/signup:**

1. Crea endpoint: `POST /auth/signup`
2. Configura la query:
```sql
INSERT INTO users (first_name, last_name, email, password, role, is_active)
VALUES (:first_name, :last_name, :email, :password, 'user', true)
```
3. Configura los parámetros:
   - `first_name` (string, required)
   - `last_name` (string, required)
   - `email` (string, required)
   - `password` (string, required)
4. Habilita **CORS**
5. Configura **permisos** como público

### **4. Crear Endpoint GET /auth/me:**

1. Crea endpoint: `GET /auth/me`
2. Configura la query:
```sql
SELECT * FROM users WHERE id = :user_id
```
3. Configura los parámetros:
   - `user_id` (int, required)
4. Habilita **CORS**
5. Configura **permisos** como autenticado

### **5. Insertar Usuario Administrador:**

```sql
INSERT INTO users (first_name, last_name, email, password, role, is_active) VALUES
('Admin', 'ElectroVerse', 'admin@electroverse.com', 'password123', 'admin', TRUE);
```

### **6. Configurar CORS:**

1. Ve a **Settings** → **CORS** en Xano
2. Agrega: `http://localhost:5173`
3. Agrega: `https://localhost:5173`
4. Guarda los cambios

## 🧪 **Probar Endpoints:**

### **Probar Login:**
```bash
curl -X POST "https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@electroverse.com","password":"password123"}'
```

### **Probar Registro:**
```bash
curl -X POST "https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@example.com","password":"password123"}'
```

## 📋 **Checklist de Configuración:**

### **En Xano:**
- [ ] **Tabla `users`** creada
- [ ] **Endpoint POST /auth/login** configurado
- [ ] **Endpoint POST /auth/signup** configurado
- [ ] **Endpoint GET /auth/me** configurado
- [ ] **CORS** configurado para localhost:5173
- [ ] **Permisos** configurados correctamente
- [ ] **Usuario admin** creado

### **En tu Aplicación:**
- [ ] **Variables de entorno** correctas
- [ ] **Hook useXano** funcionando
- [ ] **Componente de prueba** actualizado

## 🆘 **Solución de Problemas:**

### **Error 403:**
- Verifica que el endpoint esté configurado
- Revisa los permisos del endpoint
- Asegúrate de que CORS esté configurado

### **Error 404:**
- El endpoint no existe
- Crea el endpoint en Xano
- Verifica la URL del endpoint

### **Error de JSON:**
- Verifica el formato del JSON
- Revisa los parámetros del endpoint
- Asegúrate de que Content-Type sea application/json

## 🎯 **Resultado Esperado:**

Una vez configurado correctamente:
- ✅ **Login**: Debería devolver token y datos del usuario
- ✅ **Registro**: Debería crear nuevo usuario
- ✅ **Perfil**: Debería devolver datos del usuario autenticado
- ✅ **Pruebas**: Todas las pruebas deberían pasar

¡Una vez configurados estos endpoints, la autenticación funcionará perfectamente! 🎉
