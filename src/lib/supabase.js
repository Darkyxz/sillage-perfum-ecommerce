
import { createClient } from '@supabase/supabase-js';
import safeStorage from '@/utils/storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

// Configurar Supabase para que funcione sin localStorage usando nuestro safeStorage
const supabaseOptions = {
  auth: {
    storage: {
      getItem: (key) => {
        return safeStorage.getItem(key);
      },
      setItem: (key, value) => {
        safeStorage.setItem(key, value);
      },
      removeItem: (key) => {
        safeStorage.removeItem(key);
      }
    },
    autoRefreshToken: true,
    persistSession: safeStorage.isStorageAvailable(), // Solo persistir si hay storage disponible
    detectSessionInUrl: true
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Función para verificar y crear la tabla profiles si no existe
export const initializeDatabase = async () => {
  try {
    // Verificar si la tabla profiles existe
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      console.log('La tabla profiles no existe. Creándola...');
      // Aquí podrías ejecutar SQL para crear la tabla
      // Por ahora, solo mostraremos un mensaje
      console.log('Por favor, crea la tabla profiles en Supabase con las siguientes columnas:');
      console.log('- id (uuid, primary key)');
      console.log('- full_name (text)');
      console.log('- avatar_url (text, nullable)');
      console.log('- role (text, default: "user")');
      console.log('- created_at (timestamp, default: now())');
      console.log('- updated_at (timestamp, default: now())');
    }
  } catch (error) {
    console.error('Error verificando la base de datos:', error);
  }
};
