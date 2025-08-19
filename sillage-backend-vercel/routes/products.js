const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

const router = express.Router();

// =====================================================
// RUTAS PÚBLICAS (sin autenticación)
// =====================================================

// GET /api/products - Obtener todos los productos activos
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, limit = 50, offset = 0 } = req.query;

    let sql = `
      SELECT id, name, description, price, sku, brand, category, 
             image_url, stock_quantity, is_featured, rating, created_at,
             in_stock, notes, duration, original_inspiration, size, concentration,
             fragrance_profile, fragrance_notes_top, fragrance_notes_middle, fragrance_notes_base
      FROM products 
      WHERE is_active = 1
    `;
    const params = [];

    // Filtros opcionales
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (featured === 'true') {
      sql += ' AND is_featured = 1';
    }

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR brand LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY is_featured DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const products = await query(sql, params);

    // Obtener el total de productos (sin límite)
    let totalSql = `
      SELECT COUNT(*) as total
      FROM products 
      WHERE is_active = 1
    `;
    const totalParams = [];

    // Aplicar los mismos filtros para el conteo
    if (category) {
      totalSql += ' AND category = ?';
      totalParams.push(category);
    }

    if (featured === 'true') {
      totalSql += ' AND is_featured = 1';
    }

    if (search) {
      totalSql += ' AND (name LIKE ? OR description LIKE ? OR brand LIKE ?)';
      const searchTerm = `%${search}%`;
      totalParams.push(searchTerm, searchTerm, searchTerm);
    }

    const totalResult = await query(totalSql, totalParams);
    const total = totalResult[0]?.total || 0;

    res.json({
      success: true,
      data: products,
      total: total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo productos'
    });
  }
});

// GET /api/products/all - Obtener todos los productos sin paginación (DEBE IR ANTES DE RUTAS DINÁMICAS)
router.get('/all', async (req, res) => {
  try {
    const sql = `
      SELECT id, name, description, price, sku, brand, category, 
             image_url, stock_quantity, is_featured, rating, created_at,
             in_stock, notes, duration, original_inspiration, size, concentration,
             fragrance_profile, fragrance_notes_top, fragrance_notes_middle, fragrance_notes_base
      FROM products 
      WHERE is_active = 1
      ORDER BY created_at DESC
    `;

    const products = await query(sql);

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Error obteniendo todos los productos:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo productos'
    });
  }
});

// GET /api/products/featured - Obtener productos destacados
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const sql = `
      SELECT id, name, description, price, sku, brand, category, 
             image_url, stock_quantity, rating, created_at,
             in_stock, notes, duration, original_inspiration, size, concentration
      FROM products 
      WHERE is_active = 1 AND is_featured = 1
      ORDER BY RAND()
      LIMIT ?
    `;

    const products = await query(sql, [parseInt(limit)]);

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Error obteniendo productos destacados:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo productos destacados'
    });
  }
});

// GET /api/products/categories - Obtener categorías disponibles
router.get('/categories', async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT category, COUNT(*) as count
      FROM products 
      WHERE is_active = 1 AND category IS NOT NULL
      GROUP BY category
      ORDER BY category
    `;

    const categories = await query(sql);

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo categorías'
    });
  }
});

// GET /api/products/:sku - Obtener producto por SKU (DEBE IR DESPUÉS DE RUTAS ESPECÍFICAS)
router.get('/:sku', async (req, res) => {
  try {
    const { sku } = req.params;

    const sql = `
      SELECT id, name, description, price, sku, brand, category, 
             image_url, stock_quantity, is_featured, rating, created_at,
             in_stock, notes, duration, original_inspiration, size, concentration,
             fragrance_profile, fragrance_notes_middle, fragrance_notes_base
      FROM products 
      WHERE sku = ? AND is_active = 1
    `;

    const products = await query(sql, [sku]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: products[0]
    });

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo producto'
    });
  }
});

// GET /api/products/categories - Obtener categorías disponibles
router.get('/categories', async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT category, COUNT(*) as count
      FROM products 
      WHERE is_active = 1 AND category IS NOT NULL
      GROUP BY category
      ORDER BY category
    `;

    const categories = await query(sql);

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo categorías'
    });
  }
});

// =====================================================
// RUTAS PROTEGIDAS (requieren autenticación de admin)
// =====================================================

// DELETE /api/products/clear-all - Limpiar todos los productos (solo admin)
router.delete('/clear-all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Eliminar todos los productos PERMANENTEMENTE
    const result = await query('DELETE FROM products');

    res.json({
      success: true,
      message: `${result.affectedRows} productos eliminados permanentemente`,
      data: { deletedCount: result.affectedRows }
    });

  } catch (error) {
    console.error('Error limpiando productos:', error);
    res.status(500).json({
      success: false,
      error: 'Error limpiando productos'
    });
  }
});

// DELETE /api/products/hard-clear - Eliminar permanentemente todos los productos (solo admin)
router.delete('/hard-clear', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Eliminar permanentemente todos los productos
    const result = await query('DELETE FROM products');

    res.json({
      success: true,
      message: `${result.affectedRows} productos eliminados permanentemente`,
      data: { deletedCount: result.affectedRows }
    });

  } catch (error) {
    console.error('Error eliminando productos permanentemente:', error);
    res.status(500).json({
      success: false,
      error: 'Error eliminando productos permanentemente'
    });
  }
});

