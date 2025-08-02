import { apiClient } from './apiClient';

export const contactService = {
    // Enviar mensaje de contacto
    async sendMessage(contactData) {
        try {
            console.log('📧 Enviando mensaje de contacto:', contactData);

            const response = await apiClient.post('/contact', contactData);

            if (response.success) {
                console.log('✅ Mensaje enviado exitosamente');
                return { success: true, message: response.message };
            } else {
                throw new Error(response.error || 'Error enviando mensaje');
            }
        } catch (error) {
            console.error('❌ Error en contactService:', error);
            throw error;
        }
    }
};