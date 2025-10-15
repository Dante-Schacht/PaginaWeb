# Configuración de Xano para ElectroVerse

## Pasos para conectar tu aplicación con Xano

### 1. Crear cuenta en Xano
1. Ve a [xano.com](https://xano.com)
2. Crea una cuenta gratuita
3. Crea un nuevo workspace

### 2. Configurar tu API en Xano

#### Crear las tablas necesarias:

**Tabla: products**
- `id` (Auto-increment, Primary Key)
- `name` (Text)
- `description` (Text)
- `price` (Decimal)
- `original_price` (Decimal, nullable)
- `image` (Text, URL)
- `category` (Text)
- `rating` (Decimal, default: 0)
- `reviews` (Integer, default: 0)
- `discount` (Integer, nullable)
- `is_new` (Boolean, default: false)
- `stock` (Integer, default: 0)
- `created_at` (DateTime)
- `updated_at` (DateTime)

**Tabla: categories**
- `id` (Auto-increment, Primary Key)
- `name` (Text)
- `slug` (Text, unique)
- `description` (Text, nullable)
- `image` (Text, nullable)
- `created_at` (DateTime)

**Tabla: blogs**
- `id` (Auto-increment, Primary Key)
- `title` (Text)
- `content` (Text)
- `excerpt` (Text)
- `image` (Text)
- `author` (Text)
- `category` (Text)
- `featured` (Boolean, default: false)
- `published` (Boolean, default: true)
- `created_at` (DateTime)
- `updated_at` (DateTime)

**Tabla: users** (opcional, si quieres autenticación)
- `id` (Auto-increment, Primary Key)
- `email` (Text, unique)
- `password` (Text, hashed)
- `first_name` (Text)
- `last_name` (Text)
- `phone` (Text, nullable)
- `created_at` (DateTime)

**Tabla: cart_items** (opcional, para carrito persistente)
- `id` (Auto-increment, Primary Key)
- `user_id` (Integer, Foreign Key to users)
- `product_id` (Integer, Foreign Key to products)
- `quantity` (Integer)
- `created_at` (DateTime)

**Tabla: orders**
- `id` (Auto-increment, Primary Key)
- `user_id` (Integer, Foreign Key to users)
- `total` (Decimal)
- `status` (Text, default: 'pending')
- `shipping_address` (Text)
- `billing_address` (Text)
- `created_at` (DateTime)

**Tabla: order_items**
- `id` (Auto-increment, Primary Key)
- `order_id` (Integer, Foreign Key to orders)
- `product_id` (Integer, Foreign Key to products)
- `quantity` (Integer)
- `price` (Decimal)

### 3. Crear los endpoints en Xano

#### Endpoints para productos:
- `GET /products` - Listar todos los productos
- `GET /products/:id` - Obtener producto por ID
- `GET /products/category/:category` - Productos por categoría
- `GET /products/search` - Buscar productos

#### Endpoints para categorías:
- `GET /categories` - Listar todas las categorías

#### Endpoints para blogs:
- `GET /blogs` - Listar todos los blogs
- `GET /blogs/:id` - Obtener blog por ID
- `GET /blogs/featured` - Blogs destacados

#### Endpoints para contacto:
- `POST /contact` - Enviar mensaje de contacto

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz de tu proyecto:

```env
REACT_APP_XANO_BASE_URL=https://tu-workspace.xano.io/api:tu-api-group
REACT_APP_XANO_API_KEY=tu-api-key-opcional
```

### 5. Actualizar la configuración

En `src/config/xano.js`, actualiza la `BASE_URL` con tu URL de Xano:

```javascript
const XANO_CONFIG = {
  BASE_URL: 'https://tu-workspace.xano.io/api:tu-api-group',
  // ... resto de la configuración
};
```

### 6. Datos de ejemplo para poblar tu base de datos

#### Categorías:
```json
[
  {"name": "Mouses", "slug": "mouses", "description": "Mouses gaming y profesionales"},
  {"name": "Teclados", "slug": "teclados", "description": "Teclados mecánicos y de membrana"},
  {"name": "Micrófonos", "slug": "microfonos", "description": "Micrófonos para streaming y gaming"},
  {"name": "Monitores", "slug": "monitores", "description": "Monitores gaming y profesionales"},
  {"name": "Parlantes", "slug": "parlantes", "description": "Sistemas de audio y parlantes"},
  {"name": "Televisores", "slug": "televisores", "description": "Smart TVs y monitores grandes"},
  {"name": "Teléfonos", "slug": "telefonos", "description": "Smartphones y accesorios"},
  {"name": "Audífonos", "slug": "audifonos", "description": "Audífonos y auriculares"},
  {"name": "Smartwatches", "slug": "smartwatches", "description": "Relojes inteligentes"}
]
```

#### Productos de ejemplo:
```json
[
  {
    "name": "Mouse Gaming Pro X1",
    "description": "Mouse gaming de alta precisión con RGB personalizable",
    "price": 89.99,
    "original_price": 119.99,
    "image": "https://via.placeholder.com/300x300",
    "category": "Mouses",
    "rating": 4.5,
    "reviews": 128,
    "discount": 25,
    "is_new": false,
    "stock": 50
  }
]
```

### 7. Configurar CORS en Xano

En la configuración de tu API en Xano:
1. Ve a Settings > API
2. Habilita CORS
3. Agrega tu dominio local: `http://localhost:3000`
4. Para producción, agrega tu dominio: `https://tu-dominio.com`

### 8. Testing de la integración

Una vez configurado todo, puedes probar la integración:

1. Ejecuta tu aplicación: `npm run dev`
2. Ve a la página de productos
3. Los productos deberían cargarse desde Xano
4. Prueba la funcionalidad de búsqueda y filtros

### 9. Optimizaciones adicionales

#### Cache de datos:
Puedes implementar cache local para mejorar el rendimiento:

```javascript
// En tu hook useProducts
const [cache, setCache] = useState(new Map());

const fetchProducts = useCallback(async () => {
  const cacheKey = JSON.stringify(params);
  
  if (cache.has(cacheKey)) {
    setProducts(cache.get(cacheKey));
    return;
  }
  
  // ... fetch from API
  setCache(prev => new Map(prev.set(cacheKey, data)));
}, [params, cache]);
```

#### Paginación:
Implementa paginación para manejar grandes cantidades de productos:

```javascript
const [pagination, setPagination] = useState({
  page: 1,
  limit: 20,
  total: 0
});
```

### 10. Monitoreo y Analytics

Considera agregar:
- Google Analytics para tracking de usuarios
- Error tracking con Sentry
- Performance monitoring
- User behavior analytics

## Soporte

Si tienes problemas con la integración:
1. Revisa la consola del navegador para errores
2. Verifica que la URL de Xano sea correcta
3. Asegúrate de que los endpoints estén configurados correctamente
4. Revisa la documentación de Xano: [docs.xano.com](https://docs.xano.com)
