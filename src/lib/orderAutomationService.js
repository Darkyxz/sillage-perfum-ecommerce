import { supabase } from './supabase';
import { orderService } from './orderService';

export const orderAutomationService = {
  // Marcar automáticamente pedidos como completados basado en tiempo
  async autoCompleteOrders(daysThreshold = 7) {
    try {
      console.log('🤖 Iniciando automatización de pedidos...');
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);
      
      // Obtener pedidos enviados que deberían estar completados
      const { data: ordersToComplete, error } = await supabase
        .from('orders')
        .select('id, created_at, status, user_id')
        .eq('status', 'shipped')
        .lt('created_at', cutoffDate.toISOString());

      if (error) {
        throw error;
      }

      let completedCount = 0;
      
      for (const order of ordersToComplete) {
        try {
          await orderService.updateOrderStatus(order.id, 'delivered');
          completedCount++;
          console.log(`✅ Pedido #${order.id} marcado como entregado automáticamente`);
        } catch (updateError) {
          console.error(`❌ Error al completar pedido #${order.id}:`, updateError);
        }
      }

      console.log(`🎉 Automatización completada: ${completedCount} pedidos marcados como entregados`);
      
      return {
        success: true,
        completedCount,
        totalChecked: ordersToComplete.length
      };
      
    } catch (error) {
      console.error('💥 Error en automatización:', error);
      throw error;
    }
  },

  // Obtener estadísticas de pedidos
  async getOrderStats() {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, total_amount, created_at');

      if (error) throw error;

      const stats = {
        total: orders.length,
        byStatus: {},
        revenueByStatus: {},
        recent: {
          today: 0,
          week: 0,
          month: 0
        },
        revenue: {
          today: 0,
          week: 0,
          month: 0,
          total: 0
        }
      };

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      orders.forEach(order => {
        const status = order.status;
        const amount = parseFloat(order.total_amount) || 0;
        const orderDate = new Date(order.created_at);

        // Estadísticas por estado
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
        stats.revenueByStatus[status] = (stats.revenueByStatus[status] || 0) + amount;

        // Estadísticas por fecha
        if (orderDate >= today) {
          stats.recent.today++;
          stats.revenue.today += amount;
        }
        if (orderDate >= weekAgo) {
          stats.recent.week++;
          stats.revenue.week += amount;
        }
        if (orderDate >= monthAgo) {
          stats.recent.month++;
          stats.revenue.month += amount;
        }

        stats.revenue.total += amount;
      });

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  },

  // Obtener pedidos próximos a vencer
  async getExpiringOrders(daysThreshold = 3) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + daysThreshold);
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          total_amount
        `)
        .in('status', ['pending', 'paid'])
        .lt('created_at', cutoffDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('✅ Expiring orders fetched:', orders?.length || 0);
      if (!orders || orders.length === 0) {
        console.log('ℹ️ No expiring orders currently');
        return [];
      }

      return orders.map(order => ({
        ...order,
        daysSinceCreated: Math.floor((new Date() - new Date(order.created_at)) / (1000 * 60 * 60 * 24))
      }));
    } catch (error) {
      console.error('Error obteniendo pedidos por vencer:', error);
      throw error;
    }
  },

  // Función para enviar recordatorios (placeholder)
  async sendOrderReminders(orders) {
    // Esta función podría integrarse con un servicio de email
    console.log('📧 Enviando recordatorios para:', orders.length, 'pedidos');
    
    // Aquí podrías integrar con un servicio de email como SendGrid, Mailgun, etc.
    // Por ahora solo registramos los recordatorios
    
    return {
      success: true,
      reminders: orders.map(order => ({
        orderId: order.id,
        email: order.profiles.email,
        message: `Recordatorio: Tu pedido #${order.id} está pendiente`
      }))
    };
  }
};
