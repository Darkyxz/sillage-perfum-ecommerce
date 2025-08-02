import { apiClient } from './apiClient';

export const orderService = {
  // Crear un nuevo pedido con validación mejorada
  async createOrder(userId, items, totalAmount, paymentId = null, shippingAddress = null) {
    try {
      console.log('🔍 Debug orderService - userId recibido:', userId);
      console.log('🔍 Debug orderService - items:', items);
      console.log('🔍 Debug orderService - totalAmount:', totalAmount);

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

      // Preparar datos del pedido para MySQL
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.price)
        })),
        shipping_address: shippingAddress?.address || 'Dirección por definir',
        shipping_city: shippingAddress?.city || 'Santiago',
        shipping_region: shippingAddress?.region || 'Región Metropolitana',
        shipping_postal_code: shippingAddress?.postal_code || '',
        notes: shippingAddress?.notes || ''
      };

      const response = await apiClient.post('/orders', orderData);

      if (!response.success) {
        throw new Error(response.error || 'Error al crear el pedido');
      }

      console.log('✅ Pedido creado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  },

  // Obtener historial de pedidos del usuario
  async getUserOrders() {
    try {
      console.log('📦 Obteniendo pedidos del usuario...');

      const response = await apiClient.get('/orders/user');

      if (response.success) {
        console.log('✅ Pedidos obtenidos:', response.data.length);
        return response.data;
      } else {
        throw new Error(response.error || 'Error obteniendo pedidos');
      }
    } catch (error) {
      console.error('❌ Error getting user orders:', error);
      throw error;
    }
  },

  // Obtener un pedido específico
  async getOrder(orderId) {
    try {
      console.log('📦 Obteniendo pedido:', orderId);

      const response = await apiClient.get(`/orders/${orderId}`);

      if (response.success) {
        console.log('✅ Pedido obtenido:', response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Error obteniendo pedido');
      }
    } catch (error) {
      console.error('❌ Error getting order:', error);
      throw error;
    }
  },

  // Obtener todos los pedidos (para admin)
  async getAllOrders() {
    try {
      console.log('🔍 orderService: Obteniendo todos los pedidos...');

      const response = await apiClient.get('/orders/admin/all');

      if (response.success) {
        console.log('📦 orderService: Pedidos obtenidos:', response.data?.length || 0);
        return response.data || [];
      } else {
        console.warn('⚠️ orderService: No se pudieron cargar las órdenes:', response.error);
        return [];
      }
    } catch (error) {
      console.error('❌ orderService: Error fetching all orders:', error);
      return [];
    }
  },

  // Obtener un pedido específico
  async getOrderById(orderId) {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Pedido no encontrado');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Actualizar estado del pedido
  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiClient.put(`/orders/${orderId}/status`, { status });

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error al actualizar el estado del pedido');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Actualizar payment_id cuando se confirma el pago
  async updatePaymentId(orderId, paymentId) {
    try {
      const response = await apiClient.put(`/orders/${orderId}/payment`, {
        payment_id: paymentId,
        status: 'paid'
      });

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error al actualizar el ID de pago');
      }
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

      return await this.getOrderById(orderId);
    } catch (error) {
      console.error('Error fetching order by external reference:', error);
      throw error;
    }
  },

  // Actualizar pedido con información de pago
  async updateOrderWithPaymentInfo(orderId, paymentInfo) {
    try {
      const updateData = {
        payment_id: paymentInfo.payment_id,
        payment_method: paymentInfo.payment_method,
        payment_status: paymentInfo.status
      };

      // Determinar el estado del pedido basado en el estado del pago
      switch (paymentInfo.status) {
        case 'approved':
        case 'paid':
          updateData.status = 'paid';
          break;
        case 'rejected':
        case 'failed':
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

      const response = await apiClient.put(`/orders/${orderId}/payment-info`, updateData);

      if (response.success) {
        console.log(`✅ Pedido ${orderId} actualizado con info de pago:`, updateData);
        return response.data;
      } else {
        throw new Error(response.error || 'Error al actualizar la información de pago');
      }
    } catch (error) {
      console.error('Error updating order with payment info:', error);
      throw error;
    }
  },

  // Obtener estadísticas de pedidos (para admin)
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
          failed: 0,
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
        failed: 0,
        cancelled: 0,
        totalRevenue: 0,
        averageOrderValue: 0
      };
    }
  },

  // Actualizar datos de envío de una orden
  async updateOrderShipping(orderId, shippingData) {
    try {
      console.log('📦 Actualizando datos de envío para orden:', orderId);

      const response = await apiClient.put(`/orders/${orderId}/shipping`, {
        shipping_address: shippingData.address,
        shipping_city: shippingData.city,
        shipping_region: shippingData.region,
        shipping_postal_code: shippingData.postal_code,
        notes: shippingData.notes
      });

      if (response.success) {
        console.log('✅ Datos de envío actualizados');
        return response.data;
      } else {
        throw new Error(response.error || 'Error actualizando datos de envío');
      }
    } catch (error) {
      console.error('❌ Error updating order shipping:', error);
      throw error;
    }
  },

  // Obtener todos los pedidos con filtros (admin)
  async getAllOrdersAdmin(status = 'all', limit = 50, offset = 0) {
    try {
      console.log('📦 Obteniendo todos los pedidos (admin)...');

      const params = new URLSearchParams({
        status,
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await apiClient.get(`/orders/admin?${params}`);

      if (response.success) {
        console.log('✅ Pedidos obtenidos (admin):', response.data.orders.length);
        return response.data;
      } else {
        throw new Error(response.error || 'Error obteniendo pedidos');
      }
    } catch (error) {
      console.error('❌ Error getting all orders (admin):', error);
      throw error;
    }
  },

  // Actualizar estado de pedido (admin)
  async updateOrderStatusAdmin(orderId, status) {
    try {
      console.log('📦 Actualizando estado de pedido (admin):', orderId, 'a', status);

      const response = await apiClient.put(`/orders/${orderId}/admin-status`, {
        status
      });

      if (response.success) {
        console.log('✅ Estado de pedido actualizado (admin)');
        return response.data;
      } else {
        throw new Error(response.error || 'Error actualizando estado de pedido');
      }
    } catch (error) {
      console.error('❌ Error updating order status (admin):', error);
      throw error;
    }
  }
}; 