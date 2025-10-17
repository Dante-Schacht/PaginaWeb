// Script para probar el endpoint corregido
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🔧 Probando endpoint corregido...');

async function testCorrectedEndpoint() {
  try {
    const token = localStorage.getItem('electroverse-token') || localStorage.getItem('token');
    
    if (!token) {
      console.log('❌ No hay token de autenticación');
      return;
    }
    
    console.log('✅ Token encontrado');
    
    // URL corregida - solo /user
    const correctUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C/user';
    console.log('📡 URL corregida:', correctUrl);
    
    const response = await fetch(correctUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📊 Status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Usuarios obtenidos exitosamente:', data);
      console.log('📋 Cantidad de usuarios:', Array.isArray(data) ? data.length : 'No es array');
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('👤 Primer usuario:', data[0]);
      }
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
    }
    
    // Verificar que no sea /user/user
    if (response.url.includes('/user/user')) {
      console.log('❌ PROBLEMA: URL duplicada detectada');
    } else {
      console.log('✅ URL correcta sin duplicación');
    }
    
  } catch (error) {
    console.error('❌ Error de red:', error);
  }
}

// Ejecutar la prueba
testCorrectedEndpoint();

console.log('\n📋 Verificaciones:');
console.log('✅ URL debe ser: /api:QbleTY9C/user');
console.log('❌ NO debe ser: /api:QbleTY9C/user/user');
console.log('✅ Debe devolver 200 OK con lista de usuarios');
console.log('❌ NO debe devolver 404 Not Found');
