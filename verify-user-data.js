// Script para verificar los datos del usuario en la gestión de usuarios
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🔍 Verificando datos del usuario en la gestión de usuarios...');

function verifyUserData() {
  console.log('\n📊 Datos del usuario en localStorage:');
  
  // Verificar datos del usuario
  const userData = localStorage.getItem('electroverse-user');
  if (userData) {
    const user = JSON.parse(userData);
    console.log('✅ Usuario encontrado:', user);
    console.log('   - ID:', user.id);
    console.log('   - Nombre:', user.name);
    console.log('   - Email:', user.email);
    console.log('   - Rol:', user.role);
    console.log('   - Activo:', user.isActive);
    console.log('   - Fecha de creación:', user.createdAt);
  } else {
    console.log('❌ No se encontraron datos del usuario en localStorage');
  }
  
  // Verificar token
  const token = localStorage.getItem('electroverse-token');
  console.log('\n🔑 Token de autenticación:', token ? '✅ Presente' : '❌ Ausente');
  
  // Simular la lógica de mapeo
  if (userData) {
    const user = JSON.parse(userData);
    const mockUser = {
      id: user.id,
      name: user.name || 'Usuario Admin',
      email: user.email,
      role: user.role || 'admin',
      status: user.isActive !== false ? 'active' : 'inactive',
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
      isCurrentUser: true
    };
    
    console.log('\n📋 Usuario mapeado para la tabla:');
    console.log('   - ID:', mockUser.id);
    console.log('   - Nombre:', mockUser.name);
    console.log('   - Email:', mockUser.email);
    console.log('   - Rol:', mockUser.role);
    console.log('   - Estado:', mockUser.status);
    console.log('   - Fecha de registro:', mockUser.createdAt);
    console.log('   - Es usuario actual:', mockUser.isCurrentUser);
    
    // Verificar problemas potenciales
    console.log('\n🔍 Verificando problemas:');
    
    if (!mockUser.name || mockUser.name === 'Usuario Admin') {
      console.log('⚠️  Nombre vacío o por defecto - verificar datos del usuario');
    }
    
    if (mockUser.status === 'inactive') {
      console.log('⚠️  Estado inactivo - verificar isActive del usuario');
    }
    
    if (mockUser.createdAt === 'Invalid Date') {
      console.log('⚠️  Fecha inválida - verificar formato de createdAt');
    }
    
    if (mockUser.email && mockUser.email.includes('@')) {
      console.log('✅ Email válido');
    } else {
      console.log('❌ Email inválido o ausente');
    }
  }
}

// Ejecutar verificación
verifyUserData();

console.log('\n📋 Instrucciones:');
console.log('1. Abre las herramientas de desarrollador (F12)');
console.log('2. Ve a la pestaña Console');
console.log('3. Copia y pega este script completo');
console.log('4. Presiona Enter para ejecutar');
console.log('5. Revisa los datos del usuario y los problemas identificados');
console.log('6. Si hay problemas, verifica los datos en localStorage');
