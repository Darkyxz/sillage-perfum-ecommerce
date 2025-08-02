const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin, requireOwnershipOrAdmin } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validation');

const router = express.Router();

// =====================================================
// RUTAS PROTEGIDAS - REQUIEREN AUTENTICACIÓN
// =====================================================

// PUT /api/users/:id - Actualizar perfil de usuario
router.put('/:id', authenticateToken, requireOwnershipOrAdmin, validateUserUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, address, city, region, postal_code } = req.body;
    
    const sql = `
      UPDATE users SET
        full_name = COALESCE(?, full_name),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        region = COALESCE(?, region),
        postal_code = COALESCE(?, postal_code),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const result = await query(sql, [full_name, phone, address, city, region, postal_code, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    // Obtener datos actualizados
    const updatedUser = await query(`
      SELECT id, email, full_name, phone, address, city, region, postal_code, role, created_at
      FROM users WHERE id = ?
    `, [id]);
    
    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: updatedUser[0]
    });
    
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando perfil'
    });
  }
});

// GET /api/users/:id - Obtener perfil de usuario
router.get('/:id', authenticateToken, requireOwnershipOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `
      SELECT id, email, full_name, phone, address, city, region, 
             postal_code, role, email_verified, created_at
      FROM users 
      WHERE id = ?
    `;
    
    const users = await query(sql, [id]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: users[0]
    });
    
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo perfil'
    });
  }
});

// GET /api/users/:id/orders - Obtener órdenes del usuario
router.get('/:id/orders', authenticateToken, requireOwnershipOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20, offset = 0, status } = req.query;
    
    let sql = `
      SELECT o.id, o.total_amount, o.status, o.payment_status, o.payment_method,
             o.shipping_address, o.shipping_city, o.shipping_region,
             o.tracking_number, o.created_at, o.updated_at,
             COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
    `;
    
    const params = [id];
    
    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }
    
    sql += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const orders = await query(sql, params);
    
    res.json({
      success: true,
      data: orders
    });
    
  } catch (error) {
    console.error('Error obteniendo órdenes del usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo órdenes'
    });
  }
});

// =====================================================
// RUTAS DE ADMINISTRADOR
// =====================================================

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 50, offset = 0, role, search } = req.query;
    
    let sql = `
      SELECT id, email, full_name, phone, city, region, role, 
             email_verified, created_at, updated_at
      FROM users
      WHERE 1=1
    `;
    
    const params = [];
    
    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }
    
    if (search) {
      sql += ' AND (full_name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const users = await query(sql, params);
    
    // Obtener total de usuarios para paginación
    let countSql = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];
    
    if (role) {
      countSql += ' AND role = ?';
      countParams.push(role);
    }
    
    if (search) {
      countSql += ' AND (full_name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }
    
    const totalResult = await query(countSql, countParams);
    const total = totalResult[0].total;
    
    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo usuarios'
    });
  }
});

// PUT /api/users/:id/role - Cambiar rol de usuario (solo admin)
router.put('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Rol inválido. Debe ser "user" o "admin"'
      });
    }
    
    const sql = 'UPDATE users SET role = ? WHERE id = ?';
    const result = await query(sql, [role, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: `Rol actualizado a ${role} exitosamente`
    });
    
  } catch (error) {
    console.error('Error actualizando rol:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando rol'
    });
  }
});

// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que no sea el último admin
    if (req.user.id.toString() === id.toString()) {
      const adminCount = await query('SELECT COUNT(*) as count FROM users WHERE role = "admin"');
      
      if (adminCount[0].count <= 1) {
        return res.status(400).json({
          success: false,
          error: 'No puedes eliminar el último administrador'
        });
      }
    }
    
    // Eliminar usuario (esto también eliminará las sesiones por CASCADE)
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await query(sql, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error eliminando usuario'
    });
  }
});

// GET /api/users/stats - Estadísticas de usuarios (solo admin)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
        SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as user_count,
        SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verified_count,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_users_30d
      FROM users
    `);
    
    res.json({
      success: true,
      data: stats[0]
    });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estadísticas'
    });
  }
});

// GET /api/users/admin/all - Obtener todos los usuarios (solo admin)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await query(`
      SELECT id, email, full_name, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `);
    
    res.json({
      success: true,
      data: users
    });
    
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo usuarios'
    });
  }
});

// POST /api/users/make-admin - Hacer admin a perfumsillage@gmail.com (TEMPORAL)
router.post('/make-admin', async (req, res) => {
  try {
    const { secret, email } = req.body;
    
    // Clave secreta para seguridad (cambiar por una más segura)
    if (secret !== 'sillage-admin-2024') {
      return res.status(403).json({
        success: false,
        error: 'Clave secreta incorrecta'
      });
    }
    
    const targetEmail = email || 'perfumsillage@gmail.com';
    
    // Buscar usuario
    const users = await query('SELECT id, email, role FROM users WHERE email = ?', [targetEmail]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado. Debe registrarse primero.'
      });
    }
    
    const user = users[0];
    
    if (user.role === 'admin') {
      return res.json({
        success: true,
        message: 'El usuario ya es admin',
        data: { email: user.email, role: user.role }
      });
    }
    
    // Actualizar a admin
    await query('UPDATE users SET role = ? WHERE id = ?', ['admin', user.id]);
    
    res.json({
      success: true,
      message: `Usuario ${targetEmail} ahora es admin`,
      data: { email: targetEmail, role: 'admin' }
    });
    
  } catch (error) {
    console.error('Error haciendo admin:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router;