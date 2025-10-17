// Script para probar endpoints de Xano disponibles
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🔍 Probando endpoints de Xano disponibles...');

async function testXanoEndpoints() {
  const token = localStorage.getItem('electroverse-token') || localStorage.getItem('token');
  
  if (!token) {
    console.log('❌ No hay token de autenticación');
    return;
  }
  
  console.log('✅ Token encontrado');
  
  const authBaseUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C';
  const mainBaseUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  
  console.log('\n📡 Probando endpoints de autenticación (api:QbleTY9C):');
  
  // Probar GET /user (debería funcionar según la imagen)
  try {
    console.log('🔍 Probando GET /user...');
    const userResponse = await fetch(`${authBaseUrl}/user`, {
      method: 'GET',
      headers: headers
    });
    
    console.log(`   Status: ${userResponse.status} ${userResponse.statusText}`);
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('   ✅ GET /user funciona:', userData);
    } else {
      const error = await userResponse.text();
      console.log('   ❌ GET /user error:', error);
    }
  } catch (error) {
    console.log('   ❌ GET /user error de red:', error.message);
  }
  
  // Probar POST /user (probablemente no existe)
  try {
    console.log('🔍 Probando POST /user...');
    const createResponse = await fetch(`${authBaseUrl}/user`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'test123',
        role: 'user'
      })
    });
    
    console.log(`   Status: ${createResponse.status} ${createResponse.statusText}`);
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('   ✅ POST /user funciona:', createData);
    } else {
      const error = await createResponse.text();
      console.log('   ❌ POST /user error:', error);
    }
  } catch (error) {
    console.log('   ❌ POST /user error de red:', error.message);
  }
  
  // Probar PUT /user/:id (probablemente no existe)
  try {
    console.log('🔍 Probando PUT /user/1...');
    const updateResponse = await fetch(`${authBaseUrl}/user/1`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({
        first_name: 'Updated',
        last_name: 'User'
      })
    });
    
    console.log(`   Status: ${updateResponse.status} ${updateResponse.statusText}`);
    
    if (updateResponse.ok) {
      const updateData = await updateResponse.json();
      console.log('   ✅ PUT /user/:id funciona:', updateData);
    } else {
      const error = await updateResponse.text();
      console.log('   ❌ PUT /user/:id error:', error);
    }
  } catch (error) {
    console.log('   ❌ PUT /user/:id error de red:', error.message);
  }
  
  // Probar DELETE /user/:id (probablemente no existe)
  try {
    console.log('🔍 Probando DELETE /user/1...');
    const deleteResponse = await fetch(`${authBaseUrl}/user/1`, {
      method: 'DELETE',
      headers: headers
    });
    
    console.log(`   Status: ${deleteResponse.status} ${deleteResponse.statusText}`);
    
    if (deleteResponse.ok) {
      const deleteData = await deleteResponse.json();
      console.log('   ✅ DELETE /user/:id funciona:', deleteData);
    } else {
      const error = await deleteResponse.text();
      console.log('   ❌ DELETE /user/:id error:', error);
    }
  } catch (error) {
    console.log('   ❌ DELETE /user/:id error de red:', error.message);
  }
  
  console.log('\n📋 Resumen:');
  console.log('Según la imagen de Xano que me mostraste:');
  console.log('✅ GET /user - Existe (devuelve usuario actual)');
  console.log('❌ POST /user - No existe (por eso el error 404)');
  console.log('❌ PUT /user/:id - Probablemente no existe');
  console.log('❌ DELETE /user/:id - Probablemente no existe');
  console.log('❌ GET /users - No existe (para listar todos los usuarios)');
}

// Ejecutar la prueba
testXanoEndpoints();

console.log('\n📋 Instrucciones:');
console.log('1. Abre las herramientas de desarrollador (F12)');
console.log('2. Ve a la pestaña Console');
console.log('3. Copia y pega este script completo');
console.log('4. Presiona Enter para ejecutar');
console.log('5. Revisa qué endpoints están disponibles');
