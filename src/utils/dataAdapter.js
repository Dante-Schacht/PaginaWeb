// Adaptador para mapear datos de la API de Xano a la estructura esperada por la aplicación

// Mapear producto de Xano a estructura de la aplicación
export const mapProduct = (xanoProduct) => {
  console.log('mapProduct: Mapeando producto de Xano:', xanoProduct);
  
  // Mapear categorías de Xano a nombres consistentes
  const categoryMap = {
    'Mouse': 'Mouse',
    'Teclado': 'Teclado',
    'Monitor': 'Monitor',
    'Audífono': 'Audífono',
    'Micrófono': 'Micrófono',
    'Parlante': 'Parlante',
    'Televisor': 'Televisor',
    'Teléfono': 'Teléfono',
    'Smartwatch': 'Smartwatch'
  };

  // Generar datos adicionales que no están en Xano
  const generateAdditionalData = (product) => {
    const baseRating = 4.0 + Math.random() * 1.0; // Rating entre 4.0 y 5.0
    const reviews = Math.floor(Math.random() * 2000) + 100; // Reviews entre 100 y 2100
    const isNew = Math.random() > 0.7; // 30% chance de ser nuevo
    const hasDiscount = Math.random() > 0.6; // 40% chance de tener descuento
    
    let originalPrice = null;
    let discount = 0;
    
    if (hasDiscount) {
      discount = Math.floor(Math.random() * 30) + 10; // Descuento entre 10% y 40%
      originalPrice = Math.round(product.price / (1 - discount / 100));
    }

    // Generar detalles específicos del producto
    const generateProductDetails = (productName, category) => {
      const detailsMap = {
        'Teclado': {
          features: ['Switches mecánicos', 'Retroiluminación RGB', 'Anti-ghosting', 'Cable desmontable'],
          specifications: {
            'Tipo de switch': 'Mecánico',
            'Retroiluminación': 'RGB personalizable',
            'Conectividad': 'USB-C',
            'Compatibilidad': 'Windows, Mac, Linux'
          }
        },
        'Mouse': {
          features: ['Sensor óptico de alta precisión', 'Botones programables', 'Peso ajustable', 'Cable flexible'],
          specifications: {
            'DPI': 'Hasta 12,000 DPI',
            'Polling Rate': '1000 Hz',
            'Conectividad': 'USB',
            'Botones': '6 botones programables'
          }
        },
        'Monitor': {
          features: ['Panel IPS', 'Alta frecuencia de actualización', 'Tecnología HDR', 'Ajuste de altura'],
          specifications: {
            'Tamaño': '27 pulgadas',
            'Resolución': '2560x1440',
            'Frecuencia': '144 Hz',
            'Tiempo de respuesta': '1ms'
          }
        },
        'Audífonos': {
          features: ['Cancelación de ruido activa', 'Audio de alta fidelidad', 'Micrófono integrado', 'Batería de larga duración'],
          specifications: {
            'Tipo': 'Over-ear',
            'Conectividad': 'Bluetooth 5.0',
            'Batería': 'Hasta 30 horas',
            'Cancelación de ruido': 'Activa'
          }
        },
        'Micrófono': {
          features: ['Patrón cardioide', 'Filtro de pop integrado', 'Conectividad USB', 'Control de ganancia'],
          specifications: {
            'Tipo': 'Condensador',
            'Patrón': 'Cardioide',
            'Frecuencia': '20Hz - 20kHz',
            'Conectividad': 'USB'
          }
        }
      };

      // Buscar coincidencias en el nombre del producto
      for (const [key, details] of Object.entries(detailsMap)) {
        if (productName.toLowerCase().includes(key.toLowerCase())) {
          return details;
        }
      }

      // Detalles genéricos si no hay coincidencia
      return {
        features: ['Alta calidad', 'Diseño ergonómico', 'Fácil instalación', 'Garantía extendida'],
        specifications: {
          'Marca': product.brand || 'ElectroVerse',
          'Categoría': category,
          'Garantía': '1 año',
          'Origen': 'Importado'
        }
      };
    };

    const productDetails = generateProductDetails(product.name, categoryMap[product.category] || product.category);

    return {
      rating: Math.round(baseRating * 10) / 10,
      reviews,
      isNew,
      originalPrice,
      discount,
      additionalImages: [],
      features: productDetails.features,
      specifications: productDetails.specifications,
      detailedDescription: `${product.description} Este producto está diseñado para ofrecer la mejor experiencia de usuario con tecnología de vanguardia y materiales de alta calidad.`,
      shippingInfo: {
        freeShipping: product.price > 100000,
        estimatedDelivery: '2-5 días hábiles',
        returnPolicy: '30 días de garantía de devolución'
      }
    };
  };

  const additionalData = generateAdditionalData(xanoProduct);

  // Procesar imágenes de Xano
  const processImages = (xanoImages) => {
    console.log('🔍 processImages - Input:', xanoImages);
    
    if (!xanoImages || !Array.isArray(xanoImages)) {
      console.log('❌ processImages - No es array o es null/undefined');
      return null; // No hay imágenes, retornar null en lugar de imagen por defecto
    }
    
    console.log('✅ processImages - Es array, procesando...');
    
    const images = xanoImages
      .filter(img => {
        console.log('🔍 processImages - Filtrando imagen:', img);
        const candidate = img && (img.path || img.url);
        return !!(candidate && String(candidate).trim());
      })
      .map(img => {
        const candidate = img.path || img.url;
        console.log('🔍 processImages - Mapeando imagen:', candidate);
        return candidate;
      });
    
    console.log('✅ processImages - Imágenes válidas encontradas:', images);
    return images.length > 0 ? images : null; // Retornar null si no hay imágenes válidas
  };

  console.log('🔍 mapProduct - Procesando imágenes para:', xanoProduct.name);
  console.log('🔍 mapProduct - xanoProduct.images:', xanoProduct.images);
  
  const processedImages = processImages(xanoProduct.images);
  console.log('🔍 mapProduct - processedImages:', processedImages);
  
  const mappedProduct = {
    id: xanoProduct.id,
    name: xanoProduct.name,
    description: xanoProduct.description || '',
    price: xanoProduct.price,
    originalPrice: additionalData.originalPrice,
    category: categoryMap[xanoProduct.category] || xanoProduct.category,
    brand: xanoProduct.brand,
    image: processedImages?.[0] || null,
    additionalImages: processedImages || [],
    images: processedImages || [],
    stock: xanoProduct.stock || 0,
    isNew: additionalData.isNew,
    discount: additionalData.discount,
    rating: additionalData.rating,
    reviews: additionalData.reviews,
    active: xanoProduct.active !== false,
    createdAt: xanoProduct.created_at ? new Date(xanoProduct.created_at) : new Date(),
    // Nuevos campos para detalles
    features: additionalData.features,
    specifications: additionalData.specifications,
    detailedDescription: additionalData.detailedDescription,
    shippingInfo: additionalData.shippingInfo
  };
  
  console.log('🔍 mapProduct - mappedProduct.image:', mappedProduct.image);
  console.log('🔍 mapProduct - mappedProduct.additionalImages:', mappedProduct.additionalImages);
  
  console.log('mapProduct: Producto mapeado:', mappedProduct);
  return mappedProduct;
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
