const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configuración del transporter de nodemailer
const createTransporter = () => {
    const port = parseInt(process.env.SMTP_PORT) || 587;
    const secure = port === 465; // true para 465 (SSL), false para 587 (TLS)

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: port,
        secure: secure,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// POST /api/contact - Enviar mensaje de contacto
router.post('/', async (req, res) => {
    try {
        console.log('📧 Recibida solicitud de contacto:', req.body);

        const { name, lastName, email, message } = req.body;

        // Validaciones básicas
        if (!name || !lastName || !email || !message) {
            console.log('❌ Campos faltantes en la solicitud');
            return res.status(400).json({
                success: false,
                error: 'Todos los campos son requeridos'
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Formato de email inválido:', email);
            return res.status(400).json({
                success: false,
                error: 'Formato de email inválido'
            });
        }

        console.log('📧 Configurando transporter de email...');
        console.log('SMTP_HOST:', process.env.SMTP_HOST);
        console.log('SMTP_USER:', process.env.SMTP_USER);

        // Verificar si las variables de entorno están configuradas
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('⚠️ Variables de entorno de email no configuradas');
            return res.status(500).json({
                success: false,
                error: 'Configuración de email no disponible. Por favor contacta directamente a ventas@sillageperfum.cl'
            });
        }

        const transporter = createTransporter();

        // Configurar el email
        const mailOptions = {
            from: `"${name} ${lastName}" <${process.env.SMTP_USER}>`,
            to: 'ventas@sillageperfum.cl',
            subject: `Nuevo mensaje de contacto - ${name} ${lastName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #D4AF37, #B8860B); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Sillage Perfum</h1>
            <p style="color: white; margin: 5px 0;">Nuevo mensaje de contacto</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
              Información del Cliente
            </h2>
            
            <table style="width: 100%; margin: 20px 0;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Nombre:</td>
                <td style="padding: 8px 0; color: #333;">${name} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0; color: #333;">
                  <a href="mailto:${email}" style="color: #D4AF37;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Fecha:</td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString('es-CL')}</td>
              </tr>
            </table>
            
            <h3 style="color: #333; margin-top: 30px;">Mensaje:</h3>
            <div style="background: white; padding: 20px; border-left: 4px solid #D4AF37; margin: 10px 0;">
              <p style="color: #333; line-height: 1.6; margin: 0;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #e8f4f8; border-radius: 5px;">
              <p style="margin: 0; color: #555; font-size: 14px;">
                <strong>Nota:</strong> Puedes responder directamente a este email para contactar al cliente.
              </p>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #ccc; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} Sillage Perfum - Sistema de Contacto Automático
            </p>
          </div>
        </div>
      `,
            replyTo: email // Para que puedan responder directamente al cliente
        };

        // Enviar el email
        await transporter.sendMail(mailOptions);

        console.log(`✅ Email de contacto enviado desde: ${email}`);

        res.json({
            success: true,
            message: 'Mensaje enviado correctamente'
        });

    } catch (error) {
        console.error('❌ Error enviando email de contacto:', error);

        // Si hay error de email, al menos guardar el mensaje en logs
        console.log('📝 MENSAJE DE CONTACTO RECIBIDO:');
        console.log('Nombre:', req.body.name, req.body.lastName);
        console.log('Email:', req.body.email);
        console.log('Mensaje:', req.body.message);
        console.log('Fecha:', new Date().toISOString());

        res.status(500).json({
            success: false,
            error: 'Error interno del servidor al enviar el mensaje. Tu mensaje ha sido registrado y nos pondremos en contacto contigo.'
        });
    }
});

module.exports = router;