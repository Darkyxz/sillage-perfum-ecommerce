const { query } = require('./config/database');

async function activateProducts() {
  console.log('🔄 ACTIVANDO PRODUCTOS INACTIVOS');
  console.log('='.repeat(50));
  
  try {
    // Verificar conexión
    const testQuery = await query('SELECT 1 as test');
    console.log('✅ Conexión a base de datos OK');
    
    // Contar productos inactivos
    const inactiveResult = await query('SELECT COUNT(*) as total FROM products WHERE is_active = 0');
    const inactiveCount = inactiveResult[0].total;
    
    console.log(`📊 Productos inactivos encontrados: ${inactiveCount}`);
    
    if (inactiveCount === 0) {
      console.log('✅ No hay productos inactivos para activar');
      return true;
    }
    
    // Mostrar productos inactivos
    const inactiveProducts = await query('SELECT id, name, sku FROM products WHERE is_active = 0 LIMIT 10');
    console.log('\n📦 Productos inactivos:');
    inactiveProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.sku})`);
    });
    
    // Activar todos los productos inactivos
    console.log('\n🔄 Activando productos...');
    const result = await query('UPDATE products SET is_active = 1 WHERE is_active = 0');
    
    console.log(`✅ ${result.affectedRows} productos activados exitosamente`);
    
    // Verificar resultado
    const activeResult = await query('SELECT COUNT(*) as total FROM products WHERE is_active = 1');
    const newActiveCount = activeResult[0].total;
    
    console.log(`📊 Productos activos ahora: ${newActiveCount}`);
    
    // Mostrar algunos productos activados
    const sampleActive = await query('SELECT name, price, sku FROM products WHERE is_active = 1 LIMIT 5');
    console.log('\n🛍️ Muestra de productos activos:');
    sampleActive.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.sku})`);
    });
    
    console.log('\n🎉 ACTIVACIÓN COMPLETADA');
    return true;
    
  } catch (error) {
    console.error('❌ Error activando productos:', error.message);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  activateProducts()
    .then((success) => {
      if (success) {
        console.log('\n✅ TODOS LOS PRODUCTOS HAN SIDO ACTIVADOS');
        console.log('🛍️ Los productos ahora aparecerán disponibles en tu tienda');
      } else {
        console.log('\n❌ HUBO PROBLEMAS AL ACTIVAR LOS PRODUCTOS');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { activateProducts };