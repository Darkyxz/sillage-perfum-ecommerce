// Script de diagnóstico para Brave Browser
// Copia y pega este código en la consola del navegador (F12)

console.log('🔍 DIAGNÓSTICO BRAVE BROWSER');
console.log('============================');

// 1. Información básica del navegador
console.log('\n1. INFORMACIÓN DEL NAVEGADOR:');
console.log('User Agent:', navigator.userAgent);
console.log('Es Brave:', !!(navigator.brave && navigator.brave.isBrave));
console.log('Cookies habilitadas:', navigator.cookieEnabled);

// 2. Test de localStorage
console.log('\n2. TEST DE LOCALSTORAGE:');
try {
  const testKey = 'brave_test_' + Date.now();
  localStorage.setItem(testKey, 'test_value');
  const retrieved = localStorage.getItem(testKey);
  localStorage.removeItem(testKey);
  console.log('✅ localStorage funciona:', retrieved === 'test_value');
} catch (e) {
  console.log('❌ localStorage falló:', e.message);
}

// 3. Test de sessionStorage
console.log('\n3. TEST DE SESSIONSTORAGE:');
try {
  const testKey = 'brave_session_test_' + Date.now();
  sessionStorage.setItem(testKey, 'test_value');
  const retrieved = sessionStorage.getItem(testKey);
  sessionStorage.removeItem(testKey);
  console.log('✅ sessionStorage funciona:', retrieved === 'test_value');
} catch (e) {
  console.log('❌ sessionStorage falló:', e.message);
}

// 4. Test de cookies
console.log('\n4. TEST DE COOKIES:');
try {
  document.cookie = 'brave_test=1; SameSite=Lax; path=/';
  const cookieWorks = document.cookie.includes('brave_test');
  document.cookie = 'brave_test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  console.log('✅ Cookies funcionan:', cookieWorks);
} catch (e) {
  console.log('❌ Cookies fallaron:', e.message);
}

// 5. Test de IndexedDB
console.log('\n5. TEST DE INDEXEDDB:');
try {
  const request = indexedDB.open('brave_test_db', 1);
  request.onsuccess = () => {
    console.log('✅ IndexedDB funciona');
    request.result.close();
    indexedDB.deleteDatabase('brave_test_db');
  };
  request.onerror = () => {
    console.log('❌ IndexedDB falló');
  };
} catch (e) {
  console.log('❌ IndexedDB no disponible:', e.message);
}

// 6. Configuración de Brave específica
console.log('\n6. CONFIGURACIÓN BRAVE:');
if (navigator.brave && navigator.brave.isBrave) {
  console.log('🛡️ Brave detectado oficialmente');
  console.log('💡 Recomendaciones:');
  console.log('   1. Ve a brave://settings/privacy');
  console.log('   2. En "Cookies y otros datos del sitio" selecciona "Permitir todas las cookies"');
  console.log('   3. O al menos "Bloquear cookies de terceros en modo privado"');
  console.log('   4. Asegúrate de que "Bloquear almacenamiento local" esté deshabilitado');
} else {
  console.log('ℹ️ Brave no detectado oficialmente, pero podría ser Brave');
}

// 7. Test de APIs web
console.log('\n7. APIS WEB DISPONIBLES:');
const apis = {
  'Storage': typeof Storage !== 'undefined',
  'IndexedDB': typeof indexedDB !== 'undefined',
  'ServiceWorker': typeof navigator.serviceWorker !== 'undefined',
  'WebSQL': typeof openDatabase !== 'undefined',
  'Fetch': typeof fetch !== 'undefined',
  'Promise': typeof Promise !== 'undefined'
};

Object.entries(apis).forEach(([api, available]) => {
  console.log(`${available ? '✅' : '❌'} ${api}: ${available ? 'Disponible' : 'No disponible'}`);
});

// 8. Configuración recomendada
console.log('\n8. CONFIGURACIÓN RECOMENDADA PARA BRAVE:');
console.log('🔧 Pasos para solucionar:');
console.log('   1. Abre brave://settings/');
console.log('   2. Ve a "Privacidad y seguridad"');
console.log('   3. Haz clic en "Cookies y otros datos del sitio"');
console.log('   4. Selecciona "Permitir todas las cookies"');
console.log('   5. Recarga la página');
console.log('');
console.log('🔧 Alternativa menos permisiva:');
console.log('   1. En lugar del paso 4, selecciona "Bloquear cookies de terceros"');
console.log('   2. Agrega tu sitio a "Sitios que siempre pueden usar cookies"');

// 9. Test final
console.log('\n9. RESUMEN:');
const storageWorks = (() => {
  try {
    localStorage.setItem('final_test', '1');
    localStorage.removeItem('final_test');
    return true;
  } catch (e) {
    return false;
  }
})();

console.log(`Estado general: ${storageWorks ? '✅ FUNCIONANDO' : '❌ PROBLEMAS DETECTADOS'}`);

if (!storageWorks) {
  console.log('\n🚨 ACCIÓN REQUERIDA:');
  console.log('   Tu configuración de Brave está bloqueando el almacenamiento local.');
  console.log('   Sigue las recomendaciones anteriores para solucionarlo.');
}

console.log('\n============================');
console.log('🔍 DIAGNÓSTICO COMPLETADO');