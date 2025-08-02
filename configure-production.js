#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 CONFIGURANDO PARA PRODUCCIÓN');
console.log('================================');

// Verificar que existe .env.production
const envProductionPath = path.join(__dirname, '.env.production');
if (!fs.existsSync(envProductionPath)) {
    console.error('❌ No se encontró .env.production');
    process.exit(1);
}

// Leer variables de entorno de producción
const envContent = fs.readFileSync(envProductionPath, 'utf8');
console.log('📋 Variables de entorno de producción:');
console.log('=====================================');

const lines = envContent.split('\n');
lines.forEach(line => {
    if (line.startsWith('VITE_') && !line.startsWith('#')) {
        console.log(`✅ ${line}`);
    }
});

console.log('\n🚀 PASOS PARA DESPLIEGUE:');
console.log('========================');
console.log('1. Verifica que tu backend esté corriendo en el servidor');
console.log('2. Asegúrate de que la URL del API sea correcta');
console.log('3. Ejecuta: bun build');
console.log('4. Sube la carpeta dist/ a tu servidor');
console.log('5. Configura tu servidor web (nginx/apache) para servir los archivos');

console.log('\n🔍 VERIFICACIONES NECESARIAS:');
console.log('============================');
console.log('• Backend corriendo en: https://sillageperfum.cl/api');
console.log('• Base de datos MySQL conectada');
console.log('• Variables de entorno del backend configuradas');
console.log('• CORS configurado para permitir tu dominio');

console.log('\n💡 CONFIGURACIÓN RECOMENDADA PARA HOSTINGER:');
console.log('===========================================');
console.log('• Frontend: Subir dist/ a public_html/');
console.log('• Backend: Subir backend/ a una carpeta separada');
console.log('• Usar PM2 o similar para mantener el backend corriendo');
console.log('• Configurar nginx/apache para proxy al backend');