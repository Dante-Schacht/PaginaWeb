// Script para verificar endpoints disponibles en Xano
// Ejecutar en la consola del navegador

console.log('🔍 Verificando endpoints de Xano...');

async function checkXanoEndpoints() {
  const token = localStorage.getItem('electroverse-token') || localStorage.getItem('token');
  
  if (!token) {
    console.log('❌ No hay token de autenticación');
    return;
  }
  
  const baseAuthUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C';
  const baseMainUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX';
  
  console.log('🔑 Token:', token.substring(0, 20) + '...');
  
  // Lista de endpoints a probar
  const endpoints = [
    // Auth endpoints
    { url: `${baseAuthUrl}/auth/me`, method: 'GET', name: 'Auth - Profile' },
    { url: `${baseAuthUrl}/user`, method: 'GET', name: 'Auth - Users List' },
    { url: `${baseAuthUrl}/user`, method: 'POST', name: 'Auth - Create User' },
    
    // Main endpoints
    { url: `${baseMainUrl}/user`, method: 'GET', name: 'Main - Users List' },
    { url: `${baseMainUrl}/user`, method: 'POST', name: 'Main - Create User' },
    { url: `${baseMainUrl}/users`, method: 'GET', name: 'Main - Users List (plural)' },
    { url: `${baseMainUrl}/users`, method: 'POST', name: 'Main - Create User (plural)' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Probando: ${endpoint.name}`);
      console.log(`   URL: ${endpoint.url}`);
      console.log(`   Method: ${endpoint.method}`);
      
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        ...(endpoint.method === 'POST' && {
          body: JSON.stringify({
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            password: 'test123',
            role: 'user'
          })
        })
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Success:`, data);
      } else {
        const error = await response.text();
        console.log(`   ❌ Error:`, error);
      }
      
    } catch (error) {
      console.log(`   ❌ Network Error:`, error.message);
    }
  }
  
  console.log('\n📋 Resumen:');
  console.log('✅ Endpoints que funcionan correctamente');
  console.log('❌ Endpoints que dan error 404');
  console.log('🔒 Endpoints que requieren autenticación');
}

// Ejecutar verificación
checkXanoEndpoints();
