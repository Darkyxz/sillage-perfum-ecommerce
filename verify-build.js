const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando build para Render...\n');

// Verificar que dist existe
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Carpeta dist no existe');
  process.exit(1);
}

// Verificar index.html
const indexPath = path.join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html no existe en dist/');
  process.exit(1);
}

// Verificar _redirects
const redirectsPath = path.join(distPath, '_redirects');
if (!fs.existsSync(redirectsPath)) {
  console.warn('⚠️ _redirects no existe en dist/');
} else {
  console.log('✅ _redirects encontrado');
}

// Verificar contenido de index.html
const indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes('root')) {
  console.error('❌ index.html parece estar corrupto');
  process.exit(1);
}

// Listar archivos en dist
console.log('\n📁 Archivos en dist/:');
const files = fs.readdirSync(distPath);
files.forEach(file => {
  const filePath = path.join(distPath, file);
  const stats = fs.statSync(filePath);
  console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
});

console.log('\n✅ Build verificado correctamente para Render!');
console.log('🚀 Listo para deploy en Render');

// Verificar rutas en App.jsx
const appPath = path.join(__dirname, 'src', 'App.jsx');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  if (appContent.includes('/admin')) {
    console.log('✅ Ruta /admin encontrada en App.jsx');
  } else {
    console.error('❌ Ruta /admin NO encontrada en App.jsx');
  }
}