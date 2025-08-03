const express = require('express');
const { query, transaction } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

const router = express.Router();

// GET /api/orders/admin - Obtener todos los pedidos (solo admin)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let whereClause = '';
    let queryParams = [];
    
    if (status && status !== 'all') {
      whereClause = 'WHERE o.status = ?';
      queryParams.push(status);
    }
    
    // Obtener pedidos con información del usuario
    const orders = await query(`
      SELECT 
        o.id, o.user_id, o.total_amount, o.status, o.payment_status, o.payment_method,
        o.shipping_address, o.shipping_city, o.shipping_region, o.shipping_postal_code,
        o.notes, o.created_at, o.updated_at,
        u.full_name, u.email, u.phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, parseInt(limit), parseInt(offset)]);
    
    // Para cada pedido, obtener sus items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await query(`
          SELECT 
            oi.id, oi.product_id, oi.product_name, oi.product_sku,
            oi.quantity, oi.unit_price, oi.total_price
          FROM order_items oi
          WHERE oi.order_id = ?
        `, [order.id]);
        
        return {
          ...order,
          items,
          customer: {
            name: order.full_name,
            email: order.email,
            phone: order.phone
          }
        };
      })
    );
    
    // Obtener estadísticas
    const stats = await query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders
    `);
    
    res.json({
      success: true,
      data: {
        orders: ordersWithItems,
        stats: stats[0],
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: ordersWithItems.length
        }
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo pedidos (admin):', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo pedidos'
    });
  }
});

// PUT /api/orders/:id/shipping - Actualizar datos de envío
router.put('/:id/shipping', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    const { shipping_address, shipping_city, shipping_region, shipping_postal_code, notes } = req.body;
    
    // Verificar que el pedido pertenece al usuario
    const orders = await query('SELECT id FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }
    
    // Actualizar datos de envío
    await query(`
      UPDATE orders 
      SET shipping_address = ?, shipping_city = ?, shipping_region = ?, 
          shipping_postal_code = ?, notes = ?, updated_at = NOW()
      WHERE id = ?
    `, [shipping_address, shipping_city, shipping_region, shipping_postal_code, notes, orderId]);
    
    res.json({
      success: true,
      message: 'Datos de envío actualizados'
    });
    
  } catch (error) {
    console.error('Error actualizando datos de envío:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando datos de envío'
    });
  }
});

