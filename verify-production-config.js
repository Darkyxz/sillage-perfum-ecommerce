#!/usr/bin/env node

console.log('🔍 VERIFICANDO CONFIGURACIÓN DE PRODUCCIÓN');
console.log('==========================================\n');

// Simular variables de entorno de producción
const mockProdEnv = {
  DEV: false,
  PROD: true,
  VITE_API_BASE_URL: 'https://sillageperfum.cl/api-proxy.php',
  VITE_BASE_URL: 'https://sillageperfum.cl',
  VITE_NODE_ENV: 'production'
};

// Simular import.meta.env para producción
const originalImportMeta = global.import?.meta?.env || {};

// Configuración simulada
const isDevelopment = mockProdEnv.DEV;
const isProduction = mockProdEnv.PROD;

const API_CONFIG = {
  BASE_URL: isDevelopment 
    ? mockProdEnv.VITE_API_BASE_URL || 'http://localhost:3001/api'
    : mockProdEnv.VITE_API_BASE_URL || 'https://sillageperfum.cl/api-proxy.php',
  
  FRONTEND_URL: isDevelopment 
    ? 'http://localhost:5173'
    : 'https://sillageperfum.cl',
    
  PAYMENT_RETURN_URL: isDevelopment 
    ? 'http://localhost:5173/pago-exitoso'
    : 'https://sillageperfum.cl/pago-exitoso',
    
  PAYMENT_FAILURE_URL: isDevelopment 
    ? 'http://localhost:5173/pago-fallido' 
    : 'https://sillageperfum.cl/pago-fallido',
    
  GUEST_PAYMENT_RETURN_URL: (orderId, email) => {
    const baseUrl = isDevelopment 
      ? 'http://localhost:5173'
      : 'https://sillageperfum.cl';
    return `${baseUrl}/pago-exitoso?guest=true&order=${orderId}&email=${encodeURIComponent(email)}`;
  },
  
  GUEST_PAYMENT_FAILURE_URL: (orderId) => {
    const baseUrl = isDevelopment 
      ? 'http://localhost:5173'
      : 'https://sillageperfum.cl';
    return `${baseUrl}/pago-fallido?guest=true&order=${orderId}`;
  }
};

console.log('📋 CONFIGURACIÓN DETECTADA:');
console.log('============================');
console.log(`• Ambiente: ${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
console.log(`• API Base URL: ${API_CONFIG.BASE_URL}`);
console.log(`• Frontend URL: ${API_CONFIG.FRONTEND_URL}`);
console.log(`• Payment Return URL: ${API_CONFIG.PAYMENT_RETURN_URL}`);
console.log(`• Payment Failure URL: ${API_CONFIG.PAYMENT_FAILURE_URL}`);

console.log('\n🧪 PROBANDO URLS DE INVITADO:');
console.log('==============================');
const testOrderId = 'BO-1234567890';
const testEmail = 'test@example.com';
console.log(`• Guest Return URL: ${API_CONFIG.GUEST_PAYMENT_RETURN_URL(testOrderId, testEmail)}`);
console.log(`• Guest Failure URL: ${API_CONFIG.GUEST_PAYMENT_FAILURE_URL(testOrderId)}`);

console.log('\n✅ VERIFICACIONES:');
console.log('==================');

// Verificar que no hay localhost en producción
const hasLocalhost = [
  API_CONFIG.BASE_URL,
  API_CONFIG.FRONTEND_URL,
  API_CONFIG.PAYMENT_RETURN_URL,
  API_CONFIG.PAYMENT_FAILURE_URL
].some(url => url.includes('localhost'));

if (hasLocalhost && isProduction) {
  console.log('❌ ERROR: URLs de localhost encontradas en configuración de producción');
} else if (isProduction) {
  console.log('✅ URLs de producción correctas (sin localhost)');
} else {
  console.log('ℹ️  URLs de desarrollo (localhost esperado)');
}

// Verificar formato de URLs
const urlRegex = /^https?:\/\/.+/;
const allUrls = [
  { name: 'API Base URL', url: API_CONFIG.BASE_URL },
  { name: 'Frontend URL', url: API_CONFIG.FRONTEND_URL },
  { name: 'Payment Return URL', url: API_CONFIG.PAYMENT_RETURN_URL },
  { name: 'Payment Failure URL', url: API_CONFIG.PAYMENT_FAILURE_URL }
];

console.log('\n🔗 VALIDACIÓN DE URLs:');
console.log('======================');
allUrls.forEach(({ name, url }) => {
  if (urlRegex.test(url)) {
    console.log(`✅ ${name}: Formato válido`);
  } else {
    console.log(`❌ ${name}: Formato inválido - ${url}`);
  }
});

console.log('\n📝 RESUMEN:');
console.log('===========');
if (isProduction && !hasLocalhost) {
  console.log('✅ Configuración lista para producción');
  console.log('');
  console.log('🚀 Siguiente paso:');
  console.log('• Ejecuta: build-production.bat');
  console.log('• Sube los archivos de dist/ a tu servidor');
  console.log('• Verifica que el backend esté funcionando');
} else if (!isProduction) {
  console.log('ℹ️  Configuración de desarrollo activa');
} else {
  console.log('❌ Configuración necesita correcciones');
  console.log('• Revisa las URLs que contienen localhost');
  console.log('• Asegúrate de usar .env.production en build');
}

console.log('\n💡 COMANDOS ÚTILES:');
console.log('===================');
console.log('• bun run build    (build de producción)');
console.log('• bun run preview  (previsualizar build)');
console.log('• bun run dev      (desarrollo)');

console.log('\n🔧 ARCHIVOS IMPORTANTES:');
console.log('========================');
console.log('• .env.local       (desarrollo)');
console.log('• .env.production  (producción)');
console.log('• src/utils/config.js (configuración centralizada)');

console.log('\n');
