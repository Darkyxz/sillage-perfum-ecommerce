const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Suscribir nuevo usuario
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    // Validación básica de email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Por favor, proporciona un email válido' });
    }
    // Verificar si el email ya está registrado
    const existingSubscriber = await Subscriber.findByEmail(email);
    if (existingSubscriber) {
      return res.status(400).json({
        error: 'Este email ya está suscrito',
        alreadySubscribed: true
      });
    }
    // Generar token único
    const token = crypto.randomBytes(20).toString('hex');
    // Guardar en base de datos
    await Subscriber.create(email, token);
    // Enviar email de confirmación solo si está configurado
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'tu-email@gmail.com') {
      const backendUrl = process.env.BACKEND_URL || 'https://sillage-backend-iae11t8w2-sillageperfums-projects.vercel.app';
      const unsubscribeLink = `${backendUrl}/api/subscribers/unsubscribe/${token}`;
      try {
        await transporter.sendMail({
          from: `"Sillage Perfums" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Confirmación de suscripción',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4a4a4a;">¡Gracias por suscribirte a Sillage Perfums!</h2>
              <p style="color: #333;">Ahora recibirás nuestras últimas noticias y promociones.</p>
              <p style="color: #333;">Si no solicitaste esta suscripción, puedes cancelarla haciendo clic en el siguiente enlace:</p>
              <a href="${unsubscribeLink}" 
                 style="display: inline-block; margin: 15px 0; padding: 10px 15px; background-color: #e74c3c; color: white; text-decoration: none; border-radius: 4px;">
                 Cancelar suscripción
              </a>
              <p style="font-size: 12px; color: #777;">
                O copia esta URL en tu navegador:<br>
                ${unsubscribeLink}
              </p>
            </div>
          `
        });
        console.log('✅ Email de confirmación enviado a:', email);
      } catch (emailError) {
        console.error('⚠️ Error enviando email (continuando sin enviar):', emailError.message);
      }
    } else {
      console.log('⚠️ Email no configurado - suscripción guardada sin email de confirmación');
    }

    res.status(200).json({
      success: true,
      message: 'Suscripción exitosa. Por favor revisa tu email.'
    });

  } catch (error) {
    console.error('Error en suscripción:', error);
    res.status(500).json({
      error: 'Error al procesar la suscripción',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Cancelar suscripción
router.get('/unsubscribe/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const frontendUrl = process.env.FRONTEND_URL || 'https://sillageperfum.cl';

    // Buscar suscriptor por token
    const subscriber = await Subscriber.findByToken(token);
    if (!subscriber) {
      return res.redirect(`${frontendUrl}/unsubscribe?status=not_found`);
    }

    // Eliminar suscriptor de la base de datos
    const deleted = await Subscriber.unsubscribe(token);
    
    if (deleted) {
      console.log(`✅ Suscriptor ${subscriber.email} eliminado exitosamente`);
      return res.redirect(`${frontendUrl}/unsubscribe?status=success&email=${encodeURIComponent(subscriber.email)}`);
    } else {
      return res.redirect(`${frontendUrl}/unsubscribe?status=error`);
    }

  } catch (error) {
    console.error('Error al cancelar suscripción:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'https://sillageperfum.cl';
    return res.redirect(`${frontendUrl}/unsubscribe?status=error`);
  }
});

// Obtener todos los suscriptores activos (para uso interno)
router.get('/active', async (req, res) => {
  try {
    const activeSubscribers = await Subscriber.getAllActive();
    res.status(200).json({
      count: activeSubscribers.length,
      subscribers: activeSubscribers
    });
  } catch (error) {
    console.error('Error obteniendo suscriptores:', error);
    res.status(500).json({ error: 'Error al obtener suscriptores' });
  }
});

module.exports = router;