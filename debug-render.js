import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 DIAGNÓSTICO COMPLETO PARA RENDER\n');

// 1. Verificar estructura del proyecto
console.log('📁 1. ESTRUCTURA DEL PROYECTO:');
const distPath = path.join(__dirname, 'dist');
const srcPath = path.join(__dirname, 'src');

console.log(`   Dist exists: ${fs.existsSync(distPath) ? '✅' : '❌'}`);
console.log(`   Src exists: ${fs.existsSync(srcPath) ? '✅' : '❌'}`);

// 2. Verificar archivos críticos
console.log('\n📄 2. ARCHIVOS CRÍTICOS:');
const criticalFiles = [
  'dist/index.html',
  'dist/_redirects',
  'server.js',
  'package.json',
  'src/App.jsx',
  'src/pages/Admin.jsx'
];

criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`   ${file}: ${exists ? '✅' : '❌'}`);
});

// 3. Verificar contenido de dist
console.log('\n📋 3. CONTENIDO DE DIST:');
if (fs.existsSync(distPath)) {
  const files = fs.readdirSync(distPath);
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    console.log(`   ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
  });
} else {
  console.log('   ❌ Carpeta dist no existe');
}

// 4. Verificar rutas en App.jsx
console.log('\n🛣️  4. RUTAS EN APP.JSX:');
const appPath = path.join(__dirname, 'src', 'App.jsx');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  const routes = ['/admin', '/productos', '/carrito', '/favoritos'];
  
  routes.forEach(route => {
    const hasRoute = appContent.includes(`path="${route}"`);
    console.log(`   ${route}: ${hasRoute ? '✅' : '❌'}`);
  });
} else {
  console.log('   ❌ App.jsx no encontrado');
}

// 5. Verificar componente Admin
console.log('\n🔧 5. COMPONENTE ADMIN:');
const adminPath = path.join(__dirname, 'src', 'pages', 'Admin.jsx');
if (fs.existsSync(adminPath)) {
  console.log('   ✅ Admin.jsx existe');
  const adminContent = fs.readFileSync(adminPath, 'utf8');
  const hasExport = adminContent.includes('export default');
  console.log(`   Export default: ${hasExport ? '✅' : '❌'}`);
} else {
  console.log('   ❌ Admin.jsx no encontrado');
}

// 6. Verificar package.json
console.log('\n📦 6. PACKAGE.JSON:');
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(`   Start script: ${packageContent.scripts?.start || 'No definido'}`);
  console.log(`   Build script: ${packageContent.scripts?.build || 'No definido'}`);
  console.log(`   Type: ${packageContent.type || 'No definido'}`);
  console.log(`   Express dependency: ${packageContent.dependencies?.express ? '✅' : '❌'}`);
}

// 7. Verificar server.js
console.log('\n🖥️  7. SERVER.JS:');
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  const hasExpress = serverContent.includes('express');
  const hasSPA = serverContent.includes('app.get(\'*\'');
  console.log(`   ✅ server.js existe`);
  console.log(`   Express import: ${hasExpress ? '✅' : '❌'}`);
  console.log(`   SPA routing: ${hasSPA ? '✅' : '❌'}`);
}

console.log('\n🎯 RESUMEN:');
console.log('Si todos los elementos anteriores muestran ✅, el problema puede ser:');
console.log('1. Variables de entorno en Render');
console.log('2. Configuración de Build/Start Command en Render');
console.log('3. Puerto o binding del servidor');
console.log('\n🚀 Próximos pasos:');
console.log('1. Hacer push de estos cambios');
console.log('2. Verificar logs de Render');
console.log('3. Probar /health endpoint');
console.log('4. Probar /api/debug endpoint');