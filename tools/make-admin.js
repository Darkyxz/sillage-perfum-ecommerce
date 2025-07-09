import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zspwhagjbcsiazyyydaw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcHdoYWdqYmNzaWF6eXl5ZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTcyMjcsImV4cCI6MjA2NjAzMzIyN30.DJ18OWXH9-I_7LrgLeA-atlfwJdkrFabh5wN7LTkRPM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function makeAdmin(email) {
  try {
    // Primero obtener el usuario por email
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (userError) {
      console.error('Error obteniendo usuario:', userError);
      return;
    }

    if (!user) {
      console.log('Usuario no encontrado');
      return;
    }

    // Actualizar el perfil para hacer admin
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);

    if (error) {
      console.error('Error actualizando perfil:', error);
      return;
    }

    console.log(`✅ Usuario ${email} convertido a admin exitosamente`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uso: node tools/make-admin.js tu-email@ejemplo.com
const email = process.argv[2];
if (!email) {
  console.log('Uso: node tools/make-admin.js tu-email@ejemplo.com');
  process.exit(1);
}

makeAdmin(email); 