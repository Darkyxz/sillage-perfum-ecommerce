const { query } = require('./config/database');

async function analyzeProducts() {
  console.log('🔍 ANALIZANDO PRODUCTOS ACTUALES...\n');
  let hasError = false;
  let errorMessages = [];
  try {
    // Analizar algunos productos para ver la estructura
    const sampleProducts = await query(`
      SELECT id, name, sku, price, size, brand 
      FROM products 
      WHERE brand = "Sillage Perfum" 
      ORDER BY id DESC 
      LIMIT 10
    `);

    console.log('📋 MUESTRA DE PRODUCTOS RECIENTES:');
    console.table(sampleProducts);

    // Analizar precios actuales
    const priceAnalysis = await query(`
      SELECT size, MIN(price) as min_price, MAX(price) as max_price, COUNT(*) as count
      FROM products 
      WHERE brand = "Sillage Perfum" 
      GROUP BY size 
      ORDER BY CAST(SUBSTRING(size, 1, LENGTH(size)-2) AS UNSIGNED)
    `);

    console.log('\n💰 ANÁLISIS DE PRECIOS POR TAMAÑO:');
    console.table(priceAnalysis);

    // Validar precios por tamaño (ejemplo de rango esperado)
    const expectedPriceRanges = {
      '30ml': { min: 8000, max: 10000 },
      '50ml': { min: 12000, max: 15000 },
      '100ml': { min: 17000, max: 20000 },
      '200ml': { min: 7000, max: 8000 },
      '120ml': { min: 6000, max: 6000 }
    };
    for (const row of priceAnalysis) {
      const size = row.size;
      const range = expectedPriceRanges[size];
      if (!range) {
        hasError = true;
        errorMessages.push(`Tamaño inesperado encontrado en precios: ${size}`);
        continue;
      }
      if (row.min_price < range.min || row.max_price > range.max) {
        hasError = true;
        errorMessages.push(`Precios fuera de rango para ${size}: min ${row.min_price}, max ${row.max_price} (esperado entre ${range.min}-${range.max})`);
      }
    }

    // Detectar productos con nombres problemáticos
    const longNames = await query(`
      SELECT id, sku, LEFT(name, 100) as short_name
      FROM products 
      WHERE brand = "Sillage Perfum" 
      AND LENGTH(name) > 60
      ORDER BY LENGTH(name) DESC
      LIMIT 10
    `);

    console.log('\n⚠️ PRODUCTOS CON NOMBRES LARGOS (POSIBLES DESCRIPCIONES):');
    console.table(longNames);
    if (longNames.length > 0) {
      hasError = true;
      errorMessages.push(`Se encontraron ${longNames.length} productos con nombres excesivamente largos (posibles errores de carga o descripción en campo nombre).`);
    }

    // Contar productos por tamaño
    const sizeCount = await query(`
      SELECT size, COUNT(*) as count
      FROM products 
      WHERE brand = "Sillage Perfum"
      GROUP BY size
      ORDER BY count DESC
    `);

    console.log('\n📊 DISTRIBUCIÓN POR TAMAÑOS:');
    console.table(sizeCount);
    // Validar que solo existan tamaños esperados
    const validSizes = ['30ml', '50ml', '100ml', '120ml', '200ml'];
    for (const row of sizeCount) {
      if (!validSizes.includes(row.size)) {
        hasError = true;
        errorMessages.push(`Tamaño inesperado en distribución: ${row.size}`);
      }
    }

  } catch (error) {
    hasError = true;
    errorMessages.push('❌ Error inesperado: ' + error.message);
  }

  if (hasError) {
    console.error('\n❌ TEST DE PRODUCTOS FALLIDO');
    for (const msg of errorMessages) {
      console.error('  - ' + msg);
    }
    process.exit(1);
  } else {
    console.log('\n✅ TEST DE PRODUCTOS EXITOSO: Todos los checks pasaron.');
    process.exit(0);
  }
}

analyzeProducts();
