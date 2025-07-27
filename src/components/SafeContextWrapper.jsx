import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import safeStorage from '@/utils/storage';

const ContextErrorFallback = ({ error, resetErrorBoundary, contextName }) => {
  const isStorageError = error.message.includes('localStorage') || 
                        error.message.includes('sessionStorage') ||
                        error.message.includes('storage');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md text-center">
        <h2 className="text-lg font-semibold text-sillage-gold mb-3">
          Error en {contextName}
        </h2>
        
        {isStorageError ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Problema de compatibilidad con el almacenamiento del navegador.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-xs text-amber-800">
                <strong>Solución:</strong> Habilita las cookies en tu navegador o prueba en modo normal (no privado).
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-3">
            {error.message}
          </p>
        )}
        
        <button
          onClick={resetErrorBoundary}
          className="bg-sillage-gold text-white px-4 py-2 rounded text-sm hover:bg-sillage-gold-dark transition"
        >
          Reintentar
        </button>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-3 text-left">
            <summary className="text-xs cursor-pointer text-muted-foreground">
              Detalles técnicos
            </summary>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

const SafeContextWrapper = ({ children, contextName = "Context" }) => {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ContextErrorFallback {...props} contextName={contextName} />
      )}
      onError={(error, errorInfo) => {
        console.error(`Error en ${contextName}:`, error);
        console.error('Error info:', errorInfo);
        
        // Log información de storage para debugging
        if (safeStorage) {
          console.log('Storage info:', safeStorage.getStorageInfo());
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default SafeContextWrapper;