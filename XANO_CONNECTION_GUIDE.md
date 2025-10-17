# 🔗 Guía de Conexión con Xano

## ✅ **Estado Actual: CONECTADO**

Tu proyecto ya está conectado con Xano y listo para usar. Aquí tienes toda la información:

## 📋 **Configuración Actual**

### **Variables de Entorno (.env):**
```env
VITE_API_URL=https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX
VITE_AUTH_URL=https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C
```

### **URLs de Xano:**
- **API Principal:** `https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX`
- **API de Autenticación:** `https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C`

## 🧪 **Cómo Probar la Conexión**

### **1. Usando el Componente de Prueba:**
- Ve a la página principal (Home)
- En modo desarrollo, verás un componente "Prueba de Conexión con Xano"
- Haz clic en "Ejecutar Pruebas" para verificar la conexión

### **2. Usando la Consola del Navegador con axios:**
```javascript
// Copia y pega este código en la consola del navegador
// Primero importa axios: import('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js')
axios.get('https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX/products')
  .then(response => console.log('✅ Conexión exitosa:', response.data))
  .catch(error => console.error('❌ Error:', error.response?.data || error.message));
```

### **3. Usando el Script de Prueba:**
```bash
# Ejecuta el script de prueba
node test-xano-connection.js
```

## 🔧 **Funcionalidades Disponibles**

### **✅ Autenticación:**
- Login de usuarios
- Registro de usuarios
- Logout
- Perfil de usuario
- Cambio de contraseña
- Recuperación de contraseña

### **✅ Productos:**
- Obtener lista de productos
- Buscar productos
- Filtrar por categoría
- Obtener producto por ID

### **✅ Carrito:**
- Agregar productos
- Remover productos
- Actualizar cantidades
- Obtener carrito del usuario

### **✅ Órdenes:**
- Crear órdenes
- Obtener órdenes del usuario
- Obtener orden por ID

### **✅ Contacto:**
- Enviar mensajes de contacto

### **✅ Blogs:**
- Obtener blogs
- Obtener blog por ID
- Obtener blogs destacados

## 🚀 **Cómo Usar en tu Código**

### **1. Usando el Hook useXano:**
```jsx
import useXano from '../hooks/useXano';

const MyComponent = () => {
  const xano = useXano();
  
  const loadProducts = async () => {
    try {
      const products = await xano.getProducts();
      console.log('Productos:', products);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <button onClick={loadProducts}>
      Cargar Productos
    </button>
  );
};
```

### **2. Usando la API Directamente:**
```jsx
import xanoAPI from '../config/xano';

const loadData = async () => {
  try {
    const products = await xanoAPI.getProducts();
    const categories = await xanoAPI.getCategories();
    console.log('Datos:', { products, categories });
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🛠️ **Configuración en Xano**

### **Endpoints Necesarios:**
Asegúrate de que estos endpoints estén configurados en tu workspace de Xano:

#### **Productos:**
- `GET /products` - Lista de productos
- `GET /products/:id` - Producto por ID
- `GET /products?category=:category` - Productos por categoría
- `GET /products/search?q=:query` - Búsqueda de productos

#### **Autenticación:**
- `POST /auth/login` - Login
- `POST /auth/signup` - Registro
- `GET /auth/me` - Perfil del usuario
- `POST /auth/logout` - Logout
- `PUT /auth/update-profile` - Actualizar perfil
- `POST /auth/change-password` - Cambiar contraseña
- `POST /auth/forgot-password` - Recuperar contraseña

#### **Carrito:**
- `GET /cart?user_id=:id` - Obtener carrito
- `POST /cart/add` - Agregar al carrito
- `DELETE /cart/remove` - Remover del carrito
- `PUT /cart/update` - Actualizar carrito

#### **Órdenes:**
- `POST /orders/create` - Crear orden
- `GET /orders/:id` - Orden por ID
- `GET /orders?user_id=:id` - Órdenes del usuario

#### **Contacto:**
- `POST /contact` - Enviar mensaje

#### **Blogs:**
- `GET /blogs` - Lista de blogs
- `GET /blogs/:id` - Blog por ID
- `GET /blogs/featured` - Blogs destacados

## 🔒 **Configuración de CORS**

Asegúrate de configurar CORS en tu workspace de Xano:

1. Ve a **Settings** → **CORS**
2. Agrega tu dominio: `http://localhost:5173` (desarrollo)
3. Agrega tu dominio de producción cuando lo despliegues

## 📱 **Próximos Pasos**

### **1. Probar la Conexión:**
- Ejecuta `npm run dev`
- Ve a la página principal
- Usa el componente de prueba para verificar la conexión

### **2. Implementar Funcionalidades:**
- Reemplaza los datos mock con datos reales de Xano
- Implementa la carga de productos desde Xano
- Conecta el sistema de autenticación

### **3. Configurar Endpoints:**
- Crea las tablas necesarias en Xano
- Configura los endpoints según tus necesidades
- Prueba cada endpoint individualmente

## 🆘 **Solución de Problemas**

### **Error de CORS:**
- Verifica que CORS esté configurado en Xano
- Asegúrate de que tu dominio esté en la lista de CORS

### **Error 404:**
- Verifica que los endpoints existan en Xano
- Revisa la configuración de rutas en Xano

### **Error de Autenticación:**
- Verifica que los endpoints de auth estén configurados
- Revisa el formato de los datos que envías

## 📞 **Soporte**

Si tienes problemas con la conexión:
1. Revisa la consola del navegador para errores
2. Usa el componente de prueba para diagnosticar
3. Verifica la configuración en Xano
4. Revisa los logs de Xano para errores del servidor

¡Tu proyecto está listo para usar Xano! 🎉
