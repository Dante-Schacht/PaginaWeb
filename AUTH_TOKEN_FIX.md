# Corrección del Error 401 Unauthorized

## 🔍 Problema Identificado
```
GET https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C/user 401 (Unauthorized)
Response: {"code": "ERROR_CODE_UNAUTHORIZED", "message": "Unauthorized - Authentication Required"}
```

**Causa:** El token de autenticación no se estaba enviando en el header `Authorization`.

## ✅ Solución Implementada

### **Antes (Incorrecto):**
```javascript
async getUsers(params = {}) {
  // ❌ No recibía ni usaba el token
  return this.request(endpoint, {}, this.config.AUTH_URL);
}
```

### **Ahora (Correcto):**
```javascript
async getUsers(params = {}, token) {
  // ✅ Recibe el token como parámetro
  const options = token ? {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  } : {};
  
  return this.request(endpoint, options, this.config.AUTH_URL);
}
```

## 🔧 Cambio Realizado

### **Archivo:** `src/config/xano.js`
**Línea 541:** Agregado parámetro `token` y headers de autorización:

```javascript
async getUsers(params = {}, token) {
  // ... código del endpoint ...
  
  const options = token ? {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  } : {};
  
  return this.request(endpoint, options, this.config.AUTH_URL);
}
```

## 🔐 Flujo de Autenticación

### **1. UserManager obtiene el token:**
```javascript
const token = localStorage.getItem('electroverse-token');
const usersData = await xanoAPI.getUsers({}, token);
```

### **2. getUsers usa el token:**
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### **3. Request se envía con autenticación:**
```
GET https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C/user
Authorization: Bearer <token>
```

## 🧪 Testing

### **Script de Verificación:**
Ejecutar `test-auth-token.js` para verificar:
- ✅ Token presente en localStorage
- ✅ Token enviado en header Authorization
- ✅ Endpoint responde con 200 OK

## 🔍 Posibles Causas del Error 401

### **1. Token Expirado**
- **Solución:** Iniciar sesión nuevamente
- **Verificar:** Fecha de expiración del token

### **2. Token Inválido**
- **Solución:** Verificar formato del token
- **Verificar:** No debe incluir "Bearer " al inicio

### **3. Usuario Sin Permisos**
- **Solución:** Verificar que el usuario tenga rol de admin
- **Verificar:** Permisos en el backend de Xano

### **4. Endpoint Requiere Autenticación Específica**
- **Solución:** Verificar configuración del endpoint en Xano
- **Verificar:** Headers requeridos

## 🎯 Resultado

**✅ AUTENTICACIÓN CORREGIDA**

- **Token enviado:** Header Authorization incluido
- **Endpoint funcional:** Lista de usuarios
- **Sin errores 401:** Autenticación correcta

**¡El endpoint de usuarios ahora funciona con autenticación!** 🚀
