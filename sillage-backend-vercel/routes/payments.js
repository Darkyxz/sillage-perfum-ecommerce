const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/payments - Guardar información de pago
router.post('/', async (req, res) => {
  try {
    const {
      order_id,
      payment_id,
      payment_method,
      payment_type,
      status,
      amount,
      currency,
      installments,
      payer_email,
      payer_identification,
      payment_data,
      processed_at
    } = req.body;
    
    const sql = `
      INSERT INTO payments (
        order_id, payment_id, payment_method, payment_type, status,
        amount, currency, installments, payer_email, payer_identification,
        payment_data, processed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        payment_data = VALUES(payment_data),
        processed_at = VALUES(processed_at)
    `;
    
    const result = await query(sql, [
      order_id, payment_id, payment_method, payment_type, status,
      amount, currency, installments, payer_email, 
      JSON.stringify(payer_identification), JSON.stringify(payment_data), processed_at
    ]);
    
    res.json({
      success: true,
      message: 'Información de pago guardada exitosamente',
      data: { id: result.insertId }
    });
    
  } catch (error) {
    console.error('Error guardando pago:', error);
    res.status(500).json({
      success: false,
      error: 'Error guardando información de pago'
    });
  }
});

// GET /api/payments/order/:orderId - Obtener pagos de una orden
router.get('/order/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const sql = `
      SELECT * FROM payments 
      WHERE order_id = ?
      ORDER BY processed_at DESC
    `;
    
    const payments = await query(sql, [orderId]);
    
    res.json({
      success: true,
      data: payments
    });
    
  } catch (error) {
    console.error('Error obteniendo pagos:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo pagos'
    });
  }
});

// GET /api/payments/:paymentId - Obtener información de un pago específico
router.get('/:paymentId', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const sql = 'SELECT * FROM payments WHERE payment_id = ?';
    const payments = await query(sql, [paymentId]);
    
    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pago no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: payments[0]
    });
    
  } catch (error) {
    console.error('Error obteniendo pago:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo pago'
    });
  }
});

// GET /api/payments - Obtener todos los pagos (solo admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;
    
    let sql = `
      SELECT p.*, o.user_id, o.total_amount as order_total
      FROM payments p
      LEFT JOIN orders o ON p.order_id = o.id
    `;
    const params = [];
    
    if (status) {
      sql += ' WHERE p.status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY p.processed_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const payments = await query(sql, params);
    
    res.json({
      success: true,
      data: payments
    });
    
  } catch (error) {
    console.error('Error obteniendo pagos:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo pagos'
    });
  }
});

module.exports = router;