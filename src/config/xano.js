import axios from 'axios';

// Xano API Configuration
const XANO_CONFIG = {
  // Base URL de tu API de Xano
  BASE_URL: import.meta.env.VITE_XANO_BASE_URL || import.meta.env.VITE_XANO_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX',
  
  // Auth URL separada para autenticación
  AUTH_URL: import.meta.env.VITE_AUTH_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C',
  
  // Endpoints
  ENDPOINTS: {
    // Productos
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id) => `/products/${id}`,
    PRODUCTS_BY_CATEGORY: (category) => `/products?category=${category}`,
    SEARCH_PRODUCTS: (query) => `/products/search?q=${query}`,
    // Fallbacks para entornos que usan rutas en singular
    PRODUCTS_FALLBACK: '/product',
    PRODUCT_FALLBACK_BY_ID: (id) => `/product/${id}`,
    
    // Categorías (usar endpoint de productos para obtener categorías)
    CATEGORIES: '/products/categories',
    
    // Carrito (si usas Xano para manejar carritos)
    CART: '/cart',
    ADD_TO_CART: '/cart/add',
    REMOVE_FROM_CART: '/cart/remove',
    UPDATE_CART: '/cart/update',
    
    // Usuarios y Autenticación (ajustados a tus endpoints de Xano)
    USERS: '/user',
    CREATE_USER: '/user',
    UPDATE_USER: (id) => `/user/${id}`,
    DELETE_USER: (id) => `/user/${id}`,
    LOGIN: '/auth/login',
    REGISTER: '/auth/signup',
    PROFILE: '/auth/me',
    // Endpoints adicionales que puedes agregar después
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    UPDATE_PROFILE: '/auth/update-profile',
    CHANGE_PASSWORD: '/auth/change-password',
    
    // Órdenes
    ORDERS: '/orders',
    CREATE_ORDER: '/orders/create',
    ORDER_BY_ID: (id) => `/orders/${id}`,
    
    // Contacto
    CONTACT: '/contact',
    
    // Blogs
    BLOGS: '/blogs',
    BLOG_BY_ID: (id) => `/blogs/${id}`,
    FEATURED_BLOGS: '/blogs/featured'
  },
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Timeout para requests
  TIMEOUT: 10000,
  
  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  }
};

// Clase para manejar las llamadas a la API de Xano
class XanoAPI {
  constructor(config = XANO_CONFIG) {
    this.config = config;
    this.baseURL = config.BASE_URL;
    this.authURL = config.AUTH_URL;
  }

  // Método para hacer requests HTTP con axios
  async request(endpoint, options = {}, customBaseURL = null) {
    const baseURL = customBaseURL || this.baseURL;
    const url = `${baseURL}${endpoint}`;
    const axiosConfig = {
      url,
      method: options.method || 'GET',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        ...options.headers
      },
      timeout: this.config.TIMEOUT,
      ...options
    };

    // Si hay body, convertir a data y remover body
    if (options.body) {
      axiosConfig.data = options.body;
      delete axiosConfig.body;
    }

