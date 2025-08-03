const { query } = require('./config/database');

async function analyzeProducts() {
  console.log('🔍 ANALIZANDO PRODUCTOS ACTUALES...\n');
  
  try {
    // Analizar algunos productos para ver la estructura
    const sampleProducts = await query(`
      SELECT id, name, sku, price, size, brand 
      FROM products 
      WHERE brand = "Zachary Perfumes" 
      ORDER BY id DESC 
      LIMIT 10
    `);
    
    console.log('📋 MUESTRA DE PRODUCTOS RECIENTES:');
    console.table(sampleProducts);
    
    // Analizar precios actuales
    const priceAnalysis = await query(`
      SELECT size, MIN(price) as min_price, MAX(price) as max_price, COUNT(*) as count
      FROM products 
      WHERE brand = "Zachary Perfumes" 
      GROUP BY size 
      ORDER BY CAST(SUBSTRING(size, 1, LENGTH(size)-2) AS UNSIGNED)
    `);
    
    console.log('\n💰 ANÁLISIS DE PRECIOS POR TAMAÑO:');
    console.table(priceAnalysis);
    
    // Detectar productos con nombres problemáticos
    const longNames = await query(`
      SELECT id, sku, LEFT(name, 100) as short_name
      FROM products 
      WHERE brand = "Zachary Perfumes" 
      AND LENGTH(name) > 60
      ORDER BY LENGTH(name) DESC
      LIMIT 10
    `);
    
    console.log('\n⚠️ PRODUCTOS CON NOMBRES LARGOS (POSIBLES DESCRIPCIONES):');
    console.table(longNames);
    
    // Contar productos por tamaño
    const sizeCount = await query(`
      SELECT size, COUNT(*) as count
      FROM products 
      WHERE brand = "Zachary Perfumes"
      GROUP BY size
      ORDER BY count DESC
    `);
    
    console.log('\n📊 DISTRIBUCIÓN POR TAMAÑOS:');
    console.table(sizeCount);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

analyzeProducts();
