const { query } = require('./config/database');

async function fixStockStatus() {
  console.log('🔧 CORRIGIENDO ESTADO DE STOCK');
  console.log('='.repeat(50));
  
  try {
    // Verificar conexión
    const testQuery = await query('SELECT 1 as test');
    console.log('✅ Conexión a base de datos OK');
    
    // Verificar si existe la columna in_stock
    const tableInfo = await query('DESCRIBE products');
    const columns = tableInfo.map(col => col.Field);
    
    if (!columns.includes('in_stock')) {
      console.log('➕ Agregando columna in_stock...');
      await query('ALTER TABLE products ADD COLUMN in_stock BOOLEAN DEFAULT TRUE');
      console.log('✅ Columna in_stock agregada');
    }
    
    // Contar productos con problemas de stock
    const problemProducts = await query(`
      SELECT COUNT(*) as total 
      FROM products 
      WHERE (stock_quantity > 0 AND in_stock = 0) OR (stock_quantity = 0 AND in_stock = 1)
    `);
    
    console.log(`📊 Productos con estado de stock incorrecto: ${problemProducts[0].total}`);
    
    // Mostrar algunos ejemplos
    const examples = await query(`
      SELECT id, name, sku, stock_quantity, in_stock 
      FROM products 
      WHERE (stock_quantity > 0 AND in_stock = 0) OR (stock_quantity = 0 AND in_stock = 1)
      LIMIT 5
    `);
    
    if (examples.length > 0) {
      console.log('\\n📦 Ejemplos de productos con problemas:');
      examples.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.sku})`);
        console.log(`   Stock: ${product.stock_quantity}, in_stock: ${product.in_stock}`);
      });
    }
    
    // Corregir el estado de stock
    console.log('\\n🔄 Corrigiendo estado de stock...');
    
    // Marcar como disponible los productos con stock > 0
    const availableResult = await query(`
      UPDATE products 
      SET in_stock = 1 
      WHERE stock_quantity > 0 AND in_stock = 0
    `);
    
    // Marcar como no disponible los productos con stock = 0
    const unavailableResult = await query(`
      UPDATE products 
      SET in_stock = 0 
      WHERE stock_quantity = 0 AND in_stock = 1
    `);
    
    console.log(`✅ ${availableResult.affectedRows} productos marcados como disponibles`);
    console.log(`✅ ${unavailableResult.affectedRows} productos marcados como no disponibles`);
    
    // Verificar resultado final
    const finalStats = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN in_stock = 1 THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN in_stock = 0 THEN 1 ELSE 0 END) as unavailable,
        SUM(CASE WHEN stock_quantity > 0 THEN 1 ELSE 0 END) as with_stock,
        SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as without_stock
      FROM products 
      WHERE is_active = 1
    `);
    
    const stats = finalStats[0];
    console.log('\\n📊 ESTADÍSTICAS FINALES:');
    console.log(`📦 Total productos activos: ${stats.total}`);
    console.log(`✅ Productos disponibles (in_stock=1): ${stats.available}`);
    console.log(`❌ Productos no disponibles (in_stock=0): ${stats.unavailable}`);
    console.log(`📈 Productos con stock > 0: ${stats.with_stock}`);
    console.log(`📉 Productos con stock = 0: ${stats.without_stock}`);
    
    // Mostrar algunos productos disponibles
    const sampleAvailable = await query(`
      SELECT name, sku, stock_quantity, in_stock 
      FROM products 
      WHERE is_active = 1 AND in_stock = 1 
      LIMIT 5
    `);
    
    console.log('\\n🛍️ Muestra de productos disponibles:');
    sampleAvailable.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.sku})`);
      console.log(`   Stock: ${product.stock_quantity}, Disponible: ${product.in_stock ? 'Sí' : 'No'}`);
    });
    
    console.log('\\n🎉 CORRECCIÓN COMPLETADA');
    return true;
    
  } catch (error) {
    console.error('❌ Error corrigiendo estado de stock:', error.message);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  fixStockStatus()
    .then((success) => {
      if (success) {
        console.log('\\n✅ ESTADO DE STOCK CORREGIDO EXITOSAMENTE');
        console.log('🛍️ Los productos ahora mostrarán correctamente su disponibilidad');
      } else {
        console.log('\\n❌ HUBO PROBLEMAS AL CORREGIR EL ESTADO DE STOCK');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { fixStockStatus };