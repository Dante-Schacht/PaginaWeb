// Script para probar el endpoint de usuarios corregido
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🧪 Probando endpoint de usuarios corregido...');

async function testUsersEndpoint() {
  try {
    const token = localStorage.getItem('electroverse-token') || localStorage.getItem('token');
    
    if (!token) {
      console.log('❌ No hay token de autenticación');
      return;
    }
    
    console.log('✅ Token encontrado');
    
    // Probar el endpoint corregido
    const authUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C/user';
    console.log('📡 Probando endpoint:', authUrl);
    
    const response = await fetch(authUrl, {
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
    
  } catch (error) {
    console.error('❌ Error de red:', error);
  }
}

// Ejecutar la prueba
testUsersEndpoint();

console.log('\n📋 Instrucciones:');
console.log('1. Asegúrate de estar logueado como admin');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console');
console.log('4. Copia y pega este script completo');
console.log('5. Presiona Enter para ejecutar');
console.log('6. Verifica que el endpoint funcione correctamente');
