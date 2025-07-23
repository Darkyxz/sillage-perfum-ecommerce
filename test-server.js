import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    admin_route: '/admin should work',
    timestamp: new Date().toISOString()
  });
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// SPA routing
app.get('*', (req, res) => {
  console.log(`Route requested: ${req.url}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Test server running on http://localhost:${port}`);
  console.log(`Test admin at: http://localhost:${port}/admin`);
});