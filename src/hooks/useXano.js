import { useState, useEffect, useCallback } from 'react';
import xanoAPI from '../config/xano';

// Hook para manejar el estado de carga y errores
export const useXanoState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeRequest = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestFn();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, executeRequest };
};

// Hook para productos
export const useProducts = (params = {}) => {
  const { loading, error, executeRequest } = useXanoState();
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await executeRequest(() => xanoAPI.getProducts(params));
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }, [params, executeRequest]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

// Hook para un producto específico
export const useProduct = (id) => {
  const { loading, error, executeRequest } = useXanoState();
  const [product, setProduct] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    try {
      const data = await executeRequest(() => xanoAPI.getProductById(id));
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
    }
  }, [id, executeRequest]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
};

// Hook para categorías
export const useCategories = () => {
  const { loading, error, executeRequest } = useXanoState();
  const [categories, setCategories] = useState([]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await executeRequest(() => xanoAPI.getCategories());
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, [executeRequest]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

// Hook para búsqueda de productos
export const useProductSearch = () => {
  const { loading, error, executeRequest } = useXanoState();
  const [searchResults, setSearchResults] = useState([]);

  const searchProducts = useCallback(async (query, params = {}) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const data = await executeRequest(() => xanoAPI.searchProducts(query, params));
      setSearchResults(data);
    } catch (err) {
      console.error('Error searching products:', err);
    }
  }, [executeRequest]);

  return { searchResults, loading, error, searchProducts };
};

// Hook para carrito
export const useCart = (userId = null) => {
  const { loading, error, executeRequest } = useXanoState();
  const [cart, setCart] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!userId) return;
    
    try {
      const data = await executeRequest(() => xanoAPI.getCart(userId));
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  }, [userId, executeRequest]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      await executeRequest(() => xanoAPI.addToCart(productId, quantity, userId));
      fetchCart(); // Refetch cart after adding
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  }, [userId, executeRequest, fetchCart]);

  const removeFromCart = useCallback(async (productId) => {
    try {
      await executeRequest(() => xanoAPI.removeFromCart(productId, userId));
      fetchCart(); // Refetch cart after removing
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  }, [userId, executeRequest, fetchCart]);

  const updateCartItem = useCallback(async (productId, quantity) => {
    try {
      await executeRequest(() => xanoAPI.updateCart(productId, quantity, userId));
      fetchCart(); // Refetch cart after updating
    } catch (err) {
      console.error('Error updating cart:', err);
    }
  }, [userId, executeRequest, fetchCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateCartItem,
    refetch: fetchCart
  };
};

// Hook para autenticación
export const useAuth = () => {
  const { loading, error, executeRequest } = useXanoState();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (email, password) => {
    try {
      const data = await executeRequest(() => xanoAPI.login(email, password));
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('auth_token', data.token);
      return data;
    } catch (err) {
      console.error('Error logging in:', err);
      throw err;
    }
  }, [executeRequest]);

  const register = useCallback(async (userData) => {
    try {
      const data = await executeRequest(() => xanoAPI.register(userData));
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('auth_token', data.token);
      return data;
    } catch (err) {
      console.error('Error registering:', err);
      throw err;
    }
  }, [executeRequest]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
  }, []);

  const getProfile = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const data = await executeRequest(() => xanoAPI.getProfile(token));
      setUser(data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error fetching profile:', err);
      logout();
    }
  }, [executeRequest, logout]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    getProfile
  };
};

// Hook para blogs
export const useBlogs = (params = {}) => {
  const { loading, error, executeRequest } = useXanoState();
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = useCallback(async () => {
    try {
      const data = await executeRequest(() => xanoAPI.getBlogs(params));
      setBlogs(data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  }, [params, executeRequest]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, refetch: fetchBlogs };
};

// Hook para un blog específico
export const useBlog = (id) => {
  const { loading, error, executeRequest } = useXanoState();
  const [blog, setBlog] = useState(null);

  const fetchBlog = useCallback(async () => {
    if (!id) return;
    
    try {
      const data = await executeRequest(() => xanoAPI.getBlogById(id));
      setBlog(data);
    } catch (err) {
      console.error('Error fetching blog:', err);
    }
  }, [id, executeRequest]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  return { blog, loading, error, refetch: fetchBlog };
};

// Hook para blogs destacados
export const useFeaturedBlogs = () => {
  const { loading, error, executeRequest } = useXanoState();
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

  const fetchFeaturedBlogs = useCallback(async () => {
    try {
      const data = await executeRequest(() => xanoAPI.getFeaturedBlogs());
      setFeaturedBlogs(data);
    } catch (err) {
      console.error('Error fetching featured blogs:', err);
    }
  }, [executeRequest]);

  useEffect(() => {
    fetchFeaturedBlogs();
  }, [fetchFeaturedBlogs]);

  return { featuredBlogs, loading, error, refetch: fetchFeaturedBlogs };
};

// Hook para contacto
export const useContact = () => {
  const { loading, error, executeRequest } = useXanoState();

  const sendMessage = useCallback(async (messageData) => {
    try {
      const data = await executeRequest(() => xanoAPI.sendContactMessage(messageData));
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  }, [executeRequest]);

  return { sendMessage, loading, error };
};
