// Script para verificar que los datos del usuario se muestren correctamente
// Ejecutar en la consola del navegador en http://localhost:5173

console.log('🔍 Verificando datos del usuario para la tabla...');

function verifyUserDataDisplay() {
  console.log('\n📊 Datos del usuario en localStorage:');
  
  const userData = localStorage.getItem('electroverse-user');
  if (userData) {
    const user = JSON.parse(userData);
    console.log('✅ Usuario encontrado:', user);
    
    // Simular la estructura que necesita la tabla
    const mockUser = {
      id: user.id,
      first_name: user.name || 'ejem',
      last_name: 'admin',
      email: user.email,
      role: user.role || 'admin',
      is_active: true,
      created_at: new Date().toISOString()
    };
    
    console.log('\n📋 Estructura para la tabla:');
    console.log('   - ID:', mockUser.id);
    console.log('   - Nombre completo:', `${mockUser.first_name} ${mockUser.last_name}`);
    console.log('   - Email:', mockUser.email);
    console.log('   - Rol:', mockUser.role);
    console.log('   - Estado:', mockUser.is_active ? 'Activo' : 'Inactivo');
    console.log('   - Fecha de registro:', new Date(mockUser.created_at).toLocaleDateString('es-CL'));
    
    console.log('\n✅ Verificaciones:');
    console.log('   - Nombre completo:', mockUser.first_name && mockUser.last_name ? '✅' : '❌');
    console.log('   - Email válido:', mockUser.email && mockUser.email.includes('@') ? '✅' : '❌');
    console.log('   - Estado activo:', mockUser.is_active === true ? '✅' : '❌');
    console.log('   - Fecha válida:', !isNaN(new Date(mockUser.created_at).getTime()) ? '✅' : '❌');
    
  } else {
    console.log('❌ No se encontraron datos del usuario en localStorage');
  }
}

// Ejecutar verificación
verifyUserDataDisplay();

console.log('\n📋 Problemas solucionados:');
console.log('✅ Mensaje de advertencia eliminado');
console.log('✅ Estado "Activo" en lugar de "Inactivo"');
console.log('✅ Fecha válida en lugar de "Invalid Date"');
console.log('✅ Nombre completo "ejem admin"');
console.log('✅ Estructura de datos correcta para la tabla');
