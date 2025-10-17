// Script para verificar que los endpoints de Xano funcionen correctamente
// Ejecutar en la consola del navegador después de crear los endpoints

console.log('🔍 Verificando endpoints de Xano...');

async function verifyXanoEndpoints() {
  const token = localStorage.getItem('electroverse-token') || localStorage.getItem('token');
  
  if (!token) {
    console.log('❌ No hay token de autenticación');
    return;
  }
  
  const baseUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C';
  
  console.log('🔑 Token:', token.substring(0, 20) + '...');
  
  // 1. Verificar GET /user (listar usuarios)
  console.log('\n📡 1. Probando GET /user (listar usuarios)...');
  try {
    const usersResponse = await fetch(`${baseUrl}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('   Status:', usersResponse.status, usersResponse.statusText);
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log('   ✅ Usuarios obtenidos:', usersData);
      console.log('   📊 Tipo:', typeof usersData);
      console.log('   📊 Es array:', Array.isArray(usersData));
      
      if (Array.isArray(usersData)) {
        console.log('   👥 Cantidad:', usersData.length);
        usersData.forEach((user, i) => {
          console.log(`   Usuario ${i+1}:`, {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
            active: user.is_active
          });
        });
      }
    } else {
      const error = await usersResponse.text();
      console.log('   ❌ Error:', error);
    }
  } catch (error) {
    console.log('   ❌ Network Error:', error.message);
  }
  
  // 2. Verificar POST /user (crear usuario)
  console.log('\n📡 2. Probando POST /user (crear usuario)...');
  try {
    const createData = {
      first_name: 'Test',
      last_name: 'Usuario',
      email: `test${Date.now()}@example.com`,
      password: 'test123',
      role: 'user',
      is_active: true
    };
    
    const createResponse = await fetch(`${baseUrl}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(createData)
    });
    
    console.log('   Status:', createResponse.status, createResponse.statusText);
    
    if (createResponse.ok) {
      const createdUser = await createResponse.json();
      console.log('   ✅ Usuario creado:', createdUser);
    } else {
      const error = await createResponse.text();
      console.log('   ❌ Error:', error);
    }
  } catch (error) {
    console.log('   ❌ Network Error:', error.message);
  }
  
  console.log('\n📋 Resultado esperado:');
  console.log('✅ GET /user debe devolver array de usuarios');
  console.log('✅ POST /user debe crear usuario y devolverlo');
  console.log('✅ Ambos deben tener status 200/201');
  console.log('✅ Sin errores 404 o 401');
}

// Ejecutar verificación
verifyXanoEndpoints();
