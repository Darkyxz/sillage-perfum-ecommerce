import { apiClient } from './apiClient';
import { orderService } from './orderService';

export const orderAutomationService = {
  // Automatizar completado de pedidos enviados
  async autoCompleteShippedOrders(daysThreshold = 7) {
    try {
      console.log(`🚚 Buscando pedidos enviados hace más de ${daysThreshold} días...`);
      
      // Obtener pedidos enviados que deberían estar completados
      const response = await apiClient.get(`/orders/admin/shipped-orders?daysThreshold=${daysThreshold}`);
      
      if (!response.success) {
        console.warn('⚠️ No se pudieron obtener pedidos enviados:', response.error);
        return { completed: 0, errors: [] };
      }

      const ordersToComplete = response.data || [];
      
      if (ordersToComplete.length === 0) {
        console.log('✅ No hay pedidos para completar automáticamente');
        return { completed: 0, errors: [] };
      }

      console.log(`📦 Encontrados ${ordersToComplete.length} pedidos para completar`);
      
      let completed = 0;
      const errors = [];
      
      for (const order of ordersToComplete) {
        try {
          await orderService.updateOrderStatus(order.id, 'completed');
          completed++;
          console.log(`✅ Pedido ${order.id} marcado como completado`);
        } catch (error) {
          console.error(`❌ Error completando pedido ${order.id}:`, error);
          errors.push({ orderId: order.id, error: error.message });
        }
      }
      
      console.log(`🎉 Proceso completado: ${completed} pedidos actualizados, ${errors.length} errores`);
      
      return { completed, errors };
    } catch (error) {
      console.error('❌ Error en autoCompleteShippedOrders:', error);
      throw error;
    }
  },

  // Obtener estadísticas de pedidos
  async getOrderStats() {
    try {
      const response = await apiClient.get('/orders/admin/stats');
      
      if (response.success) {
        return response.data;
      } else {
        console.warn('⚠️ No se pudieron cargar las estadísticas:', response.error);
        return {
          total: 0,
          pending: 0,
          paid: 0,
          shipped: 0,
          completed: 0,
          cancelled: 0,
          totalRevenue: 0,
          averageOrderValue: 0
        };
      }
    } catch (error) {
      console.error('Error getting order stats:', error);
      return {
        total: 0,
        pending: 0,
        paid: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0,
        totalRevenue: 0,
        averageOrderValue: 0
      };
    }
  },

  // Notificar pedidos pendientes de pago
  async notifyPendingPayments(daysThreshold = 3) {
    try {
      console.log(`💳 Buscando pedidos con pagos pendientes hace más de ${daysThreshold} días...`);
      
      const response = await apiClient.get(`/orders/admin/pending-payments?daysThreshold=${daysThreshold}`);
      
      if (!response.success) {
        console.warn('⚠️ No se pudieron obtener pedidos pendientes:', response.error);
        return [];
      }

      const pendingOrders = response.data || [];
      
      if (pendingOrders.length === 0) {
        console.log('✅ No hay pedidos con pagos pendientes');
        return [];
      }

      console.log(`⏰ Encontrados ${pendingOrders.length} pedidos con pagos pendientes`);
      
      // Aquí podrías implementar notificaciones por email, etc.
      // Por ahora solo retornamos la lista
      
      return pendingOrders;
    } catch (error) {
      console.error('❌ Error en notifyPendingPayments:', error);
      throw error;
    }
  },

  // Limpiar pedidos cancelados antiguos
  async cleanupCancelledOrders(daysThreshold = 30) {
    try {
      console.log(`🗑️ Buscando pedidos cancelados hace más de ${daysThreshold} días...`);
      
      const response = await apiClient.delete(`/orders/admin/cleanup-cancelled?daysThreshold=${daysThreshold}`);
      
      if (response.success) {
        const deletedCount = response.data?.deletedCount || 0;
        console.log(`✅ ${deletedCount} pedidos cancelados eliminados`);
        return deletedCount;
      } else {
        console.warn('⚠️ No se pudieron limpiar pedidos cancelados:', response.error);
        return 0;
      }
    } catch (error) {
      console.error('❌ Error en cleanupCancelledOrders:', error);
      throw error;
    }
  }
};