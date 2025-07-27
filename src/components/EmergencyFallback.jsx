import React, { useEffect, useState } from 'react';

const EmergencyFallback = ({ children }) => {
  const [showFallback, setShowFallback] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    // Verificar si la aplicación se está renderizando correctamente
    const checkRendering = () => {
      const root = document.getElementById('root');
      const hasContent = root && root.innerHTML.length > 100; // Contenido mínimo esperado
      
      if (!hasContent) {
        console.warn('🚨 EmergencyFallback: Contenido insuficiente detectado');
        setShowFallback(true);
      }
      
      // Recopilar información de debug
      const info = {
        rootExists: !!root,
        rootContentLength: root?.innerHTML?.length || 0,
        rootChildren: root?.children?.length || 0,
        bodyBackground: window.getComputedStyle(document.body).backgroundColor,
        storageAvailable: (() => {
          try {
            localStorage.setItem('test', '1');
            localStorage.removeItem('test');
            return true;
          } catch (e) {
            return false;
          }
        })(),
        userAgent: navigator.userAgent.substring(0, 50) + '...'
      };
      
      setDebugInfo(info);
      console.log('🔧 EmergencyFallback Debug:', info);
    };

    // Verificar inmediatamente
    checkRendering();
    
    // Verificar después de un delay para dar tiempo a que se renderice
    const timer = setTimeout(checkRendering, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (showFallback) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h1 style={{
            color: '#FFC107',
            fontSize: '28px',
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            🛠️ Sillage-Perfum
          </h1>
          
          <h2 style={{
            color: '#666',
            fontSize: '18px',
            marginBottom: '20px'
          }}>
            Modo de Compatibilidad Activado
          </h2>
          
          <p style={{
            marginBottom: '20px',
            lineHeight: '1.5',
            color: '#555'
          }}>
            Tu navegador tiene configuraciones de privacidad que están interfiriendo con la carga normal de la aplicación.
          </p>
          
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '5px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <strong style={{ color: '#856404' }}>Recomendaciones:</strong>
            <ul style={{ margin: '10px 0', paddingLeft: '20px', color: '#856404' }}>
              <li>Habilita las cookies en tu navegador</li>
              <li>Desactiva el modo de navegación privada</li>
              <li>Prueba con otro navegador (Chrome, Firefox, Edge)</li>
              <li>Desactiva extensiones de bloqueo de anuncios temporalmente</li>
            </ul>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => {
                setShowFallback(false);
                window.location.reload();
              }}
              style={{
                backgroundColor: '#FFC107',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Reintentar
            </button>
            
            <button
              onClick={() => setShowFallback(false)}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Continuar de todos modos
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: '#666' }}>
                Información técnica
              </summary>
              <pre style={{
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '3px',
                fontSize: '12px',
                overflow: 'auto',
                marginTop: '10px'
              }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return children;
};

export default EmergencyFallback;