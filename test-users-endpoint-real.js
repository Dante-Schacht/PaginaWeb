// Script para probar el endpoint real de usuarios
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🧪 Probando endpoint real de usuarios...');

async function testRealUsersEndpoint() {
  try {
    const token = localStorage.getItem('electroverse-token') || localStorage.getItem('token');
    
    if (!token) {
      console.log('❌ No hay token de autenticación');
      return;
    }
    
    console.log('✅ Token encontrado');
    
    // Probar endpoint GET /user (para listado)
    const usersUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C/user';
    console.log('📡 Probando endpoint de usuarios:', usersUrl);
    
    const usersResponse = await fetch(usersUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📊 Status usuarios:', usersResponse.status, usersResponse.statusText);
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log('✅ Usuarios obtenidos:', usersData);
      console.log('📋 Tipo de datos:', typeof usersData);
      console.log('📋 Es array:', Array.isArray(usersData));
      
      if (Array.isArray(usersData)) {
        console.log('👥 Cantidad de usuarios:', usersData.length);
        usersData.forEach((user, index) => {
          console.log(`   Usuario ${index + 1}:`, {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive || user.is_active
          });
        });
      } else if (usersData.items) {
        console.log('👥 Usuarios con paginación:', usersData.items.length);
        console.log('📊 Total:', usersData.total);
        usersData.items.forEach((user, index) => {
          console.log(`   Usuario ${index + 1}:`, {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive || user.is_active
          });
        });
      } else {
        console.log('🔍 Estructura de datos:', usersData);
      }
    } else {
      const error = await usersResponse.text();
      console.log('❌ Error en usuarios:', error);
    }
    
    // Probar endpoint POST /user (para crear)
    console.log('\n📡 Probando endpoint POST para crear usuario...');
    
    const createUserData = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'test123',
      role: 'user',
      is_active: true
    };
    
    const createResponse = await fetch(usersUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(createUserData)
    });
    
    console.log('📊 Status crear usuario:', createResponse.status, createResponse.statusText);
    
    if (createResponse.ok) {
      const createdUser = await createResponse.json();
      console.log('✅ Usuario creado:', createdUser);
    } else {
      const error = await createResponse.text();
      console.log('❌ Error al crear usuario:', error);
    }
    
  } catch (error) {
    console.error('❌ Error de red:', error);
  }
}

// Ejecutar la prueba
testRealUsersEndpoint();

console.log('\n📋 Verificaciones:');
console.log('✅ GET /user debe devolver lista de usuarios');
console.log('✅ POST /user debe permitir crear usuarios');
console.log('✅ Datos deben tener estructura correcta');
console.log('✅ Sin errores 404 o 401');
