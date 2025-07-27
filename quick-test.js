// Test rápido para pantalla en blanco
// Ejecutar en la consola del navegador

console.log('🚀 TEST RÁPIDO DE RENDERIZADO');

// 1. Verificar el DOM básico
const root = document.getElementById('root');
console.log('Root element:', root);
console.log('Root innerHTML length:', root?.innerHTML?.length || 0);
console.log('Root children:', root?.children?.length || 0);

// 2. Verificar si hay contenido pero invisible
if (root && root.innerHTML.length > 0) {
  console.log('✅ Hay contenido en el DOM');

  // Verificar estilos que podrían ocultar contenido
  const rootStyles = window.getComputedStyle(root);
  console.log('Root display:', rootStyles.display);
  console.log('Root visibility:', rootStyles.visibility);
  console.log('Root opacity:', rootStyles.opacity);
  console.log('Root height:', rootStyles.height);

  // Buscar elementos principales
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');

  console.log('Header found:', !!header);
  console.log('Main found:', !!main);
  console.log('Footer found:', !!footer);

  if (header) {
    const headerStyles = window.getComputedStyle(header);
    console.log('Header display:', headerStyles.display);
    console.log('Header visibility:', headerStyles.visibility);
    console.log('Header height:', headerStyles.height);
  }

} else {
  console.log('❌ No hay contenido en el DOM');
}

// 3. Test de forzar contenido visible
window.testRender = () => {
  console.log('🔧 Forzando contenido visible...');

  if (root) {
    // Crear contenido de prueba
    const testDiv = document.createElement('div');
    testDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-family: Arial, sans-serif;
      z-index: 9999;
      flex-direction: column;
      gap: 20px;
    `;

    testDiv.innerHTML = `
      <h1>🎉 TEST EXITOSO</h1>
      <p>La aplicación puede renderizar contenido</p>
      <p>El problema está en los estilos o componentes específicos</p>
      <button onclick="this.parentElement.remove()" style="
        background: white;
        color: #333;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      ">Cerrar Test</button>
    `;

    document.body.appendChild(testDiv);

    setTimeout(() => {
      if (testDiv.parentElement) {
        testDiv.remove();
      }
    }, 10000); // Auto-remove después de 10 segundos
  }
};

// 4. Verificar CSS crítico
console.log('🎨 Verificando CSS crítico...');
const bodyStyles = window.getComputedStyle(document.body);
console.log('Body background:', bodyStyles.backgroundColor);
console.log('Body color:', bodyStyles.color);

// Verificar si Tailwind está cargado
const testElement = document.createElement('div');
testElement.className = 'bg-red-500';
document.body.appendChild(testElement);
const testStyles = window.getComputedStyle(testElement);
const tailwindWorking = testStyles.backgroundColor.includes('rgb(239, 68, 68)') || testStyles.backgroundColor.includes('rgb(220, 38, 38)');
testElement.remove();
console.log('Tailwind CSS funcionando:', tailwindWorking);

// 5. Instrucciones
console.log('\n📋 INSTRUCCIONES:');
console.log('1. Ejecuta window.testRender() para probar renderizado');
console.log('2. Si ves el test, el problema está en los estilos de la app');
console.log('3. Si no ves nada, el problema está en el DOM/JavaScript');

console.log('\n🔍 Ejecuta: window.testRender()');