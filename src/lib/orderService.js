import { supabase } from './supabase';

export const orderService = {
  // Crear un nuevo pedido con validación mejorada
  async createOrder(userId, items, totalAmount, paymentId = null, shippingAddress = null) {
    try {
      // Validaciones previas
      if (!userId) {
        throw new Error('El ID del usuario es requerido.');
      }
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('Los items son requeridos y deben ser un array no vacío.');
      }
      
      if (typeof totalAmount !== 'number' || isNaN(totalAmount) || totalAmount <= 0) {
        throw new Error('El monto total debe ser un número válido mayor a 0.');
      }

      // Validar que el usuario existe
      const { data: userExists, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (userError || !userExists) {
        throw new Error('El usuario no existe en el sistema.');
      }

      // 1. Crear el pedido principal con información completa
      const orderData = {
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending',
        payment_id: paymentId,
        shipping_address: shippingAddress,
        created_at: new Date().toISOString()
      };

      const { data: newOrders, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw new Error(`Error al crear el pedido: ${orderError.message}`);
      }
      
      if (!newOrders || newOrders.length === 0) {
        throw new Error("La creación del pedido no devolvió el registro esperado.");
      }
      
      const order = newOrders[0];
      console.log('✅ Pedido creado exitosamente:', { orderId: order.id, userId, totalAmount });

      // 2. Crear los items del pedido con validación
      const orderItems = items.map(item => {
        if (!item.id || !item.quantity || !item.price) {
          throw new Error(`Item inválido: ${JSON.stringify(item)}`);
        }
        
        return {
          order_id: order.id,
          product_id: item.id,
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.price)
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Intentar eliminar la orden creada si falló la inserción de items
        await supabase.from('orders').delete().eq('id', order.id);
        throw new Error(`Error al crear los items del pedido: ${itemsError.message}`);
      }

      console.log('✅ Items del pedido creados exitosamente:', orderItems.length);
      return order;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  },

  // Obtener historial de pedidos del usuario
  async getUserOrders(userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:product_id (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Obtener todos los pedidos (para admin)
  async getAllOrders() {
    try {
      console.log('🔍 orderService: Obteniendo todos los pedidos...');
      
      // Usar una consulta que haga JOIN con profiles para obtener la información del usuario
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!inner(
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('❌ orderService: Error obteniendo pedidos:', ordersError);
        throw ordersError;
      }
      
      console.log('📦 orderService: Pedidos obtenidos:', orders?.length || 0);
      return orders || [];
    } catch (error) {
      console.error('❌ orderService: Error fetching all orders:', error);
      console.error('❌ orderService: Error details:', error.message);
      throw error;
    }
  },

  // Obtener un pedido específico
  async getOrderById(orderId) {
    try {
      // Obtener el pedido con profile y sus items en una sola consulta
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!inner(
            full_name
          ),
          order_items (
            *,
            product:products (*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Actualizar estado del pedido
  async updateOrderStatus(orderId, status) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Actualizar payment_id cuando se confirma el pago
  async updatePaymentId(orderId, paymentId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          payment_id: paymentId,
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error updating payment ID:', error);
      throw error;
    }
  },

  // Buscar pedido por external_reference (para webhooks)
  async getOrderByExternalReference(externalReference) {
    try {
      // Convertir a integer si viene como string
      const orderId = parseInt(externalReference);
      
      if (isNaN(orderId)) {
        throw new Error(`External reference inválido: ${externalReference}`);
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order by external reference:', error);
      throw error;
    }
  },

  // Actualizar pedido con información de MercadoPago
  async updateOrderWithPaymentInfo(orderId, paymentInfo) {
    try {
      const updateData = {
        payment_id: paymentInfo.payment_id,
        payment_method: paymentInfo.payment_method,
        payment_status: paymentInfo.status,
        updated_at: new Date().toISOString()
      };

      // Determinar el estado del pedido basado en el estado del pago
      switch (paymentInfo.status) {
        case 'approved':
          updateData.status = 'paid';
          break;
        case 'rejected':
          updateData.status = 'failed';
          break;
        case 'cancelled':
          updateData.status = 'cancelled';
          break;
        case 'refunded':
          updateData.status = 'refunded';
          break;
        case 'pending':
        case 'in_process':
          updateData.status = 'pending';
          break;
        default:
          updateData.status = 'failed';
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select();

      if (error) throw error;
      
      console.log(`✅ Pedido ${orderId} actualizado con info de pago:`, updateData);
      return data?.[0];
    } catch (error) {
      console.error('Error updating order with payment info:', error);
      throw error;
    }
  },

  // Obtener estadísticas de pedidos (para admin)
  async getOrderStats() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status, total_amount, created_at');

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter(o => o.status === 'pending').length,
        paid: data.filter(o => o.status === 'paid').length,
        failed: data.filter(o => o.status === 'failed').length,
        cancelled: data.filter(o => o.status === 'cancelled').length,
        totalRevenue: data
          .filter(o => o.status === 'paid')
          .reduce((sum, o) => sum + (o.total_amount || 0), 0),
        averageOrderValue: 0
      };

      if (stats.paid > 0) {
        stats.averageOrderValue = stats.totalRevenue / stats.paid;
      }

      return stats;
    } catch (error) {
      console.error('Error getting order stats:', error);
      throw error;
    }
  }
}; 