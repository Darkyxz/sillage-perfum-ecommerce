const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { query } = require('./config/database');

async function checkProductsStatus() {
  try {
    console.log('🔍 Verificando estado de los productos...\n');
    
    // Total de productos
    const totalProducts = await query('SELECT COUNT(*) as count FROM products');
    console.log('📊 Total de productos en DB:', totalProducts[0].count);
    
    // Productos activos
    const activeProducts = await query('SELECT COUNT(*) as count FROM products WHERE is_active = 1');
    console.log('✅ Productos activos:', activeProducts[0].count);
    
    // Productos inactivos
    const inactiveProducts = await query('SELECT COUNT(*) as count FROM products WHERE is_active = 0');
    console.log('❌ Productos inactivos:', inactiveProducts[0].count);
    
    // Productos destacados
    const featuredProducts = await query('SELECT COUNT(*) as count FROM products WHERE is_featured = 1');
    console.log('⭐ Productos destacados:', featuredProducts[0].count);
    
    // Productos destacados y activos
    const activeFeatured = await query('SELECT COUNT(*) as count FROM products WHERE is_featured = 1 AND is_active = 1');
    console.log('🌟 Productos destacados y activos:', activeFeatured[0].count);
    
    // Categorías
    const categories = await query('SELECT category, COUNT(*) as count FROM products WHERE is_active = 1 GROUP BY category ORDER BY count DESC');
    console.log('\n📂 Productos por categoría:');
    categories.forEach(cat => {
      console.log(`   ${cat.category || 'Sin categoría'}: ${cat.count}`);
    });
    
    // Algunos productos de ejemplo
    const sampleProducts = await query('SELECT id, name, sku, is_active, is_featured, category FROM products LIMIT 10');
    console.log('\n📝 Muestra de productos:');
    sampleProducts.forEach(product => {
      console.log(`   ${product.id}: ${product.name} (${product.sku}) - Activo: ${product.is_active}, Destacado: ${product.is_featured}, Categoría: ${product.category || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('❌ Error verificando productos:', error);
  }
}

checkProductsStatus();