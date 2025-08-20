import { apiClient } from './apiClient';

export const checkoutService = {
  async processWebpayCheckout(userId, items, amount, returnUrl, failureUrl) {
    try {
      const token = apiClient.getToken();
      console.log('🔑 Debug API Base URL:', apiClient.baseURL);
      console.log('🔑 Debug Token existe:', !!token);
      console.log('🔑 Debug Token (primeros 20 chars):', token?.substring(0, 20));
      
      const result = await apiClient.post('/webpay/create', {
        userId,
        items,
        amount,
        returnUrl,
        failureUrl
      });

      return result.data;
    } catch (error) {
      console.error('Error en processWebpayCheckout:', error);
      throw error;
    }
  },

  async confirmWebpayPayment(token) {
    try {
      const result = await apiClient.post('/webpay/confirm', { token });
      return result.data;
    } catch (error) {
      console.error('Error en confirmWebpayPayment:', error);
      throw error;
    }
  },

  async getPaymentStatus(token) {
    try {
      const result = await apiClient.get(`/webpay/status/${token}`);
      return result.data;
    } catch (error) {
      console.error('Error en getPaymentStatus:', error);
      throw error;
    }
  }
};