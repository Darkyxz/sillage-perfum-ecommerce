
import React, { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../lib/authService';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar si hay una sesión activa
        if (authService.hasActiveSession()) {
          const { user: currentUser, error } = await authService.getCurrentUser();

          if (currentUser && !error) {
            setUser(currentUser.user || currentUser); // Ajustar estructura de respuesta
            console.log('🔐 Sesión restaurada:', currentUser.user?.email || currentUser.email);
          } else {
            // Si hay error, limpiar sesión
            authService.clearSession();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        authService.clearSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    console.log('🔐 Iniciando sesión:', email);
    setLoading(true);

    try {
      const { user: loggedUser, error } = await authService.login(email, password);

      if (loggedUser && !error) {
        setUser(loggedUser);
        console.log('✅ Usuario logueado:', loggedUser); // Debug
        toast({
          title: "¡Bienvenido!",
          description: `Has iniciado sesión como ${loggedUser.full_name || loggedUser.email}`
        });
        return { error: null };
      } else {
        console.error('❌ Error en login:', error); // Debug
        toast({
          title: "Error al iniciar sesión",
          description: error?.message || 'Error desconocido',
          variant: "destructive"
        });
        return { error };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive"
      });
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, fullName) => {
    console.log('🔐 Registrando usuario:', email);
    setLoading(true);

    try {
      const { user: newUser, error } = await authService.register(email, password, fullName);

      if (newUser && !error) {
        setUser(newUser);
        console.log('✅ Usuario registrado:', newUser); // Debug
        toast({
          title: "¡Registro exitoso!",
          description: `Bienvenido ${newUser.full_name || newUser.email}`
        });
        return { error: null };
      } else {
        console.error('❌ Error en registro:', error); // Debug
        toast({
          title: "Error en el registro",
          description: error?.message || 'Error desconocido',
          variant: "destructive"
        });
        return { error };
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error en el registro",
        description: error.message,
        variant: "destructive"
      });
      return { error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('🔐 Cerrando sesión');

    try {
      const currentUserId = user?.id;

      await authService.logout();
      setUser(null);

      // NO limpiar el carrito específico del usuario - debe persistir para cuando regrese
      // Solo limpiar storage genérico por compatibilidad
      localStorage.removeItem('cart');
      localStorage.removeItem('favorites');

      console.log('🔐 Sesión cerrada - carrito del usuario preservado');

      toast({ title: "Has cerrado sesión" });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error al cerrar sesión",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    profile: user, // En MySQL, el perfil está incluido en el usuario
    loading,
    profileLoading: false, // Ya no necesitamos carga separada de perfil
    login,
    signup,
    logout,
    isAdmin: user?.role === 'admin',
    // Estado de carga de autenticación
    isAuthLoading: loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