    try {
      const hasAuth = Boolean(axiosConfig.headers?.Authorization);
      const safeHeaders = { ...axiosConfig.headers };
      if (hasAuth) safeHeaders.Authorization = 'Bearer ***';
      console.debug('Xano request start:', {
        method: axiosConfig.method,
        url,
        headers: safeHeaders,
        hasBody: Boolean(axiosConfig.data)
      });
      const response = await axios(axiosConfig);
      console.debug('Xano request ok:', {
        method: axiosConfig.method,
        url,
        status: response.status
      });
      return response.data;
    } catch (error) {
      // Manejar cancelaciones sin ruido
      if (axios.isCancel?.(error) || error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError') {
        console.debug('Xano request canceled:', { method: axiosConfig.method, url });
        throw error; // Propagar cancelación para que el llamador la pueda ignorar
      }

      const status = error.response?.status;
      const is404 = status === 404;
      const logFn = is404 ? console.warn : console.error;
      logFn('Xano API Error Details:', {
        method: axiosConfig.method,
        url: url,
        status,
        statusText: error.response?.statusText,
        responseBody: error.response?.data,
        requestPayload: axiosConfig.data
      });
      
      if (error.response) {
        // Extraer mensaje de error más específico de Xano
        const errorData = error.response.data;
        if (errorData && errorData.message) {
          throw new Error(`HTTP ${status}: ${errorData.message}`);
        } else {
          throw new Error(`HTTP ${status} ${error.response?.statusText || ''}: ${JSON.stringify(errorData)}`);
        }
      } else {
        throw new Error(`Network error: ${error.message}`);
      }
    }
  }

  // Método para hacer requests de autenticación con axios
  async authRequest(endpoint, options = {}) {
    const url = `${this.authURL}${endpoint}`;
    const axiosConfig = {
      url,
      method: options.method || 'GET',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        ...options.headers
      },
      timeout: this.config.TIMEOUT,
      ...options
    };

    // Si hay body, convertir a data y remover body
    if (options.body) {
      axiosConfig.data = options.body;
      delete axiosConfig.body;
    }

    try {
      const response = await axios(axiosConfig);
      return response.data;
    } catch (error) {
      console.error('Xano Auth API Error:', error);
      
      if (error.response) {
        // Extraer mensaje de error más específico de Xano
        const errorData = error.response.data;
        if (errorData && errorData.message) {
          throw new Error(`HTTP ${error.response.status}: ${errorData.message}`);
        } else {
          throw new Error(`HTTP ${error.response.status} ${error.response.statusText}: ${JSON.stringify(errorData)}`);
        }
      } else {
        throw new Error(`Network error: ${error.message}`);
      }
    }
  }

  // Métodos para productos
  async getProducts(params = {}, options = {}) {
    const queryString = new URLSearchParams(params).toString();
    const singular = queryString ? 
      `${this.config.ENDPOINTS.PRODUCTS_FALLBACK}?${queryString}` : 
      this.config.ENDPOINTS.PRODUCTS_FALLBACK;
    const plural = queryString ? 
      `${this.config.ENDPOINTS.PRODUCTS}?${queryString}` : 
      this.config.ENDPOINTS.PRODUCTS;
    try {
      const data = await this.request(singular, options);
      try {
        localStorage.setItem('electroverse-products-cache', JSON.stringify({ ts: Date.now(), data }));
      } catch {}
      return data;
    } catch (error) {
      console.warn('getProducts: error en endpoint singular:', error.message);
      // Intentar leer de cache local ante fallo de red
      try {
        const cached = JSON.parse(localStorage.getItem('electroverse-products-cache') || '{}');
        if (cached && Array.isArray(cached.data) && cached.data.length) {
          console.warn('getProducts: usando cache local por fallo de red');
          return cached.data;
        }
      } catch {}
      console.warn('getProducts: fallback a endpoint plural por error:', error.message);
      const data = await this.request(plural, options);
      try {
        localStorage.setItem('electroverse-products-cache', JSON.stringify({ ts: Date.now(), data }));
      } catch {}
      return data;
    }
  }

  async getProductById(id, options = {}) {
    try {
      const data = await this.request(this.config.ENDPOINTS.PRODUCT_BY_ID(id), options);
      // Actualizar cache si existe
      try {
        const cached = JSON.parse(localStorage.getItem('electroverse-products-cache') || '{}');
        if (cached && Array.isArray(cached.data)) {
          const idx = cached.data.findIndex((p) => p && (p.id === id || p.product_id === id));
          if (idx >= 0) {
            cached.data[idx] = data;
            localStorage.setItem('electroverse-products-cache', JSON.stringify(cached));
          }
        }
      } catch {}
      return data;
    } catch (error) {
      console.warn('getProductById: error en endpoint principal:', error.message);
      // Intentar resolver desde cache local
      try {
        const cached = JSON.parse(localStorage.getItem('electroverse-products-cache') || '{}');
        if (cached && Array.isArray(cached.data)) {
          const found = cached.data.find((p) => p && (p.id === id || p.product_id === id));
          if (found) {
            console.warn('getProductById: usando cache local por fallo de red');
            return found;
          }
        }
      } catch {}
      console.warn('getProductById: fallback a /product/:id por error:', error.message);
      return this.request(this.config.ENDPOINTS.PRODUCT_FALLBACK_BY_ID(id), options);
    }
  }

  async getProductsByCategory(category, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? 
      `${this.config.ENDPOINTS.PRODUCTS_BY_CATEGORY(category)}&${queryString}` : 
      this.config.ENDPOINTS.PRODUCTS_BY_CATEGORY(category);
    
    return this.request(endpoint);
  }

  async searchProducts(query, params = {}) {
    const searchParams = { q: query, ...params };
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = `${this.config.ENDPOINTS.SEARCH_PRODUCTS(query)}&${queryString}`;
    
    return this.request(endpoint);
  }

  async createProduct(productData, token) {
    // Sanitizar el payload usando la función específica para creación
    const sanitizedPayload = this.sanitizeCreateProductPayload(productData);
    
    // Si hay imágenes, agregarlas al payload
    if (productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
      sanitizedPayload.images = productData.images;
    }
    
    console.log('CreateProduct - Sanitized payload:', sanitizedPayload);
    const opts = {
      method: 'POST',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      },
      body: sanitizedPayload
    };
    console.debug('createProduct: preparando request', {
      endpoint: this.config.ENDPOINTS.PRODUCTS,
      imagesCount: sanitizedPayload.images?.length || 0
    });
    
    try {
      return await this.request(this.config.ENDPOINTS.PRODUCTS, opts);
    } catch (error) {
      console.warn('createProduct: fallback a /product por error:', error.message);
      console.debug('createProduct: fallback ejecutado', {
        endpoint: this.config.ENDPOINTS.PRODUCTS_FALLBACK
      });
      return this.request(this.config.ENDPOINTS.PRODUCTS_FALLBACK, opts);
    }
  }

  // Método de sanitización para creación de productos
  sanitizeCreateProductPayload(input = {}) {
    const out = {};
    const keep = ["name", "description", "price", "stock", "brand", "category", "active"];

    for (const key of keep) {
      let val = input[key];
      if (val === undefined || val === null) continue;

      if (key === "price") {
        const n = Number(val);
        if (!Number.isNaN(n)) out.price = n;
        continue;
      }
      if (key === "stock") {
        const n = parseInt(val, 10);
        if (!Number.isNaN(n)) out.stock = n;
        continue;
      }
      if (key === "active") {
        const boolVal = (typeof val === "string") ? val.toLowerCase() === "true" : Boolean(val);
        out.active = boolVal;
        out.is_active = boolVal;
        continue;
      }
      // strings: evita vacíos
      if (typeof val === "string") {
        const s = val.trim();
        if (s.length) out[key] = s;
        continue;
      }
      // otros tipos, asignación directa si no es undefined/null
      out[key] = val;
    }

    return out;
  }

  async updateProduct(id, productData, token) {
    const sanitizedPayload = this.sanitizeProductPayload(productData);
    const baseHeaders = {
      ...this.config.DEFAULT_HEADERS,
      'Authorization': `Bearer ${token}`
    };
    const custom = import.meta.env.VITE_XANO_PRODUCT_UPDATE_ENDPOINT || null;
    const attempts = [
      { endpoint: this.config.ENDPOINTS.PRODUCT_BY_ID(id), method: 'PUT' },
      { endpoint: this.config.ENDPOINTS.PRODUCT_BY_ID(id), method: 'PATCH' },
      { endpoint: this.config.ENDPOINTS.PRODUCT_FALLBACK_BY_ID(id), method: 'PUT' },
      { endpoint: this.config.ENDPOINTS.PRODUCT_FALLBACK_BY_ID(id), method: 'PATCH' },
      { endpoint: this.config.ENDPOINTS.PRODUCT_FALLBACK_BY_ID(id), method: 'POST' }
    ];
    if (custom) {
      attempts.unshift({ endpoint: custom.replace(':id', id), method: 'PATCH' });
      attempts.unshift({ endpoint: custom.replace(':id', id), method: 'PUT' });
    }
    let lastError = null;
    for (const a of attempts) {
      const opts = {
        method: a.method,
        headers: baseHeaders,
        body: sanitizedPayload
      };
      console.debug('updateProduct: intentando', { endpoint: a.endpoint, method: a.method, id });
      try {
        return await this.request(a.endpoint, opts);
      } catch (error) {
        lastError = error;
        console.warn('updateProduct: intento fallido', { endpoint: a.endpoint, method: a.method, message: error.message });
      }
    }
    throw lastError || new Error('No se pudo actualizar el producto');
  }

  sanitizeProductPayload(input = {}) {
    const out = {};
    const keep = [
      "name", "description", "price", "stock", "brand", "category", "active",
      "image", "images"
    ];

    for (const key of keep) {
      let val = input[key];
      if (val === undefined || val === null) continue;

      if (key === "price") {
        const n = Number(val);
        if (!Number.isNaN(n)) out.price = n;
        continue;
      }
      if (key === "stock") {
        const n = parseInt(val, 10);
        if (!Number.isNaN(n)) out.stock = n;
        continue;
      }
      if (key === "active") {
        const boolVal = (typeof val === "string") ? val.toLowerCase() === "true" : Boolean(val);
        out.active = boolVal;
        out.is_active = boolVal;
        continue;
      }
      if (key === "images") {
        if (Array.isArray(val)) {
          // Limpiar las URLs de imágenes
          const cleanedImages = val
            .map((img) => (typeof img === "string" ? img.trim() : img))
            .filter((img) => Boolean(img));
          if (cleanedImages.length) out.images = cleanedImages;
        }
        continue;
      }
      if (key === "image") {
        if (typeof val === "string") {
          const s = val.trim();
          if (s.length) out.image = s;
        } else {
          out.image = val;
        }
        continue;
      }

      // strings: evita vacíos
      if (typeof val === "string") {
        const s = val.trim();
        if (s.length) out[key] = s;
        continue;
      }

      // otros tipos, asignación directa si no es undefined/null
      out[key] = val;
    }

    return out;
  }

  async deleteProduct(id, token) {
    const opts = {
      method: 'DELETE',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      }
    };
    console.debug('deleteProduct: preparando request', {
      id,
      endpoint: this.config.ENDPOINTS.PRODUCT_BY_ID(id)
    });
    try {
      return await this.request(this.config.ENDPOINTS.PRODUCT_BY_ID(id), opts);
    } catch (error) {
      console.warn('deleteProduct: fallback a /product/:id por error:', error.message);
      console.debug('deleteProduct: fallback ejecutado', {
        id,
        endpoint: this.config.ENDPOINTS.PRODUCT_FALLBACK_BY_ID(id)
      });
      return this.request(this.config.ENDPOINTS.PRODUCT_FALLBACK_BY_ID(id), opts);
    }
  }

  async getCategories() {
    return this.request(this.config.ENDPOINTS.CATEGORIES);
  }

  async getCart(userId) {
    return this.request(`${this.config.ENDPOINTS.CART}?userId=${userId}`);
  }

  async addToCart(productId, quantity = 1, userId = null) {
    return this.request(this.config.ENDPOINTS.ADD_TO_CART, {
      method: 'POST',
      body: { productId, quantity, userId }
    });
  }

  async removeFromCart(productId, userId = null) {
    return this.request(this.config.ENDPOINTS.REMOVE_FROM_CART, {
      method: 'DELETE',
      body: { productId, userId }
    });
  }

  async updateCart(productId, quantity, userId = null) {
    return this.request(this.config.ENDPOINTS.UPDATE_CART, {
      method: 'PUT',
      body: { productId, quantity, userId }
    });
  }

  async login(email, password) {
    return this.authRequest(this.config.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: { email, password }
    });
  }

  async register(userData) {
    return this.authRequest(this.config.ENDPOINTS.REGISTER, {
      method: 'POST',
      body: userData
    });
  }

  async logout(token) {
    return this.authRequest(this.config.ENDPOINTS.LOGOUT, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  async getProfile(token) {
    return this.authRequest(this.config.ENDPOINTS.PROFILE, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  async updateProfile(token, userData) {
    return this.authRequest(this.config.ENDPOINTS.UPDATE_PROFILE, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: userData
    });
  }

  async changePassword(token, currentPassword, newPassword) {
    return this.authRequest(this.config.ENDPOINTS.CHANGE_PASSWORD, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: { currentPassword, newPassword }
    });
  }

  async forgotPassword(email) {
    return this.authRequest(this.config.ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: { email }
    });
  }

  async resetPassword(token, password) {
    return this.authRequest(this.config.ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      body: { token, password }
    });
  }

  async verifyEmail(token) {
    return this.authRequest(this.config.ENDPOINTS.VERIFY_EMAIL, {
      method: 'POST',
      body: { token }
    });
  }

  async refreshToken(refreshToken) {
    return this.authRequest(this.config.ENDPOINTS.REFRESH_TOKEN, {
      method: 'POST',
      body: { refreshToken }
    });
  }

  async createOrder(orderData) {
    return this.request(this.config.ENDPOINTS.ORDERS, {
      method: 'POST',
      body: orderData
    });
  }

  async getOrderById(id) {
    return this.request(this.config.ENDPOINTS.ORDER_BY_ID(id));
  }

  async getUserOrders(userId) {
    return this.request(`${this.config.ENDPOINTS.ORDERS}?userId=${userId}`);
  }

  async sendContactMessage(messageData) {
    return this.request(this.config.ENDPOINTS.CONTACT, {
      method: 'POST',
      body: messageData
    });
  }

  async getBlogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${this.config.ENDPOINTS.BLOGS}?${queryString}` : this.config.ENDPOINTS.BLOGS;
    return this.request(endpoint);
  }

  async getBlogById(id) {
    return this.request(this.config.ENDPOINTS.BLOG_BY_ID(id));
  }

  async getFeaturedBlogs() {
    return this.request(this.config.ENDPOINTS.FEATURED_BLOGS);
  }

  async getUsers(params = {}, token) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${this.config.ENDPOINTS.USERS}?${queryString}` : this.config.ENDPOINTS.USERS;
    return this.authRequest(endpoint, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  async createUser(userData, token) {
    return this.authRequest(this.config.ENDPOINTS.CREATE_USER, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: userData
    });
  }

  async updateUser(id, userData, token) {
    return this.authRequest(this.config.ENDPOINTS.UPDATE_USER(id), {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: userData
    });
  }

  async deleteUser(id, token) {
    return this.authRequest(this.config.ENDPOINTS.DELETE_USER(id), {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
}

export function sanitizeProductPayload(input = {}) {
  const out = {};
  const keep = [
    "id", "name", "description", "price", "stock", "brand", "category", "active",
    "image", "images", "additionalImages", "rating", "reviews"
  ];

  for (const key of keep) {
    let val = input[key];
    if (val === undefined || val === null) continue;

    if (key === "price") {
      const n = Number(val);
      if (!Number.isNaN(n)) out.price = n;
      continue;
    }
    if (key === "stock") {
      const n = parseInt(val, 10);
      if (!Number.isNaN(n)) out.stock = n;
      continue;
    }
    if (key === "active") {
      if (typeof val === "string") {
        out.active = val.toLowerCase() === "true";
      } else {
        out.active = Boolean(val);
      }
      continue;
    }
    if (key === "images") {
      if (Array.isArray(val)) {
        const cleanedImages = val
          .map((img) => (typeof img === "string" ? img.trim() : img))
          .filter((img) => Boolean(img));
        if (cleanedImages.length) out.images = cleanedImages;
      }
      continue;
    }
    if (key === "image") {
      if (typeof val === "string") {
        const s = val.trim();
        if (s.length) out.image = s;
      } else {
        out.image = val;
      }
      continue;
    }

    if (typeof val === "string") {
      const s = val.trim();
      if (s.length) out[key] = s;
      continue;
    }

    out[key] = val;
  }

  return out;
}

export function sanitizeCreateProductPayload(input = {}) {
  const out = {};
  const keep = ["name", "description", "price", "stock", "brand", "category", "active", "image"];

  for (const key of keep) {
    let val = input[key];
    if (val === undefined || val === null) continue;

    if (key === "price") {
      const n = Number(val);
      if (!Number.isNaN(n)) out.price = n;
      continue;
    }
    if (key === "stock") {
      const n = parseInt(val, 10);
      if (!Number.isNaN(n)) out.stock = n;
      continue;
    }
    if (key === "active") {
      if (typeof val === "string") {
        out.active = val.toLowerCase() === "true";
      } else {
        out.active = Boolean(val);
      }
      continue;
    }

    if (key === "image") {
      if (typeof val === "string") {
        const s = val.trim();
        if (s.length) out.image = s;
      } else {
        out.image = val;
      }
      continue;
    }

    if (typeof val === "string") {
      const s = val.trim();
      if (s.length) out[key] = s;
      continue;
    }

    out[key] = val;
  }

  return out;
}

const xanoAPI = new XanoAPI();

export default xanoAPI;
export { XANO_CONFIG };
