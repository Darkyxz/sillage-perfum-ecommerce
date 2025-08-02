const { query } = require('./config/database');

async function fixOrderItemsTable() {
  console.log('🔧 ARREGLANDO TABLA ORDER_ITEMS');
  console.log('='.repeat(50));
  
  try {
    // Verificar conexión
    const testQuery = await query('SELECT 1 as test');
    console.log('✅ Conexión a base de datos OK');
    
    // Verificar si la tabla existe
    try {
      const currentColumns = await query('DESCRIBE order_items');
      const columnNames = currentColumns.map(col => col.Field);
      console.log('📊 Columnas actuales en order_items:', columnNames.join(', '));
      
      // Columnas requeridas
      const requiredColumns = [
        { name: 'product_name', type: 'VARCHAR(255) NOT NULL' },
        { name: 'product_sku', type: 'VARCHAR(100) NOT NULL' },
        { name: 'unit_price', type: 'DECIMAL(10,2) NOT NULL' },
        { name: 'total_price', type: 'DECIMAL(10,2) NOT NULL' }
      ];
      
      // Agregar columnas faltantes
      for (const col of requiredColumns) {
        if (!columnNames.includes(col.name)) {
          console.log(`➕ Agregando columna ${col.name}...`);
          await query(`ALTER TABLE order_items ADD COLUMN ${col.name} ${col.type}`);
          console.log(`✅ Columna ${col.name} agregada`);
        } else {
          console.log(`✅ Columna ${col.name} ya existe`);
        }
      }
      
    } catch (error) {
      console.log('📦 Tabla order_items no existe, creándola...');
      await query(`
        CREATE TABLE order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          product_id INT NOT NULL,
          product_name VARCHAR(255) NOT NULL,
          product_sku VARCHAR(100) NOT NULL,
          quantity INT NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
      `);
      console.log('✅ Tabla order_items creada');
    }
    
    // Verificar estructura final
    console.log('\n📋 Verificando estructura final...');
    const finalColumns = await query('DESCRIBE order_items');
    console.log('📊 Columnas finales en order_items:');
    finalColumns.forEach(col => {
      console.log(`   ${col.Field} - ${col.Type} - ${col.Null} - ${col.Key} - ${col.Default}`);
    });
    
    console.log('\n🎉 TABLA ORDER_ITEMS ARREGLADA');
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  fixOrderItemsTable()
    .then((success) => {
      if (success) {
        console.log('\n✅ TABLA ORDER_ITEMS CORREGIDA EXITOSAMENTE');
        console.log('🛍️ Ahora el checkout debería funcionar completamente');
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

module.exports = { fixOrderItemsTable };