const { query } = require('./config/database');

async function verifyProducts() {
  try {
    console.log('🔍 VERIFICANDO PRODUCTOS CORREGIDOS...\n');

    // Verificar productos con nombres corregidos
    const products = await query(`
      SELECT sku, name, price, size 
      FROM products 
      WHERE brand = "Sillage Perfum" 
      ORDER BY sku 
      LIMIT 15
    `);

    console.log('📋 PRODUCTOS CORREGIDOS (muestra):');
    console.table(products);

    // Verificar precios únicos por tamaño
    const priceCheck = await query(`
      SELECT size, price, COUNT(*) as count
      FROM products 
      WHERE brand = "Sillage Perfum"
      GROUP BY size, price
      ORDER BY size
    `);

    console.log('\n💰 VERIFICACIÓN DE PRECIOS FINALES:');
    console.table(priceCheck);

    // Contar productos únicos por SKU base
    const uniqueCount = await query(`
      SELECT COUNT(DISTINCT SUBSTRING_INDEX(sku, '-', 1)) as unique_skus
      FROM products 
      WHERE brand = "Sillage Perfum"
    `);

    console.log(`\n📊 TOTAL SKUs ÚNICOS: ${uniqueCount[0].unique_skus}`);
    console.log('✅ Sistema listo para selector dinámico de ML/precio');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyProducts();
