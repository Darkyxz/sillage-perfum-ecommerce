const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura-aqui';

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token de acceso requerido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Obtener usuario de la base de datos
    const users = await query('SELECT id, email, full_name, role, is_active FROM users WHERE id = ?', [decoded.userId]);
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Usuario inactivo'
      });
    }

    // Agregar usuario a la request
    req.user = user;
    next();

  } catch (error) {
    console.error('Error en autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar rol de admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Autenticación requerida'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Permisos de administrador requeridos'
    });
  }

  next();
};

// Función para generar token JWT
const generateToken = (userId, email, role = 'user') => {
  return jwt.sign(
    { 
      userId, 
      email, 
      role 
    },
    JWT_SECRET,
    { 
      expiresIn: '7d' // Token válido por 7 días
    }
  );
};

// Middleware opcional - no falla si no hay token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const users = await query('SELECT id, email, full_name, role, is_active FROM users WHERE id = ?', [decoded.userId]);
      
      if (users.length > 0 && users[0].is_active) {
        req.user = users[0];
      }
    }
    
    next();
  } catch (error) {
    // Si hay error, continúa sin usuario
    next();
  }
};

// Middleware para verificar que el usuario es dueño del recurso o admin
const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Autenticación requerida'
    });
  }

  const resourceUserId = req.params.id;
  const currentUserId = req.user.id.toString();
  const isAdmin = req.user.role === 'admin';

  // Permitir si es admin o si es el dueño del recurso
  if (isAdmin || currentUserId === resourceUserId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'No tienes permisos para acceder a este recurso'
  });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  generateToken,
  optionalAuth,
  requireOwnershipOrAdmin,
  JWT_SECRET
};