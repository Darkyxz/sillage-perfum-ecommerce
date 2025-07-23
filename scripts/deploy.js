#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Iniciando proceso de deploy...\n');

// Verificar variables de entorno
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_MERCADOPAGO_ACCESS_TOKEN'
];

console.log('🔍 Verificando variables de entorno...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Faltan las siguientes variables de entorno:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n💡 Asegúrate de tener un archivo .env.production con todas las variables necesarias.');
  process.exit(1);
}

console.log('✅ Variables de entorno verificadas\n');

try {
  // Limpiar build anterior
  console.log('🧹 Limpiando build anterior...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  
  // Instalar dependencias
  console.log('📦 Instalando dependencias...');
  execSync('bun install', { stdio: 'inherit' });
  
  // Build de producción
  console.log('🔨 Construyendo aplicación para producción...');
  execSync('bun run build', { stdio: 'inherit' });
  
  // Verificar que el build fue exitoso
  if (!fs.existsSync('dist/index.html')) {
    throw new Error('El build no se completó correctamente');
  }
  
  console.log('\n✅ Build completado exitosamente!');
  console.log('📁 Los archivos están en la carpeta "dist"');
  
  // Mostrar opciones de deploy
  console.log('\n🌐 Opciones para hacer deploy:');
  console.log('');
  console.log('1️⃣  NETLIFY (Recomendado):');
  console.log('   • Ve a https://netlify.com');
  console.log('   • Arrastra la carpeta "dist" a Netlify Drop');
  console.log('   • O conecta tu repositorio de GitHub');
  console.log('');
  console.log('2️⃣  VERCEL:');
  console.log('   • Instala Vercel CLI: npm i -g vercel');
  console.log('   • Ejecuta: vercel --prod');
  console.log('');
  console.log('3️⃣  GITHUB PAGES:');
  console.log('   • Haz push a tu repositorio');
  console.log('   • Ve a Settings > Pages en GitHub');
  console.log('   • Selecciona GitHub Actions como source');
  console.log('');
  console.log('🔗 Tu admin estará disponible en: https://tu-dominio.com/admin');
  
} catch (error) {
  console.error('\n❌ Error durante el deploy:');
  console.error(error.message);
  process.exit(1);
}