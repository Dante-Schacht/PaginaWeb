// Script para probar la conexión con Xano usando axios
// Ejecutar en la consola del navegador

import axios from 'axios';

console.log('🧪 Probando conexión con Xano usando axios...');

// Configuración de Xano
const XANO_CONFIG = {
  API_URL: 'https://x8ki-letl-twmt.n7.xano.io/api:SzMZfFwX',
  AUTH_URL: 'https://x8ki-letl-twmt.n7.xano.io/api:QbleTY9C'
};

// Función para probar la conexión
async function testXanoConnection() {
  try {
    console.log('📡 Probando API de productos con axios...');
    
    // Probar endpoint de productos
    const productsResponse = await axios.get(`${XANO_CONFIG.API_URL}/products`);
    console.log('✅ API de productos:', productsResponse.status);
    
    if (productsResponse.status === 200) {
      const products = productsResponse.data;
      console.log('📦 Productos encontrados:', products.length || 0);
    }
    
    console.log('🔐 Probando API de autenticación con axios...');
    
    // Probar endpoint de autenticación
    try {
      const authResponse = await axios.post(`${XANO_CONFIG.AUTH_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'test123'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ API de autenticación:', authResponse.status);
      const authData = authResponse.data;
      console.log('🔑 Respuesta de auth:', authData);
    } catch (authError) {
      console.log('✅ API de autenticación:', authError.response?.status || 'Error');
      console.log('⚠️ Error de auth (esperado):', authError.response?.data || authError.message);
    }
    
    console.log('🎉 ¡Conexión con Xano exitosa usando axios!');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.response?.data || error.message);
  }
}

// Ejecutar prueba
testXanoConnection();
