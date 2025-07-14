import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zspwhagjbcsiazyyydaw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcHdoYWdqYmNzaWF6eXl5ZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTcyMjcsImV4cCI6MjA2NjAzMzIyN30.DJ18OWXH9-I_7LrgLeA-atlfwJdkrFabh5wN7LTkRPM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function makeAdmin(email) {
  try {
    console.log(`🔍 Buscando usuario: ${email}`);
    
    // Primero verificar si el usuario existe en la tabla profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(10);
    
    console.log('📊 Usuarios existentes en profiles:', profiles);
    
    if (profilesError) {
      console.error('❌ Error verificando tabla profiles:', profilesError);
      return;
    }

    // Obtener usuarios de auth
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error obteniendo usuarios:', usersError);
      return;
    }

    console.log('👥 Usuarios en auth:', users?.map(u => ({ id: u.id, email: u.email })));
    
    // Buscar el usuario específico
    const user = users?.find(u => u.email === email);
    
    if (!user) {
      console.log('❌ Usuario no encontrado en auth');
      return;
    }

    console.log('✅ Usuario encontrado:', { id: user.id, email: user.email });

    // Verificar si ya existe en profiles
    const { data: existingProfile, error: existingError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (existingError && existingError.code !== 'PGRST116') {
      console.error('❌ Error verificando perfil existente:', existingError);
    }

    if (existingProfile) {
      console.log('📝 Perfil existente:', existingProfile);
      
      // Actualizar perfil existente
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id)
        .select();

      if (error) {
        console.error('❌ Error actualizando perfil:', error);
        return;
      }

      console.log('✅ Perfil actualizado:', data);
    } else {
      console.log('📝 Creando nuevo perfil...');
      
      // Crear nuevo perfil
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email,
          role: 'admin',
          avatar_url: null
        })
        .select();

      if (error) {
        console.error('❌ Error creando perfil:', error);
        return;
      }

      console.log('✅ Perfil creado:', data);
    }

    console.log(`🎉 Usuario ${email} convertido a admin exitosamente`);
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Uso: node tools/make-admin.js tu-email@ejemplo.com
const email = process.argv[2];
if (!email) {
  console.log('Uso: node tools/make-admin.js tu-email@ejemplo.com');
  process.exit(1);
}

makeAdmin(email); 