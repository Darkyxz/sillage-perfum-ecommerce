// Configuración centralizada para diferentes ambientes

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// URLs base según ambiente
export const API_CONFIG = {
  // API Backend
  BASE_URL: isDevelopment 
    ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
    : import.meta.env.VITE_API_BASE_URL || 'https://sillageperfum.cl/api-proxy.php',
  
  // Frontend URLs
  FRONTEND_URL: isDevelopment 
    ? 'http://localhost:5173'
    : 'https://sillageperfum.cl',
    
  // URLs de retorno para pagos
  PAYMENT_RETURN_URL: isDevelopment 
    ? 'http://localhost:5173/pago-exitoso'
    : 'https://sillageperfum.cl/pago-exitoso',
    
  PAYMENT_FAILURE_URL: isDevelopment 
    ? 'http://localhost:5173/pago-fallido' 
    : 'https://sillageperfum.cl/pago-fallido',
    
  // Para checkout de invitados
  GUEST_PAYMENT_RETURN_URL: (orderId, email) => {
    const baseUrl = isDevelopment 
      ? 'http://localhost:5173'
      : 'https://sillageperfum.cl';
    return `${baseUrl}/pago-exitoso?guest=true&order=${orderId}&email=${encodeURIComponent(email)}`;
  },
  
  GUEST_PAYMENT_FAILURE_URL: (orderId) => {
    const baseUrl = isDevelopment 
      ? 'http://localhost:5173'
      : 'https://sillageperfum.cl';
    return `${baseUrl}/pago-fallido?guest=true&order=${orderId}`;
  }
};

// Configuración de Webpay
export const WEBPAY_CONFIG = {
  COMMERCE_CODE: import.meta.env.VITE_WEBPAY_PLUS_COMMERCE_CODE || '597055555532',
  API_KEY: import.meta.env.VITE_WEBPAY_PLUS_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
  ENVIRONMENT: import.meta.env.VITE_WEBPAY_ENVIRONMENT || 'integration'
};

// Configuración general de la app
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Sillage Perfume',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Tienda de perfumes premium',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENVIRONMENT: isDevelopment ? 'development' : 'production'
};

// Helper functions
export const getPaymentReturnUrl = () => API_CONFIG.PAYMENT_RETURN_URL;
export const getPaymentFailureUrl = () => API_CONFIG.PAYMENT_FAILURE_URL;
export const getGuestPaymentReturnUrl = (orderId, email) => API_CONFIG.GUEST_PAYMENT_RETURN_URL(orderId, email);
export const getGuestPaymentFailureUrl = (orderId) => API_CONFIG.GUEST_PAYMENT_FAILURE_URL(orderId);

// Debug helper
export const logConfig = () => {
  if (isDevelopment) {
    console.log('🔧 Configuración actual:', {
      environment: APP_CONFIG.ENVIRONMENT,
      apiBaseUrl: API_CONFIG.BASE_URL,
      frontendUrl: API_CONFIG.FRONTEND_URL,
      paymentReturnUrl: API_CONFIG.PAYMENT_RETURN_URL,
      paymentFailureUrl: API_CONFIG.PAYMENT_FAILURE_URL
    });
  }
};

export default {
  API_CONFIG,
  WEBPAY_CONFIG,
  APP_CONFIG,
  getPaymentReturnUrl,
  getPaymentFailureUrl,
  getGuestPaymentReturnUrl,
  getGuestPaymentFailureUrl,
  logConfig
};
