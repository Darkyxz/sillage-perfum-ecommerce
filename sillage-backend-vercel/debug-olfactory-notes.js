const { query } = require('./config/database');

async function debugOlfactoryNotes() {
  console.log('🔍 DEPURANDO NOTAS OLFATIVAS DE LOS PRODUCTOS...\n');
  try {
    // Seleccionar 10 productos al azar para ver sus notas olfativas
    const sampleProducts = await query(`
      SELECT 
        id, 
        name, 
        sku, 
        fragrance_profile, 
        fragrance_notes_middle, 
        fragrance_notes_base
      FROM products 
      ORDER BY RAND()
      LIMIT 10
    `);

    if (sampleProducts.length === 0) {
      console.log('No se encontraron productos para analizar.');
      process.exit(0);
    }

    console.log('📋 MUESTRA DE NOTAS OLFATIVAS EN PRODUCTOS ALEATORIOS:');
    
    // Imprimir los datos de una manera más legible que console.table para campos largos
    sampleProducts.forEach(product => {
      console.log('--------------------------------------------------');
      console.log(`Producto: ${product.name} (SKU: ${product.sku})`);
      console.log('--------------------------------------------------');
      console.log('Notas de Salida (fragrance_profile):', product.fragrance_profile);
      console.log('Notas de Corazón (fragrance_notes_middle):', product.fragrance_notes_middle);
      console.log('Notas de Base (fragrance_notes_base):', product.fragrance_notes_base);
      console.log('\n');
    });

    // Verificar el tipo de dato de las columnas de notas
    const firstProduct = sampleProducts[0];
    console.log('🕵️  ANÁLISIS DEL TIPO DE DATO (PRIMER PRODUCTO):');
    console.log(`- typeof fragrance_profile: ${typeof firstProduct.fragrance_profile}`);
    console.log(`- typeof fragrance_notes_middle: ${typeof firstProduct.fragrance_notes_middle}`);
    console.log(`- typeof fragrance_notes_base: ${typeof firstProduct.fragrance_notes_base}`);
    
    console.log('\n✅ Script de depuración finalizado.');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA DEPURACIÓN:');
    console.error(error.message);
    process.exit(1);
  }
}

debugOlfactoryNotes();
