
import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await getProfile(session.user.id);
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setProfile(null); // Reset profile on auth change
      if (session?.user) {
        await getProfile(session.user.id);
      }
      // No poner setLoading(false) aquí para evitar flashes de contenido
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const getProfile = async (userId) => {
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, avatar_url, role`)
        .eq('id', userId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error cargando perfil:', error.message);
    }
  };
  
  const login = async (email, password) => {
    console.log('Logging in with:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error);
      toast({ title: "Error al iniciar sesión", description: error.message, variant: "destructive" });
    }
    return { error };
  };

  const signup = async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
     if (error) {
      toast({ title: "Error en el registro", description: error.message, variant: "destructive" });
    }
    return { error };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error al cerrar sesión", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Has cerrado sesión" });
    }
  };

  const value = {
    user,
    profile,
    loading,
    login,
    signup,
    logout,
    isAdmin: profile?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
