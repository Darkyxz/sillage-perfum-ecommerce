// Script simple para verificar productos - ejecutar en consola del navegador
// Ve al admin, abre la consola (F12) y pega este código:

console.log('🔍 Verificando productos en Supabase...');

// Usar el supabase global si está disponible
if (window.supabase) {
  window.supabase
    .from('products')
    .select('name, category, sku, price')
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Error:', error);
        return;
      }
      
      console.log(`📊 Total productos: ${data.length}`);
      
      // Contar por categoría
      const categories = {};
      data.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + 1;
      });
      
      console.log('📋 Por categoría:');
      Object.entries(categories).forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} productos`);
      });
      
      // Mostrar algunos productos de home y body
      const homeProducts = data.filter(p => p.category === 'home');
      const bodyProducts = data.filter(p => p.category === 'body');
      
      console.log('\n🏠 Productos HOME (primeros 3):');
      homeProducts.slice(0, 3).forEach(p => {
        console.log(`   - ${p.name} (${p.sku}) - $${p.price}`);
      });
      
      console.log('\n💧 Productos BODY (primeros 3):');
      bodyProducts.slice(0, 3).forEach(p => {
        console.log(`   - ${p.name} (${p.sku}) - $${p.price}`);
      });
    });
} else {
  console.log('❌ Supabase no está disponible globalmente');
  console.log('💡 Intenta desde el panel de admin donde supabase está cargado');
}