// Script para verificar el token de autenticación
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🔐 Verificando token de autenticación...');

function checkAuthToken() {
  console.log('\n📋 Verificando tokens en localStorage:');
  
  // Verificar diferentes nombres de token
  const tokenKeys = [
    'electroverse-token',
    'token',
    'authToken',
    'xano-token'
  ];
  
  let foundToken = null;
  let tokenKey = null;
  
  tokenKeys.forEach(key => {
    const token = localStorage.getItem(key);
    if (token) {
      console.log(`✅ Token encontrado en '${key}':`, token.substring(0, 20) + '...');
      if (!foundToken) {
        foundToken = token;
        tokenKey = key;
      }
    } else {
      console.log(`❌ No hay token en '${key}'`);
    }
  });
  
  if (foundToken) {
    console.log(`\n🔑 Token principal: ${tokenKey}`);
    console.log(`📝 Token completo: ${foundToken}`);
    
    // Verificar formato del token
    if (foundToken.startsWith('Bearer ')) {
      console.log('⚠️  Token incluye "Bearer " - puede causar problemas');
    } else {
      console.log('✅ Token sin "Bearer " - formato correcto');
    }
    
    return foundToken;
  } else {
    console.log('❌ No se encontró ningún token');
    return null;
  }
}

async function testUsersEndpointWithToken() {
  const token = checkAuthToken();
  
  if (!token) {
    console.log('\n❌ No se puede probar sin token');
    return;
  }
  
  console.log('\n📡 Probando endpoint con token...');
  
  try {
    const url = 'https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C/user';
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
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
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
      
      if (response.status === 401) {
        console.log('\n🔍 Posibles causas del error 401:');
        console.log('1. Token expirado');
        console.log('2. Token inválido');
        console.log('3. Usuario sin permisos de admin');
        console.log('4. Endpoint requiere autenticación diferente');
      }
    }
  } catch (error) {
    console.error('❌ Error de red:', error);
  }
}

// Ejecutar verificación
testUsersEndpointWithToken();

console.log('\n📋 Instrucciones:');
console.log('1. Verifica que hay un token válido en localStorage');
console.log('2. Asegúrate de estar logueado como admin');
console.log('3. Si el token está expirado, inicia sesión nuevamente');
