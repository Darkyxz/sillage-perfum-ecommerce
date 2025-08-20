const { query, testConnection } = require('../config/database');
const nodemailer = require('nodemailer');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendNewsletter() {
  console.log('📧 INICIANDO ENVÍO DE NEWSLETTER');
  console.log('='.repeat(50));

  try {
    // Verificar conexión a BD
    await testConnection();

    // Obtener suscriptores activos
    const subscribers = await query('SELECT * FROM subscribers WHERE subscribed = true');

    if (subscribers.length === 0) {
      console.log('⚠️  No hay suscriptores activos');
      return;
    }

    console.log(`📋 Se encontraron ${subscribers.length} suscriptores activos`);

    // Verificar configuración de email
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ Variables de email no configuradas');
      console.log('   Configurar: EMAIL_USER y EMAIL_PASS');
      return;
    }

    // Template del email
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #D4AF37; font-size: 32px; margin-bottom: 10px;">Sillage Perfum</h1>
          <p style="color: #666; font-size: 16px;">Newsletter Exclusivo</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f5f3f0 0%, #faf9f7 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 20px;">¡Descubre Nuestras Nuevas Fragancias!</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Estimado suscriptor,
          </p>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Te invitamos a descubrir nuestra nueva colección de fragancias exclusivas. 
            Cada perfume está cuidadosamente elaborado para capturar la esencia de momentos únicos.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #D4AF37; margin-bottom: 15px;">✨ Ofertas Especiales</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>🎁 REtira en nuestro local.</li>
              <li>💫 20% de descuento en tu segunda fragancia</li>
              <li>🌟 Muestras gratuitas con cada pedido</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://sillageperfum.cl/productos" 
               style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%); 
                      color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; 
                      font-weight: bold; font-size: 16px;">
              Ver Catálogo Completo
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 14px; margin-bottom: 15px;">
            Síguenos en nuestras redes sociales:
          </p>
          <div style="margin-bottom: 20px;">
            <a href="https://www.instagram.com/sillage668" style="margin: 0 10px; color: #D4AF37; text-decoration: none;">📷 Instagram</a>
            <a href="https://web.facebook.com/profile.php?id=61578843794049" style="margin: 0 10px; color: #D4AF37; text-decoration: none;">📘 Facebook</a>
            <a href="https://www.tiktok.com/@sillage.perfum.sp" style="margin: 0 10px; color: #D4AF37; text-decoration: none;">🎵 TikTok</a>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-bottom: 10px;">
            © 2025 Sillage Perfum. Todos los derechos reservados.
          </p>
          <p style="color: #999; font-size: 12px;">
            <a href="https://sillage-backend-iae11t8w2-sillageperfums-projects.vercel.app/api/subscribers/unsubscribe/{{TOKEN}}" 
               style="color: #999; text-decoration: underline;">
              Cancelar suscripción
            </a>
          </p>
        </div>
      </div>
    `;

    let sentCount = 0;
    let errorCount = 0;

    console.log('📤 Iniciando envío de emails...');
    console.log('-'.repeat(50));

    // Enviar emails uno por uno
    for (const subscriber of subscribers) {
      try {
        const personalizedTemplate = emailTemplate.replace('{{TOKEN}}', subscriber.token);

        await transporter.sendMail({
          from: `"${process.env.EMAIL_FROM_NAME || 'Sillage Perfum'}" <${process.env.EMAIL_USER}>`,
          to: subscriber.email,
          subject: '✨ Nueva Colección Sillage Perfum - Ofertas Exclusivas',
          html: personalizedTemplate
        });

        sentCount++;
        console.log(`✅ Email enviado a: ${subscriber.email}`);

        // Pequeña pausa entre envíos para no saturar el servidor
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        errorCount++;
        console.error(`❌ Error enviando a ${subscriber.email}:`, error.message);
      }
    }

    console.log('='.repeat(50));
    console.log('📊 RESUMEN DE ENVÍO:');
    console.log(`   ✅ Emails enviados exitosamente: ${sentCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📧 Total procesados: ${subscribers.length}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('💥 Error fatal:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  sendNewsletter()
    .then(() => {
      console.log('✨ Newsletter enviado exitosamente');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error enviando newsletter:', error);
      process.exit(1);
    });
}

module.exports = { sendNewsletter };
