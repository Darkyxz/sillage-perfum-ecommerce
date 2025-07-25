// Script para configurar MercadoPago automáticamente
// Ejecutar desde la consola del navegador en el panel de admin

async function setupMercadoPago() {
  console.log('🚀 CONFIGURANDO MERCADOPAGO PARA SILLAGE PERFUM');
  console.log('=' .repeat(60));
  
  // Paso 1: Verificar configuración
  console.log('📋 PASO 1: Verificando configuración...');
  
  const config = {
    accessToken: import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN,
    publicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY,
    appId: import.meta.env.VITE_MERCADOPAGO_APP_ID,
    userId: import.meta.env.VITE_MERCADOPAGO_USER_ID,
    environment: import.meta.env.VITE_MERCADOPAGO_ENVIRONMENT,
    baseUrl: import.meta.env.VITE_BASE_URL
  };
  
  // Verificar que todas las variables estén configuradas
  const missingVars = Object.entries(config)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables faltantes:', missingVars);
    console.log('💡 Asegúrate de tener configuradas todas las variables en .env.local');
    return false;
  }
  
  console.log('✅ Todas las variables configuradas');
  
  // Paso 2: Test de conexión
  console.log('\n🔗 PASO 2: Probando conexión con MercadoPago...');
  
  try {
    const response = await fetch('https://api.mercadopago.com/users/me', {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      console.log('✅ Conexión exitosa');
      console.log(`   Usuario: ${userData.first_name} ${userData.last_name}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   País: ${userData.site_id}`);
      
      // Verificar que sea el usuario correcto
      if (userData.id.toString() === config.userId) {
        console.log('✅ User ID coincide');
      } else {
        console.warn('⚠️  User ID no coincide:', userData.id, 'vs', config.userId);
      }
    } else {
      console.error('❌ Error de conexión:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error de red:', error.message);
    return false;
  }
  
  // Paso 3: Crear preferencia de prueba
  console.log('\n🧪 PASO 3: Creando preferencia de prueba...');
  
  try {
    const testItems = [{
      title: 'Perfume Sillage - Test',
      description: 'Producto de prueba para verificar integración',
      quantity: 1,
      unit_price: 50000,
      currency_id: 'CLP'
    }];
    
    const testPayer = {
      name: 'Test',
      surname: 'Sillage',
      email: 'test@sillage-perfum.com'
    };
    
    const testBackUrls = {
      success: `${config.baseUrl}/pago-exitoso`,
      failure: `${config.baseUrl}/pago-fallido`,
      pending: `${config.baseUrl}/pago-pendiente`
    };
    
    const testReference = 'TEST-SETUP-' + Date.now();
    
    // Usar el servicio existente
    const { createMercadoPagoPreference } = await import('./src/lib/mercadopagoService.js');
    const preference = await createMercadoPagoPreference(
      testItems,
      testPayer,
      testBackUrls,
      testReference
    );
    
    console.log('✅ Preferencia de prueba creada');
    console.log(`   ID: ${preference.id}`);
    console.log(`   URL Sandbox: ${preference.sandbox_init_point}`);
    
    // Paso 4: Verificar webhook URL
    console.log('\n🔔 PASO 4: Verificando configuración de webhooks...');
    
    const webhookUrl = `${config.baseUrl}/api/webhooks/mercadopago`;
    console.log(`   URL configurada: ${webhookUrl}`);
    
    if (config.baseUrl.includes('localhost')) {
      console.log('⚠️  NOTA: Webhooks no funcionarán en localhost');
      console.log('   Opciones:');
      console.log('   1. Usar ngrok: ngrok http 5173');
      console.log('   2. Desplegar en Render/Vercel para testing');
    } else {
      console.log('✅ URL pública configurada para webhooks');
    }
    
    // Paso 5: Instrucciones finales
    console.log('\n📋 PASO 5: Instrucciones finales...');
    console.log('');
    console.log('🎯 PRÓXIMOS PASOS:');
    console.log('');
    console.log('1. 📊 EJECUTAR SQL DE PAGOS:');
    console.log('   - Ir a Supabase SQL Editor');
    console.log('   - Ejecutar: create-payments-table.sql');
    console.log('');
    console.log('2. 🚀 DESPLEGAR EDGE FUNCTION:');
    console.log('   - Terminal: supabase functions deploy mercadopago-webhook');
    console.log('');
    console.log('3. 🔗 CONFIGURAR WEBHOOK EN MERCADOPAGO:');
    console.log('   - Ir a: https://www.mercadopago.com/developers/panel/webhooks');
    console.log(`   - Agregar URL: ${webhookUrl}`);
    console.log('   - Eventos: payment, merchant_order');
    console.log('');
    console.log('4. 🧪 TESTING:');
    console.log('   - Crear pedido en el carrito');
    console.log('   - Usar tarjeta de prueba: 4009175332806176');
    console.log('   - CVV: 123, Fecha: 11/25');
    console.log('');
    console.log('💳 TARJETAS DE PRUEBA:');
    console.log('   ✅ APROBADA: 4009175332806176');
    console.log('   ❌ RECHAZADA: 4013540682746260');
    console.log('   ⏳ PENDIENTE: 4509953566233704');
    console.log('');
    console.log('🎉 ¡CONFIGURACIÓN COMPLETADA!');
    
    return {
      success: true,
      config,
      testPreference: preference,
      webhookUrl
    };
    
  } catch (error) {
    console.error('❌ Error creando preferencia:', error.message);
    return false;
  }
}

// Función para test rápido de pago
async function quickPaymentTest() {
  console.log('⚡ QUICK PAYMENT TEST');
  console.log('=' .repeat(30));
  
  try {
    const testItems = [{
      title: 'Test Perfume Sillage',
      quantity: 1,
      unit_price: 25000,
      currency_id: 'CLP'
    }];
    
    const testPayer = {
      name: 'Test',
      surname: 'User',
      email: 'test@example.com'
    };
    
    const testBackUrls = {
      success: `${import.meta.env.VITE_BASE_URL}/pago-exitoso`,
      failure: `${import.meta.env.VITE_BASE_URL}/pago-fallido`,
      pending: `${import.meta.env.VITE_BASE_URL}/pago-pendiente`
    };
    
    const { createMercadoPagoPreference } = await import('./src/lib/mercadopagoService.js');
    const preference = await createMercadoPagoPreference(
      testItems,
      testPayer,
      testBackUrls,
      'QUICK-TEST-' + Date.now()
    );
    
    console.log('✅ Preferencia creada');
    console.log('🔗 URL de pago:', preference.sandbox_init_point);
    console.log('');
    console.log('📋 Para probar:');
    console.log('1. Abrir URL en nueva pestaña');
    console.log('2. Usar tarjeta: 4009175332806176');
    console.log('3. CVV: 123, Fecha: 11/25');
    
    // Abrir automáticamente
    if (preference.sandbox_init_point) {
      window.open(preference.sandbox_init_point, '_blank');
    }
    
    return preference;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar setup automáticamente
console.log('🎯 Ejecutando setup de MercadoPago...');
setupMercadoPago();

// Exportar funciones para uso manual
window.setupMercadoPago = setupMercadoPago;
window.quickPaymentTest = quickPaymentTest;