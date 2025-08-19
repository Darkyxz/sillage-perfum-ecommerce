const { query, testConnection } = require('../config/database');
const nodemailer = require('nodemailer');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuración de Nodemailer para testing
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function testEmailConfiguration() {
  console.log('🔧 PROBANDO CONFIGURACIÓN DE EMAIL');
  console.log('='.repeat(50));
  
  try {
    // Verificar variables de entorno
    console.log('📋 Variables de entorno:');
    console.log(`   EMAIL_SERVICE: ${process.env.EMAIL_SERVICE || 'Gmail (default)'}`);
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Configurado' : '❌ NO configurado'}`);
    console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Configurado' : '❌ NO configurado'}`);
    console.log(`   EMAIL_FROM_NAME: ${process.env.EMAIL_FROM_NAME || 'Sillage Perfum (default)'}`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('\n❌ Configuración incompleta. No se puede probar envío.');
      return false;
    }
    
    // Probar conexión SMTP
    console.log('\n🔌 Probando conexión SMTP...');
    await transporter.verify();
    console.log('✅ Conexión SMTP exitosa');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error en configuración de email:', error.message);
    return false;
  }
}

async function listSubscribers() {
  console.log('👥 LISTANDO SUSCRIPTORES');
  console.log('='.repeat(50));
  
  try {
    await testConnection();
    
    const allSubscribers = await query('SELECT * FROM subscribers ORDER BY created_at DESC');
    const activeSubscribers = allSubscribers.filter(s => s.subscribed);
    const inactiveSubscribers = allSubscribers.filter(s => !s.subscribed);
    
    console.log(`📊 Total suscriptores: ${allSubscribers.length}`);
    console.log(`   ✅ Activos: ${activeSubscribers.length}`);
    console.log(`   ❌ Inactivos: ${inactiveSubscribers.length}`);
    
    if (activeSubscribers.length > 0) {
      console.log('\n📋 Suscriptores Activos:');
      activeSubscribers.forEach((sub, index) => {
        console.log(`   ${index + 1}. ${sub.email} (${sub.created_at})`);
      });
    }
    
    if (inactiveSubscribers.length > 0) {
      console.log('\n📋 Suscriptores Inactivos:');
      inactiveSubscribers.forEach((sub, index) => {
        console.log(`   ${index + 1}. ${sub.email} (cancelado: ${sub.updated_at})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error listando suscriptores:', error);
  }
}

async function sendTestEmail(testEmail) {
  console.log('🧪 ENVIANDO EMAIL DE PRUEBA');
  console.log('='.repeat(50));
  
  if (!testEmail) {
    console.log('❌ Debes proporcionar un email para la prueba');
    console.log('   Uso: node test-newsletter.js test tu-email@ejemplo.com');
    return;
  }
  
  const canSend = await testEmailConfiguration();
  if (!canSend) {
    return;
  }
  
  const testTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #D4AF37; font-size: 32px; margin-bottom: 10px;">Sillage Perfum</h1>
        <p style="color: #666; font-size: 16px;">Email de Prueba</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #f5f3f0 0%, #faf9f7 100%); padding: 30px; border-radius: 10px;">
        <h2 style="color: #333; margin-bottom: 20px;">🧪 Prueba de Configuración de Email</h2>
        
        <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
          Este es un email de prueba para verificar que la configuración de envío está funcionando correctamente.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #D4AF37; margin-bottom: 15px;">✅ Configuración Verificada</h3>
          <ul style="color: #555; line-height: 1.8;">
            <li>📧 Servidor SMTP conectado</li>
            <li>🔐 Autenticación exitosa</li>
            <li>📤 Email enviado correctamente</li>
          </ul>
        </div>
        
        <p style="color: #555; text-align: center; margin-top: 30px;">
          <strong>¡El sistema de newsletter está listo para usar!</strong>
        </p>
      </div>
    </div>
  `;
  
  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Sillage Perfum'}" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: '🧪 Prueba de Newsletter - Sillage Perfum',
      html: testTemplate
    });
    
    console.log(`✅ Email de prueba enviado exitosamente a: ${testEmail}`);
    console.log('📋 Verifica tu bandeja de entrada y spam');
    
  } catch (error) {
    console.error('❌ Error enviando email de prueba:', error.message);
  }
}

async function addTestSubscriber(email) {
  console.log('➕ AGREGANDO SUSCRIPTOR DE PRUEBA');
  console.log('='.repeat(50));
  
  if (!email) {
    console.log('❌ Debes proporcionar un email');
    console.log('   Uso: node test-newsletter.js add-subscriber tu-email@ejemplo.com');
    return;
  }
  
  try {
    await testConnection();
    
    // Generar token único
    const token = require('crypto').randomBytes(32).toString('hex');
    
    // Insertar suscriptor
    await query(
      'INSERT INTO subscribers (email, token, subscribed, created_at) VALUES (?, ?, ?, NOW())',
      [email, token, true]
    );
    
    console.log(`✅ Suscriptor agregado: ${email}`);
    console.log(`📄 Token: ${token}`);
    
  } catch (error) {
    if (error.message.includes('Duplicate entry')) {
      console.log(`⚠️  El email ${email} ya está suscrito`);
    } else {
      console.error('❌ Error agregando suscriptor:', error.message);
    }
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('🚀 TEST NEWSLETTER SYSTEM');
  console.log('='.repeat(50));
  
  switch (command) {
    case 'config':
      await testEmailConfiguration();
      break;
      
    case 'list':
      await listSubscribers();
      break;
      
    case 'test':
      const testEmail = args[1];
      await sendTestEmail(testEmail);
      break;
      
    case 'add-subscriber':
      const newEmail = args[1];
      await addTestSubscriber(newEmail);
      break;
      
    case 'full-test':
      console.log('🔄 Ejecutando prueba completa...\n');
      const configOk = await testEmailConfiguration();
      if (configOk) {
        console.log('\n');
        await listSubscribers();
      }
      break;
      
    default:
      console.log('📖 COMANDOS DISPONIBLES:');
      console.log('   config           - Probar configuración de email');
      console.log('   list             - Listar suscriptores');
      console.log('   test <email>     - Enviar email de prueba');
      console.log('   add-subscriber <email> - Agregar suscriptor de prueba');
      console.log('   full-test        - Ejecutar todas las pruebas');
      console.log('\n📝 Ejemplos:');
      console.log('   node test-newsletter.js config');
      console.log('   node test-newsletter.js list');
      console.log('   node test-newsletter.js test tu-email@gmail.com');
      console.log('   node test-newsletter.js add-subscriber test@ejemplo.com');
      console.log('   node test-newsletter.js full-test');
      break;
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
}
