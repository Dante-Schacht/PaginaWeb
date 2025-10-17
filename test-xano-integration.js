// Script para probar la integración con Xano usando axios
// Ejecuta esto en la consola del navegador después de crear el .env

import axios from 'axios';

console.log('🧪 Probando integración con Xano usando axios...');

// 1. Verificar URL de Xano
console.log('📍 URL de Xano:', process.env.REACT_APP_XANO_BASE_URL);

// 2. Probar endpoint de login
async function testLogin() {
  try {
    console.log('🔐 Probando login con axios...');
    const response = await axios.post('https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C/auth/login', {
      email: 'test@test.com',
      password: 'test123'
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = response.data;
    console.log('✅ Respuesta del login:', data);
    
    if (data.authToken) {
      console.log('🎉 ¡Login funciona! Token recibido:', data.authToken);
    } else {
      console.log('❌ Error en login:', data);
    }
  } catch (error) {
    console.log('❌ Error de CORS o conexión:', error.response?.data || error.message);
    console.log('💡 Solución: Habilita CORS en Xano para http://localhost:3000');
  }
}

// 3. Probar endpoint de signup
async function testSignup() {
  try {
    console.log('📝 Probando signup con axios...');
    const response = await axios.post('https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C/auth/signup', {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@test.com',
      password: 'test123'
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = response.data;
    console.log('✅ Respuesta del signup:', data);
    
    if (data.authToken) {
      console.log('🎉 ¡Signup funciona! Token recibido:', data.authToken);
    } else {
      console.log('❌ Error en signup:', data);
    }
  } catch (error) {
    console.log('❌ Error de CORS o conexión:', error.response?.data || error.message);
    console.log('💡 Solución: Habilita CORS en Xano para http://localhost:3000');
  }
}

// Ejecutar pruebas
testLogin();
// testSignup(); // Descomenta para probar signup

console.log('📋 Instrucciones:');
console.log('1. Crea el archivo .env con la URL de Xano');
console.log('2. Habilita CORS en Xano para http://localhost:3000');
console.log('3. Reinicia tu aplicación: npm run dev');
console.log('4. Ejecuta este script en la consola del navegador');
