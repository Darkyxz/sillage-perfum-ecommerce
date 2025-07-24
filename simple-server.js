const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

console.log('🚀 Starting Render server...');
console.log('📁 Serving from:', path.join(__dirname, 'dist'));
console.log('🌐 Port:', port);

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Health check
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: port 
  });
});

// SPA routing - DEBE estar al final
app.get('*', (req, res) => {
  console.log(`SPA route: ${req.url}`);
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${port}`);
  console.log(`🔧 Admin should be available at: http://0.0.0.0:${port}/admin`);
});