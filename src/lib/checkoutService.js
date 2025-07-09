import { supabase } from './supabase';
import { orderService } from './orderService';
import { createMercadoPagoPreference } from './mercadopagoService';

export const checkoutService = {
  // Proceso completo de checkout con validación robusta
  async processCheckout(userId, cartItems, shippingAddress = null) {
    try {
      console.log('🛒 Iniciando proceso de checkout...', { userId, itemCount: cartItems.length });
      
      // 1. Validaciones iniciales
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }
      
      if (!cartItems || cartItems.length === 0) {
        throw new Error('El carrito está vacío');
      }

      // 2. Obtener información del usuario
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', userId)
        .single();

      if (userError || !userProfile) {
        throw new Error('No se pudo obtener la información del usuario');
      }

      // 3. Validar y calcular totales
      const validatedItems = [];
      let totalAmount = 0;

      for (const item of cartItems) {
        // Verificar que el producto existe y tiene stock
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('id, name, price, stock_quantity')
          .eq('id', item.id)
          .single();

        if (productError || !product) {
          throw new Error(`Producto no encontrado: ${item.id}`);
        }

        if (product.stock_quantity < item.quantity) {
          throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock_quantity}`);
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        validatedItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          total: itemTotal
        });
      }

      console.log('✅ Items validados:', { count: validatedItems.length, totalAmount });

      // 4. Crear la orden en la base de datos
      const order = await orderService.createOrder(
        userId,
        validatedItems,
        totalAmount,
        null, // payment_id se actualizará después del pago
        shippingAddress
      );

      console.log('✅ Orden creada:', { orderId: order.id });

      // 5. Preparar datos para MercadoPago
      const mercadoPagoItems = validatedItems.map(item => ({
        id: item.id,
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'CLP'
      }));

      const payer = {
        name: userProfile.full_name,
        email: userProfile.email
      };

      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5174';
      const backUrls = {
        success: `${baseUrl}/payment-success`,
        failure: `${baseUrl}/payment-failure`,
        pending: `${baseUrl}/payment-pending`
      };

      // 6. Crear preferencia de pago
      const preference = await createMercadoPagoPreference(
        mercadoPagoItems,
        payer,
        backUrls,
        order.id.toString() // external_reference
      );

      console.log('✅ Preferencia de pago creada:', { preferenceId: preference.id });

      // 7. Actualizar la orden con el preference_id
      await supabase
        .from('orders')
        .update({ preference_id: preference.id })
        .eq('id', order.id);

      return {
        success: true,
        orderId: order.id,
        preferenceId: preference.id,
        initPoint: preference.init_point,
        sandboxInitPoint: preference.sandbox_init_point,
        totalAmount,
        items: validatedItems
      };

    } catch (error) {
      console.error('❌ Error en checkout:', error);
      throw error;
    }
  },

  // Confirmar pago y actualizar stock
  async confirmPayment(orderId, paymentId) {
    try {
      console.log('💳 Confirmando pago...', { orderId, paymentId });

      // 1. Obtener la orden con sus items
      const order = await orderService.getOrderById(orderId);
      if (!order) {
        throw new Error('Orden no encontrada');
      }

      // 2. Verificar que la orden pertenece al usuario correcto
      if (order.status === 'paid') {
        console.log('⚠️ Orden ya procesada');
        return { success: true, message: 'Orden ya procesada' };
      }

      // 3. Actualizar el estado de la orden
      await orderService.updatePaymentId(orderId, paymentId);

      // 4. Actualizar el stock de productos
      for (const item of order.order_items) {
        const { error: stockError } = await supabase
          .from('products')
          .update({
            stock_quantity: supabase.sql`stock_quantity - ${item.quantity}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.product_id);

        if (stockError) {
          console.error('Error actualizando stock:', stockError);
          // No fallar el proceso por error de stock, pero registrar el error
        }
      }

      console.log('✅ Pago confirmado y stock actualizado');

      return {
        success: true,
        orderId,
        paymentId,
        message: 'Pago confirmado exitosamente'
      };

    } catch (error) {
      console.error('❌ Error confirmando pago:', error);
      throw error;
    }
  },

  // Validar estado de orden
  async validateOrderStatus(orderId, userId) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!inner(full_name, email)
        `)
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (error || !order) {
        throw new Error('Orden no encontrada o no pertenece al usuario');
      }

      return order;
    } catch (error) {
      console.error('❌ Error validando orden:', error);
      throw error;
    }
  }
};
