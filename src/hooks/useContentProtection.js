import { useEffect } from 'react';

export const useContentProtection = () => {
  useEffect(() => {
    // Deshabilitar click derecho
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Deshabilitar teclas de desarrollador y atajos comunes
    const handleKeyDown = (e) => {
      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (Ver código fuente)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (Guardar página)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+A (Seleccionar todo)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+P (Imprimir)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+C (Copiar)
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+V (Pegar)
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+X (Cortar)
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        return false;
      }
    };

    // Deshabilitar selección de texto
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Deshabilitar arrastrar imágenes
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Deshabilitar copiar imágenes
    const handleCopy = (e) => {
      e.preventDefault();
      return false;
    };

    // Detectar DevTools (método básico)
    const detectDevTools = () => {
      const threshold = 160;
      
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        console.clear();
        console.log('%c🚫 Acceso no autorizado', 'color: red; font-size: 20px; font-weight: bold;');
        console.log('%c⚠️ Esta aplicación está protegida', 'color: orange; font-size: 16px;');
      }
    };

    // Agregar event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    
    // Detectar DevTools cada 500ms
    const devToolsInterval = setInterval(detectDevTools, 500);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      clearInterval(devToolsInterval);
    };
  }, []);
};