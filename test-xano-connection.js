// Script para probar la conexión con Xano
// Ejecutar en la consola del navegador

console.log('🧪 Probando conexión con Xano...');

// Configuración de Xano
const XANO_CONFIG = {
  API_URL: 'https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX',
  AUTH_URL: 'https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C'
};

// Función para probar la conexión
async function testXanoConnection() {
  try {
    console.log('📡 Probando API de productos...');
    
    // Probar endpoint de productos
    const productsResponse = await fetch(`${XANO_CONFIG.API_URL}/products`);
    console.log('✅ API de productos:', productsResponse.status);
    
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log('📦 Productos encontrados:', products.length || 0);
    }
    
    console.log('🔐 Probando API de autenticación...');
    
    // Probar endpoint de autenticación
    const authResponse = await fetch(`${XANO_CONFIG.AUTH_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    console.log('✅ API de autenticación:', authResponse.status);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('🔑 Respuesta de auth:', authData);
    } else {
      const errorData = await authResponse.json();
      console.log('⚠️ Error de auth (esperado):', errorData);
    }
    
    console.log('🎉 ¡Conexión con Xano exitosa!');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

// Ejecutar prueba
testXanoConnection();
