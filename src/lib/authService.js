import { apiClient } from './apiClient';

// Servicio de autenticación para reemplazar Supabase Auth
export const authService = {
  // Login de usuario
  async login(email, password) {
    try {
      const response = await apiClient.login(email, password);

      if (response.success) {
        return {
          user: response.data.user,
          token: response.data.token,
          error: null
        };
      } else {
        return {
          user: null,
          token: null,
          error: { message: response.error || 'Error en el login' }
        };
      }
    } catch (error) {
      return {
        user: null,
        token: null,
        error: { message: error.message || 'Error de conexión' }
      };
    }
  },

  // Registro de usuario
  async register(email, password, fullName) {
    try {
      const response = await apiClient.register(email, password, fullName);

      if (response.success) {
        return {
          user: response.data.user,
          token: response.data.token,
          error: null
        };
      } else {
        return {
          user: null,
          token: null,
          error: { message: response.error || 'Error en el registro' }
        };
      }
    } catch (error) {
      return {
        user: null,
        token: null,
        error: { message: error.message || 'Error de conexión' }
      };
    }
  },

  // Logout
  async logout() {
    try {
      await apiClient.logout();
      return { error: null };
    } catch (error) {
      console.error('Logout error:', error);
      return { error: { message: error.message } };
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const user = await apiClient.getCurrentUser();
      return { user, error: null };
    } catch (error) {
      return { user: null, error: { message: error.message } };
    }
  },

  // Verificar si hay sesión activa
  hasActiveSession() {
    return !!apiClient.getToken();
  },

  // Obtener token actual
  getToken() {
    return apiClient.getToken();
  },

  // Limpiar sesión local
  clearSession() {
    apiClient.setToken(null);
  },

  // Actualizar perfil de usuario
  async updateProfile(userId, profileData) {
    try {
      const response = await apiClient.updateProfile(userId, profileData);

      if (response.success) {
        return {
          user: response.data,
          error: null
        };
      } else {
        return {
          user: null,
          error: { message: response.error || 'Error actualizando perfil' }
        };
      }
    } catch (error) {
      return {
        user: null,
        error: { message: error.message || 'Error de conexión' }
      };
    }
  },

  // Verificar si el usuario es admin
  isAdmin(user) {
    return user && user.role === 'admin';
  },

  // Solicitar reset de contraseña
  async requestPasswordReset(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return {
        success: response.success,
        error: response.success ? null : { message: response.error }
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error.message || 'Error solicitando reset' }
      };
    }
  },

  // Refrescar token
  async refreshToken() {
    try {
      const currentToken = this.getToken();
      if (!currentToken) return { token: null, error: { message: 'No hay token' } };

      const response = await apiClient.post('/auth/refresh', { token: currentToken });

      if (response.success) {
        apiClient.setToken(response.data.token);
        return {
          token: response.data.token,
          error: null
        };
      } else {
        this.clearSession();
        return {
          token: null,
          error: { message: response.error || 'Error refrescando token' }
        };
      }
    } catch (error) {
      this.clearSession();
      return {
        token: null,
        error: { message: error.message || 'Error de conexión' }
      };
    }
  }
};