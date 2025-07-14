import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zspwhagjbcsiazyyydaw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcHdoYWdqYmNzaWF6eXl5ZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTcyMjcsImV4cCI6MjA2NjAzMzIyN30.DJ18OWXH9-I_7LrgLeA-atlfwJdkrFabh5wN7LTkRPM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function makeAdminByEmail(email) {
  try {
    console.log(`🔍 Buscando usuario con email: ${email}`);
    
    // Primero verificar si la tabla profiles existe
    const { data: testProfiles, error: testError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error accediendo a tabla profiles:', testError);
      console.log('📝 Creando tabla profiles...');
      
      // Intentar crear la tabla profiles
      const { error: createError } = await supabase.rpc('create_profiles_table');
      
      if (createError) {
        console.error('❌ Error creando tabla profiles:', createError);
        console.log('⚠️  La tabla profiles no existe y no se puede crear automáticamente.');
        console.log('   Debes crear la tabla manualmente en Supabase con la siguiente estructura:');
        console.log(`
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
        `);
        return;
      }
    }
    
    console.log('✅ Tabla profiles accesible');
    
    // Verificar todos los perfiles existentes
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('*');
    
    if (allError) {
      console.error('❌ Error obteniendo perfiles:', allError);
      return;
    }
    
    console.log('📊 Perfiles existentes:', allProfiles);
    
    // Buscar usuario por email en los perfiles existentes
    const existingProfile = allProfiles?.find(p => p.full_name === email || p.id === email);
    
    if (existingProfile) {
      console.log('📝 Perfil encontrado:', existingProfile);
      
      // Actualizar perfil existente
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', existingProfile.id)
        .select();

      if (error) {
        console.error('❌ Error actualizando perfil:', error);
        return;
      }

      console.log('✅ Perfil actualizado:', data);
      console.log(`🎉 Usuario ${email} convertido a admin exitosamente`);
    } else {
      console.log('❌ No se encontró un perfil para el email:', email);
      console.log('💡 Opciones:');
      console.log('   1. Asegúrate de que el usuario se haya registrado en la aplicación');
      console.log('   2. Verifica que el email sea correcto');
      console.log('   3. El usuario debe iniciar sesión al menos una vez para crear su perfil');
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Crear función para insertar perfil manualmente
async function createProfileManually(email) {
  try {
    console.log(`📝 Creando perfil manualmente para: ${email}`);
    
    // Generar un UUID aleatorio (simplificado)
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    
    const newProfile = {
      id: generateUUID(),
      full_name: email,
      role: 'admin',
      avatar_url: null
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select();
    
    if (error) {
      console.error('❌ Error creando perfil manual:', error);
      return;
    }
    
    console.log('✅ Perfil creado manualmente:', data);
    
  } catch (error) {
    console.error('💥 Error creando perfil manual:', error);
  }
}

// Uso del script
const email = process.argv[2];
const action = process.argv[3];

if (!email) {
  console.log('Uso: node tools/make-admin-simple.js tu-email@ejemplo.com [create]');
  console.log('');
  console.log('Ejemplos:');
  console.log('  node tools/make-admin-simple.js danielvleonf@gmail.com');
  console.log('  node tools/make-admin-simple.js danielvleonf@gmail.com create');
  process.exit(1);
}

if (action === 'create') {
  createProfileManually(email);
} else {
  makeAdminByEmail(email);
}
