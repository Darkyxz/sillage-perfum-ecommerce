// Diagnóstico profundo para encontrar errores de JavaScript
// Ejecutar en la consola con cookies DESHABILITADAS

console.log('🔍 DIAGNÓSTICO PROFUNDO - COOKIES DESHABILITADAS');
console.log('================================================');

// 1. Capturar TODOS los errores
const errors = [];
const warnings = [];
const logs = [];

// Sobrescribir console methods para capturar todo
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

console.error = function (...args) {
  errors.push(args.join(' '));
  originalError.apply(console, args);
};

console.warn = function (...args) {
  warnings.push(args.join(' '));
  originalWarn.apply(console, args);
};

// 2. Capturar errores no manejados
window.addEventListener('error', (event) => {
  errors.push(`Uncaught Error: ${event.error?.message || event.message} at ${event.filename}:${event.lineno}`);
});

window.addEventListener('unhandledrejection', (event) => {
  errors.push(`Unhandled Promise Rejection: ${event.reason}`);
});

// 3. Verificar estado del DOM cada segundo
let domCheckCount = 0;
const domChecker = setInterval(() => {
  domCheckCount++;
  const root = document.getElementById('root');
  const contentLength = root?.innerHTML?.length || 0;

  console.log(`DOM Check ${domCheckCount}: Content length = ${contentLength}`);

  if (contentLength > 1000 || domCheckCount > 10) {
    clearInterval(domChecker);
    console.log('DOM check stopped');
  }
}, 1000);

// 4. Verificar React específicamente
const checkReact = () => {
  console.log('\n🔍 VERIFICACIÓN DE REACT:');
  console.log('React disponible:', typeof React !== 'undefined');
  console.log('ReactDOM disponible:', typeof ReactDOM !== 'undefined');

  // Verificar si React se está montando
  const root = document.getElementById('root');
  if (root) {
    console.log('Root element exists');
    console.log('Root _reactInternalFiber:', !!root._reactInternalFiber);
    console.log('Root _reactInternalInstance:', !!root._reactInternalInstance);
    console.log('Root __reactInternalInstance:', !!root.__reactInternalInstance);
  }
};

// 5. Verificar módulos específicos
const checkModules = () => {
  console.log('\n🔍 VERIFICACIÓN DE MÓDULOS:');

  // Verificar si los módulos principales están cargados
  const modules = [
    'React',
    'ReactDOM',
    'supabase',
    'framer-motion'
  ];

  modules.forEach(module => {
    console.log(`${module}:`, typeof window[module] !== 'undefined' ? 'Disponible' : 'No disponible');
  });
};

// 6. Verificar variables de entorno
const checkEnv = () => {
  console.log('\n🔍 VERIFICACIÓN DE ENTORNO:');
  console.log('Location:', window.location.href);
  console.log('User Agent:', navigator.userAgent.substring(0, 100));
  console.log('Cookies enabled:', navigator.cookieEnabled);
  console.log('Local storage available:', (() => {
    try {
      localStorage.setItem('test', '1');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  })());
};

// 7. Intentar montar React manualmente
const tryManualMount = () => {
  console.log('\n🔧 INTENTANDO MONTAJE MANUAL DE REACT:');

  if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
    try {
      const root = document.getElementById('root');
      if (root && root.innerHTML.length < 100) {
        console.log('Intentando montar componente de prueba...');

        const TestComponent = React.createElement('div', {
          style: {
            padding: '20px',
            backgroundColor: '#f0f0f0',
            color: '#333',
            fontFamily: 'Arial',
            textAlign: 'center'
          }
        },
          React.createElement('h1', null, '🧪 React Manual Mount Test'),
          React.createElement('p', null, 'Si ves esto, React puede montarse'),
          React.createElement('p', null, 'El problema está en la aplicación específica')
        );

        ReactDOM.render(TestComponent, root);
        console.log('✅ Montaje manual exitoso');
      }
    } catch (error) {
      console.error('❌ Error en montaje manual:', error);
      errors.push(`Manual mount error: ${error.message}`);
    }
  } else {
    console.log('❌ React o ReactDOM no disponibles para montaje manual');
  }
};

// 8. Ejecutar verificaciones
setTimeout(() => {
  checkReact();
  checkModules();
  checkEnv();

  // Mostrar errores capturados
  console.log('\n📋 ERRORES CAPTURADOS:');
  if (errors.length > 0) {
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  } else {
    console.log('No se capturaron errores');
  }

  console.log('\n⚠️ WARNINGS CAPTURADOS:');
  if (warnings.length > 0) {
    warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning}`);
    });
  } else {
    console.log('No se capturaron warnings');
  }

  // Si no hay contenido después de 3 segundos, intentar montaje manual
  const root = document.getElementById('root');
  if (!root || root.innerHTML.length < 100) {
    console.log('\n🚨 NO HAY CONTENIDO - INTENTANDO MONTAJE MANUAL');
    tryManualMount();
  }

}, 3000);

// 9. Función para obtener reporte completo
window.getDebugReport = () => {
  const root = document.getElementById('root');
  return {
    timestamp: new Date().toISOString(),
    errors: errors,
    warnings: warnings,
    domContent: root?.innerHTML?.length || 0,
    reactAvailable: typeof React !== 'undefined',
    reactDOMAvailable: typeof ReactDOM !== 'undefined',
    cookiesEnabled: navigator.cookieEnabled,
    storageAvailable: (() => {
      try {
        localStorage.setItem('test', '1');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    })(),
    userAgent: navigator.userAgent
  };
};

console.log('\n📋 INSTRUCCIONES:');
console.log('1. Espera 5 segundos para que se complete el diagnóstico');
console.log('2. Ejecuta window.getDebugReport() para obtener el reporte completo');
console.log('3. Si ves un componente de prueba, React funciona pero la app tiene problemas');
console.log('4. Si no ves nada, hay un error crítico de JavaScript');

console.log('\n⏱️ Diagnóstico iniciado... espera 5 segundos');