const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/favorites - Obtener favoritos del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT f.id as favorite_id, f.created_at as favorited_at,
             p.id, p.name, p.description, p.price, p.sku, p.brand, p.category,
             p.image_url, p.stock_quantity, p.rating, p.is_featured,
             p.size, p.concentration, p.in_stock
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      WHERE f.user_id = ? AND p.is_active = 1
      ORDER BY f.created_at DESC
    `;

    const favorites = await query(sql, [userId]);

    res.json({
      success: true,
      data: favorites,
      count: favorites.length
    });

  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo favoritos'
    });
  }
});

// GET /api/favorites/check/:productId - Verificar si un producto está en favoritos
router.get('/check/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const favorite = await query(
      'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    res.json({
      success: true,
      isFavorite: favorite.length > 0,
      favoriteId: favorite.length > 0 ? favorite[0].id : null
    });

  } catch (error) {
    console.error('Error verificando favorito:', error);
    res.status(500).json({
      success: false,
      error: 'Error verificando favorito'
    });
  }
});

// POST /api/favorites - Agregar producto a favoritos
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: 'product_id es requerido'
      });
    }

    // Verificar que el producto existe
    const productExists = await query(
      'SELECT id, name FROM products WHERE id = ? AND is_active = 1',
      [product_id]
    );

    if (productExists.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    // Verificar si ya está en favoritos
    const existingFavorite = await query(
      'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existingFavorite.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'El producto ya está en favoritos',
        favoriteId: existingFavorite[0].id
      });
    }

    // Agregar a favoritos
    const result = await query(
      'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
      [userId, product_id]
    );

    res.status(201).json({
      success: true,
      message: `${productExists[0].name} agregado a favoritos`,
      data: {
        favorite_id: result.insertId,
        user_id: userId,
        product_id: product_id,
        product_name: productExists[0].name
      }
    });

  } catch (error) {
    console.error('Error agregando a favoritos:', error);
    res.status(500).json({
      success: false,
      error: 'Error agregando a favoritos'
    });
  }
});

// DELETE /api/favorites/:productId - Remover producto de favoritos
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Obtener info del producto antes de eliminar
    const productInfo = await query(`
      SELECT p.name 
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      WHERE f.user_id = ? AND f.product_id = ?
    `, [userId, productId]);

    const result = await query(
      'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Favorito no encontrado'
      });
    }

    res.json({
      success: true,
      message: productInfo.length > 0
        ? `${productInfo[0].name} removido de favoritos`
        : 'Producto removido de favoritos'
    });

  } catch (error) {
    console.error('Error removiendo de favoritos:', error);
    res.status(500).json({
      success: false,
      error: 'Error removiendo de favoritos'
    });
  }
});

// POST /api/favorites/toggle - Toggle favorito (agregar/remover)
router.post('/toggle', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: 'product_id es requerido'
      });
    }

    // Verificar que el producto existe
    const productExists = await query(
      'SELECT id, name FROM products WHERE id = ? AND is_active = 1',
      [product_id]
    );

    if (productExists.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    // Verificar si ya está en favoritos
    const existingFavorite = await query(
      'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existingFavorite.length > 0) {
      // Remover de favoritos
      await query(
        'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
        [userId, product_id]
      );

      res.json({
        success: true,
        action: 'removed',
        isFavorite: false,
        message: `${productExists[0].name} removido de favoritos`
      });
    } else {
      // Agregar a favoritos
      const result = await query(
        'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
        [userId, product_id]
      );

      res.json({
        success: true,
        action: 'added',
        isFavorite: true,
        favoriteId: result.insertId,
        message: `${productExists[0].name} agregado a favoritos`
      });
    }

  } catch (error) {
    console.error('Error toggle favorito:', error);
    res.status(500).json({
      success: false,
      error: 'Error procesando favorito'
    });
  }
});

module.exports = router;