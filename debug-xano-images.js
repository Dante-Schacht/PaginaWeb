// Script para debuggear las imágenes de Xano
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🔍 Debuggeando imágenes de Xano...');

async function debugXanoImages() {
  try {
    // 1. Obtener datos directamente de Xano
    console.log('📡 Obteniendo datos directamente de Xano...');
    const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX/product');
    const rawData = await response.json();
    
    console.log('📊 Datos brutos de Xano:', rawData);
    
    // 2. Analizar cada producto
    rawData.forEach((product, index) => {
      console.log(`\n📦 Producto ${index + 1}:`, {
        id: product.id,
        name: product.name,
        images: product.images,
        active: product.active,
        imagesType: typeof product.images,
        imagesIsArray: Array.isArray(product.images),
        imagesLength: product.images?.length
      });
      
      // 3. Procesar imágenes como lo hace el dataAdapter
      if (product.images && Array.isArray(product.images)) {
        console.log('🖼️ Imágenes encontradas:');
        product.images.forEach((img, imgIndex) => {
          console.log(`  Imagen ${imgIndex + 1}:`, {
            img: img,
            path: img?.path,
            pathType: typeof img?.path,
            pathTrimmed: img?.path?.trim()
          });
        });
        
        // Filtrar imágenes válidas
        const validImages = product.images
          .filter(img => img && img.path && img.path.trim() !== '')
          .map(img => img.path);
          
        console.log('✅ Imágenes válidas:', validImages);
      } else {
        console.log('❌ No hay imágenes o no es un array');
      }
    });
    
    // 4. Probar el dataAdapter
    console.log('\n🔄 Probando dataAdapter...');
    if (typeof mapProduct === 'function') {
      const mappedProduct = mapProduct(rawData[0]);
      console.log('📋 Producto mapeado:', {
        id: mappedProduct.id,
        name: mappedProduct.name,
        image: mappedProduct.image,
        additionalImages: mappedProduct.additionalImages
      });
    } else {
      console.log('⚠️ mapProduct no está disponible en el scope');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar debug
debugXanoImages();

console.log('\n📋 Instrucciones:');
console.log('1. Abre las herramientas de desarrollador (F12)');
console.log('2. Ve a la pestaña Console');
console.log('3. Copia y pega este script completo');
console.log('4. Presiona Enter para ejecutar');
console.log('5. Revisa los logs para identificar el problema');
