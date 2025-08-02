const { query } = require('./config/database');

// Función para convertir precios de formato decimal a entero (CLP)
function convertPrice(price) {
  return Math.round(parseFloat(price) * 10);
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

// Función para procesar notas de fragancia
function processFragranceNotes(fragrance_profile) {
  try {
    if (!fragrance_profile) return '';
    return fragrance_profile
      .replace(/[\[\]"]/g, '')
      .split(',')
      .map(note => note.trim())
      .join(', ');
  } catch (error) {
    return fragrance_profile || '';
  }
}

// Función para determinar duración
function getDuration(concentration) {
  if (concentration === 'Eau de Parfum') {
    return '6-8 horas';
  } else if (concentration === 'Home Spray') {
    return 'Ambiente: 4-6 horas';
  } else if (concentration === 'Body Mist') {
    return '2-4 horas';
  }
  return '4-6 horas';
}

// Función para obtener inspiración original
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

// Función para leer y procesar el CSV
const fs = require('fs');
const path = require('path');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function readCSVFile() {
  try {
    const csvPath = path.join(__dirname, '..', 'products_rows.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('❌ Archivo CSV no encontrado en:', csvPath);
      return [];
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n');
    const products = [];
    
    // Saltar la primera línea (headers)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const fields = parseCSVLine(line);
      
      if (fields.length >= 19) {
        const product = {
          id: parseInt(fields[0]) || 0,
          name: fields[1] || '',
          brand: fields[2] || 'Zachary Perfumes',
          price: parseFloat(fields[3]) || 0,
          category: fields[4] || 'women',
          description: fields[5].replace(/"/g, '') || '',
          sku: fields[6] || '',
          stock_quantity: parseInt(fields[7]) || 50,
          size: fields[8] || '30ml',
          concentration: fields[9] || 'Eau de Parfum',
          image_url: fields[10] || '/images/sillapM.jpg',
          rating: parseFloat(fields[11]) || 4.5,
          reviews_count: parseInt(fields[12]) || 0,
          in_stock: fields[13] === 'true',
          is_featured: fields[16] === 'true',
          fragrance_profile: fields[17] || ''
        };
        
        products.push(product);
      }
    }
    
    console.log(`📄 CSV procesado: ${products.length} productos encontrados`);
    return products;
    
  } catch (error) {
    console.error('❌ Error leyendo CSV:', error.message);
    return [];
  }
}

// Obtener datos del CSV
const csvData = readCSVFile();

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

// Función principal para generar y cargar todos los productos
async function generateAllProducts() {
  console.log('🚀 GENERANDO Y CARGANDO TODOS LOS PRODUCTOS DEL CSV');
  console.log('='.repeat(70));
  
  try {
    // Actualizar estructura de tabla
    await updateTableStructure();
    
    console.log('✅ Conexión a MySQL OK');
    
    // Limpiar productos existentes
    console.log('🧹 Limpiando productos existentes...');
    await query('DELETE FROM products');
    console.log('✅ Productos existentes eliminados');
    
    // Procesar productos del CSV
    const processedProducts = csvData.map(csvProduct => {
      return {
        name: csvProduct.name,
        description: csvProduct.description,
        price: convertPrice(csvProduct.price),
        sku: csvProduct.sku,
        brand: csvProduct.brand,
        category: mapCategory(csvProduct.category),
        image_url: csvProduct.image_url,
        stock_quantity: csvProduct.stock_quantity,
        is_featured: csvProduct.is_featured || false,
        rating: parseFloat(csvProduct.rating) || 4.5,
        notes: processFragranceNotes(csvProduct.fragrance_profile),
        duration: getDuration(csvProduct.concentration),
        original_inspiration: getOriginalInspiration(csvProduct.name),
        size: csvProduct.size,
        concentration: csvProduct.concentration
      };
    });
    
    console.log(`📋 Productos a procesar: ${processedProducts.length}`);
    
    if (processedProducts.length === 0) {
      console.log('⚠️ No se encontraron productos para procesar. Verifica el archivo CSV.');
      return { insertedCount: 0, errorCount: 1 };
    }
    
    let insertedCount = 0;
    let errorCount = 0;
    
    for (const product of processedProducts) {
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
        
        console.log(`✅ Insertado: ${product.name} ${product.size} - $${product.price.toLocaleString('es-CL')}`);
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
  generateAllProducts()
    .then(() => {
      console.log('\n🎉 GENERACIÓN DE PRODUCTOS COMPLETADA EXITOSAMENTE');
      console.log('\n📝 PRODUCTOS LISTOS PARA:');
      console.log('✅ Agregar al carrito');
      console.log('✅ Comprar con Webpay');
      console.log('✅ Gestionar desde admin dashboard');
      console.log('✅ Modificar stock y precios');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { generateAllProducts };