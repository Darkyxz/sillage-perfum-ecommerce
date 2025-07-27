import { useState, useEffect } from 'react';
import safeStorage from '@/utils/storage';

export const useCookieConsent = () => {
  const [consent, setConsent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar consentimiento guardado
    const loadConsent = () => {
      try {
        const savedConsent = safeStorage.getItem('cookie-consent');
        if (savedConsent) {
          const parsed = JSON.parse(savedConsent);
          setConsent(parsed);
        }
      } catch (error) {
        console.warn('Error loading cookie consent:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConsent();

    // Escuchar cambios en el consentimiento
    const handleConsentChange = (event) => {
      setConsent(event.detail);
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange);
    };
  }, []);

  // Funciones de utilidad
  const hasConsent = (type) => {
    if (!consent) return false;
    return consent[type] === true;
  };

  const canUseAnalytics = () => hasConsent('analytics');
  const canUseMarketing = () => hasConsent('marketing');
  const canUseFunctional = () => hasConsent('functional');
  
  // Las cookies necesarias siempre están permitidas
  const canUseNecessary = () => true;

  const updateConsent = (newConsent) => {
    const updatedConsent = {
      ...newConsent,
      timestamp: new Date().toISOString()
    };
    
    safeStorage.setItem('cookie-consent', JSON.stringify(updatedConsent));
    setConsent(updatedConsent);
    
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: updatedConsent 
    }));
  };

  const revokeConsent = () => {
    safeStorage.removeItem('cookie-consent');
    setConsent(null);
    
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: null 
    }));
  };

  return {
    consent,
    loading,
    hasConsent,
    canUseAnalytics,
    canUseMarketing,
    canUseFunctional,
    canUseNecessary,
    updateConsent,
    revokeConsent,
    // Estado de consentimiento
    isConsentGiven: consent !== null,
    consentTimestamp: consent?.timestamp
  };
};