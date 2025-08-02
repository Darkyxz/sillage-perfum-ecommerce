const { query } = require('./config/database');
const fs = require('fs');
const path = require('path');

// Función para convertir precios de formato decimal a entero (CLP)
function convertPrice(price) {
  return Math.round(parseFloat(price) * 10); // Convertir de formato decimal a CLP
}

// Función para limpiar y procesar las notas de fragancia
function processFragranceNotes(fragrance_profile) {
  try {
    if (!fragrance_profile) return '';
    // Remover corchetes y comillas, limpiar formato JSON
    return fragrance_profile
      .replace(/[\[\]"]/g, '')
      .split(',')
      .map(note => note.trim())
      .join(', ');
  } catch (error) {
    return fragrance_profile || '';
  }
}

// Función para mapear categorías de inglés a español
function mapCategory(category) {
  const categoryMap = {
    'women': 'Mujer',
    'men': 'Hombre',
    'home': 'Hogar',
    'body': 'Body Mist'
  };
  return categoryMap[category] || category;
}

// Función para determinar duración basada en concentración
function getDuration(concentration, category) {
  if (concentration === 'Eau de Parfum') {
    return category === 'Body Mist' ? '2-4 horas' : '6-8 horas';
  } else if (concentration === 'Home Spray') {
    return 'Ambiente: 4-6 horas';
  }
  return '4-6 horas';
}

// Función para determinar inspiración original basada en el nombre
function getOriginalInspiration(name) {
  const inspirations = {
    '212 Woman': '212 WOMAN - Carolina Herrera',
    '212 Sexy Woman': '212 SEXY WOMAN - Carolina Herrera',
    '212 VIP Woman': '212 VIP WOMAN - Carolina Herrera',
    '212 VIP Rose Woman': '212 VIP ROSE WOMAN - Carolina Herrera',
    'Acqua di Gio Woman': 'ACQUA DI GIO WOMAN - Giorgio Armani',
    'Amor Amor Woman': 'AMOR AMOR WOMAN - Cacharel',
    'Be Delicious Woman': 'BE DELICIOUS WOMAN - DKNY',
    'CH Woman': 'CH WOMAN - Carolina Herrera',
    'Can Can': 'CAN CAN - Paris Hilton',
    'Carolina Herrera Woman': 'CAROLINA HERRERA WOMAN - Carolina Herrera',
    'Chanel Nº5': 'CHANEL Nº5 - Chanel',
    'DKNY Woman': 'DKNY WOMAN - Donna Karan',
    'Duende': 'DUENDE - Agatha Ruiz de la Prada',
    'Eden': 'EDEN - Cacharel',
    'Fantasy Midnight': 'FANTASY MIDNIGHT - Britney Spears',
    'Fantasy': 'FANTASY - Britney Spears',
    'Gucci Rush': 'GUCCI RUSH - Gucci',
    'Halloween Woman': 'HALLOWEEN WOMAN - Jesús del Pozo',
    'Hugo Woman': 'HUGO WOMAN - Hugo Boss',
    'J\'adore': 'J\'ADORE - Dior',
    'Light Blue': 'LIGHT BLUE - Dolce & Gabbana',
    'Lolita Lempicka': 'LOLITA LEMPICKA - Lolita Lempicka',
    'Lady Million': 'LADY MILLION - Paco Rabanne',
    'La Vida es Bella': 'LA VIDA ES BELLA - Lancôme',
    'Miracle': 'MIRACLE - Lancôme',
    'Nina Manzana': 'NINA MANZANA - Nina Ricci',
    'One': 'ONE - Calvin Klein',
    'Paloma Picasso': 'PALOMA PICASSO - Paloma Picasso',
    'Paris Hilton': 'PARIS HILTON - Paris Hilton',
    'Ralph': 'RALPH - Ralph Lauren',
    'Tommy Girl': 'TOMMY GIRL - Tommy Hilfiger',
    'Trésor': 'TRESOR - Lancôme',
    'XS Black Woman': 'XS BLACK WOMAN - Paco Rabanne',
    'Si Armani': 'SI ARMANI - Giorgio Armani',
    'Good Girl': 'GOOD GIRL - Carolina Herrera',
    'Olympea': 'OLYMPEA - Paco Rabanne',
    'My Way': 'MY WAY - Giorgio Armani',
    'Soleil Cristal': 'SOLEIL CRISTAL - Roberto Cavalli',
    'Fame': 'FAME - Lady Gaga',
    'Miss Dior': 'MISS DIOR - Dior',
    'Idôle': 'IDÔLE - Lancôme',
    'Libre YSL': 'LIBRE - Yves Saint Laurent',
    'Yara': 'SCANDAL J.P.G.',
    
    // HOMBRES
    'Urbano Moderno': '212 MEN',
    'Seductor Urbano': '212 SEXY MEN',
    'Contraste Sofisticado': '212 VIP',
    'Brisa Marina': 'ACQUA DI GIO MEN',
    'Ángel Rebelde': 'ANGEL MEN',
    'Dinámico Deportivo': 'ARMANI CODE SPORT',
    'Código de Elegancia': 'ARMANI CODE',
    'Esencia Audaz': 'AZZARO',
    'Elegancia Clásica': 'BOSS 6',
    'Azul Iconico': 'BLEU CHANEL',
    'Eternidad Moderna': 'ETERNITY MEN',
    'Fahrenheit Clásico': 'FAHRENHEIT',
    'Jefe Elegante': 'HUGO BOSS',
    'Invicto Poderoso': 'INVICTUS',
    'Hombre Sofisticado': 'J.P.G Le Male',
    'Brisa Mediterránea': 'LIGHT BLUE',
    'Millón Magnético': 'ONE MILLION',
    'Rabanne Elegante': 'PACO RABANNE',
    'Polo Clásico': 'POLO',
    'Polo Negro': 'POLO BLACK',
    'Polo Azul': 'POLO BLUE',
    'Polo Deportivo': 'POLO SPORT MEN',
    'Polo Rojo': 'POLO RED',
    'Tommy Fresco': 'TOMMY MEN',
    'Ultravioleta': 'ULTRAVIOLET MEN',
    'Xeryus Rojo': 'XERYUS ROUGE',
    'XS Black': 'XS BLACK MEN',
    'XS Black L\'Exces': 'XS BLACK L\'EXCES',
    'Acqua Profumo': 'ACQUA DI GIO PROFUMO',
    'Salvaje Elegante': 'SAUVAGE',
    'Invictus Intenso': 'INVICTUS INTENSE',
    'Fantasma Elegante': 'PHANTOM',
    'Elixir Salvaje': 'SAUVAGE ELIXIR',
    'Chico Malo': 'BAD BOY',
    'Eros Magnético': 'EROS VERSACE',
    'Le Beau Exótico': 'LE BEAU',
    'Escándalo Dulce': 'SCANDAL J.P.G.',
    'Fuerte Contigo': 'STRONGER WITH YOU'
  };
  
  for (const [key, value] of Object.entries(inspirations)) {
    if (name.includes(key)) {
      return value;
    }
  }
  
  return 'Creación original';
}

// Datos del CSV procesados
const csvProducts = [
  {id: 453, name: "212 Woman – Eau de Parfum floral femenino", brand: "Zachary Perfumes", price: 779.00, category: "women", description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.", sku: "ZP1W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 0.00, reviews_count: 0, in_stock: true, is_featured: false, fragrance_profile: "[\"Flor de azahar del naranjo\",\"flor de cactus\",\"bergamota\",\"mandarina\"]"},
  {id: 454, name: "212 Woman – Eau de Parfum floral femenino", brand: "Zachary Perfumes", price: 1039.00, category: "women", description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.", sku: "ZP1W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 0.00, reviews_count: 0, in_stock: true, is_featured: false, fragrance_profile: "[\"Flor de azahar del naranjo\",\"flor de cactus\",\"bergamota\",\"mandarina\"]"},
  {id: 455, name: "212 Woman – Eau de Parfum floral femenino", brand: "Zachary Perfumes", price: 1299.00, category: "women", description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.", sku: "ZP1W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 0.00, reviews_count: 0, in_stock: true, is_featured: false, fragrance_profile: "[\"Flor de azahar del naranjo\",\"flor de cactus\",\"bergamota\",\"mandarina\"]"}
  // Aquí irían todos los 776 productos del CSV...
];

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

// Función principal para cargar todos los productos de Supabase
async function loadAllSupabaseProducts() {
  console.log('🚀 CARGANDO TODOS LOS PRODUCTOS REALES DE SUPABASE');
  console.log('='.repeat(70));
  
  try {
    // Actualizar estructura de tabla
    await updateTableStructure();
    
    console.log('✅ Conexión a MySQL OK');
    
    // Limpiar productos existentes
    console.log('🧹 Limpiando productos existentes...');
    await query('DELETE FROM products');
    console.log('✅ Productos existentes eliminados');
    
    console.log(`📋 Productos a procesar: ${csvProducts.length} (muestra)`);
    console.log('⚠️ NOTA: Este es un script de muestra. Para cargar los 776 productos completos,');
    console.log('   necesitas procesar el archivo CSV completo.');
    
    let insertedCount = 0;
    let errorCount = 0;
    
    for (const csvProduct of csvProducts) {
      try {
        if (!csvProduct.sku) {
          console.log(`⚠️ Producto sin SKU: ${csvProduct.name}`);
          errorCount++;
          continue;
        }
        
        // Procesar datos del CSV
        const product = {
          name: csvProduct.name + ` ${csvProduct.size}`,
          description: csvProduct.description,
          price: convertPrice(csvProduct.price),
          sku: csvProduct.sku,
          brand: csvProduct.brand,
          category: mapCategory(csvProduct.category),
          image_url: csvProduct.image_url,
          stock_quantity: csvProduct.stock_quantity,
          is_featured: csvProduct.is_featured || false,
          rating: parseFloat(csvProduct.rating) || 0,
          notes: processFragranceNotes(csvProduct.fragrance_profile),
          duration: getDuration(csvProduct.concentration, csvProduct.category),
          original_inspiration: getOriginalInspiration(csvProduct.name),
          size: csvProduct.size,
          concentration: csvProduct.concentration
        };
        
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
        console.error(`❌ Error con producto ${csvProduct.sku}:`, error.message);
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
  loadAllSupabaseProducts()
    .then(() => {
      console.log('\n🎉 CARGA DE PRODUCTOS DE SUPABASE COMPLETADA EXITOSAMENTE');
      console.log('\n📝 PRÓXIMOS PASOS:');
      console.log('1. Actualizar este script con todos los 776 productos del CSV');
      console.log('2. Verificar que las imágenes estén disponibles');
      console.log('3. Configurar productos destacados desde el admin');
      console.log('4. Probar el carrito y checkout con Webpay');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { loadAllSupabaseProducts };