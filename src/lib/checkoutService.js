const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const checkoutService = {
  async processWebpayCheckout(userId, items, amount, returnUrl, failureUrl) {
    try {
      const response = await fetch(`${API_URL}/api/webpay/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          items,
          amount,
          returnUrl,
          failureUrl
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al iniciar el pago');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en processWebpayCheckout:', error);
      throw error;
    }
  },

  async confirmWebpayPayment(token) {
    try {
      const response = await fetch(`${API_URL}/api/webpay/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al confirmar el pago');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en confirmWebpayPayment:', error);
      throw error;
    }
  },

  async getPaymentStatus(token) {
    try {
      const response = await fetch(`${API_URL}/api/webpay/status/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al obtener estado del pago');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en getPaymentStatus:', error);
      throw error;
    }
  }
};