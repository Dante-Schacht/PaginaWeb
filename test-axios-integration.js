// Script para probar que axios está funcionando correctamente en el proyecto
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🧪 Probando integración de axios en el proyecto...');

// Verificar que axios esté disponible
if (typeof axios === 'undefined') {
  console.log('❌ Axios no está disponible. Cargando desde CDN...');
  // Cargar axios desde CDN
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
  script.onload = () => {
    console.log('✅ Axios cargado desde CDN');
    runTests();
  };
  document.head.appendChild(script);
} else {
  console.log('✅ Axios está disponible');
  runTests();
}

async function runTests() {
  try {
    // Probar una API pública para verificar que axios funciona
    console.log('📡 Probando axios con API pública...');
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('✅ Axios funciona correctamente:', response.data);
    
    // Probar la API de Xano (sin credenciales)
    console.log('🔐 Probando conexión con Xano...');
    try {
      const xanoResponse = await axios.get('https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX/product');
      console.log('✅ Conexión con Xano exitosa:', xanoResponse.data);
    } catch (xanoError) {
      console.log('⚠️ Error esperado de Xano (sin autenticación):', xanoError.response?.status);
    }
    
    console.log('🎉 ¡Todas las pruebas de axios completadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

console.log('📋 Instrucciones:');
console.log('1. Abre http://localhost:5173 en tu navegador');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console');
console.log('4. Copia y pega este script completo');
console.log('5. Presiona Enter para ejecutar');
