// Adaptador para mapear datos de la API de Xano a la estructura esperada por la aplicación

// Mapear producto de Xano a estructura de la aplicación
export const mapProduct = (xanoProduct) => {
  return {
    id: xanoProduct.id,
    name: xanoProduct.name,
    description: xanoProduct.description || '',
    price: xanoProduct.price,
    originalPrice: xanoProduct.original_price || null,
    category: xanoProduct.category,
    brand: xanoProduct.brand,
    image: xanoProduct.images && xanoProduct.images.length > 0 
      ? xanoProduct.images[0].path || '/ImagenHome.png'
      : '/ImagenHome.png',
    stock: xanoProduct.stock || 0,
    isNew: xanoProduct.is_new || false,
    discount: xanoProduct.discount || 0,
    rating: xanoProduct.rating || 0,
    reviews: xanoProduct.reviews || 0,
    active: xanoProduct.active !== false,
    createdAt: xanoProduct.created_at ? new Date(xanoProduct.created_at) : new Date()
  };
};

// Mapear categoría de Xano a estructura de la aplicación
export const mapCategory = (xanoCategory) => {
  return {
    id: xanoCategory.id,
    name: xanoCategory.name,
    slug: xanoCategory.slug || xanoCategory.name.toLowerCase().replace(/\s+/g, '-'),
    description: xanoCategory.description || '',
    createdAt: xanoCategory.created_at ? new Date(xanoCategory.created_at) : new Date()
  };
};

// Mapear usuario de Xano a estructura de la aplicación
export const mapUser = (xanoUser) => {
  return {
    id: xanoUser.id,
    name: `${xanoUser.first_name || ''} ${xanoUser.last_name || ''}`.trim(),
    firstName: xanoUser.first_name || '',
    lastName: xanoUser.last_name || '',
    email: xanoUser.email,
    role: xanoUser.role || 'user',
    isActive: xanoUser.is_active !== false,
    createdAt: xanoUser.created_at ? new Date(xanoUser.created_at) : new Date()
  };
};

// Obtener categorías únicas desde los productos
export const extractCategoriesFromProducts = (products) => {
  const categoryMap = new Map();
  
  products.forEach(product => {
    if (product.category && !categoryMap.has(product.category)) {
      categoryMap.set(product.category, {
        id: product.category,
        name: product.category,
        slug: product.category.toLowerCase().replace(/\s+/g, '-'),
        description: `Productos de la categoría ${product.category}`
      });
    }
  });
  
  return Array.from(categoryMap.values());
};

// Mapear respuesta de login de Xano
export const mapLoginResponse = (xanoResponse) => {
  return {
    success: true,
    user: mapUser(xanoResponse.user || xanoResponse),
    token: xanoResponse.authToken || xanoResponse.token,
    refreshToken: xanoResponse.refreshToken
  };
};

// Mapear respuesta de registro de Xano
export const mapRegisterResponse = (xanoResponse) => {
  return {
    success: true,
    user: mapUser(xanoResponse.user || xanoResponse),
    token: xanoResponse.authToken || xanoResponse.token,
    refreshToken: xanoResponse.refreshToken
  };
};

// Mapear error de Xano
export const mapError = (xanoError) => {
  if (typeof xanoError === 'string') {
    return xanoError;
  }
  
  if (xanoError.message) {
    return xanoError.message;
  }
  
  if (xanoError.error) {
    return xanoError.error;
  }
  
  return 'Error desconocido';
};

// Validar si un producto está disponible
export const isProductAvailable = (product) => {
  return product.active && product.stock > 0;
};

// Formatear precio para mostrar
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Calcular descuento
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) {
    return 0;
  }
  
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Filtrar productos por categoría
export const filterProductsByCategory = (products, category) => {
  if (!category) return products;
  
  return products.filter(product => 
    product.category && product.category.toLowerCase() === category.toLowerCase()
  );
};

// Buscar productos por nombre
export const searchProducts = (products, query) => {
  if (!query) return products;
  
  const searchTerm = query.toLowerCase();
  
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm)
  );
};
