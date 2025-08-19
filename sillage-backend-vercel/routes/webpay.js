const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require('transbank-sdk');

const router = express.Router();

// Configurar Webpay con credenciales de integración
let webpayTransaction;

try {
  // Usar las credenciales de integración del SDK
  webpayTransaction = new WebpayPlus.Transaction(
    new Options(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY,
      Environment.Integration
    )
  );
  console.log('✅ Webpay configurado correctamente para integración');
} catch (error) {
  console.error('❌ Error configurando Webpay:', error);
}

// POST /api/webpay/create - Crear transacción Webpay
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { userId, items, amount, returnUrl, failureUrl } = req.body;

    if (!userId || !items || !amount || !returnUrl) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' });
    }

    // Validar que el monto sea un número válido (mínimo 50 pesos según Transbank)
    const finalAmount = Math.round(parseFloat(amount));
    if (isNaN(finalAmount) || finalAmount < 50) {
      return res.status(400).json({ success: false, error: 'Monto inválido (mínimo $50)' });
    }

    // Validar que returnUrl sea una URL válida
    try {
      new URL(returnUrl);
    } catch (error) {
      return res.status(400).json({ success: false, error: 'URL de retorno inválida' });
    }

    const buyOrder = `BO${Date.now()}${userId}`.substring(0, 26); // Max 26 caracteres
    const sessionId = `SID${Date.now()}`.substring(0, 61); // Max 61 caracteres

    console.log('🚀 Creando transacción Webpay:');
    console.log('- Buy Order:', buyOrder);
    console.log('- Session ID:', sessionId);
    console.log('- Amount:', finalAmount);
    console.log('- Return URL:', returnUrl);
    console.log('- User ID:', userId);

    // Primero crear el pedido en la base de datos
    const orderResult = await query(
      `INSERT INTO orders (user_id, total_amount, status, payment_id, created_at) VALUES (?, ?, 'pending', ?, NOW())`,
      [userId, finalAmount, buyOrder]
    );

    const orderId = orderResult.insertId;

    // Guardar los items del pedido
    if (items && items.length > 0) {
      for (const item of items) {
        const unitPrice = parseFloat(item.price) || 0;
        const totalPrice = unitPrice * (item.quantity || 1);
        
        await query(
          `INSERT INTO order_items (order_id, product_id, quantity, price, product_name, product_sku, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [orderId, item.id, item.quantity || 1, unitPrice, item.name || 'Producto', item.sku || '', unitPrice, totalPrice]
        );
      }
    }

    // Verificar que webpayTransaction esté inicializado
    if (!webpayTransaction) {
      throw new Error('Webpay no está configurado correctamente');
    }

    // Llamada REAL a Transbank
    console.log('🔄 Llamando a Transbank con parámetros:', {
      buyOrder,
      sessionId,
      amount: finalAmount,
      returnUrl
    });

    const createResponse = await webpayTransaction.create(buyOrder, sessionId, finalAmount, returnUrl);

    console.log('✅ Respuesta de Transbank:', {
      url: createResponse.url,
      token: createResponse.token
    });

    // Actualizar el pedido con el token de Webpay
    await query(
      'UPDATE orders SET preference_id = ? WHERE id = ?',
      [createResponse.token, orderId]
    );

    res.json({
      success: true,
      data: {
        url: createResponse.url,
        token: createResponse.token,
        orderId: orderId,
        // Agregar información adicional para debug
        debug: {
          buyOrder,
          sessionId,
          amount: finalAmount,
          returnUrl
        }
      }
    });

  } catch (error) {
    console.error('❌ Error creando transacción Webpay:', error);
    res.status(500).json({ success: false, error: error.message || 'Error interno del servidor' });
  }
});

// POST /api/webpay/confirm - Confirmar transacción Webpay
router.post('/confirm', async (req, res) => {
  let connection;
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token requerido' });
    }

    console.log('🔍 Confirmando transacción con token:', token);

    // Buscar la orden asociada al token ANTES de confirmar con Transbank
    const orderResult = await query(
      'SELECT * FROM orders WHERE preference_id = ?',
      [token]
    );

    if (orderResult.length === 0) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    const order = orderResult[0];

    // Verificar si ya fue procesada
    if (order.status === 'paid' || order.status === 'completed') {
      console.log('⚠️ Transacción ya fue procesada previamente');
      
      // Buscar el pago existente
      const existingPayment = await query(
        'SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1',
        [order.id]
      );
      
      return res.json({
        success: true,
        data: {
          status: 'AUTHORIZED',
          amount: order.total_amount,
          authorization_code: existingPayment.length > 0 ? existingPayment[0].transaction_id : null,
          transaction_date: order.updated_at,
          order_id: order.id,
          message: 'Transacción ya procesada'
        }
      });
    }

    // Verificar que webpayTransaction esté inicializado
    if (!webpayTransaction) {
      throw new Error('Webpay no está configurado correctamente');
    }

    // Confirmación REAL con Transbank
    let commitResponse;
    try {
      commitResponse = await webpayTransaction.commit(token);
      console.log('📋 Respuesta de confirmación:', commitResponse);
    } catch (transbankError) {
      console.error('❌ Error de Transbank:', transbankError.message);
      
      // Si el error indica que la transacción ya fue procesada
      if (transbankError.message.includes('already') || 
          transbankError.message.includes('locked') ||
          transbankError.message.includes('processed')) {
        
        // Marcar como completada y retornar éxito
        await query(
          'UPDATE orders SET status = "paid", payment_status = "paid", updated_at = NOW() WHERE preference_id = ?',
          [token]
        );
        
        return res.json({
          success: true,
          data: {
            status: 'AUTHORIZED',
            amount: order.total_amount,
            authorization_code: token,
            transaction_date: new Date().toISOString(),
            order_id: order.id,
            message: 'Transacción procesada exitosamente (recuperada)'
          }
        });
      }
      
      throw transbankError;
    }

    // Procesar la respuesta de Transbank
    if (commitResponse.status === 'AUTHORIZED') {
      // Usar transacción para evitar condiciones de carrera
      await query('START TRANSACTION');
      
      try {
        // Actualizar orden como pagada
        await query(
          'UPDATE orders SET status = "paid", payment_status = "paid", updated_at = NOW() WHERE preference_id = ? AND status != "paid"',
          [token]
        );

        // Verificar si el pago ya existe
        const existingPayment = await query(
          'SELECT id FROM payments WHERE order_id = ? AND transaction_id = ?',
          [order.id, commitResponse.authorization_code]
        );

        if (existingPayment.length === 0) {
          // Generar un payment_id único
          const paymentId = `PAY_${Date.now()}_${order.id}`;
          
          // Guardar el pago en la tabla payments
          await query(
            `INSERT INTO payments (
              order_id,
              payment_id,
              amount, 
              payment_method, 
              status, 
              transaction_id, 
              authorization_code,
              payment_data,
              processed_at,
              created_at
            ) VALUES (?, ?, ?, 'webpay', 'completed', ?, ?, ?, NOW(), NOW())`,
            [
              order.id,
              paymentId,
              commitResponse.amount, 
              commitResponse.authorization_code,
              commitResponse.authorization_code,
              JSON.stringify(commitResponse)
            ]
          );
          
          console.log(`💳 Pago registrado con ID: ${paymentId}`);
        }

        // Descontar stock de los productos comprados
        try {
          const orderItems = await query(
            'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
            [order.id]
          );

          for (const item of orderItems) {
            await query(
              'UPDATE products SET stock_quantity = GREATEST(0, stock_quantity - ?) WHERE id = ?',
              [item.quantity, item.product_id]
            );
            console.log(`📦 Stock descontado: Producto ${item.product_id}, Cantidad: ${item.quantity}`);
          }

          console.log('✅ Stock actualizado para todos los productos');
        } catch (stockError) {
          console.error('⚠️ Error actualizando stock (pago exitoso pero stock no actualizado):', stockError);
          // No lanzamos el error porque el pago ya fue exitoso
        }

        await query('COMMIT');
        console.log('✅ Pago confirmado exitosamente');
        
      } catch (dbError) {
        await query('ROLLBACK');
        throw dbError;
      }
    } else {
      // Actualizar orden como fallida
      await query(
        'UPDATE orders SET status = "failed", payment_status = "failed", updated_at = NOW() WHERE preference_id = ?',
        [token]
      );
      console.log('❌ Pago rechazado');
    }

    res.json({
      success: true,
      data: {
        status: commitResponse.status,
        amount: commitResponse.amount,
        authorization_code: commitResponse.authorization_code,
        transaction_date: commitResponse.transaction_date,
        order_id: order.id
      }
    });

  } catch (error) {
    // Rollback en caso de error
    try {
      await query('ROLLBACK');
    } catch (rollbackError) {
      console.error('❌ Error en rollback:', rollbackError.message);
    }
    
    console.error('❌ Error confirmando transacción Webpay:', error);
    
    // Mapear errores específicos
    let errorMessage = error.message || 'Error interno del servidor';
    let statusCode = 500;
    
    if (error.message && error.message.includes('already')) {
      errorMessage = 'Transacción ya procesada';
      statusCode = 422;
    } else if (error.message && error.message.includes('locked')) {
      errorMessage = 'Transacción bloqueada por otro proceso';
      statusCode = 422;
    }
    
    res.status(statusCode).json({ 
      success: false, 
      error: errorMessage,
      code: error.code || 'WEBPAY_CONFIRM_ERROR'
    });
  }
});

// GET /api/webpay/status/:token - Obtener estado de la transacción
router.get('/status/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token requerido' });
    }

    // Buscar la orden en la base de datos
    const orderResult = await query(
      'SELECT o.*, p.status as payment_status, p.transaction_id FROM orders o LEFT JOIN payments p ON o.id = p.order_id WHERE o.preference_id = ?',
      [token]
    );

    if (orderResult.length === 0) {
      return res.status(404).json({ success: false, error: 'Transacción no encontrada' });
    }

    const order = orderResult[0];

    res.json({
      success: true,
      data: {
        order_id: order.id,
        status: order.status,
        amount: order.total_amount,
        payment_status: order.payment_status,
        transaction_id: order.transaction_id,
        created_at: order.created_at,
        updated_at: order.updated_at
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo estado de transacción:', error);
    res.status(500).json({ success: false, error: error.message || 'Error interno del servidor' });
  }
});

// GET /api/webpay/test - Endpoint de prueba para verificar configuración
router.get('/test', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        webpayConfigured: !!webpayTransaction,
        environment: 'integration',
        commerceCode: IntegrationCommerceCodes.WEBPAY_PLUS,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
