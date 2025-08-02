const { query } = require('./config/database');

// Script para hacer admin a un usuario específico
async function makeUserAdmin(email) {
  console.log('🔧 SCRIPT PARA HACER ADMIN A USUARIO');
  console.log('='.repeat(50));
  
  try {
    // Verificar conexión
    const testQuery = await query('SELECT 1 as test');
    console.log('✅ Conexión a base de datos OK');
    
    // Buscar el usuario por email
    console.log(`🔍 Buscando usuario: ${email}`);
    const users = await query('SELECT id, email, full_name, role FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      console.log('❌ Usuario no encontrado');
      console.log('💡 Asegúrate de que el usuario se haya registrado primero');
      return false;
    }
    
    const user = users[0];
    console.log('👤 Usuario encontrado:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nombre: ${user.full_name}`);
    console.log(`   Rol actual: ${user.role}`);
    
    if (user.role === 'admin') {
      console.log('✅ El usuario ya es admin');
      return true;
    }
    
    // Actualizar rol a admin
    console.log('🔄 Actualizando rol a admin...');
    const result = await query(
      'UPDATE users SET role = ? WHERE id = ?',
      ['admin', user.id]
    );
    
    if (result.affectedRows > 0) {
      console.log('✅ Usuario actualizado exitosamente');
      console.log(`🎉 ${user.email} ahora es ADMIN`);
      
      // Verificar el cambio
      const updatedUser = await query('SELECT email, role FROM users WHERE id = ?', [user.id]);
      console.log('✅ Verificación:');
      console.log(`   Email: ${updatedUser[0].email}`);
      console.log(`   Nuevo rol: ${updatedUser[0].role}`);
      
      return true;
    } else {
      console.log('❌ No se pudo actualizar el usuario');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Función para listar todos los admins
async function listAdmins() {
  console.log('👥 LISTADO DE ADMINISTRADORES');
  console.log('='.repeat(50));
  
  try {
    const admins = await query(
      'SELECT id, email, full_name, created_at FROM users WHERE role = ? ORDER BY created_at',
      ['admin']
    );
    
    if (admins.length === 0) {
      console.log('❌ No hay administradores registrados');
      return;
    }
    
    console.log(`✅ Encontrados ${admins.length} administrador(es):`);
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email} (${admin.full_name}) - Creado: ${admin.created_at}`);
    });
    
  } catch (error) {
    console.error('❌ Error listando admins:', error.message);
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const email = args[1];
  
  if (command === 'make-admin' && email) {
    await makeUserAdmin(email);
  } else if (command === 'list-admins') {
    await listAdmins();
  } else if (command === 'make-perfumsillage-admin') {
    // Comando específico para hacer admin a perfumsillage@gmail.com
    await makeUserAdmin('perfumsillage@gmail.com');
  } else {
    console.log('🔧 SCRIPT DE ADMINISTRACIÓN DE USUARIOS');
    console.log('='.repeat(50));
    console.log('');
    console.log('Uso:');
    console.log('  node make-admin.js make-admin <email>           - Hacer admin a un usuario');
    console.log('  node make-admin.js make-perfumsillage-admin     - Hacer admin a perfumsillage@gmail.com');
    console.log('  node make-admin.js list-admins                  - Listar todos los admins');
    console.log('');
    console.log('Ejemplos:');
    console.log('  node make-admin.js make-admin usuario@ejemplo.com');
    console.log('  node make-admin.js make-perfumsillage-admin');
    console.log('  node make-admin.js list-admins');
  }
  
  process.exit(0);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error ejecutando script:', error.message);
    process.exit(1);
  });
}

module.exports = { makeUserAdmin, listAdmins };