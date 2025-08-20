import React, { useEffect } from 'react';
import { useContentProtection } from '@/hooks/useContentProtection';

const ContentProtection = ({ children }) => {
  // Usar el hook de protección
  useContentProtection();

  useEffect(() => {
    // Agregar estilos CSS para protección adicional
    const style = document.createElement('style');
    style.textContent = `
      /* Deshabilitar selección de texto */
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      /* Permitir selección solo en inputs y textareas */
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      
      /* Proteger imágenes */
      img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
      
      /* Proteger imágenes en modo hover para admin */
      .admin-page img {
        pointer-events: auto !important;
      }
      
      /* Ocultar scrollbars en DevTools */
      ::-webkit-scrollbar {
        display: none;
      }
      
      /* Protección adicional contra inspección */
      body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;

    document.head.appendChild(style);

    // Cleanup
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Detectar herramientas de desarrollo abiertas
  useEffect(() => {
    const detectDevTools = () => {
      const devtools = {
        open: false,
        orientation: null
      };

      const threshold = 160;

      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            console.clear();
            console.log('%c🚫 ACCESO NO AUTORIZADO', 'color: red; font-size: 30px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
            console.log('%c⚠️ Esta aplicación web está protegida contra inspección', 'color: orange; font-size: 18px; font-weight: bold;');
            console.log('%c🔒 Sillage-Perfum - Contenido Protegido', 'color: #c29605ff; font-size: 16px; font-weight: bold;');

            // Opcional: Redirigir o mostrar advertencia
            // window.location.href = '/';
          }
        } else {
          devtools.open = false;
        }
      }, 500);
    };

    detectDevTools();
  }, []);

  return <>{children}</>;
};

export default ContentProtection;