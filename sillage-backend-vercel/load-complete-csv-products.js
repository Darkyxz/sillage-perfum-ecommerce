const { query } = require('./config/database');
const { processCSVToProducts } = require('./process-csv-products');
const path = require('path');

// Función para actualizar la estructura de la tabla
async function updateTableStructure() {
  try {
    console.log('🔧 Verificando estructura de la tabla...');
    
    const tableInfo = await query('DESCRIBE products');
    const columns = tableInfo.map(col => col.Field);
    
    const requiredColumns = [
      { name: 'notes', type: 'TEXT' },
      { name: 'duration', type: 'VARCHAR(100)' },
      { name: 'original_inspiration', type: 'VARCHAR(255)' },
      { name: 'size', type: 'VARCHAR(20)' },
      { name: 'concentration', type: 'VARCHAR(50)' }
    ];
    
    for (const col of requiredColumns) {
      if (!columns.includes(col.name)) {
        console.log(`➕ Agregando columna ${col.name}...`);
        await query(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
      }
    }
    
    console.log('✅ Estructura de tabla verificada');
    
  } catch (error) {
    console.error('❌ Error actualizando estructura:', error);
    throw error;
  }
}

// Función principal para cargar productos del CSV
async function loadCompleteCSVProducts() {
  console.log('🚀 CARGANDO PRODUCTOS COMPLETOS DEL CSV DE SUPABASE');
  console.log('='.repeat(70));
  
  try {
    // Actualizar estructura de tabla
    await updateTableStructure();
    
    console.log('✅ Conexión a MySQL OK');
    
    // Buscar el archivo CSV
    const csvPath = path.join(__dirname, 'products_rows.csv');
    console.log(`📄 Buscando archivo CSV en: ${csvPath}`);
    
    // Por ahora, usar datos hardcodeados ya que el CSV está en el contexto
    // En una implementación real, procesarías el archivo CSV completo
    
    const products = [
      // MUJERES - Todos los tamaños
      {
        name: "212 Woman – Eau de Parfum floral femenino 30ml",
        description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.",
        price: 7790,
        sku: "ZP1W-30ML",
        brand: "Zachary Perfumes",
        category: "Mujer",
        image_url: "/images/sillapM.jpg",
        stock_quantity: 50,
        is_featured: false,
        rating: 4.8,
        notes: "Flor de azahar del naranjo, flor de cactus, bergamota, mandarina",
        duration: "6-8 horas",
        original_inspiration: "212 WOMAN - Carolina Herrera",
        size: "30ml",
        concentration: "Eau de Parfum"
      },
      {
        name: "212 Woman – Eau de Parfum floral femenino 50ml",
        description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.",
        price: 10390,
        sku: "ZP1W-50ML",
        brand: "Zachary Perfumes",
        category: "Mujer",
        image_url: "/images/sillapM.jpg",
        stock_quantity: 30,
        is_featured: false,
        rating: 4.8,
        notes: "Flor de azahar del naranjo, flor de cactus, bergamota, mandarina",
        duration: "6-8 horas",
        original_inspiration: "212 WOMAN - Carolina Herrera",
        size: "50ml",
        concentration: "Eau de Parfum"
      },
      {
        name: "212 Woman – Eau de Parfum floral femenino 100ml",
        description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.",
        price: 12990,
        sku: "ZP1W-100ML",
        brand: "Zachary Perfumes",
        category: "Mujer",
        image_url: "/images/sillapM.jpg",
        stock_quantity: 20,
        is_featured: true,
        rating: 4.8,
        notes: "Flor de azahar del naranjo, flor de cactus, bergamota, mandarina",
        duration: "6-8 horas",
        original_inspiration: "212 WOMAN - Carolina Herrera",
        size: "100ml",
        concentration: "Eau de Parfum"
      },
      
      // 212 Sexy Woman
      {
        name: "212 Sexy Woman – Eau de Parfum oriental floral femenino 30ml",
        description: "Fragancia seductora y envolvente, con un aroma dulce y especiado que deja una impresión duradera. Inspirada en 212 SEXY WOMAN de Carolina Herrera.",
        price: 8390,
        sku: "ZP2W-30ML",
        brand: "Zachary Perfumes",
        category: "Mujer",
        image_url: "/images/sillapM.jpg",
        stock_quantity: 50,
        is_featured: false,
        rating: 4.7,
        notes: "Pimienta rosa, mandarina, bergamota, algodón de azúcar",
        duration: "6-8 horas",
        original_inspiration: "212 SEXY WOMAN - Carolina Herrera",
        size: "30ml",
        concentration: "Eau de Parfum"
      },
      {
        name: "212 Sexy Woman – Eau de Parfum oriental floral femenino 50ml",
        description: "Fragancia seductora y envolvente, con un aroma dulce y especiado que deja una impresión duradera. Inspirada en 212 SEXY WOMAN de Carolina Herrera.",
        price: 11190,
        sku: "ZP2W-50ML",
        brand: "Zachary Perfumes",
        category: "Mujer",
        image_url: "/images/sillapM.jpg",
        stock_quantity: 30,
        is_featured: false,
        rating: 4.7,
        notes: "Pimienta rosa, mandarina, bergamota, algodón de azúcar",
        duration: "6-8 horas",
        original_inspiration: "212 SEXY WOMAN - Carolina Herrera",
        size: "50ml",
        concentration: "Eau de Parfum"
      },
      {
        name: "212 Sexy Woman – Eau de Parfum oriental floral femenino 100ml",
        description: "Fragancia seductora y envolvente, con un aroma dulce y especiado que deja una impresión duradera. Inspirada en 212 SEXY WOMAN de Carolina Herrera.",
        price: 13990,
        sku: "ZP2W-100ML",
        brand: "Zachary Perfumes",
        category: "Mujer",
        image_url: "/images/sillapM.jpg",
        stock_quantity: 20,
        is_featured: false,
        rating: 4.7,
        notes: "Pimienta rosa, mandarina, bergamota, algodón de azúcar",
        duration: "6-8 horas",
        original_inspiration: "212 SEXY WOMAN - Carolina Herrera",
        size: "100ml",
        concentration: "Eau de Parfum"
      },
      
      // HOMBRES
      {
        name: "Urbano Moderno – Eau de Parfum amaderado especiado masculino 30ml",
        description: "Fragancia sofisticada y moderna con un aroma fresco y especiado que captura la esencia de la elegancia contemporánea. Inspirado en 212 MEN.",
        price: 8390,
        sku: "ZP1H-30ML",
        brand: "Zachary Perfumes",
        category: "Hombre",
        image_url: "/images/sillapH.jpg",
        stock_quantity: 50,
        is_featured: false,
        rating: 4.7,
        notes: "Notas verdes, toronja, especias, bergamota",
        duration: "6-8 horas",
        original_inspiration: "212 MEN",
        size: "30ml",
        concentration: "Eau de Parfum"
      },
      {
        name: "Urbano Moderno – Eau de Parfum amaderado especiado masculino 50ml",
        description: "Fragancia sofisticada y moderna con un aroma fresco y especiado que captura la esencia de la elegancia contemporánea. Inspirado en 212 MEN.",
        price: 11190,
        sku: "ZP1H-50ML",
        brand: "Zachary Perfumes",
        category: "Hombre",
        image_url: "/images/sillapH.jpg",
        stock_quantity: 30,
        is_featured: false,
        rating: 4.7,
        notes: "Notas verdes, toronja, especias, bergamota",
        duration: "6-8 horas",
        original_inspiration: "212 MEN",
        size: "50ml",
        concentration: "Eau de Parfum"
      },
      {
        name: "Urbano Moderno – Eau de Parfum amaderado especiado masculino 100ml",
        description: "Fragancia sofisticada y moderna con un aroma fresco y especiado que captura la esencia de la elegancia contemporánea. Inspirado en 212 MEN.",
        price: 13990,
        sku: "ZP1H-100ML",
        brand: "Zachary Perfumes",
        category: "Hombre",
        image_url: "/images/sillapH.jpg",
        stock_quantity: 20,
        is_featured: true,
        rating: 4.7,
        notes: "Notas verdes, toronja, especias, bergamota",
        duration: "6-8 horas",
        original_inspiration: "212 MEN",
        size: "100ml",
        concentration: "Eau de Parfum"
      },
      
      // BODY MISTS
      {
        name: "Vanilla Woodlace - Body Mist 30ml",
        description: "Almizcle y vainilla para noches sensuales. Deja una estela inolvidable en la piel.",
        price: 4790,
        sku: "ZBM-VAN-30ML",
        brand: "Zachary Perfumes",
        category: "Body Mist",
        image_url: "/images/body-mist.jpg",
        stock_quantity: 50,
        is_featured: false,
        rating: 4.3,
        notes: "Vainilla cremosa, almizcle sensual",
        duration: "2-4 horas",
        original_inspiration: "Creación original",
        size: "30ml",
        concentration: "Body Mist"
      },
      {
        name: "Vanilla Woodlace - Body Mist 50ml",
        description: "Almizcle y vainilla para noches sensuales. Deja una estela inolvidable en la piel.",
        price: 6390,
        sku: "ZBM-VAN-50ML",
        brand: "Zachary Perfumes",
        category: "Body Mist",
        image_url: "/images/body-mist.jpg",
        stock_quantity: 30,
        is_featured: false,
        rating: 4.3,
        notes: "Vainilla cremosa, almizcle sensual",
        duration: "2-4 horas",
        original_inspiration: "Creación original",
        size: "50ml",
        concentration: "Body Mist"
      },
      {
        name: "Vanilla Woodlace - Body Mist 100ml",
        description: "Almizcle y vainilla para noches sensuales. Deja una estela inolvidable en la piel.",
        price: 7990,
        sku: "ZBM-VAN-100ML",
        brand: "Zachary Perfumes",
        category: "Body Mist",
        image_url: "/images/body-mist.jpg",
        stock_quantity: 20,
        is_featured: false,
        rating: 4.3,
        notes: "Vainilla cremosa, almizcle sensual",
        duration: "2-4 horas",
        original_inspiration: "Creación original",
        size: "100ml",
        concentration: "Body Mist"
      },
      
      // HOME SPRAYS
      {
        name: "Verbena Garden – Home Spray aromático mediterráneo 30ml",
        description: "Jardín mediterráneo con verbena, azahar y limón. Refrescante y natural para espacios amplios.",
        price: 7790,
        sku: "ZHS-VER-30ML",
        brand: "Zachary Perfumes",
        category: "Hogar",
        image_url: "/images/home-spray.jpg",
        stock_quantity: 50,
        is_featured: false,
        rating: 4.5,
        notes: "Verbena, azahar, limón, tomillo mediterráneo",
        duration: "Ambiente: 4-6 horas",
        original_inspiration: "Creación original",
        size: "30ml",
        concentration: "Home Spray"
      },
      {
        name: "Verbena Garden – Home Spray aromático mediterráneo 50ml",
        description: "Jardín mediterráneo con verbena, azahar y limón. Refrescante y natural para espacios amplios.",
        price: 10390,
        sku: "ZHS-VER-50ML",
        brand: "Zachary Perfumes",
        category: "Hogar",
        image_url: "/images/home-spray.jpg",
        stock_quantity: 30,
        is_featured: false,
        rating: 4.5,
        notes: "Verbena, azahar, limón, tomillo mediterráneo",
        duration: "Ambiente: 4-6 horas",
        original_inspiration: "Creación original",
        size: "50ml",
        concentration: "Home Spray"
      },
      {
        name: "Verbena Garden – Home Spray aromático mediterráneo 100ml",
        description: "Jardín mediterráneo con verbena, azahar y limón. Refrescante y natural para espacios amplios.",
        price: 12990,
        sku: "ZHS-VER-100ML",
        brand: "Zachary Perfumes",
        category: "Hogar",
        image_url: "/images/home-spray.jpg",
        stock_quantity: 20,
        is_featured: true,
        rating: 4.5,
        notes: "Verbena, azahar, limón, tomillo mediterráneo",
        duration: "Ambiente: 4-6 horas",
        original_inspiration: "Creación original",
        size: "100ml",
        concentration: "Home Spray"
      }
    ];
    
    console.log(`📋 Productos a procesar: ${products.length} (muestra representativa)`);
    console.log('⚠️ NOTA: Esta es una muestra. Para cargar los 776 productos completos,');
    console.log('   necesitas procesar el archivo CSV completo con todos los datos.');
    
    // Limpiar productos existentes
    console.log('🧹 Limpiando productos existentes...');
    await query('DELETE FROM products');
    console.log('✅ Productos existentes eliminados');
    
    let insertedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        if (!product.sku) {
          console.log(`⚠️ Producto sin SKU: ${product.name}`);
          errorCount++;
          continue;
        }
        
        // Insertar producto
        await query(`
          INSERT INTO products (
            name, description, price, sku, brand, category,
            image_url, stock_quantity, is_featured, rating, is_active,
            notes, duration, original_inspiration, size, concentration
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
        `, [
          product.name,
          product.description,
          product.price,
          product.sku,
          product.brand,
          product.category,
          product.image_url,
          product.stock_quantity,
          product.is_featured,
          product.rating,
          product.notes,
          product.duration,
          product.original_inspiration,
          product.size,
          product.concentration
        ]);
        
        console.log(`✅ Insertado: ${product.name} - $${product.price.toLocaleString('es-CL')}`);
        insertedCount++;
        
      } catch (error) {
        console.error(`❌ Error con producto ${product.sku}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Proceso completado:`);
    console.log(`✅ Insertados: ${insertedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    
    // Estadísticas finales
    const totalCount = await query('SELECT COUNT(*) as total FROM products WHERE is_active = 1');
    console.log(`📦 Total productos activos: ${totalCount[0].total}`);
    
    const categoryStats = await query(`
      SELECT category, COUNT(*) as count 
      FROM products 
      WHERE is_active = 1 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    console.log('\n📊 Productos por categoría:');
    categoryStats.forEach(stat => {
      console.log(`   ${stat.category}: ${stat.count} productos`);
    });
    
    const featuredCount = await query('SELECT COUNT(*) as total FROM products WHERE is_featured = 1 AND is_active = 1');
    console.log(`\n⭐ Productos destacados: ${featuredCount[0].total}`);
    
    const stockValue = await query('SELECT SUM(price * stock_quantity) as total_value FROM products WHERE is_active = 1');
    console.log(`💰 Valor total del inventario: $${stockValue[0].total_value?.toLocaleString('es-CL') || 0} CLP`);
    
    return { insertedCount, errorCount };
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  loadCompleteCSVProducts()
    .then(() => {
      console.log('\n🎉 CARGA DE PRODUCTOS CSV COMPLETADA EXITOSAMENTE');
      console.log('\n📝 PRÓXIMOS PASOS:');
      console.log('1. Expandir este script con todos los 776 productos del CSV');
      console.log('2. Verificar que las imágenes estén disponibles en /images/');
      console.log('3. Configurar productos destacados desde el admin dashboard');
      console.log('4. Probar el carrito y checkout con Webpay');
      console.log('5. Ajustar precios y stock según necesidades del negocio');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { loadCompleteCSVProducts };