const express = require('express');
const bcrypt = require('bcrypt');
const { query } = require('../config/database');
const { generateToken, authenticateToken } = require('../middleware/auth');
const { validateUserRegister, validateUserLogin } = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/register - Registro de usuario
router.post('/register', validateUserRegister, async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;

    // Verificar si el usuario ya existe
    const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const result = await query(`
      INSERT INTO users (email, password_hash, full_name, phone, is_active)
      VALUES (?, ?, ?, ?, 1)
    `, [email, hashedPassword, full_name, phone || null]);

    const userId = result.insertId;

    // Generar token
    const token = generateToken(userId, email, 'user');

    // Obtener datos del usuario creado
    const newUser = await query('SELECT id, email, full_name, phone, role, created_at FROM users WHERE id = ?', [userId]);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: newUser[0],
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// POST /api/auth/login - Inicio de sesión
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const users = await query('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    const user = users[0];

    // Verificar contraseña - intentar ambos campos
    let isValidPassword = false;
    
    // Primero intentar con password_hash
    if (user.password_hash) {
      isValidPassword = await bcrypt.compare(password, user.password_hash);
    }
    
    // Si no funciona, intentar con password
    if (!isValidPassword && user.password) {
      isValidPassword = await bcrypt.compare(password, user.password);
    }
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(user.id, user.email, user.role);

    // Remover contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// GET /api/auth/me - Obtener datos del usuario actual
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// PUT /api/auth/profile - Actualizar perfil
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, phone, address, city, region, postal_code } = req.body;

    // Actualizar usuario
    await query(`
      UPDATE users 
      SET full_name = ?, phone = ?, address = ?, city = ?, region = ?, postal_code = ?, updated_at = NOW()
      WHERE id = ?
    `, [full_name, phone, address, city, region, postal_code, userId]);

    // Obtener datos actualizados
    const updatedUser = await query('SELECT id, email, full_name, phone, address, city, region, postal_code, role FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        user: updatedUser[0]
      }
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// POST /api/auth/logout - Cerrar sesión (opcional, el token se maneja en frontend)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
});

module.exports = router;