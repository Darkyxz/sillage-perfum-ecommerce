import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos desde dist
app.use(express.static(path.join(__dirname, 'dist')));

// Manejar todas las rutas de React (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📱 App available at http://localhost:${port}`);
  console.log(`🔧 Admin available at http://localhost:${port}/admin`);
});