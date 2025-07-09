// Servicio simplificado de MercadoPago para desarrollo
// NOTA: En producción, esto debe ir en una Edge Function por seguridad

export const createMercadoPagoPreference = async (items, payer, backUrls, externalReference) => {
  try {
    // Obtener el token desde las variables de entorno
    const accessToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('VITE_MERCADOPAGO_ACCESS_TOKEN no está configurado en las variables de entorno');
    }
    
    console.log('🔄 Creando preferencia de MercadoPago...');
    console.log('📦 Items:', items);
    console.log('👤 Payer:', payer);
    console.log('🔗 Back URLs:', backUrls);
    console.log('🏷️ External Reference:', externalReference);

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        payer,
        back_urls: backUrls,
        external_reference: externalReference,
        // auto_return: 'approved', // DESACTIVADO TEMPORALMENTE para desarrollo en localhost
        statement_descriptor: "SILLAGE-PERFUM",
        expires: true,
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de MercadoPago:', errorText);
      throw new Error(`MercadoPago API error: ${response.status} - ${errorText}`);
    }

    const preference = await response.json();
    console.log('✅ Preferencia creada:', preference);
    
    return {
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point
    };
  } catch (error) {
    console.error('💥 Error creando preferencia:', error);
    throw error;
  }
};

// Función para obtener el estado de un pago
export const getPaymentStatus = async (paymentId) => {
  try {
    const accessToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('VITE_MERCADOPAGO_ACCESS_TOKEN no está configurado');
    }
    
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get payment status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};

// Función para procesar el resultado del pago
export const processPaymentResult = async (paymentId, orderId) => {
  try {
    const payment = await getPaymentStatus(paymentId);
    
    let orderStatus = 'pending';
    switch (payment.status) {
      case 'approved':
        orderStatus = 'paid';
        break;
      case 'rejected':
        orderStatus = 'failed';
        break;
      case 'pending':
      case 'in_process':
        orderStatus = 'pending';
        break;
      default:
        orderStatus = 'failed';
    }

    // Aquí deberías actualizar el estado del pedido en tu base de datos
    console.log(`🔄 Actualizando pedido ${orderId} a estado: ${orderStatus}`);
    
    return {
      orderId,
      paymentId,
      status: orderStatus,
      paymentDetails: payment
    };
  } catch (error) {
    console.error('Error processing payment result:', error);
    throw error;
  }
}; 