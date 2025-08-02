import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing:', {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey
    });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Función helper para manejar errores de Supabase
export const handleSupabaseError = (error) => {
    console.error('Supabase error:', error);
    return {
        success: false,
        error: error.message || 'Error desconocido'
    };
};

// Función helper para respuestas exitosas
export const handleSupabaseSuccess = (data) => {
    return {
        success: true,
        data
    };
};