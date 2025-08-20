const isDevelopment = import.meta.env.DEV;

// En desarrollo, apuntamos directamente al backend local.
// En producción, usamos el proxy PHP en Hostinger.
const API_BASE = isDevelopment
  ? import.meta.env.VITE_API_BASE_URL
  : import.meta.env.VITE_API_URL;

const createApiUrl = (path) => {
  if (isDevelopment) {
    // En desarrollo, la URL es directa: http://localhost:3001/api/webpay/create
    return `${API_BASE}${path}`;
  } else {
    // En producción, usamos el proxy: https://sillageperfum.cl/api-proxy.php?path=/api/webpay/create
    return `${API_BASE}?path=${path}`;
  }
};

export const checkoutService = {
  async processWebpayCheckout(userId, items, amount, returnUrl, failureUrl) {
    const url = createApiUrl('/api/webpay/create');
    const response = await fetch(url, {
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
    const url = createApiUrl('/api/webpay/confirm');
    const response = await fetch(url, {
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