const { query } = require('./config/database');

async function checkOrderItemsTable() {
  console.log('🔍 VERIFICANDO TABLA ORDER_ITEMS');
  console.log('='.repeat(40));
  
  try {
    // Verificar conexión
    const testQuery = await query('SELECT 1 as test');
    console.log('✅ Conexión a base de datos OK');
    
    // Verificar estructura de order_items
    console.log('\n📦 Estructura de tabla order_items:');
    try {
      const structure = await query('DESCRIBE order_items');
      console.log('📋 Columnas actuales:');
      structure.forEach(col => {
        console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
      });
      
      // Verificar algunos datos de ejemplo
      console.log('\n📊 Datos de ejemplo (últimas 3 entradas):');
      const sampleData = await query('SELECT * FROM order_items ORDER BY id DESC LIMIT 3');
      if (sampleData.length > 0) {
        console.table(sampleData);
      } else {
        console.log('📭 No hay datos en order_items');
      }
      
    } catch (error) {
      console.log('❌ Error accediendo a order_items:', error.message);
      
      // Crear la tabla si no existe
      console.log('\n🔧 Creando tabla order_items...');
      await query(`
        CREATE TABLE order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          product_id INT NOT NULL,
          product_name VARCHAR(255) NOT NULL,
          product_sku VARCHAR(100),
          quantity INT NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
      `);
      console.log('✅ Tabla order_items creada');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Ejecutar
checkOrderItemsTable()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
