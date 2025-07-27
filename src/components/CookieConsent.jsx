import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, X, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import safeStorage from '@/utils/storage';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Siempre true, no se puede desactivar
    functional: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Verificar si ya se dio consentimiento
    const consent = safeStorage.getItem('cookie-consent');
    if (!consent) {
      // Mostrar banner después de 2 segundos
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // Cargar preferencias guardadas
      try {
        const savedPrefs = JSON.parse(consent);
        setPreferences(prev => ({ ...prev, ...savedPrefs }));
      } catch (e) {
        console.warn('Error parsing cookie preferences');
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    
    safeStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowBanner(false);
    
    // Disparar evento para otros componentes
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: allAccepted 
    }));
  };

  const handleAcceptSelected = () => {
    const selectedPrefs = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    
    safeStorage.setItem('cookie-consent', JSON.stringify(selectedPrefs));
    setShowBanner(false);
    setShowSettings(false);
    
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: selectedPrefs 
    }));
  };

  const handleRejectAll = () => {
    const minimalPrefs = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    
    safeStorage.setItem('cookie-consent', JSON.stringify(minimalPrefs));
    setPreferences(minimalPrefs);
    setShowBanner(false);
    
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: minimalPrefs 
    }));
  };

  const togglePreference = (key) => {
    if (key === 'necessary') return; // No se puede desactivar
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const cookieTypes = [
    {
      key: 'necessary',
      title: 'Cookies Necesarias',
      description: 'Esenciales para el funcionamiento básico del sitio web. No se pueden desactivar.',
      icon: Shield,
      required: true
    },
    {
      key: 'functional',
      title: 'Cookies Funcionales',
      description: 'Permiten recordar tus preferencias y mejorar tu experiencia de navegación.',
      icon: Settings,
      required: false
    },
    {
      key: 'analytics',
      title: 'Cookies de Análisis',
      description: 'Nos ayudan a entender cómo interactúas con nuestro sitio para mejorarlo.',
      icon: Check,
      required: false
    },
    {
      key: 'marketing',
      title: 'Cookies de Marketing',
      description: 'Utilizadas para mostrarte contenido y anuncios relevantes.',
      icon: Cookie,
      required: false
    }
  ];

  return (
    <>
      {/* Banner Principal */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Cookie className="h-6 w-6 text-sillage-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      🍪 Utilizamos cookies para mejorar tu experiencia
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Utilizamos cookies para personalizar contenido, analizar nuestro tráfico y mejorar nuestros servicios. 
                      Al continuar navegando, aceptas nuestro uso de cookies.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Personalizar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectAll}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Solo Necesarias
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="bg-sillage-gold hover:bg-sillage-gold-dark text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Aceptar Todas
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Configuración */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-sillage-gold" />
              Configuración de Cookies
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Puedes elegir qué tipos de cookies permitir. Las cookies necesarias siempre están activas 
              ya que son esenciales para el funcionamiento del sitio.
            </p>
            
            <div className="space-y-4">
              {cookieTypes.map((type) => {
                const IconComponent = type.icon;
                const isEnabled = preferences[type.key];
                
                return (
                  <div
                    key={type.key}
                    className={`border rounded-lg p-4 transition-colors ${
                      isEnabled ? 'border-sillage-gold bg-sillage-gold/5' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <IconComponent className={`h-5 w-5 mt-0.5 ${
                          isEnabled ? 'text-sillage-gold' : 'text-gray-400'
                        }`} />
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {type.title}
                            {type.required && (
                              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                Requerida
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {type.description}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => togglePreference(type.key)}
                        disabled={type.required}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isEnabled ? 'bg-sillage-gold' : 'bg-gray-200'
                        } ${type.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAcceptSelected}
                className="flex-1 bg-sillage-gold hover:bg-sillage-gold-dark text-white"
              >
                Guardar Preferencias
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;