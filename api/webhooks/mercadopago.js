// Endpoint para webhooks de MercadoPago
// Debe desplegarse como Edge Function en Supabase o Vercel

import { webhookService } from '../../src/lib/webhookService.js';

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔔 Webhook MercadoPago recibido');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    // Validar que el webhook viene de MercadoPago
    const userAgent = req.headers['user-agent'];
    if (!userAgent || !userAgent.includes('MercadoPago')) {
      console.warn('⚠️ Webhook no viene de MercadoPago');
      return res.status(400).json({ error: 'Invalid source' });
    }

    // En producción, validar la signature
    if (process.env.NODE_ENV === 'production') {
      const signature = req.headers['x-signature'];
      const webhookSecret = process.env.VITE_MERCADOPAGO_WEBHOOK_SECRET;
      
      if (!webhookService.validateWebhookSignature(
        JSON.stringify(req.body), 
        signature, 
        webhookSecret
      )) {
        console.error('❌ Signature inválida');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    // Procesar el webhook
    const result = await webhookService.processWebhook(req.body);
    
    console.log('✅ Webhook procesado:', result);
    
    return res.status(200).json({
      success: true,
      result
    });

  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Configuración para Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};