// Script para probar diferentes endpoints de usuarios en Xano
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🔍 Probando endpoints de usuarios en Xano...');

async function testUserEndpoints() {
  const baseURL = 'https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX';
  const token = localStorage.getItem('electroverse-token');
  
  console.log('🔑 Token encontrado:', token ? '✅ Sí' : '❌ No');
  
  const endpoints = [
    '/user',
    '/users',
    '/auth/user',
    '/auth/users',
    '/profile',
    '/profiles',
    '/account',
    '/accounts'
  ];
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  console.log('\n📡 Probando endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Probando: ${baseURL}${endpoint}`);
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: 'GET',
        headers: headers
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ ÉXITO! Datos:`, data);
        console.log(`   📊 Tipo de datos:`, Array.isArray(data) ? 'Array' : 'Object');
        console.log(`   📊 Cantidad:`, Array.isArray(data) ? data.length : 'N/A');
      } else {
        const error = await response.text();
        console.log(`   ❌ Error:`, error);
      }
    } catch (error) {
      console.log(`   ❌ Error de red:`, error.message);
    }
  }
  
  // Probar también con el endpoint de autenticación
  console.log('\n🔐 Probando endpoint de autenticación...');
  try {
    const authResponse = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C/auth/me', {
      method: 'GET',
      headers: headers
    });
    
    console.log(`   Status: ${authResponse.status} ${authResponse.statusText}`);
    
    if (authResponse.ok) {
      const userData = await authResponse.json();
      console.log(`   ✅ Usuario actual:`, userData);
    } else {
      const error = await authResponse.text();
      console.log(`   ❌ Error:`, error);
    }
  } catch (error) {
    console.log(`   ❌ Error de red:`, error.message);
  }
}

// Ejecutar la prueba
testUserEndpoints();

console.log('\n📋 Instrucciones:');
console.log('1. Abre las herramientas de desarrollador (F12)');
console.log('2. Ve a la pestaña Console');
console.log('3. Copia y pega este script completo');
console.log('4. Presiona Enter para ejecutar');
console.log('5. Revisa qué endpoint devuelve datos de usuarios');
console.log('6. Usa ese endpoint para actualizar la configuración');
