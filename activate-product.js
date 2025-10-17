// Script para activar productos desde el admin panel
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🔧 Script para activar productos...');

async function activateProduct(productId) {
  try {
    const token = localStorage.getItem('electroverse-token');
    if (!token) {
      console.log('❌ No hay token de autenticación. Inicia sesión como admin.');
      return;
    }

    console.log('🔑 Token encontrado, activando producto...');
    
    // Datos para activar el producto
    const updateData = {
      active: true
    };

    const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX/product/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Producto activado exitosamente:', result);
      return result;
    } else {
      const error = await response.text();
      console.error('❌ Error al activar producto:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error de red:', error);
    return null;
  }
}

// Función para activar el producto Logitech G Pro X Superlight 2 (ID: 37)
async function activateLogitechProduct() {
  console.log('🎯 Activando producto Logitech G Pro X Superlight 2 (ID: 37)...');
  const result = await activateProduct(37);
  
  if (result) {
    console.log('🎉 ¡Producto activado! Ahora debería aparecer en el frontend.');
    console.log('📋 Próximos pasos:');
    console.log('1. Recarga la página de productos');
    console.log('2. Busca el producto Logitech G Pro X Superlight 2');
    console.log('3. Verifica que las imágenes se muestren correctamente');
  } else {
    console.log('❌ No se pudo activar el producto. Verifica:');
    console.log('- Que estés logueado como admin');
    console.log('- Que el token sea válido');
    console.log('- Que el producto exista');
  }
}

// Función para listar todos los productos y su estado
async function listAllProducts() {
  try {
    console.log('📋 Obteniendo lista de productos...');
    const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX/product');
    const products = await response.json();
    
    console.log('📊 Productos encontrados:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ID: ${product.id} | Nombre: ${product.name} | Activo: ${product.active} | Imágenes: ${product.images?.length || 0}`);
    });
    
    return products;
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    return [];
  }
}

// Ejecutar funciones
console.log('🚀 Ejecutando script...');

// Primero listar productos
listAllProducts().then(() => {
  // Luego activar el producto Logitech
  activateLogitechProduct();
});

console.log('\n📋 Instrucciones:');
console.log('1. Asegúrate de estar logueado como admin');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console');
console.log('4. Copia y pega este script completo');
console.log('5. Presiona Enter para ejecutar');
