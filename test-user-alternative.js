// Script para probar la alternativa de gestión de usuarios
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🧪 Probando alternativa de gestión de usuarios...');

async function testUserAlternative() {
  try {
    const token = localStorage.getItem('electroverse-token');
    
    if (!token) {
      console.log('❌ No hay token de autenticación');
      return;
    }
    
    console.log('✅ Token encontrado');
    
    // Probar endpoint de usuarios (debería fallar)
    console.log('\n📡 Probando endpoint de usuarios...');
    try {
      const usersResponse = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('✅ Endpoint de usuarios funciona:', usersData);
      } else {
        console.log('❌ Endpoint de usuarios no funciona:', usersResponse.status);
      }
    } catch (error) {
      console.log('❌ Error en endpoint de usuarios:', error.message);
    }
    
    // Probar endpoint de perfil (debería funcionar)
    console.log('\n👤 Probando endpoint de perfil...');
    try {
      const profileResponse = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Endpoint de perfil funciona:', profileData);
        
        // Simular la lista de usuarios con el usuario actual
        const mockUsers = [{
          id: profileData.id || 1,
          name: profileData.name || profileData.email,
          email: profileData.email,
          role: profileData.role || 'admin',
          status: 'active',
          createdAt: profileData.createdAt || new Date().toISOString(),
          isCurrentUser: true
        }];
        
        console.log('📋 Lista de usuarios simulada:', mockUsers);
        
      } else {
        console.log('❌ Endpoint de perfil no funciona:', profileResponse.status);
      }
    } catch (error) {
      console.log('❌ Error en endpoint de perfil:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la prueba
testUserAlternative();

console.log('\n📋 Instrucciones:');
console.log('1. Asegúrate de estar logueado como admin');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console');
console.log('4. Copia y pega este script completo');
console.log('5. Presiona Enter para ejecutar');
console.log('6. Revisa si el endpoint de perfil funciona');
console.log('7. Si funciona, la gestión de usuarios debería mostrar tu usuario actual');
