const API_URL = import.meta.env.VITE_API_URL;

export const checkoutService = {
  async processWebpayCheckout(userId, items, amount, returnUrl, failureUrl) {
    const response = await fetch(`${API_URL}/api/webpay/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      throw new Error(error.message || 'Error al iniciar el pago');
    }

    return response.json();
  },

  async confirmWebpayPayment(token) {
    const response = await fetch(`${API_URL}/api/webpay/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al confirmar el pago');
    }

    return response.json();
  }
};