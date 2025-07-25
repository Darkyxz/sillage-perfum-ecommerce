// Script para ejecutar en la consola del navegador
// Copia y pega este código en la consola del navegador (F12)

async function debugNewProducts() {
  try {
    console.log('🔍 Verificando productos en la base de datos...');
    
    // Obtener supabase desde el contexto global (si está disponible)
    const { supabase } = await import('./src/lib/supabase.js');
    
    // Obtener todos los productos
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Error obteniendo productos:', allError);
      return;
    }

    console.log(`📊 Total productos en BD: ${allProducts.length}`);
    
    // Verificar productos por categoría
    const categories = ['men', 'women', 'home', 'body', 'unisex'];
    categories.forEach(category => {
      const count = allProducts.filter(p => p.category === category).length;
      console.log(`   ${category}: ${count} productos`);
    });

    // Mostrar los últimos 10 productos agregados
    console.log('\n📋 ÚLTIMOS 10 PRODUCTOS AGREGADOS:');
    allProducts.slice(0, 10).forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category}) - $${product.price} - SKU: ${product.sku}`);
    });

    // Verificar productos de las nuevas categorías específicamente
    console.log('\n🏠 PRODUCTOS CATEGORÍA HOME:');
    const homeProducts = allProducts.filter(p => p.category === 'home');
    homeProducts.slice(0, 5).forEach(product => {
      console.log(`   - ${product.name} - $${product.price}`);
    });

    console.log('\n💧 PRODUCTOS CATEGORÍA BODY:');
    const bodyProducts = allProducts.filter(p => p.category === 'body');
    bodyProducts.slice(0, 5).forEach(product => {
      console.log(`   - ${product.name} - $${product.price}`);
    });

    // Verificar si hay productos con códigos específicos de los nuevos
    const newProductCodes = ['ZPT-SUN', 'ZPT-MID', 'ZBM-VAN', 'ZHS-VER'];
    console.log('\n🔍 VERIFICANDO CÓDIGOS ESPECÍFICOS:');
    
    for (const code of newProductCodes) {
      const found = allProducts.filter(p => p.sku && p.sku.startsWith(code));
      console.log(`   ${code}: ${found.length} variantes encontradas`);
      if (found.length > 0) {
        found.forEach(variant => {
          console.log(`     - ${variant.sku}: ${variant.name}`);
        });
      }
    }

    return allProducts;
  } catch (error) {
    console.error('❌ Error en verificación:', error);
    throw error;
  }
}

// Ejecutar verificación
debugNewProducts()
  .then(() => console.log('✅ Verificación completada'))
  .catch(error => console.error('❌ Error:', error));