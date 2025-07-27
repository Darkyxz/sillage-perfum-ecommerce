// Script de diagnóstico para pantalla en blanco
// Ejecutar en la consola del navegador cuando la pantalla esté en blanco

console.log('🔍 DIAGNÓSTICO DE PANTALLA EN BLANCO');
console.log('=====================================');

// 1. Verificar que React está cargado
console.log('\n1. VERIFICACIÓN DE REACT:');
console.log('React disponible:', typeof React !== 'undefined');
console.log('ReactDOM disponible:', typeof ReactDOM !== 'undefined');

// 2. Verificar el DOM
console.log('\n2. VERIFICACIÓN DEL DOM:');
const rootElement = document.getElementById('root');
console.log('Elemento root encontrado:', !!rootElement);
if (rootElement) {
  console.log('Contenido del root:', rootElement.innerHTML.length > 0 ? 'Tiene contenido' : 'Vacío');
  console.log('Clases del root:', rootElement.className);
}

// 3. Verificar errores en consola
console.log('\n3. VERIFICACIÓN DE ERRORES:');
const errors = [];
const originalError = console.error;
console.error = function (...args) {
  errors.push(args.join(' '));
  originalError.apply(console, args);
};

// 4. Verificar CSS
console.log('\n4. VERIFICACIÓN DE CSS:');
const stylesheets = Array.from(document.styleSheets);
console.log('Hojas de estilo cargadas:', stylesheets.length);
stylesheets.forEach((sheet, index) => {
  try {
    console.log(`Hoja ${index + 1}:`, sheet.href || 'Inline');
  } catch (e) {
    console.log(`Hoja ${index + 1}: Error accediendo`);
  }
});

// 5. Verificar JavaScript
console.log('\n5. VERIFICACIÓN DE JAVASCRIPT:');
console.log('Errores capturados:', errors.length);
if (errors.length > 0) {
  console.log('Errores:', errors);
}

// 6. Verificar storage
console.log('\n6. VERIFICACIÓN DE STORAGE:');
const testStorage = () => {
  const tests = {
    localStorage: false,
    sessionStorage: false,
    cookies: false
  };

  try {
    localStorage.setItem('test', '1');
    localStorage.removeItem('test');
    tests.localStorage = true;
  } catch (e) {
    console.log('localStorage error:', e.message);
  }

  try {
    sessionStorage.setItem('test', '1');
    sessionStorage.removeItem('test');
    tests.sessionStorage = true;
  } catch (e) {
    console.log('sessionStorage error:', e.message);
  }

  try {
    document.cookie = 'test=1';
    tests.cookies = document.cookie.includes('test');
    document.cookie = 'test=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch (e) {
    console.log('cookies error:', e.message);
  }

  return tests;
};

const storageResults = testStorage();
console.log('Storage results:', storageResults);

// 7. Verificar variables de entorno
console.log('\n7. VERIFICACIÓN DE VARIABLES DE ENTORNO:');
console.log('NODE_ENV:', typeof process !== 'undefined' ? process?.env?.NODE_ENV : 'No disponible');
console.log('Vite env disponible:', typeof window !== 'undefined' && window.location.hostname === 'localhost');

// 8. Verificar red
console.log('\n8. VERIFICACIÓN DE RED:');
console.log('Navigator online:', navigator.onLine);
console.log('Connection type:', navigator.connection?.effectiveType || 'No disponible');

// 9. Verificar Supabase
console.log('\n9. VERIFICACIÓN DE SUPABASE:');
if (typeof window !== 'undefined' && window.supabase) {
  console.log('Supabase disponible:', true);
  try {
    window.supabase.auth.getSession().then(({ data, error }) => {
      console.log('Supabase session:', data ? 'OK' : 'No session');
      if (error) console.log('Supabase error:', error.message);
    });
  } catch (e) {
    console.log('Supabase test error:', e.message);
  }
} else {
  console.log('Supabase no disponible globalmente');
}

// 10. Verificar elementos específicos
console.log('\n10. VERIFICACIÓN DE ELEMENTOS:');
const checkElements = [
  'header',
  'main',
  'footer',
  '[class*="sillage"]',
  '[class*="bg-"]'
];

checkElements.forEach(selector => {
  const elements = document.querySelectorAll(selector);
  console.log(`${selector}:`, elements.length, 'elementos encontrados');
});

// 11. Verificar estilos computados
console.log('\n11. VERIFICACIÓN DE ESTILOS:');
if (document.body) {
  const bodyStyles = window.getComputedStyle(document.body);
  console.log('Body background:', bodyStyles.backgroundColor);
  console.log('Body color:', bodyStyles.color);
  console.log('Body display:', bodyStyles.display);
  console.log('Body visibility:', bodyStyles.visibility);
}

// 12. Recomendaciones
console.log('\n12. RECOMENDACIONES:');
const recommendations = [];

if (!storageResults.localStorage && !storageResults.sessionStorage) {
  recommendations.push('Habilitar almacenamiento local en el navegador');
}

if (!storageResults.cookies) {
  recommendations.push('Habilitar cookies en el navegador');
}

if (errors.length > 0) {
  recommendations.push('Revisar errores de JavaScript en la consola');
}

if (recommendations.length === 0) {
  recommendations.push('Todos los tests básicos pasaron - revisar código específico');
}

recommendations.forEach((rec, index) => {
  console.log(`${index + 1}. ${rec}`);
});

console.log('\n=====================================');
console.log('🔍 DIAGNÓSTICO COMPLETADO');

// Función para forzar renderizado
window.forceRender = () => {
  console.log('🔄 Intentando forzar renderizado...');
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<div style="padding: 20px; background: red; color: white; font-size: 20px;">TEST: Si ves esto, el DOM funciona</div>';
  }
};