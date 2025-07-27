import safeStorage from '@/utils/storage';

class CookieService {
  constructor() {
    this.consent = null;
    this.loadConsent();
    
    // Escuchar cambios en el consentimiento
    window.addEventListener('cookieConsentChanged', (event) => {
      this.consent = event.detail;
    });
  }

  loadConsent() {
    try {
      const savedConsent = safeStorage.getItem('cookie-consent');
      if (savedConsent) {
        this.consent = JSON.parse(savedConsent);
      }
    } catch (error) {
      console.warn('Error loading cookie consent:', error);
    }
  }

  // Verificar si se puede usar un tipo específico de cookie
  canUse(type) {
    if (!this.consent) return false;
    if (type === 'necessary') return true; // Siempre permitidas
    return this.consent[type] === true;
  }

  // Cookies Necesarias - Siempre permitidas
  setNecessaryCookie(key, value, options = {}) {
    return this.setCookie(key, value, { ...options, type: 'necessary' });
  }

  // Cookies Funcionales - Preferencias del usuario
  setFunctionalCookie(key, value, options = {}) {
    if (!this.canUse('functional')) {
      console.log('Functional cookies not allowed');
      return false;
    }
    return this.setCookie(key, value, { ...options, type: 'functional' });
  }

  // Cookies de Análisis - Google Analytics, etc.
  setAnalyticsCookie(key, value, options = {}) {
    if (!this.canUse('analytics')) {
      console.log('Analytics cookies not allowed');
      return false;
    }
    return this.setCookie(key, value, { ...options, type: 'analytics' });
  }

  // Cookies de Marketing - Publicidad, remarketing
  setMarketingCookie(key, value, options = {}) {
    if (!this.canUse('marketing')) {
      console.log('Marketing cookies not allowed');
      return false;
    }
    return this.setCookie(key, value, { ...options, type: 'marketing' });
  }

  // Método interno para establecer cookies
  setCookie(key, value, options = {}) {
    try {
      const {
        expires = 365, // días
        path = '/',
        secure = window.location.protocol === 'https:',
        sameSite = 'Lax',
        type = 'necessary'
      } = options;

      let cookieString = `${key}=${encodeURIComponent(value)}`;
      
      if (expires) {
        const date = new Date();
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
        cookieString += `; expires=${date.toUTCString()}`;
      }
      
      cookieString += `; path=${path}`;
      cookieString += `; SameSite=${sameSite}`;
      
      if (secure) {
        cookieString += '; Secure';
      }

      document.cookie = cookieString;
      
      // También guardar en storage como backup
      safeStorage.setItem(`cookie_${type}_${key}`, JSON.stringify({
        value,
        expires: expires ? Date.now() + (expires * 24 * 60 * 60 * 1000) : null,
        type
      }));

      return true;
    } catch (error) {
      console.warn('Error setting cookie:', error);
      return false;
    }
  }

  // Obtener cookie
  getCookie(key) {
    try {
      const name = key + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      
      // Fallback a storage
      const types = ['necessary', 'functional', 'analytics', 'marketing'];
      for (const type of types) {
        const stored = safeStorage.getItem(`cookie_${type}_${key}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!parsed.expires || Date.now() < parsed.expires) {
            return parsed.value;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.warn('Error getting cookie:', error);
      return null;
    }
  }

  // Eliminar cookie
  deleteCookie(key, path = '/') {
    try {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
      
      // También eliminar del storage
      const types = ['necessary', 'functional', 'analytics', 'marketing'];
      types.forEach(type => {
        safeStorage.removeItem(`cookie_${type}_${key}`);
      });
    } catch (error) {
      console.warn('Error deleting cookie:', error);
    }
  }

  // Limpiar cookies según el consentimiento
  cleanupCookies() {
    if (!this.consent) return;

    const types = ['functional', 'analytics', 'marketing'];
    
    types.forEach(type => {
      if (!this.canUse(type)) {
        // Eliminar cookies de este tipo
        this.cleanupCookiesByType(type);
      }
    });
  }

  cleanupCookiesByType(type) {
    // Eliminar del storage
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`cookie_${type}_`)) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => {
      safeStorage.removeItem(key);
    });
  }

  // Métodos de conveniencia para casos comunes
  
  // Guardar preferencias del usuario (funcional)
  saveUserPreference(key, value) {
    return this.setFunctionalCookie(`pref_${key}`, value, { expires: 365 });
  }

  getUserPreference(key) {
    return this.getCookie(`pref_${key}`);
  }

  // Tracking de analytics
  trackEvent(event, data) {
    if (this.canUse('analytics')) {
      // Aquí integrarías con Google Analytics, etc.
      console.log('Analytics event:', event, data);
      return true;
    }
    return false;
  }

  // Marketing/Remarketing
  setMarketingPixel(pixelId, data) {
    if (this.canUse('marketing')) {
      // Aquí integrarías con Facebook Pixel, Google Ads, etc.
      console.log('Marketing pixel:', pixelId, data);
      return true;
    }
    return false;
  }
}

// Instancia singleton
const cookieService = new CookieService();

export default cookieService;