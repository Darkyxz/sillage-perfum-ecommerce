import React from 'react';

// Aplicación mínima para testing sin dependencias complejas
const MinimalApp = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      color: '#333',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <header style={{
        backgroundColor: '#FFC107',
        color: '#000',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>
          🧪 Sillage-Perfum - Modo Minimal
        </h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
          Aplicación funcionando sin dependencias complejas
        </p>
      </header>

      <main style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ color: '#333', marginTop: 0 }}>
          ✅ React está funcionando correctamente
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Estado del Sistema:</h3>
          <ul style={{ lineHeight: '1.6' }}>
            <li>✅ React: Funcionando</li>
            <li>✅ DOM: Renderizando</li>
            <li>✅ CSS: Aplicado</li>
            <li>{navigator.cookieEnabled ? '✅' : '❌'} Cookies: {navigator.cookieEnabled ? 'Habilitadas' : 'Deshabilitadas'}</li>
            <li>{(() => {
              try {
                localStorage.setItem('test', '1');
                localStorage.removeItem('test');
                return '✅';
              } catch (e) {
                return '❌';
              }
            })()} LocalStorage: {(() => {
              try {
                localStorage.setItem('test', '1');
                localStorage.removeItem('test');
                return 'Disponible';
              } catch (e) {
                return 'No disponible';
              }
            })()}</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '4px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>
            Información de Debug:
          </h4>
          <p style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace' }}>
            User Agent: {navigator.userAgent.substring(0, 80)}...
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', fontFamily: 'monospace' }}>
            URL: {window.location.href}
          </p>
        </div>

        <button
          onClick={() => {
            alert('¡El JavaScript está funcionando correctamente!');
          }}
          style={{
            backgroundColor: '#FFC107',
            color: '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Probar JavaScript
        </button>
      </main>

      <footer style={{
        backgroundColor: '#6c757d',
        color: '#fff',
        padding: '15px',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '14px'
      }}>
        Si ves esta aplicación, React funciona correctamente. 
        El problema está en las dependencias o contextos complejos.
      </footer>
    </div>
  );
};

export default MinimalApp;