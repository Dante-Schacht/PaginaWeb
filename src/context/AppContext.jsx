import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import authService from '../services/authService';

// Estado inicial
const initialState = {
  products: [],
  cart: [],
  user: null,
  loading: false,
  error: null,
  categories: [
    { id: 1, name: 'Mouses', slug: 'mouses' },
    { id: 2, name: 'Teclados', slug: 'teclados' },
    { id: 3, name: 'Micrófonos', slug: 'microfonos' },
    { id: 4, name: 'Monitores', slug: 'monitores' },
    { id: 5, name: 'Parlantes', slug: 'parlantes' },
    { id: 6, name: 'Televisores', slug: 'televisores' },
    { id: 7, name: 'Teléfonos', slug: 'telefonos' },
    { id: 8, name: 'Audífonos', slug: 'audifonos' },
    { id: 9, name: 'Smartwatches', slug: 'smartwatches' }
  ]
};

// Tipos de acciones
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_USER: 'SET_USER',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.SET_PRODUCTS:
      return { ...state, products: action.payload, loading: false };
    
    case ACTIONS.ADD_TO_CART:
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };
    
    case ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case ACTIONS.UPDATE_CART_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case ACTIONS.CLEAR_CART:
      return { ...state, cart: [] };
    
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    
    case ACTIONS.LOGIN:
      console.log('🔍 Reducer - LOGIN action dispatched with payload:', action.payload);
      return { ...state, user: action.payload, loading: false };
    
    case ACTIONS.LOGOUT:
      return { ...state, user: null, cart: [] };
    
    case ACTIONS.REGISTER:
      return { ...state, user: action.payload, loading: false };
    
    default:
      return state;
  }
};

// Crear context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Funciones para manejar el carrito (usando useCallback)
  const addToCart = useCallback((product) => {
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: product });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productId });
  }, []);

  const updateCartQuantity = useCallback((productId, quantity) => {
    dispatch({ type: ACTIONS.UPDATE_CART_QUANTITY, payload: { id: productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  }, []);

  // Funciones para productos (usando useCallback para evitar recreación)
  const setProducts = useCallback((products) => {
    dispatch({ type: ACTIONS.SET_PRODUCTS, payload: products });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  // Funciones de autenticación con Xano (usando useCallback)
  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const result = await authService.login(email, password);
      console.log('🔍 AppContext - Login result:', result);
      
      if (result.success) {
        console.log('🔍 AppContext - Dispatching LOGIN with user:', result.user);
        dispatch({ type: ACTIONS.LOGIN, payload: result.user });
        return { success: true };
      } else {
        dispatch({ type: ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Error de conexión. Intenta nuevamente.';
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const userData = {
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' ') || '',
        email: email,
        password: password,
        role: 'user' // Rol por defecto
      };
      
      const result = await authService.register(userData);
      
      if (result.success) {
        dispatch({ type: ACTIONS.REGISTER, payload: result.user });
        return { success: true };
      } else {
        dispatch({ type: ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Error de conexión. Intenta nuevamente.';
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: ACTIONS.LOGOUT });
    }
  }, []);

  // Funciones adicionales de autenticación
  const updateProfile = useCallback(async (userData) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const result = await authService.updateProfile(userData);
      
      if (result.success) {
        dispatch({ type: ACTIONS.SET_USER, payload: result.user });
        return { success: true, user: result.user };
      } else {
        dispatch({ type: ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Error al actualizar perfil';
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const result = await authService.changePassword(currentPassword, newPassword);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        dispatch({ type: ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Error al cambiar contraseña';
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        dispatch({ type: ACTIONS.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Error al enviar email de recuperación';
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Verificar roles
  const hasRole = useCallback((role) => {
    return authService.hasRole(role);
  }, []);

  const isAdmin = useCallback(() => {
    return authService.isAdmin();
  }, []);

  const isVendedor = useCallback(() => {
    return authService.isVendedor();
  }, []);

  // Calcular total del carrito usando useMemo
  const cartTotal = useMemo(() => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [state.cart]);

  const cartItemsCount = useMemo(() => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  }, [state.cart]);

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('electroverse-cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        cart.forEach(item => {
          dispatch({ type: ACTIONS.ADD_TO_CART, payload: item });
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    // Cargar usuario del servicio de autenticación
    if (authService.isAuthenticated()) {
      const user = authService.getUser();
      if (user) {
        dispatch({ type: ACTIONS.SET_USER, payload: user });
      }
    }
  }, []); // Dependencias vacías para que solo se ejecute una vez

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('electroverse-cart', JSON.stringify(state.cart));
  }, [state.cart]);

  const value = useMemo(() => ({
    ...state,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setProducts,
    setLoading,
    setError,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    hasRole,
    isAdmin,
    isVendedor,
    cartTotal,
    cartItemsCount
  }), [
    state,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setProducts,
    setLoading,
    setError,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    hasRole,
    isAdmin,
    isVendedor,
    cartTotal,
    cartItemsCount
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar el context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