// PUT /api/orders/:id/admin-status - Actualizar estado del pedido (solo admin)
router.put('/:id/admin-status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, payment_status } = req.body;
    
    // Validar estado del pedido
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Estado de pedido inválido'
      });
    }
    
    // Validar estado de pago
    const validPaymentStatuses = ['pending', 'processing', 'paid', 'failed', 'refunded'];
    if (payment_status && !validPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({
        success: false,
        error: 'Estado de pago inválido'
      });
    }
    
    // Construir query dinámicamente
    let updateFields = [];
    let updateValues = [];
    
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    
    if (payment_status) {
      updateFields.push('payment_status = ?');
      updateValues.push(payment_status);
      
      // Si el pago se marca como pagado, actualizar payment_date
      if (payment_status === 'paid') {
        updateFields.push('payment_date = NOW()');
      }
    }
    
    updateFields.push('updated_at = NOW()');
    updateValues.push(orderId);
    
    // Actualizar
    const result = await query(
      `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Pedido actualizado correctamente'
    });
    
  } catch (error) {
    console.error('Error actualizando pedido (admin):', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando pedido'
    });
  }
});

// GET /api/orders/user - Obtener pedidos del usuario autenticado
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener pedidos del usuario con items
    const orders = await query(`
      SELECT 
        o.id, o.total_amount, o.status, o.payment_status, o.payment_method,
        o.shipping_address, o.shipping_city, o.shipping_region, o.shipping_postal_code,
        o.notes, o.created_at, o.updated_at
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);
    
    // Para cada pedido, obtener sus items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await query(`
          SELECT 
            oi.id, oi.product_id, oi.product_name, oi.product_sku,
            oi.quantity, oi.unit_price, oi.total_price
          FROM order_items oi
          WHERE oi.order_id = ?
        `, [order.id]);
        
        return {
          ...order,
          items
        };
      })
    );
    
    res.json({
      success: true,
      data: ordersWithItems
    });
    
  } catch (error) {
    console.error('Error obteniendo pedidos del usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo pedidos'
    });
  }
});

// GET /api/orders/:id - Obtener un pedido específico del usuario
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    
    // Obtener el pedido
    const orders = await query(`
      SELECT 
        o.id, o.total_amount, o.status, o.payment_status, o.payment_method,
        o.shipping_address, o.shipping_city, o.shipping_region, o.shipping_postal_code,
        o.notes, o.created_at, o.updated_at
      FROM orders o
      WHERE o.id = ? AND o.user_id = ?
    `, [orderId, userId]);
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }
    
    const order = orders[0];
    
    // Obtener items del pedido
    const items = await query(`
      SELECT 
        oi.id, oi.product_id, oi.product_name, oi.product_sku,
        oi.quantity, oi.unit_price, oi.total_price
      FROM order_items oi
      WHERE oi.order_id = ?
    `, [orderId]);
    
    res.json({
      success: true,
      data: {
        ...order,
        items
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo pedido'
    });
  }
});

// POST /api/orders - Crear nueva orden
router.post('/', authenticateToken, validateOrder, async (req, res) => {
  try {
    const { items, shipping_address, shipping_city, shipping_region, shipping_postal_code, notes } = req.body;
    const userId = req.user.id;
    
    const result = await transaction(async (connection) => {
      // Calcular total y verificar stock
      let totalAmount = 0;
      const orderItems = [];
      
      for (const item of items) {
        const [products] = await connection.execute(
          'SELECT id, name, sku, price, stock_quantity FROM products WHERE id = ? AND is_active = 1',
          [item.product_id]
        );
        
        if (products.length === 0) {
          throw new Error(`Producto con ID ${item.product_id} no encontrado`);
        }
        
        const product = products[0];
        
        if (product.stock_quantity < item.quantity) {
          throw new Error(`Stock insuficiente para ${product.name}`);
        }
        
        const itemTotal = item.quantity * product.price;
        totalAmount += itemTotal;
        
        orderItems.push({
          product_id: product.id,
          product_name: product.name,
          product_sku: product.sku,
          quantity: item.quantity,
          unit_price: product.price,
          total_price: itemTotal
        });
      }
      
      // Crear orden
      const [orderResult] = await connection.execute(`
        INSERT INTO orders (user_id, total_amount, shipping_address, shipping_city, 
                           shipping_region, shipping_postal_code, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [userId, totalAmount, shipping_address, shipping_city, shipping_region, shipping_postal_code, notes]);
      
      const orderId = orderResult.insertId;
      
      // Insertar items y actualizar stock
      for (const item of orderItems) {
        await connection.execute(`
          INSERT INTO order_items (order_id, product_id, product_name, product_sku, 
                                 quantity, unit_price, total_price)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [orderId, item.product_id, item.product_name, item.product_sku, 
            item.quantity, item.unit_price, item.total_price]);
        
        // Actualizar stock
        await connection.execute(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
      
      return { orderId, totalAmount };
    });
    
    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: {
        order_id: result.orderId,
        total_amount: result.totalAmount
      }
    });
    
  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error creando orden'
    });
  }
});

// GET /api/orders - Obtener órdenes del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0, status } = req.query;
    const userId = req.user.id;
    
    let sql = `
      SELECT o.id, o.total_amount, o.status, o.payment_status, o.payment_method,
             o.shipping_address, o.shipping_city, o.shipping_region,
             o.tracking_number, o.created_at, o.updated_at,
             COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
    `;
    
    const params = [userId];
    
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
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo órdenes'
    });
  }
});

// GET /api/orders/:id - Obtener orden específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Obtener orden
    const orderSql = `
      SELECT * FROM orders 
      WHERE id = ? AND (user_id = ? OR ? IN (
        SELECT id FROM users WHERE role = 'admin'
      ))
    `;
    
    const orders = await query(orderSql, [id, userId, req.user.id]);
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orden no encontrada'
      });
    }
    
    const order = orders[0];
    
    // Obtener items de la orden
    const itemsSql = `
      SELECT oi.*, p.image_url
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    
    const items = await query(itemsSql, [id]);
    
    res.json({
      success: true,
      data: {
        ...order,
        items
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo orden'
    });
  }
});

// GET /api/orders/admin/all - Obtener todas las órdenes (solo admin)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const ordersSql = `
      SELECT o.*, u.email as user_email, u.full_name as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
    
    const orders = await query(ordersSql);
    
    // Para cada orden, obtener sus items
    for (let order of orders) {
      const itemsSql = `
        SELECT oi.*, p.name as product_name, p.image_url as product_image_url
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `;
      
      const items = await query(itemsSql, [order.id]);
      order.order_items = items;
      
      // Agregar información del usuario en formato compatible
      order.user = {
        email: order.user_email,
        profiles: {
          full_name: order.user_name
        }
      };
    }
    
    res.json({
      success: true,
      data: orders
    });
    
  } catch (error) {
    console.error('Error obteniendo todas las órdenes:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo órdenes'
    });
  }
});

// PUT /api/orders/:id/status - Actualizar estado de orden (solo admin)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tracking_number } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Estado inválido'
      });
    }
    
    let sql = 'UPDATE orders SET status = ?';
    const params = [status];
    
    if (tracking_number) {
      sql += ', tracking_number = ?';
      params.push(tracking_number);
    }
    
    sql += ' WHERE id = ?';
    params.push(id);
    
    const result = await query(sql, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orden no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Estado de orden actualizado'
    });
    
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando estado'
    });
  }
});

module.exports = router;