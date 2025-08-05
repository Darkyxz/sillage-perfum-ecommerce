import { apiClient } from './apiClient';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const guestCheckoutService = {
  // Crear orden como invitado
  async createGuestOrder(cartItems, guestInfo, shippingInfo, totalAmount) {
    try {
      const response = await apiClient.post('/guest-checkout/create-order', {
        items: cartItems,
        total_amount: totalAmount,
        guest_info: guestInfo,
        shipping_info: shippingInfo
      });

      // apiClient.post ya retorna el JSON, así que solo revisa success
      if (!response.success) {
        throw new Error(response.error || 'Error al crear la orden');
      }

      return response;
    } catch (error) {
      console.error('Error creando orden de invitado:', error);
      throw error;
    }
  },

  // Procesar pago de invitado con Webpay
  async processGuestPayment(orderId, guestEmail, amount, returnUrl, failureUrl) {
    try {
      const response = await apiClient.post('/guest-checkout/process-payment', {
        order_id: orderId,
        guest_email: guestEmail,
        amount,
        return_url: returnUrl,
        failure_url: failureUrl
      });

      // apiClient.post ya retorna el JSON, así que solo revisa success
      if (!response.success) {
        throw new Error(response.error || 'Error al procesar el pago');
      }

      return response;
    } catch (error) {
      console.error('Error procesando pago de invitado:', error);
      throw error;
    }
  },

  // Rastrear orden de invitado
  async trackGuestOrder(orderId, email) {
    try {
      const response = await apiClient.get(`/guest-checkout/track-order?order_id=${orderId}&email=${encodeURIComponent(email)}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Orden no encontrada');
      }

      return response.json();
    } catch (error) {
      console.error('Error rastreando orden:', error);
      throw error;
    }
  },

  // Guardar información del invitado en localStorage para futuras compras
  saveGuestInfo(guestInfo) {
    try {
      localStorage.setItem('guest_checkout_info', JSON.stringify(guestInfo));
    } catch (error) {
      console.error('Error guardando información del invitado:', error);
    }
  },

  // Obtener información del invitado guardada
  getGuestInfo() {
    try {
      const info = localStorage.getItem('guest_checkout_info');
      return info ? JSON.parse(info) : null;
    } catch (error) {
      console.error('Error obteniendo información del invitado:', error);
      return null;
    }
  },

  // Limpiar información del invitado
  clearGuestInfo() {
    try {
      localStorage.removeItem('guest_checkout_info');
    } catch (error) {
      console.error('Error limpiando información del invitado:', error);
    }
  }
};
