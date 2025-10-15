// Xano API Configuration
const XANO_CONFIG = {
  // Base URL de tu API de Xano
  BASE_URL: process.env.REACT_APP_XANO_BASE_URL || 'https://your-workspace.xano.io/api:your-api-group',
  
  // Endpoints
  ENDPOINTS: {
    // Productos
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id) => `/products/${id}`,
    PRODUCTS_BY_CATEGORY: (category) => `/products?category=${category}`,
    SEARCH_PRODUCTS: (query) => `/products/search?q=${query}`,
    
    // Categorías
    CATEGORIES: '/categories',
    
    // Carrito (si usas Xano para manejar carritos)
    CART: '/cart',
    ADD_TO_CART: '/cart/add',
    REMOVE_FROM_CART: '/cart/remove',
    UPDATE_CART: '/cart/update',
    
    // Usuarios
    USERS: '/users',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    
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
  }

  // Método para hacer requests HTTP
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: this.config.DEFAULT_HEADERS,
      timeout: this.config.TIMEOUT,
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Xano API Error:', error);
      throw error;
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
      body: JSON.stringify({
        product_id: productId,
        quantity,
        user_id: userId
      })
    });
  }

  async removeFromCart(productId, userId = null) {
    return this.request(this.config.ENDPOINTS.REMOVE_FROM_CART, {
      method: 'DELETE',
      body: JSON.stringify({
        product_id: productId,
        user_id: userId
      })
    });
  }

  async updateCart(productId, quantity, userId = null) {
    return this.request(this.config.ENDPOINTS.UPDATE_CART, {
      method: 'PUT',
      body: JSON.stringify({
        product_id: productId,
        quantity,
        user_id: userId
      })
    });
  }

  // Métodos para autenticación
  async login(email, password) {
    return this.request(this.config.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData) {
    return this.request(this.config.ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getProfile(token) {
    return this.request(this.config.ENDPOINTS.PROFILE, {
      headers: {
        ...this.config.DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Métodos para órdenes
  async createOrder(orderData) {
    return this.request(this.config.ENDPOINTS.CREATE_ORDER, {
      method: 'POST',
      body: JSON.stringify(orderData)
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
      body: JSON.stringify(messageData)
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
}

// Crear instancia de la API
const xanoAPI = new XanoAPI();

export default xanoAPI;
export { XANO_CONFIG };
