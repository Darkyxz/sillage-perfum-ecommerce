import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import safeStorage from '@/utils/storage';
import { useBraveDetection } from '@/hooks/useBraveDetection';

const CookieNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);
  const browserInfo = useBraveDetection();

  useEffect(() => {
    // Verificar si ya hay consentimiento de cookies
    const hasConsent = safeStorage.getItem('cookie-consent');
    if (hasConsent) {
      return; // No mostrar si ya hay consentimiento
    }

    // Verificar si el storage está disponible
    const storageAvailable = safeStorage.isStorageAvailable();
    setIsStorageAvailable(storageAvailable);

    // Si el storage no está disponible, mostrar notificación
    if (!storageAvailable || browserInfo.hasStorageIssues) {
      // Verificar si ya se mostró la notificación en esta sesión
      try {
        if (!sessionStorage.getItem('cookie-notification-shown')) {
          setShowNotification(true);
          sessionStorage.setItem('cookie-notification-shown', 'true');
        }
      } catch (e) {
        // Si sessionStorage tampoco funciona, mostrar siempre
        setShowNotification(true);
      }
    }
  }, [browserInfo]);

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification) {
    return null;
  }

  const isBraveIssue = browserInfo.isBrave && browserInfo.hasStorageIssues;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md"
      >
        <div className={`border rounded-lg p-4 shadow-lg ${
          isBraveIssue 
            ? 'bg-orange-50 border-orange-200' 
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-start space-x-3">
            {isBraveIssue ? (
              <Shield className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-sm font-semibold mb-1 ${
                isBraveIssue ? 'text-orange-800' : 'text-amber-800'
              }`}>
                {isBraveIssue ? 'Brave Browser Detectado' : 'Funcionalidad Limitada'}
              </h3>
              <p className={`text-sm mb-3 ${
                isBraveIssue ? 'text-orange-700' : 'text-amber-700'
              }`}>
                {isBraveIssue 
                  ? 'Brave está bloqueando el almacenamiento local. Ve a brave://settings/privacy y ajusta "Bloquear cookies" para mejorar la experiencia.'
                  : 'Las cookies están deshabilitadas. Algunas funciones como el carrito y favoritos funcionarán solo durante esta sesión.'
                }
              </p>
              
              {browserInfo.recommendations.length > 0 && (
                <div className="mb-3">
                  <details className="text-xs">
                    <summary className={`cursor-pointer ${
                      isBraveIssue ? 'text-orange-600' : 'text-amber-600'
                    }`}>
                      Ver recomendaciones
                    </summary>
                    <ul className={`mt-1 space-y-1 ${
                      isBraveIssue ? 'text-orange-700' : 'text-amber-700'
                    }`}>
                      {browserInfo.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDismiss}
                  className={`border-opacity-50 ${
                    isBraveIssue 
                      ? 'text-orange-700 border-orange-300 hover:bg-orange-100'
                      : 'text-amber-700 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  Entendido
                </Button>
                <a
                  href="/cookies"
                  className={`text-xs hover:underline ${
                    isBraveIssue 
                      ? 'text-orange-600 hover:text-orange-800'
                      : 'text-amber-600 hover:text-amber-800'
                  }`}
                >
                  Más información
                </a>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className={`flex-shrink-0 ${
                isBraveIssue 
                  ? 'text-orange-600 hover:text-orange-800'
                  : 'text-amber-600 hover:text-amber-800'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieNotification;