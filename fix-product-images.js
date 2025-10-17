// Script completo para diagnosticar y solucionar el problema de imágenes
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🔧 Script completo para diagnosticar y solucionar imágenes de productos...');

async function diagnoseImageProblem() {
  console.log('\n🔍 PASO 1: Diagnóstico completo del problema...');
  
  try {
    // 1. Verificar autenticación
    const token = localStorage.getItem('electroverse-token');
    console.log('🔑 Token de autenticación:', token ? '✅ Presente' : '❌ Ausente');
    
    // 2. Obtener datos brutos de Xano
    console.log('\n📡 Obteniendo datos de Xano...');
    const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX/product');
    const rawProducts = await response.json();
    
    console.log('📊 Productos obtenidos de Xano:', rawProducts.length);
    
    // 3. Analizar cada producto
    rawProducts.forEach((product, index) => {
      console.log(`\n📦 Producto ${index + 1}: ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Activo: ${product.active}`);
      console.log(`   Imágenes:`, product.images);
      console.log(`   Tipo de imágenes:`, typeof product.images);
      console.log(`   Es array:`, Array.isArray(product.images));
      
      if (product.images && Array.isArray(product.images)) {
        console.log(`   Cantidad de imágenes:`, product.images.length);
        product.images.forEach((img, imgIndex) => {
          console.log(`     Imagen ${imgIndex + 1}:`, {
            objeto: img,
            path: img?.path,
            pathType: typeof img?.path,
            pathTrimmed: img?.path?.trim(),
            pathValido: img?.path && img?.path?.trim() !== ''
          });
        });
      }
    });
    
    // 4. Buscar el producto Logitech específicamente
    const logitechProduct = rawProducts.find(p => p.id === 37);
    if (logitechProduct) {
      console.log('\n🎯 PRODUCTO LOGITECH ENCONTRADO:');
      console.log('   Nombre:', logitechProduct.name);
      console.log('   Activo:', logitechProduct.active);
      console.log('   Imágenes:', logitechProduct.images);
      
      if (logitechProduct.images && Array.isArray(logitechProduct.images)) {
        console.log('   Procesando imágenes...');
        const validImages = logitechProduct.images
          .filter(img => img && img.path && img.path.trim() !== '')
          .map(img => img.path);
        console.log('   Imágenes válidas:', validImages);
      }
    }
    
    return rawProducts;
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
    return [];
  }
}

async function fixProductIssues(products) {
  console.log('\n🔧 PASO 2: Solucionando problemas encontrados...');
  
  const token = localStorage.getItem('electroverse-token');
  if (!token) {
    console.log('❌ No hay token. No se pueden hacer cambios.');
    return;
  }
  
  // Buscar productos inactivos
  const inactiveProducts = products.filter(p => p.active === false || p.active === null);
  console.log('🚫 Productos inactivos encontrados:', inactiveProducts.length);
  
  if (inactiveProducts.length > 0) {
    console.log('📋 Productos inactivos:');
    inactiveProducts.forEach(product => {
      console.log(`   - ${product.name} (ID: ${product.id})`);
    });
    
    // Activar el producto Logitech si está inactivo
    const logitechProduct = inactiveProducts.find(p => p.id === 37);
    if (logitechProduct) {
      console.log('\n🎯 Activando producto Logitech...');
      try {
        const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX/product/37`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ active: true })
        });
        
        if (response.ok) {
          console.log('✅ Producto Logitech activado exitosamente!');
        } else {
          console.error('❌ Error al activar producto Logitech:', await response.text());
        }
      } catch (error) {
        console.error('❌ Error de red al activar producto:', error);
      }
    }
  }
}

async function testImageProcessing() {
  console.log('\n🧪 PASO 3: Probando procesamiento de imágenes...');
  
  // Simular el procesamiento que hace dataAdapter
  const testProduct = {
    id: 37,
    name: "Logitech G Pro X Superlight 2",
    images: [
      { path: "https://example.com/image1.jpg" },
      { path: "https://example.com/image2.jpg" },
      { path: "" }, // Imagen vacía
      null, // Imagen nula
      { path: "https://example.com/image3.jpg" }
    ]
  };
  
  console.log('📦 Producto de prueba:', testProduct);
  
  // Procesar imágenes como lo hace el dataAdapter
  const processImages = (xanoImages) => {
    console.log('🔍 processImages - Input:', xanoImages);
    
    if (!xanoImages || !Array.isArray(xanoImages)) {
      console.log('❌ processImages - No es array o es null/undefined');
      return null;
    }
    
    console.log('✅ processImages - Es array, procesando...');
    
    const images = xanoImages
      .filter(img => {
        console.log('🔍 processImages - Filtrando imagen:', img);
        return img && img.path && img.path.trim() !== '';
      })
      .map(img => {
        console.log('🔍 processImages - Mapeando imagen:', img.path);
        return img.path;
      });
    
    console.log('✅ processImages - Imágenes válidas encontradas:', images);
    return images.length > 0 ? images : null;
  };
  
  const result = processImages(testProduct.images);
  console.log('🎯 Resultado del procesamiento:', result);
}

async function main() {
  console.log('🚀 Iniciando diagnóstico completo...');
  
  // Paso 1: Diagnóstico
  const products = await diagnoseImageProblem();
  
  // Paso 2: Solucionar problemas
  await fixProductIssues(products);
  
  // Paso 3: Probar procesamiento
  await testImageProcessing();
  
  console.log('\n🎉 Diagnóstico completado!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Si se activó el producto, recarga la página');
  console.log('2. Ve a la página de productos');
  console.log('3. Busca el producto Logitech G Pro X Superlight 2');
  console.log('4. Verifica que las imágenes se muestren');
  console.log('5. Si aún no se ven, revisa los logs de la consola');
}

// Ejecutar el diagnóstico completo
main();

console.log('\n📋 Instrucciones:');
console.log('1. Asegúrate de estar logueado como admin');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console');
console.log('4. Copia y pega este script completo');
console.log('5. Presiona Enter para ejecutar');
console.log('6. Revisa todos los logs para identificar el problema');
