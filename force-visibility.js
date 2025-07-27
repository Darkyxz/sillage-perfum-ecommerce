// Script para forzar visibilidad inmediata
// Ejecutar en la consola del navegador

console.log('🔧 FORZANDO VISIBILIDAD DE LA APLICACIÓN');

// 1. Remover estilos problemáticos
const removeProblematicStyles = () => {
  // Buscar y remover estilos que podrían estar ocultando contenido
  const stylesheets = Array.from(document.styleSheets);

  stylesheets.forEach((sheet, index) => {
    try {
      const rules = Array.from(sheet.cssRules || sheet.rules || []);
      rules.forEach((rule, ruleIndex) => {
        if (rule.style && (
          rule.style.display === 'none' ||
          rule.style.visibility === 'hidden' ||
          rule.style.opacity === '0'
        )) {
          console.log(`Removiendo regla problemática: ${rule.selectorText}`);
          sheet.deleteRule(ruleIndex);
        }
      });
    } catch (e) {
      // Ignorar errores de CORS
    }
  });
};

// 2. Aplicar estilos de emergencia
const applyEmergencyStyles = () => {
  const emergencyCSS = `
    /* Estilos de emergencia para visibilidad */
    * {
      color: #333 !important;
    }
    
    body {
      background-color: #f8f9fa !important;
      color: #333 !important;
    }
    
    #root {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      min-height: 100vh !important;
      background-color: #ffffff !important;
    }
    
    header {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      background-color: #FFC107 !important;
      color: #000 !important;
      padding: 1rem !important;
      border-bottom: 2px solid #000 !important;
    }
    
    main {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      flex: 1 !important;
      background-color: #ffffff !important;
      color: #333 !important;
      padding: 1rem !important;
      min-height: 500px !important;
    }
    
    footer {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      background-color: #f8f9fa !important;
      color: #333 !important;
      padding: 1rem !important;
      border-top: 2px solid #000 !important;
    }
    
    h1, h2, h3, h4, h5, h6 {
      color: #333 !important;
      font-weight: bold !important;
    }
    
    p, span, div, a {
      color: #333 !important;
    }
    
    button {
      background-color: #FFC107 !important;
      color: #000 !important;
      border: 1px solid #000 !important;
      padding: 0.5rem 1rem !important;
      border-radius: 4px !important;
      cursor: pointer !important;
    }
    
    a {
      color: #FFC107 !important;
      text-decoration: underline !important;
    }
    
    /* Deshabilitar protecciones que podrían interferir */
    * {
      user-select: text !important;
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
    }
    
    img {
      pointer-events: auto !important;
    }
    
    /* Asegurar que no hay reglas de print activas */
    @media screen {
      * {
        display: revert !important;
      }
    }
  `;

  // Remover estilos de emergencia anteriores
  const existingEmergencyStyle = document.getElementById('emergency-visibility-fix');
  if (existingEmergencyStyle) {
    existingEmergencyStyle.remove();
  }

  // Aplicar nuevos estilos
  const style = document.createElement('style');
  style.id = 'emergency-visibility-fix';
  style.textContent = emergencyCSS;
  document.head.appendChild(style);

  console.log('✅ Estilos de emergencia aplicados');
};

// 3. Verificar elementos principales
const checkMainElements = () => {
  const elements = ['#root', 'header', 'main', 'footer'];

  elements.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      const styles = window.getComputedStyle(element);
      console.log(`${selector}:`, {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        backgroundColor: styles.backgroundColor,
        color: styles.color
      });
    } else {
      console.log(`${selector}: No encontrado`);
    }
  });
};

// 4. Ejecutar todo
console.log('1. Removiendo estilos problemáticos...');
removeProblematicStyles();

console.log('2. Aplicando estilos de emergencia...');
applyEmergencyStyles();

console.log('3. Verificando elementos principales...');
checkMainElements();

console.log('🎉 PROCESO COMPLETADO');
console.log('Si aún no ves la aplicación, el problema podría estar en JavaScript');

// 5. Función para revertir cambios
window.revertEmergencyStyles = () => {
  const emergencyStyle = document.getElementById('emergency-visibility-fix');
  if (emergencyStyle) {
    emergencyStyle.remove();
    console.log('✅ Estilos de emergencia removidos');
  }
};