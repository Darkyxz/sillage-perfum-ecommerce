const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Intentar importar paquetes opcionales
let helmet, compression, rateLimit;
try {
  helmet = require('helmet');
} catch (e) {
  console.log('⚠️  Helmet no está instalado, continuando sin él');
}
try {
  compression = require('compression');
} catch (e) {
  console.log('⚠️  Compression no está instalado, continuando sin él');
}
try {
  rateLimit = require('express-rate-limit');
} catch (e) {
  console.log('⚠️  Express-rate-limit no está instalado, continuando sin él');
}

// Cargar variables de entorno desde el archivo .env en la carpeta backend
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Importar configuración de base de datos
const { testConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const webpayRoutes = require('./routes/webpay');
const favoritesRoutes = require('./routes/favorites');
const uploadRoutes = require('./routes/upload');
const contactRoutes = require('./routes/contact');
const guestCheckoutRouter = require('./routes/guestCheckout');


const app = express();
const PORT = process.env.PORT || 3001;

// =====================================================
// MIDDLEWARE DE SEGURIDAD
// =====================================================

// Helmet para headers de seguridad
if (helmet) {
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
}

// CORS configurado para el frontend
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://sillageperfum.cl',
      'https://www.sillageperfum.cl',
      'https://sillageperfum.store'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition']
};

app.use(cors(corsOptions));

// Rate limiting
if (rateLimit) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: {
      error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos.'
    }
  });
  app.use('/api/', limiter);

  // Rate limiting más estricto para auth
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos de login por IP
    message: {
      error: 'Demasiados intentos de login, intenta de nuevo en 15 minutos.'
    }
  });
  app.use('/api/auth/login', authLimiter);
}

// =====================================================
// MIDDLEWARE GENERAL
// =====================================================

// Compresión
if (compression) {
  app.use(compression());
}

// Parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// =====================================================
// RUTAS
// =====================================================

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Sillage Perfum API',
    version: '1.0.0'
  });
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/webpay', webpayRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/guest-checkout', guestCheckoutRouter);

// Asegurarse de que las rutas sean absolutas
const uploadsPath = path.resolve(__dirname, '..', 'uploads');
const publicImagesPath = path.resolve(__dirname, '..', 'public', 'images');

console.log('📁 Ruta de uploads:', uploadsPath);
console.log('📁 Ruta de imágenes públicas:', publicImagesPath);

// Crear directorios si no existen
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
if (!fs.existsSync(publicImagesPath)) {
  fs.mkdirSync(publicImagesPath, { recursive: true });
}

// Configuración mejorada para servir archivos estáticos
const serveStatic = (path, prefix = '') => {
  // Crear el directorio si no existe
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
    console.log(`✅ Directorio creado: ${path}`);
  }

  // Configuración de CORS y cabeceras para archivos estáticos
  return express.static(path, {
    setHeaders: (res, filePath) => {
      // Configuración de CORS
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      // Configuración de caché
      const ext = path.extname(filePath).toLowerCase();
      const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
      
      if (isImage) {
        // Cachear imágenes por 1 año
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        res.set('Expires', new Date(Date.now() + 31536000000).toUTCString());
      } else {
        // No cachear otros tipos de archivos por defecto
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
      }
      
      // Configuración de tipo MIME
      if (ext === '.js') res.type('application/javascript');
      if (ext === '.css') res.type('text/css');
    },
    // Permitir acceso a archivos ocultos (que empiezan con .)
    dotfiles: 'allow'
  });
};

// Servir archivos estáticos con prefijos específicos
app.use('/images', serveStatic(publicImagesPath, 'images'));
app.use('/uploads', serveStatic(uploadsPath, 'uploads'));

// Agregar encabezados CORS para las rutas de archivos estáticos
app.use(['/images', '/uploads'], (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Ruta para verificar la disponibilidad de archivos estáticos
app.get('/api/static/check', (req, res) => {
  const testFilePath = path.join(uploadsPath, 'test.txt');
  try {
    fs.writeFileSync(testFilePath, 'test');
    fs.unlinkSync(testFilePath);
    res.json({
      success: true,
      message: 'El sistema de archivos está funcionando correctamente',
      uploadsPath,
      publicImagesPath,
      writable: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el sistema de archivos',
      error: error.message,
      uploadsPath,
      publicImagesPath,
      writable: false
    });
  }
});

// =====================================================
// MANEJO DE ERRORES
// =====================================================

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('❌ Error:', error);

  // Error de validación
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: error.message
    });
  }

  // Error de JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }

  // Error de MySQL
  if (error.code && error.code.startsWith('ER_')) {
    return res.status(500).json({
      error: 'Error de base de datos',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }

  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

async function startServer() {
  try {
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('🚀 ================================');
      console.log('🚀 SILLAGE PERFUM API INICIADA');
      console.log('🚀 ================================');
      console.log(`🌐 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log('🚀 ================================');
    });

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🔄 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 Cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer();

module.exports = app;