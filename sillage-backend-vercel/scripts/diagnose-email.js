const nodemailer = require('nodemailer');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function diagnoseEmailSetup() {
  console.log('🔬 DIAGNÓSTICO COMPLETO DEL SISTEMA DE EMAIL');
  console.log('='.repeat(60));
  
  // Verificar variables de entorno
  console.log('📋 VARIABLES DE ENTORNO:');
  console.log('-'.repeat(30));
  console.log(`EMAIL_SERVICE: ${process.env.EMAIL_SERVICE || '❌ NO configurado'}`);
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ ' + process.env.EMAIL_USER : '❌ NO configurado'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Configurado (oculto)' : '❌ NO configurado'}`);
  console.log(`EMAIL_FROM_NAME: ${process.env.EMAIL_FROM_NAME || 'Sillage Perfum (default)'}`);
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || '❌ NO configurado'}`);
  
  // Verificar condición del código
  console.log('\n🔍 VERIFICACIÓN DE CONDICIONES:');
  console.log('-'.repeat(30));
  const hasEmailUser = !!process.env.EMAIL_USER;
  const hasEmailPass = !!process.env.EMAIL_PASS;
  const isNotPlaceholder = process.env.EMAIL_USER !== 'tu-email@gmail.com';
  const shouldSendEmail = hasEmailUser && hasEmailPass && isNotPlaceholder;
  
  console.log(`EMAIL_USER existe: ${hasEmailUser ? '✅' : '❌'}`);
  console.log(`EMAIL_PASS existe: ${hasEmailPass ? '✅' : '❌'}`);
  console.log(`No es placeholder: ${isNotPlaceholder ? '✅' : '❌'}`);
  console.log(`\n🎯 ¿Debería enviar email?: ${shouldSendEmail ? '✅ SÍ' : '❌ NO'}`);
  
  if (!shouldSendEmail) {
    console.log('\n💡 SOLUCIÓN: Configurar las variables EMAIL_USER y EMAIL_PASS en Vercel');
    return;
  }
  
  // Probar configuración SMTP
  console.log('\n📧 PROBANDO CONFIGURACIÓN SMTP:');
  console.log('-'.repeat(30));
  
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    console.log('🔌 Verificando conexión SMTP...');
    await transporter.verify();
    console.log('✅ Conexión SMTP EXITOSA');
    
    return transporter;
    
  } catch (error) {
    console.error('❌ ERROR EN CONFIGURACIÓN SMTP:');
    console.error(`   Mensaje: ${error.message}`);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 POSIBLES SOLUCIONES:');
      console.log('   1. Verificar que EMAIL_USER sea correcto');
      console.log('   2. Usar App Password de Gmail (no contraseña normal)');
      console.log('   3. Activar verificación en 2 pasos en Gmail');
      console.log('   4. Generar nueva App Password específica');
    }
    
    return null;
  }
}

async function sendTestConfirmationEmail(testEmail) {
  console.log('\n🧪 ENVIANDO EMAIL DE CONFIRMACIÓN DE PRUEBA');
  console.log('='.repeat(60));
  
  if (!testEmail) {
    console.log('❌ Proporciona un email: node diagnose-email.js test tu-email@gmail.com');
    return;
  }
  
  const transporter = await diagnoseEmailSetup();
  if (!transporter) {
    console.log('❌ No se puede enviar - configuración SMTP fallida');
    return;
  }
  
  try {
    // Simular el mismo email que se envía en subscribers.js
    const token = 'test-token-12345';
    const unsubscribeLink = `${process.env.FRONTEND_URL || 'https://sillageperfum.cl'}/unsubscribe/${token}`;
    
    await transporter.sendMail({
      from: `"Sillage Perfums" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: '🧪 PRUEBA - Confirmación de suscripción',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #D4AF37; padding: 20px;">
          <h1 style="color: #D4AF37; text-align: center;">🧪 EMAIL DE PRUEBA</h1>
          <h2 style="color: #4a4a4a;">¡Gracias por suscribirte a Sillage Perfums!</h2>
          <p style="color: #333;">Este es un email de prueba para verificar que el sistema funciona correctamente.</p>
          <p style="color: #333;">Ahora recibirás nuestras últimas noticias y promociones.</p>
          <p style="color: #333;">Si no solicitaste esta suscripción, puedes cancelarla haciendo clic en el siguiente enlace:</p>
          <a href="${unsubscribeLink}" 
             style="display: inline-block; margin: 15px 0; padding: 10px 15px; background-color: #e74c3c; color: white; text-decoration: none; border-radius: 4px;">
             Cancelar suscripción (PRUEBA)
          </a>
          <p style="font-size: 12px; color: #777;">
            O copia esta URL en tu navegador:<br>
            ${unsubscribeLink}
          </p>
          <div style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #D4AF37; margin-top: 0;">📊 Información de Prueba:</h3>
            <p style="margin: 5px 0; font-size: 14px;">Timestamp: ${new Date().toISOString()}</p>
            <p style="margin: 5px 0; font-size: 14px;">Email remitente: ${process.env.EMAIL_USER}</p>
            <p style="margin: 5px 0; font-size: 14px;">Servicio: ${process.env.EMAIL_SERVICE || 'Gmail'}</p>
          </div>
        </div>
      `
    });
    
    console.log('✅ EMAIL DE PRUEBA ENVIADO EXITOSAMENTE');
    console.log(`📬 Enviado a: ${testEmail}`);
    console.log('📋 VERIFICA:');
    console.log('   1. Bandeja de entrada');
    console.log('   2. Carpeta de spam/correo no deseado');
    console.log('   3. Puede tardar 1-2 minutos en llegar');
    
  } catch (error) {
    console.error('❌ ERROR ENVIANDO EMAIL DE PRUEBA:');
    console.error(`   ${error.message}`);
  }
}

async function verifyGmailSetup() {
  console.log('\n📧 VERIFICACIÓN ESPECÍFICA DE GMAIL');
  console.log('='.repeat(60));
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_USER.includes('gmail.com')) {
    console.log('⚠️  No parece ser una cuenta de Gmail');
    return;
  }
  
  console.log('📋 CHECKLIST PARA GMAIL:');
  console.log('-'.repeat(30));
  console.log('1. ✅ Verificación en 2 pasos ACTIVADA');
  console.log('2. ✅ App Password generada (16 caracteres)');
  console.log('3. ✅ Usar App Password en EMAIL_PASS (NO contraseña normal)');
  console.log('4. ✅ EMAIL_SERVICE=Gmail');
  
  console.log('\n🔗 LINKS ÚTILES:');
  console.log('   Configurar verificación en 2 pasos:');
  console.log('   https://myaccount.google.com/security');
  console.log('   \n   Generar App Password:');
  console.log('   https://myaccount.google.com/apppasswords');
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'test':
      const testEmail = args[1];
      await sendTestConfirmationEmail(testEmail);
      break;
      
    case 'gmail':
      await verifyGmailSetup();
      break;
      
    case 'full':
      await diagnoseEmailSetup();
      await verifyGmailSetup();
      break;
      
    default:
      await diagnoseEmailSetup();
      console.log('\n📖 COMANDOS ADICIONALES:');
      console.log('   node scripts/diagnose-email.js test tu-email@gmail.com  - Enviar email de prueba');
      console.log('   node scripts/diagnose-email.js gmail                    - Ayuda específica Gmail');
      console.log('   node scripts/diagnose-email.js full                     - Diagnóstico completo');
      break;
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
}

module.exports = { diagnoseEmailSetup, sendTestConfirmationEmail };
