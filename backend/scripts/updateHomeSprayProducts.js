const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateHomeSprayProducts() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'srv1918.hstgr.io',
    user: process.env.DB_USER || 'u172702780_AdminSillage',
    password: process.env.DB_PASS || 'M0nkey12345!',
    database: process.env.DB_NAME || 'u172702780_Sillagep'
  });

  try {
    console.log('🏠 Actualizando productos Home Spray...');

    // Primero, obtenemos todos los productos de categoría Home Spray, Hogar o Home Spray
    const [homeSprayProducts] = await connection.execute(`
      SELECT id, sku, name, category, size, price 
      FROM products 
      WHERE category IN ('Home Spray', 'Hogar', 'home spray', 'HOME SPRAY')
         OR name LIKE '%Home Spray%'
         OR name LIKE '%home spray%'
    `);

    console.log(`📦 Encontrados ${homeSprayProducts.length} productos Home Spray`);

    for (const product of homeSprayProducts) {
      console.log(`\n🔄 Procesando: ${product.name} (SKU: ${product.sku})`);
      console.log(`   Precio actual: $${product.price}, Tamaño actual: ${product.size}`);

      // Actualizar el producto principal con precio fijo y tamaño 200ml
      await connection.execute(
        `UPDATE products 
         SET price = 7500, 
             size = '200ml',
             category = 'Home Spray'
         WHERE id = ?`,
        [product.id]
      );

      console.log(`   ✅ Actualizado a: Precio $7500, Tamaño 200ml`);

      // Si el SKU tiene indicador de tamaño, actualizarlo
      const updatedSku = product.sku.replace(/-\d+ML$/i, '-200ML');
      if (updatedSku !== product.sku) {
        await connection.execute(
          `UPDATE products SET sku = ? WHERE id = ?`,
          [updatedSku, product.id]
        );
        console.log(`   ✅ SKU actualizado: ${product.sku} → ${updatedSku}`);
      }
    }

    // Eliminar duplicados de otros tamaños para productos Home Spray
    console.log('\n🗑️  Eliminando variantes de tamaño no deseadas...');
    
    // Obtener SKUs base de productos Home Spray
    const [baseSKUs] = await connection.execute(`
      SELECT DISTINCT SUBSTRING_INDEX(sku, '-', 1) as base_sku
      FROM products 
      WHERE category = 'Home Spray'
    `);

    for (const { base_sku } of baseSKUs) {
      // Eliminar todas las variantes excepto 200ML
      const [deleteResult] = await connection.execute(`
        DELETE FROM products 
        WHERE sku LIKE ? 
          AND sku NOT LIKE '%-200ML'
          AND category = 'Home Spray'`,
        [`${base_sku}%`]
      );

      if (deleteResult.affectedRows > 0) {
        console.log(`   🗑️  Eliminadas ${deleteResult.affectedRows} variantes de ${base_sku}`);
      }
    }

    console.log('\n✅ Actualización de productos Home Spray completada');

    // Mostrar resumen final
    const [finalCount] = await connection.execute(`
      SELECT COUNT(*) as total, 
             COUNT(DISTINCT SUBSTRING_INDEX(sku, '-', 1)) as unique_products
      FROM products 
      WHERE category = 'Home Spray'
    `);

    console.log(`\n📊 Resumen final:`);
    console.log(`   - Total productos Home Spray: ${finalCount[0].total}`);
    console.log(`   - Productos únicos: ${finalCount[0].unique_products}`);
    console.log(`   - Todos con precio: $7500`);
    console.log(`   - Todos con tamaño: 200ml`);

  } catch (error) {
    console.error('❌ Error actualizando productos:', error);
  } finally {
    await connection.end();
  }
}

// Ejecutar el script
updateHomeSprayProducts();
