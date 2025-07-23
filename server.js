import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Verificar que dist existe
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('🔍 Verificando archivos...');
console.log(`📁 Dist path: ${distPath}`);
console.log(`📄 Index path: ${indexPath}`);
console.log(`✅ Dist exists: ${fs.existsSync(distPath)}`);
console.log(`✅ Index exists: ${fs.existsSync(indexPath)}`);

if (!fs.existsSync(distPath)) {
  console.error('❌ Carpeta dist no encontrada!');
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html no encontrado!');
  process.exit(1);
}

// Middleware para logging detallado
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log(`User-Agent: ${req.get('User-Agent')}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: port,
    distExists: fs.existsSync(distPath),
    indexExists: fs.existsSync(indexPath),
    files: fs.readdirSync(distPath)
  });
});

// API endpoint para debug
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Server is working',
    environment: process.env.NODE_ENV || 'development',
    port: port,
    distPath: distPath,
    indexPath: indexPath,
    files: fs.readdirSync(distPath)
  });
});

// Servir archivos estáticos desde dist
app.use(express.static(distPath, {
  maxAge: '1h',
  etag: true,
  index: false // No servir index.html automáticamente
}));

// Rutas específicas para debugging
app.get('/admin', (req, res) => {
  console.log('🎯 Admin route requested specifically');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ Error serving admin:', err);
      res.status(500).send('Error loading admin page');
    } else {
      console.log('✅ Admin page served successfully');
    }
  });
});

// Manejar todas las demás rutas de React (SPA)
app.get('*', (req, res) => {
  console.log(`🌐 Serving SPA route: ${req.url}`);
  
  // Verificar que el archivo existe antes de enviarlo
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html not found when serving SPA route');
    return res.status(404).send('Application not found');
  }
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ Error serving SPA route:', err);
      res.status(500).send('Error loading page');
    } else {
      console.log(`✅ SPA route served: ${req.url}`);
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err);
  res.status(500).send('Internal server error');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📱 App available at http://0.0.0.0:${port}`);
  console.log(`🔧 Admin available at http://0.0.0.0:${port}/admin`);
  console.log(`💚 Health check at http://0.0.0.0:${port}/health`);
  console.log(`🔍 Debug API at http://0.0.0.0:${port}/api/debug`);
  console.log(`📁 Serving static files from: ${distPath}`);
  
  // Listar archivos en dist
  console.log('\n📋 Files in dist:');
  try {
    const files = fs.readdirSync(distPath);
    files.forEach(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
    });
  } catch (err) {
    console.error('❌ Error reading dist directory:', err);
  }
});