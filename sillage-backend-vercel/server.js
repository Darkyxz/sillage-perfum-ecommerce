const express = require('express');
const cors = require('cors');
const path = require('path');

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
const guestCheckoutRoutes = require('./routes/guestCheckout');

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

// CORS - Configuración permisiva para resolver problemas
app.use((req, res, next) => {
  const origin = req.headers.origin;

  console.log('🌐 CORS Request - Origin:', origin);
  console.log('🌐 CORS Request - Method:', req.method);
  console.log('🌐 CORS Request - Path:', req.path);

  // Permitir todos los orígenes temporalmente
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'false'); // Cambiar a false cuando usamos *
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS Preflight handled for:', origin);
    res.status(200).end();
    return;
  }

  next();
});

// Rate limiting - DESHABILITADO TEMPORALMENTE
// if (rateLimit) {
//   const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutos
//     max: 100, // máximo 100 requests por IP
//     message: {
//       error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos.'
//     }
//   });
//   app.use('/api/', limiter);

//   // Rate limiting más estricto para auth
//   const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutos
//     max: 5, // máximo 5 intentos de login por IP
//     message: {
//       error: 'Demasiados intentos de login, intenta de nuevo en 15 minutos.'
//     }
//   });
//   app.use('/api/auth/login', authLimiter);
// }

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

// Ruta de prueba pública
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint público funcionando',
    timestamp: new Date().toISOString()
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
app.use('/api/guest-checkout', guestCheckoutRoutes);

// Ruta para servir archivos estáticos (imágenes)
app.use('/images', express.static('public/images'));
app.use('/uploads', express.static('uploads'));

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