import axios from 'axios';

// Xano API Configuration
const XANO_CONFIG = {
  // Base URL de tu API de Xano
  BASE_URL: import.meta.env.VITE_XANO_BASE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX',
  
  // Auth URL separada para autenticación
  AUTH_URL: import.meta.env.VITE_AUTH_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C',
  
  // Endpoints
  ENDPOINTS: {
    // Productos
    PRODUCTS: '/product',
    PRODUCT_BY_ID: (id) => `/product/${id}`,
    PRODUCTS_BY_CATEGORY: (category) => `/product?category=${category}`,
    SEARCH_PRODUCTS: (query) => `/product/search?q=${query}`,
    
    // Categorías (usar endpoint de productos para obtener categorías)
    CATEGORIES: '/product/categories',
    
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
      const response = await axios(axiosConfig);
      return response.data;
    } catch (error) {
      console.error('Xano API Error Details:', {
        method: axiosConfig.method,
        url: url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseBody: error.response?.data,
        requestPayload: axiosConfig.data
      });
      
      if (error.response) {
        throw new Error(
          `HTTP ${error.response.status} ${error.response.statusText} ${axiosConfig.method} ${url}\n` +
          `Response: ${JSON.stringify(error.response.data)}`
        );
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
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? 
      `${this.config.ENDPOINTS.PRODUCTS}?${queryString}` : 
      this.config.ENDPOINTS.PRODUCTS;
    
    return this.request(endpoint);
  }

  async getProductById(id) {
    return this.request(this.config.ENDPOINTS.PRODUCT_BY_ID(id));
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
    
    return this.request(this.config.ENDPOINTS.PRODUCTS, {
      method: 'POST',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      },
      data: sanitizedPayload
    });
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
        if (typeof val === "string") {
          out.active = val.toLowerCase() === "true";
        } else {
          out.active = Boolean(val);
        }
        continue;
      }
      // strings: evita vacíos
      if (typeof val === "string") {
        const s = val.trim();
        if (s) out[key] = s;
        continue;
      }
      out[key] = val;
    }

    if (Object.keys(out).length === 0) {
      throw new Error("Nada que crear: payload vacío tras sanitizar.");
    }
    return out;
  }

  async updateProduct(id, productData, token) {
    // Sanitizar el payload usando la función local
    const sanitizedPayload = this.sanitizeProductPayload(productData);
    
    console.log('UpdateProduct - Sanitized payload:', sanitizedPayload);
    
    return this.request(this.config.ENDPOINTS.PRODUCT_BY_ID(id), {
      method: 'PATCH',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      },
      data: sanitizedPayload
    });
  }

  // Método de sanitización interno
  sanitizeProductPayload(input = {}) {
    const out = {};
    const keep = ["name", "description", "price", "stock", "brand", "category", "images", "active"];

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
          const arr = val.map(String).map(s => s.trim()).filter(Boolean);
          if (arr.length) {
            // Xano espera objetos con campos 'path', 'name', 'type', 'size', 'mime' y 'meta'
            out.images = arr.map((url, index) => ({ 
              path: url, 
              name: `image_${index + 1}`,
              type: "image",
              size: 1024,
              mime: "image/jpeg",
              meta: {}
            }));
          }
        } else if (typeof val === "string") {
          if (val.includes(",")) {
            const arr = val.split(",").map(s => s.trim()).filter(Boolean);
            if (arr.length) {
              out.images = arr.map((url, index) => ({ 
                path: url, 
                name: `image_${index + 1}`,
                type: "image",
                size: 1024,
                mime: "image/jpeg",
                meta: {}
              }));
            }
          } else if (val.trim()) {
            out.images = [{ 
              path: val.trim(), 
              name: "image_1",
              type: "image",
              size: 1024,
              mime: "image/jpeg",
              meta: {}
            }];
          }
        }
        continue;
      }
      // strings: evita vacíos
      if (typeof val === "string") {
        const s = val.trim();
        if (s) out[key] = s;
        continue;
      }
      out[key] = val;
    }

    // Nunca enviar id/created_at
    delete out.id;
    delete out.created_at;

    if (Object.keys(out).length === 0) {
      throw new Error("Nada que actualizar: payload vacío tras sanitizar.");
    }
    return out;
  }

  async deleteProduct(id, token) {
    return this.request(this.config.ENDPOINTS.PRODUCT_BY_ID(id), {
      method: 'DELETE',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Métodos para categorías
  async getCategories() {
    return this.request(this.config.ENDPOINTS.CATEGORIES);
  }

  // Métodos para carrito
  async getCart(userId) {
    return this.request(`${this.config.ENDPOINTS.CART}?user_id=${userId}`);
  }

  async addToCart(productId, quantity = 1, userId = null) {
    return this.request(this.config.ENDPOINTS.ADD_TO_CART, {
      method: 'POST',
      data: {
        product_id: productId,
        quantity,
        user_id: userId
      }
    });
  }

  async removeFromCart(productId, userId = null) {
    return this.request(this.config.ENDPOINTS.REMOVE_FROM_CART, {
      method: 'DELETE',
      data: {
        product_id: productId,
        user_id: userId
      }
    });
  }

  async updateCart(productId, quantity, userId = null) {
    return this.request(this.config.ENDPOINTS.UPDATE_CART, {
      method: 'PUT',
      data: {
        product_id: productId,
        quantity,
        user_id: userId
      }
    });
  }

  // Métodos para autenticación
  async login(email, password) {
    return this.authRequest(this.config.ENDPOINTS.LOGIN, {
      method: 'POST',
      data: { email, password }
    });
  }

  async register(userData) {
    return this.authRequest(this.config.ENDPOINTS.REGISTER, {
      method: 'POST',
      data: userData
    });
  }

  async logout(token) {
    return this.authRequest(this.config.ENDPOINTS.LOGOUT, {
      method: 'POST',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async getProfile(token) {
    return this.authRequest(this.config.ENDPOINTS.PROFILE, {
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async updateProfile(token, userData) {
    return this.authRequest(this.config.ENDPOINTS.UPDATE_PROFILE, {
      method: 'PUT',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      },
      data: userData
    });
  }

  async changePassword(token, currentPassword, newPassword) {
    return this.authRequest(this.config.ENDPOINTS.CHANGE_PASSWORD, {
      method: 'POST',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      },
      data: {
        current_password: currentPassword,
        new_password: newPassword
      }
    });
  }

  async forgotPassword(email) {
    return this.authRequest(this.config.ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      data: { email }
    });
  }

  async resetPassword(token, password) {
    return this.authRequest(this.config.ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      data: { token, password }
    });
  }

  async verifyEmail(token) {
    return this.authRequest(this.config.ENDPOINTS.VERIFY_EMAIL, {
      method: 'POST',
      data: { token }
    });
  }

  async refreshToken(refreshToken) {
    return this.authRequest(this.config.ENDPOINTS.REFRESH_TOKEN, {
      method: 'POST',
      data: { refresh_token: refreshToken }
    });
  }

  // Métodos para órdenes
  async createOrder(orderData) {
    return this.request(this.config.ENDPOINTS.CREATE_ORDER, {
      method: 'POST',
      data: orderData
    });
  }

  async getOrderById(id) {
    return this.request(this.config.ENDPOINTS.ORDER_BY_ID(id));
  }

  async getUserOrders(userId) {
    return this.request(`${this.config.ENDPOINTS.ORDERS}?user_id=${userId}`);
  }

  // Métodos para contacto
  async sendContactMessage(messageData) {
    return this.request(this.config.ENDPOINTS.CONTACT, {
      method: 'POST',
      data: messageData
    });
  }

  // Métodos para blogs
  async getBlogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? 
      `${this.config.ENDPOINTS.BLOGS}?${queryString}` : 
      this.config.ENDPOINTS.BLOGS;
    
    return this.request(endpoint);
  }

  async getBlogById(id) {
    return this.request(this.config.ENDPOINTS.BLOG_BY_ID(id));
  }

  async getFeaturedBlogs() {
    return this.request(this.config.ENDPOINTS.FEATURED_BLOGS);
  }

  // Métodos para usuarios
  async getUsers(params = {}, token) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? 
      `${this.config.ENDPOINTS.USERS}?${queryString}` : 
      this.config.ENDPOINTS.USERS;
    
    // Usar la URL de autenticación para usuarios con token
    const options = token ? {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    } : {};
    
    return this.request(endpoint, options, this.config.AUTH_URL);
  }

  async createUser(userData, token) {
    return this.request(this.config.ENDPOINTS.CREATE_USER, {
      method: 'POST',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      },
      data: userData
    }, this.config.AUTH_URL);
  }

  async updateUser(id, userData, token) {
    return this.request(this.config.ENDPOINTS.UPDATE_USER(id), {
      method: 'PUT',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      },
      data: userData
    }, this.config.AUTH_URL);
  }

  async deleteUser(id, token) {
    return this.request(this.config.ENDPOINTS.DELETE_USER(id), {
      method: 'DELETE',
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      }
    }, this.config.AUTH_URL);
  }
}

