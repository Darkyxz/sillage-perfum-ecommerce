// Utilidad para manejar localStorage de forma segura
// Funciona incluso cuando las cookies están deshabilitadas o en navegadores restrictivos como Brave

class SafeStorage {
  constructor() {
    this.isAvailable = false;
    this.fallbackStorage = new Map();
    this.sessionAvailable = false;
    this.init();
  }

  init() {
    // Verificar disponibilidad de forma más robusta
    this.isAvailable = this.checkLocalStorage();
    this.sessionAvailable = this.checkSessionStorage();
    
    console.log('🔧 SafeStorage initialized:', {
      localStorage: this.isAvailable,
      sessionStorage: this.sessionAvailable,
      fallback: !this.isAvailable && !this.sessionAvailable
    });
  }

  checkLocalStorage() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      
      const test = '__ls_test__' + Date.now();
      localStorage.setItem(test, 'test');
      const result = localStorage.getItem(test) === 'test';
      localStorage.removeItem(test);
      return result;
    } catch (e) {
      console.warn('localStorage no disponible:', e.message);
      return false;
    }
  }

  checkSessionStorage() {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return false;
      
      const test = '__ss_test__' + Date.now();
      sessionStorage.setItem(test, 'test');
      const result = sessionStorage.getItem(test) === 'test';
      sessionStorage.removeItem(test);
      return result;
    } catch (e) {
      console.warn('sessionStorage no disponible:', e.message);
      return false;
    }
  }

  getItem(key) {
    try {
      // Intentar localStorage primero
      if (this.isAvailable) {
        return localStorage.getItem(key);
      }
      // Fallback a sessionStorage
      if (this.sessionAvailable) {
        return sessionStorage.getItem(key);
      }
      // Último recurso: memoria
      return this.fallbackStorage.get(key) || null;
    } catch (e) {
      console.warn(`Error al obtener ${key}:`, e.message);
      return this.fallbackStorage.get(key) || null;
    }
  }

  setItem(key, value) {
    try {
      // Intentar localStorage primero
      if (this.isAvailable) {
        localStorage.setItem(key, value);
        return;
      }
      // Fallback a sessionStorage
      if (this.sessionAvailable) {
        sessionStorage.setItem(key, value);
        return;
      }
      // Último recurso: memoria
      this.fallbackStorage.set(key, value);
    } catch (e) {
      console.warn(`Error al guardar ${key}:`, e.message);
      this.fallbackStorage.set(key, value);
    }
  }

  removeItem(key) {
    try {
      // Intentar localStorage primero
      if (this.isAvailable) {
        localStorage.removeItem(key);
      }
      // También intentar sessionStorage
      if (this.sessionAvailable) {
        sessionStorage.removeItem(key);
      }
      // Limpiar de memoria también
      this.fallbackStorage.delete(key);
    } catch (e) {
      console.warn(`Error al eliminar ${key}:`, e.message);
      this.fallbackStorage.delete(key);
    }
  }

  clear() {
    try {
      if (this.isAvailable) {
        localStorage.clear();
      }
      if (this.sessionAvailable) {
        sessionStorage.clear();
      }
      this.fallbackStorage.clear();
    } catch (e) {
      console.warn('Error al limpiar storage:', e.message);
      this.fallbackStorage.clear();
    }
  }

  // Método para verificar si algún tipo de storage está funcionando
  isStorageAvailable() {
    return this.isAvailable || this.sessionAvailable;
  }

  // Método para obtener información de debug
  getStorageInfo() {
    return {
      localStorage: this.isAvailable,
      sessionStorage: this.sessionAvailable,
      fallbackSize: this.fallbackStorage.size,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };
  }
}

// Crear instancia singleton
const safeStorage = new SafeStorage();

export default safeStorage;