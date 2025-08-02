const { query } = require('./config/database');

// Script simple para probar la conexión MySQL
async function testConnection() {
  console.log('🔌 PROBANDO CONEXIÓN MYSQL');
  console.log('='.repeat(40));
  
  try {
    console.log('🔄 Intentando conectar...');
    
    // Prueba básica de conexión
    const result = await query('SELECT 1 as test');
    
    console.log('✅ Conexión exitosa!');
    
    // Verificar base de datos actual
    const dbResult = await query('SELECT DATABASE() as current_db');
    console.log(`🗄️ Base de datos actual: ${dbResult[0].current_db}`);
    
    // Verificar si existe la tabla products
    const tableCheck = await query(`
      SELECT COUNT(*) as table_exists 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'products'
    `);
    
    if (tableCheck[0].table_exists > 0) {
      console.log('✅ Tabla "products" existe');
      
      // Contar productos
      const productCount = await query('SELECT COUNT(*) as total FROM products');
      console.log(`📦 Total de productos: ${productCount[0].total}`);
      
      const activeCount = await query('SELECT COUNT(*) as total FROM products WHERE is_active = 1');
      console.log(`✅ Productos activos: ${activeCount[0].total}`);
      
    } else {
      console.log('❌ Tabla "products" NO existe');
      console.log('💡 Ejecuta el script de setup de base de datos primero');
    }
    
    console.log('\n🎉 CONEXIÓN MYSQL FUNCIONANDO CORRECTAMENTE');
    return true;
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('💡 Verifica:');
    console.error('   - Que el túnel SSH esté activo');
    console.error('   - Las credenciales en .env');
    console.error('   - Que MySQL esté corriendo');
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { testConnection };