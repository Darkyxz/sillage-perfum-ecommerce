const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { query } = require('./config/database');

async function fixFeaturedProducts() {
  try {
    console.log('🔧 Arreglando productos destacados...\n');
    
    // Primero, quitar el destacado de todos los productos
    await query('UPDATE products SET is_featured = 0');
    console.log('🔄 Limpiando productos destacados existentes...');
    
    // Marcar productos destacados por categoría de manera equilibrada
    
    // 1. Productos de Mujer (15 productos destacados)
    await query(`
      UPDATE products 
      SET is_featured = 1 
      WHERE category = 'Mujer' AND is_active = 1 
      ORDER BY RAND() 
      LIMIT 15
    `);
    console.log('✅ Marcados 15 productos destacados de Mujer');
    
    // 2. Productos de Hombre (12 productos destacados)
    await query(`
      UPDATE products 
      SET is_featured = 1 
      WHERE category = 'Hombre' AND is_active = 1 
      ORDER BY RAND() 
      LIMIT 12
    `);
    console.log('✅ Marcados 12 productos destacados de Hombre');
    
    // 3. Productos de Hogar (8 productos destacados)
    await query(`
      UPDATE products 
      SET is_featured = 1 
      WHERE category = 'Hogar' AND is_active = 1 
      ORDER BY RAND() 
      LIMIT 8
    `);
    console.log('✅ Marcados 8 productos destacados de Hogar');
    
    // 4. Body Mist (5 productos destacados)
    await query(`
      UPDATE products 
      SET is_featured = 1 
      WHERE category = 'Body Mist' AND is_active = 1 
      ORDER BY RAND() 
      LIMIT 5
    `);
    console.log('✅ Marcados 5 productos destacados de Body Mist');
    
    // Verificar el resultado
    const featuredCount = await query('SELECT COUNT(*) as count FROM products WHERE is_featured = 1');
    console.log(`\n🌟 Total de productos destacados ahora: ${featuredCount[0].count}`);
    
    // Mostrar distribución por categoría
    const featuredByCategory = await query(`
      SELECT category, COUNT(*) as count 
      FROM products 
      WHERE is_featured = 1 AND is_active = 1 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    console.log('\n📊 Productos destacados por categoría:');
    featuredByCategory.forEach(cat => {
      console.log(`   ${cat.category}: ${cat.count} destacados`);
    });
    
    console.log('\n✅ ¡Productos destacados actualizados correctamente!');
    console.log('🚀 Ahora el endpoint /api/products/featured debería funcionar correctamente');
    
  } catch (error) {
    console.error('❌ Error arreglando productos destacados:', error);
  }
}

fixFeaturedProducts();