// POST /api/products/load-zachary - Cargar productos de Zachary Perfumes (solo admin)
router.post('/load-zachary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { loadZacharyProducts } = require('../load-zachary-products');
    await loadZacharyProducts();

    res.json({
      success: true,
      message: 'Productos de Zachary Perfumes cargados exitosamente'
    });

  } catch (error) {
    console.error('Error cargando productos de Zachary:', error);
    res.status(500).json({
      success: false,
      error: 'Error cargando productos de Zachary Perfumes'
    });
  }
});

// POST /api/products - Crear nuevo producto (solo admin)
router.post('/', authenticateToken, requireAdmin, validateProduct, async (req, res) => {
  try {
    const {
      name, description, price, sku, brand, category,
      image_url, stock_quantity, is_featured, rating,
      fragrance_profile, fragrance_notes_top, fragrance_notes_middle, fragrance_notes_base
    } = req.body;

    const sql = `
      INSERT INTO products (
        name, description, price, sku, brand, category,
        image_url, stock_quantity, is_featured, rating,
        fragrance_profile, fragrance_notes_top, fragrance_notes_middle, fragrance_notes_base
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      name, description, price, sku, brand, category,
      image_url, stock_quantity || 0, is_featured || false, rating || 0,
      JSON.stringify(fragrance_profile || []),
      JSON.stringify(fragrance_notes_top || []),
      JSON.stringify(fragrance_notes_middle || []),
      JSON.stringify(fragrance_notes_base || [])
    ]);

    // Obtener el producto creado
    const newProduct = await query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: newProduct[0]
    });

  } catch (error) {
    console.error('Error creando producto:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: 'El SKU ya existe'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error creando producto'
    });
  }
});

// PUT /api/products/:id - Actualizar producto (solo admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea un número válido
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'ID de producto inválido'
      });
    }

    // Verificar que el producto existe
    const existingProduct = await query('SELECT * FROM products WHERE id = ?', [id]);
    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    // Extraer campos del body, usando valores existentes como fallback
    const current = existingProduct[0];
    const {
      name = current.name,
      description = current.description,
      price = current.price,
      sku = current.sku,
      brand = current.brand,
      category = current.category,
      image_url = current.image_url,
      stock_quantity = current.stock_quantity,
      is_featured = current.is_featured,
      is_active = current.is_active,
      rating = current.rating,
      notes = current.notes,
      duration = current.duration,
      original_inspiration = current.original_inspiration,
      size = current.size,
      concentration = current.concentration,
      in_stock = current.in_stock,
      // Nuevos campos de notas olfativas
      fragrance_profile = current.fragrance_profile,
      fragrance_notes_top = current.fragrance_notes_top,
      fragrance_notes_middle = current.fragrance_notes_middle,
      fragrance_notes_base = current.fragrance_notes_base
    } = req.body;

    // Validaciones básicas
    if (price !== null && price !== undefined && (isNaN(price) || price < 0)) {
      return res.status(400).json({
        success: false,
        error: 'El precio debe ser un número válido mayor o igual a 0'
      });
    }

    if (stock_quantity !== null && stock_quantity !== undefined && (isNaN(stock_quantity) || stock_quantity < 0)) {
      return res.status(400).json({
        success: false,
        error: 'La cantidad en stock debe ser un número válido mayor o igual a 0'
      });
    }

    const sql = `
      UPDATE products SET
        name = ?, description = ?, price = ?, sku = ?, brand = ?, category = ?,
        image_url = ?, stock_quantity = ?, is_featured = ?, is_active = ?, rating = ?,
        notes = ?, duration = ?, original_inspiration = ?, size = ?, concentration = ?, in_stock = ?,
        fragrance_profile = ?, fragrance_notes_top = ?, fragrance_notes_middle = ?, fragrance_notes_base = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await query(sql, [
      name, description, price, sku, brand, category,
      image_url, stock_quantity, is_featured, is_active, rating,
      notes, duration, original_inspiration, size, concentration, in_stock,
      JSON.stringify(fragrance_profile || []),
      JSON.stringify(fragrance_notes_top || []),
      JSON.stringify(fragrance_notes_middle || []),
      JSON.stringify(fragrance_notes_base || []),
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se pudo actualizar el producto'
      });
    }

    // Obtener el producto actualizado
    const updatedProduct = await query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: updatedProduct[0]
    });

  } catch (error) {
    console.error('Error actualizando producto:', error);

    // Manejar errores específicos
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: 'El SKU ya existe en otro producto'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al actualizar producto'
    });
  }
});

// DELETE /api/products/:id - Eliminar producto (solo admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - marcar como inactivo
    const sql = 'UPDATE products SET is_active = 0 WHERE id = ?';
    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error eliminando producto'
    });
  }
});

// PUT /api/products/:id/stock - Actualizar stock de producto
router.put('/:id/stock', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'La cantidad debe ser un número'
      });
    }

    // Obtener stock actual
    const currentStock = await query(
      'SELECT stock_quantity FROM products WHERE id = ? AND is_active = 1',
      [id]
    );

    if (currentStock.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    const newStock = Math.max(0, currentStock[0].stock_quantity + quantity);

    // Actualizar stock
    const result = await query(
      'UPDATE products SET stock_quantity = ? WHERE id = ?',
      [newStock, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se pudo actualizar el stock'
      });
    }

    res.json({
      success: true,
      message: 'Stock actualizado exitosamente',
      data: {
        productId: id,
        previousStock: currentStock[0].stock_quantity,
        newStock: newStock,
        change: quantity
      }
    });

  } catch (error) {
    console.error('Error actualizando stock:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando stock'
    });
  }
});

module.exports = router;