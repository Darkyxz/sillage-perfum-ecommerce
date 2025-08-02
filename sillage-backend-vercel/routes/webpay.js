const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Simulación de Webpay para desarrollo
// En producción, usar el SDK real de Transbank

// POST /api/webpay/create - Crear transacción Webpay
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { userId, items, amount, returnUrl, failureUrl } = req.body;
    
    // Validaciones
    if (!userId || !items || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Datos incompletos para crear la transacción'
      });
    }
    
    // Generar orden única
    const buyOrder = `BO-${Date.now()}-${userId}`;
    const sessionId = `SID-${Date.now()}`;
    
    // Crear orden en la base de datos
    const orderResult = await query(`
      INSERT INTO orders (
        user_id, total_amount, status, payment_id, 
        shipping_address, shipping_cost, created_at
      ) VALUES (?, ?, 'pending', ?, NULL, 5000, NOW())
    `, [userId, amount, buyOrder]);
    
    const orderId = orderResult.insertId;
    
    // Crear items de la orden
    for (const item of items) {
      await query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `, [orderId, item.id, item.quantity, item.price]);
    }
    
    // En desarrollo, simular respuesta de Webpay
    const mockToken = `TK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // En producción, aquí iría la llamada real a Transbank:
    /*
    const { WebpayPlus } = require('transbank-sdk');
    const createResponse = await WebpayPlus.Transaction.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );
    */
    
    // Respuesta simulada para desarrollo
    const mockResponse = {
      url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/webpay-simulator?token=${mockToken}&amount=${amount}&order=${buyOrder}`,
      token: mockToken,
      buyOrder: buyOrder
    };
    
    // Guardar token en la orden
    await query(
      'UPDATE orders SET preference_id = ? WHERE id = ?',
      [mockToken, orderId]
    );
    
    res.json({
      success: true,
      data: mockResponse
    });
    
  } catch (error) {
    console.error('Error creando transacción Webpay:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// POST /api/webpay/confirm - Confirmar transacción Webpay
router.post('/confirm', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token requerido'
      });
    }
    
    // Buscar la orden por token
    const orders = await query(
      'SELECT * FROM orders WHERE preference_id = ?',
      [token]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orden no encontrada'
      });
    }
    
    const order = orders[0];
    
    // En producción, aquí iría la confirmación real con Transbank:
    /*
    const { WebpayPlus } = require('transbank-sdk');
    const commitResponse = await WebpayPlus.Transaction.commit(token);
    */
    
    // Simulación para desarrollo
    const mockCommitResponse = {
      vci: 'TSY',
      amount: order.total_amount,
      status: 'AUTHORIZED',
      buy_order: order.payment_id,
      session_id: `SID-${Date.now()}`,
      card_detail: {
        card_number: '6623'
      },
      accounting_date: new Date().toISOString().split('T')[0],
      transaction_date: new Date().toISOString(),
      authorization_code: '1213',
      payment_type_code: 'VN',
      response_code: 0,
      installments_number: 0
    };
    
    // Actualizar orden como pagada
    await query(
      'UPDATE orders SET status = "paid", updated_at = NOW() WHERE id = ?',
      [order.id]
    );
    
    // Crear registro de pago
    await query(`
      INSERT INTO payments (
        order_id, payment_id, payment_method, payment_type, status,
        amount, currency, payer_email, payment_data, processed_at
      ) VALUES (?, ?, 'webpay', 'credit_card', 'approved', ?, 'CLP', ?, ?, NOW())
    `, [
      order.id,
      token,
      order.total_amount,
      'usuario@ejemplo.com', // En producción, obtener del usuario
      JSON.stringify(mockCommitResponse)
    ]);
    
    res.json({
      success: true,
      data: mockCommitResponse
    });
    
  } catch (error) {
    console.error('Error confirmando transacción Webpay:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// GET /api/webpay/status/:token - Obtener estado de transacción
router.get('/status/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const orders = await query(`
      SELECT o.*, p.status as payment_status, p.payment_data
      FROM orders o
      LEFT JOIN payments p ON o.id = p.order_id
      WHERE o.preference_id = ?
    `, [token]);
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transacción no encontrada'
      });
    }
    
    const order = orders[0];
    
    res.json({
      success: true,
      data: {
        order_id: order.id,
        status: order.status,
        amount: order.total_amount,
        payment_status: order.payment_status,
        created_at: order.created_at
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo estado de transacción:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router;