// Script para verificar la configuración de MercadoPago
// Ejecutar desde la consola del navegador

async function testMercadoPagoConfig() {
  console.log('🧪 TESTING MERCADOPAGO CONFIGURATION');
  console.log('=' .repeat(50));
  
  // Verificar variables de entorno
  const config = {
    accessToken: import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN,
    publicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY,
    appId: import.meta.env.VITE_MERCADOPAGO_APP_ID,
    userId: import.meta.env.VITE_MERCADOPAGO_USER_ID,
    environment: import.meta.env.VITE_MERCADOPAGO_ENVIRONMENT,
    integrationType: import.meta.env.VITE_MERCADOPAGO_INTEGRATION_TYPE,
    baseUrl: import.meta.env.VITE_BASE_URL
  };
  
  console.log('📋 CONFIGURACIÓN ACTUAL:');
  Object.entries(config).forEach(([key, value]) => {
    if (key === 'accessToken') {
      console.log(`  ${key}: ${value ? value.substring(0, 20) + '...' : '❌ NO CONFIGURADO'}`);
    } else {
      console.log(`  ${key}: ${value || '❌ NO CONFIGURADO'}`);
    }
  });
  
  // Verificar que las credenciales sean de prueba
  const isTestCredentials = config.accessToken?.startsWith('TEST-') && config.publicKey?.startsWith('TEST-');
  console.log(`\n🔒 CREDENCIALES DE PRUEBA: ${isTestCredentials ? '✅ SÍ' : '❌ NO'}`);
  
  if (!isTestCredentials) {
    console.warn('⚠️  ADVERTENCIA: No estás usando credenciales de prueba');
  }
  
  // Test básico de API
  if (config.accessToken) {
    try {
      console.log('\n🔄 Probando conexión con MercadoPago API...');
      
      const response = await fetch('https://api.mercadopago.com/users/me', {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ CONEXIÓN EXITOSA');
        console.log(`   Usuario: ${userData.first_name} ${userData.last_name}`);
        console.log(`   Email: ${userData.email}`);
        console.log(`   País: ${userData.site_id}`);
        console.log(`   ID: ${userData.id}`);
      } else {
        console.error('❌ ERROR DE CONEXIÓN:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ ERROR DE RED:', error.message);
    }
  }
  
  // Verificar webhook URL
  console.log('\n🔗 WEBHOOK CONFIGURATION:');
  const webhookUrl = `${config.baseUrl}/api/webhooks/mercadopago`;
  console.log(`   URL: ${webhookUrl}`);
  
  if (config.baseUrl?.includes('localhost')) {
    console.log('⚠️  NOTA: Webhooks no funcionarán en localhost');
    console.log('   Usa ngrok o despliega para probar webhooks');
  }
  
  // Test de creación de preferencia
  if (config.accessToken) {
    try {
      console.log('\n🧪 Probando creación de preferencia...');
      
      const testPreference = {
        items: [{
          title: 'Test Product - Perfume Sillage',
          description: 'Producto de prueba',
          quantity: 1,
          unit_price: 50000,
          currency_id: 'CLP'
        }],
        payer: {
          name: 'Test',
          surname: 'User',
          email: 'test@sillage-perfum.com'
        },
        back_urls: {
          success: `${config.baseUrl}/pago-exitoso`,
          failure: `${config.baseUrl}/pago-fallido`,
          pending: `${config.baseUrl}/pago-pendiente`
        },
        external_reference: 'TEST-ORDER-' + Date.now(),
        notification_url: webhookUrl,
        statement_descriptor: 'SILLAGE-PERFUM',
        expires: true,
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      };
      
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testPreference)
      });
      
      if (response.ok) {
        const preference = await response.json();
        console.log('✅ PREFERENCIA CREADA EXITOSAMENTE');
        console.log(`   ID: ${preference.id}`);
        console.log(`   Sandbox URL: ${preference.sandbox_init_point}`);
        console.log(`   Production URL: ${preference.init_point}`);
      } else {
        const error = await response.text();
        console.error('❌ ERROR CREANDO PREFERENCIA:', response.status, error);
      }
    } catch (error) {
      console.error('❌ ERROR EN TEST DE PREFERENCIA:', error.message);
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('🎯 RESUMEN:');
  console.log(`   App ID: ${config.appId}`);
  console.log(`   User ID: ${config.userId}`);
  console.log(`   Environment: ${config.environment}`);
  console.log(`   Integration: ${config.integrationType}`);
  console.log(`   Credentials: ${isTestCredentials ? 'TEST ✅' : 'PRODUCTION ⚠️'}`);
  
  return config;
}

// Ejecutar automáticamente
testMercadoPagoConfig();