const { query } = require('./config/database');

async function makeUserAdmin() {
  console.log('👑 CONVIRTIENDO USUARIO EN ADMIN');
  console.log('='.repeat(50));
  
  try {
    // Verificar conexión
    const testQuery = await query('SELECT 1 as test');
    console.log('✅ Conexión a base de datos OK');
    
    // Buscar el usuario perfumsillage@gmail.com
    const email = 'perfumsillage@gmail.com';
    const users = await query('SELECT id, email, full_name, role FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      console.log(`❌ Usuario ${email} no encontrado`);
      console.log('📋 Usuarios disponibles:');
      const allUsers = await query('SELECT id, email, full_name, role FROM users LIMIT 10');
      allUsers.forEach(user => {
        console.log(`   ${user.id}. ${user.email} (${user.full_name}) - ${user.role}`);
      });
      return false;
    }
    
    const user = users[0];
    console.log(`👤 Usuario encontrado: ${user.email} (ID: ${user.id})`);
    console.log(`📊 Rol actual: ${user.role}`);
    
    if (user.role === 'admin') {
      console.log('✅ El usuario ya es admin');
      return true;
    }
    
    // Convertir en admin
    await query('UPDATE users SET role = ? WHERE id = ?', ['admin', user.id]);
    console.log(`✅ Usuario ${user.email} ahora es admin`);
    
    // Verificar el cambio
    const updatedUser = await query('SELECT id, email, full_name, role FROM users WHERE id = ?', [user.id]);
    console.log(`🔄 Rol actualizado: ${updatedUser[0].role}`);
    
    console.log('\n🎉 CONVERSIÓN COMPLETADA');
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  makeUserAdmin()
    .then((success) => {
      if (success) {
        console.log('\n✅ USUARIO CONVERTIDO EN ADMIN EXITOSAMENTE');
        console.log('👑 Ahora puedes acceder al panel de administración');
      } else {
        console.log('\n❌ HUBO PROBLEMAS AL CONVERTIR EL USUARIO');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { makeUserAdmin };