// Función para sanitizar payload de productos
export function sanitizeProductPayload(input = {}) {
  const out = {};
  const keep = ["name", "description", "price", "stock", "brand", "category", "images", "active"];

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
        const arr = val.map(String).map(s => s.trim()).filter(Boolean);
        if (arr.length) out.images = arr;
      } else if (typeof val === "string") {
        if (val.includes(",")) {
          const arr = val.split(",").map(s => s.trim()).filter(Boolean);
          if (arr.length) out.images = arr;
        } else if (val.trim()) {
          out.images = [val.trim()];
        }
      }
      continue;
    }
    // strings: evita vacíos
    if (typeof val === "string") {
      const s = val.trim();
      if (s) out[key] = s;
      continue;
    }
    out[key] = val;
  }

  // Nunca enviar id/created_at
  delete out.id;
  delete out.created_at;

  if (Object.keys(out).length === 0) {
    throw new Error("Nada que actualizar: payload vacío tras sanitizar.");
  }
  return out;
}

// Función para sanitizar payload de creación de productos
export function sanitizeCreateProductPayload(input = {}) {
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
      if (typeof val === "string") {
        out.active = val.toLowerCase() === "true";
      } else {
        out.active = Boolean(val);
      }
      continue;
    }
    // strings: evita vacíos
    if (typeof val === "string") {
      const s = val.trim();
      if (s) out[key] = s;
      continue;
    }
    out[key] = val;
  }

  if (Object.keys(out).length === 0) {
    throw new Error("Nada que crear: payload vacío tras sanitizar.");
  }
  return out;
}


// Crear instancia de la API
const xanoAPI = new XanoAPI();

export default xanoAPI;
export { XANO_CONFIG };
