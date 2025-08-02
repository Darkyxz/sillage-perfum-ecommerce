const { query } = require('./config/database');

async function fixOrdersTable() {
  console.log('🔧 ARREGLANDO TABLA ORDERS');
  console.log('='.repeat(50));
  
  try {
    // Verificar conexión
    const testQuery = await query('SELECT 1 as test');
    console.log('✅ Conexión a base de datos OK');
    
    // Verificar estructura actual de orders
    console.log('\n📋 Verificando estructura actual de orders...');
    const currentColumns = await query('DESCRIBE orders');
    const columnNames = currentColumns.map(col => col.Field);
    console.log('📊 Columnas actuales:', columnNames.join(', '));
    
    // Columnas requeridas
    const requiredColumns = [
      { name: 'shipping_city', type: 'VARCHAR(100)' },
      { name: 'shipping_region', type: 'VARCHAR(100)' },
      { name: 'shipping_postal_code', type: 'VARCHAR(10)' },
      { name: 'notes', type: 'TEXT' }
    ];
    
    // Agregar columnas faltantes
    for (const col of requiredColumns) {
      if (!columnNames.includes(col.name)) {
        console.log(`➕ Agregando columna ${col.name}...`);
        await query(`ALTER TABLE orders ADD COLUMN ${col.name} ${col.type}`);
        console.log(`✅ Columna ${col.name} agregada`);
      } else {
        console.log(`✅ Columna ${col.name} ya existe`);
      }
    }
    
    // Verificar estructura final
    console.log('\n📋 Verificando estructura final...');
    const finalColumns = await query('DESCRIBE orders');
    console.log('📊 Columnas finales:');
    finalColumns.forEach(col => {
      console.log(`   ${col.Field} - ${col.Type} - ${col.Null} - ${col.Key} - ${col.Default}`);
    });
    
    console.log('\n🎉 TABLA ORDERS ARREGLADA');
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  fixOrdersTable()
    .then((success) => {
      if (success) {
        console.log('\n✅ TABLA ORDERS CORREGIDA EXITOSAMENTE');
        console.log('🛍️ Ahora el checkout debería funcionar');
      } else {
        console.log('\n❌ HUBO PROBLEMAS AL CORREGIR LA TABLA');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { fixOrdersTable };