// Servicio para manejar webhooks de MercadoPago
import { supabase } from './supabase.js';
import { orderService } from './orderService.js';

export const webhookService = {
  // Procesar webhook de MercadoPago
  async processWebhook(webhookData) {
    try {
      console.log('🔔 Webhook recibido:', webhookData);
      
      const { type, data } = webhookData;
      
      switch (type) {
        case 'payment':
          return await this.handlePaymentWebhook(data.id);
        case 'merchant_order':
          return await this.handleMerchantOrderWebhook(data.id);
        default:
          console.log(`ℹ️ Tipo de webhook no manejado: ${type}`);
          return { status: 'ignored', type };
      }
    } catch (error) {
      console.error('❌ Error procesando webhook:', error);
      throw error;
    }
  },

  // Manejar webhook de pago
  async handlePaymentWebhook(paymentId) {
    try {
      console.log(`💳 Procesando pago: ${paymentId}`);
      
      // Obtener información del pago desde MercadoPago
      const paymentInfo = await this.getPaymentInfo(paymentId);
      
      if (!paymentInfo) {
        throw new Error(`No se pudo obtener información del pago ${paymentId}`);
      }
      
      // Extraer el ID del pedido desde external_reference
      const orderId = parseInt(paymentInfo.external_reference);
      
      if (!orderId || isNaN(orderId)) {
        console.warn('⚠️ Pago sin external_reference válido:', paymentId, paymentInfo.external_reference);
        return { status: 'warning', message: 'Pago sin referencia de pedido válida' };
      }
      
      // Determinar el estado del pedido basado en el estado del pago
      let orderStatus = 'pending';
      let paymentStatus = 'pending';
      
      switch (paymentInfo.status) {
        case 'approved':
          orderStatus = 'paid';
          paymentStatus = 'approved';
          break;
        case 'rejected':
          orderStatus = 'failed';
          paymentStatus = 'rejected';
          break;
        case 'cancelled':
          orderStatus = 'cancelled';
          paymentStatus = 'cancelled';
          break;
        case 'refunded':
          orderStatus = 'refunded';
          paymentStatus = 'refunded';
          break;
        case 'charged_back':
          orderStatus = 'disputed';
          paymentStatus = 'charged_back';
          break;
        case 'pending':
        case 'in_process':
        case 'in_mediation':
          orderStatus = 'pending';
          paymentStatus = 'pending';
          break;
        default:
          orderStatus = 'failed';
          paymentStatus = 'unknown';
      }
      
      // Actualizar el pedido en la base de datos
      await orderService.updateOrderStatus(orderId, orderStatus);
      
      // Guardar información del pago
      await this.savePaymentInfo(orderId, paymentId, paymentInfo, paymentStatus);
      
      console.log(`✅ Pedido ${orderId} actualizado a: ${orderStatus}`);
      
      return {
        status: 'processed',
        orderId,
        paymentId,
        orderStatus,
        paymentStatus
      };
      
    } catch (error) {
      console.error(`❌ Error procesando pago ${paymentId}:`, error);
      throw error;
    }
  },

  // Manejar webhook de merchant order
  async handleMerchantOrderWebhook(merchantOrderId) {
    try {
      console.log(`🏪 Procesando merchant order: ${merchantOrderId}`);
      
      // Obtener información de la orden desde MercadoPago
      const orderInfo = await this.getMerchantOrderInfo(merchantOrderId);
      
      if (!orderInfo) {
        throw new Error(`No se pudo obtener información de la orden ${merchantOrderId}`);
      }
      
      // Procesar cada pago en la orden
      const results = [];
      for (const payment of orderInfo.payments || []) {
        const result = await this.handlePaymentWebhook(payment.id);
        results.push(result);
      }
      
      return {
        status: 'processed',
        merchantOrderId,
        payments: results
      };
      
    } catch (error) {
      console.error(`❌ Error procesando merchant order ${merchantOrderId}:`, error);
      throw error;
    }
  },

  // Obtener información del pago desde MercadoPago
  async getPaymentInfo(paymentId) {
    try {
      const accessToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
      
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`MercadoPago API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo info del pago:', error);
      throw error;
    }
  },

  // Obtener información de merchant order desde MercadoPago
  async getMerchantOrderInfo(merchantOrderId) {
    try {
      const accessToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
      
      const response = await fetch(`https://api.mercadopago.com/merchant_orders/${merchantOrderId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`MercadoPago API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo info de merchant order:', error);
      throw error;
    }
  },

  // Guardar información del pago en la base de datos
  async savePaymentInfo(orderId, paymentId, paymentInfo, paymentStatus) {
    try {
      const paymentData = {
        order_id: orderId,
        payment_id: paymentId,
        payment_method: paymentInfo.payment_method_id,
        payment_type: paymentInfo.payment_type_id,
        status: paymentStatus,
        amount: paymentInfo.transaction_amount,
        currency: paymentInfo.currency_id,
        installments: paymentInfo.installments,
        payer_email: paymentInfo.payer?.email,
        payer_identification: paymentInfo.payer?.identification,
        payment_data: paymentInfo, // Guardar toda la información como JSON
        processed_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('payments')
        .upsert(paymentData, { 
          onConflict: 'payment_id',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error('Error guardando pago:', error);
        throw error;
      }
      
      console.log(`💾 Información de pago guardada: ${paymentId}`);
    } catch (error) {
      console.error('Error guardando información del pago:', error);
      throw error;
    }
  },

  // Validar webhook signature (para producción)
  validateWebhookSignature(payload, signature, secret) {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
      
      return signature === expectedSignature;
    } catch (error) {
      console.error('Error validando signature:', error);
      return false;
    }
  }
};