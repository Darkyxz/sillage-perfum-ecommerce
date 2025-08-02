const { query } = require('./config/database');

// Función para convertir productos del frontend a formato backend
function convertProduct(product) {
  return {
    sku: product.sku || product.code, // Usar sku si existe, sino code
    name: product.name,
    brand: product.brand || 'Zachary Perfumes',
    category: convertCategory(product.category),
    price: convertPrice(product.price),
    description: product.description,
    image_url: convertImageUrl(product),
    stock_quantity: product.stock_quantity || product.stock || 50,
    is_featured: product.is_featured || false,
    rating: product.rating || 4.5
  };
}

// Convertir categorías a español
function convertCategory(category) {
  const categoryMap = {
    'men': 'Hombre',
    'women': 'Mujer', 
    'unisex': 'Unisex',
    'home': 'Hogar',
    'car': 'Auto',
    'body': 'Body Mist',
    'kids': 'Niños'
  };
  
  return categoryMap[category] || category;
}

// Convertir precios a CLP
function convertPrice(price) {
  if (price < 5000) {
    return price * 10; // Multiplicar por 10 para convertir a CLP
  }
  return price;
}

// Convertir URLs de imágenes
function convertImageUrl(product) {
  if (product.image_url) return product.image_url;
  if (product.image) return `https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop`;
  
  // Imagen por defecto según categoría
  const categoryImages = {
    'Hombre': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
    'Mujer': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    'Unisex': 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop',
    'Hogar': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop',
    'Auto': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop',
    'Body Mist': 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop'
  };
  
  return categoryImages[convertCategory(product.category)] || categoryImages['Unisex'];
}

// Productos del frontend (copiados de tu archivo)
const frontendProducts = [
  {
    sku: "ZP1H",
    name: "Urbano Moderno – Eau de Parfum amaderado especiado masculino",
    brand: "Zachary Perfumes",
    category: "Hombre",
    price: 13990,
    description: "Fragancia sofisticada y moderna con un aroma fresco y especiado que captura la esencia de la elegancia contemporánea. Inspirado en 212 MEN.",
    image_url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop",
    stock_quantity: 50,
    is_featured: true,
    rating: 4.7
  },
  {
    code: "ZP2H",
    name: "Seductor Urbano – Eau de Parfum oriental amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 13990,
    description: "Fragancia seductora y sofisticada con un aroma envolvente que captura la esencia de la elegancia urbana. Inspirado en 212 SEXY MEN.",
    stock: 50
  },
  {
    code: "ZP4H",
    name: "Contraste Sofisticado – Eau de Parfum aromático amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 13990,
    description: "Fragancia sofisticada y audaz que fusiona frescura vibrante con calidez envolvente. Inspirado en 212 Vip.",
    stock: 50
  },
  {
    code: "ZP5H",
    name: "Brisa Marina – Eau de Parfum acuático cítrico masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 13990,
    description: "Fragancia fresca y sofisticada que captura la esencia del hombre moderno con un aroma acuático y cítrico. Inspirado en ACQUA DI GIO MEN.",
    stock: 50
  },
  {
    code: "ZP7H",
    name: "Ángel Rebelde – Eau de Parfum oriental amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 14990,
    description: "Fragancia audaz y sofisticada que combina frescura de notas verdes con calidez de especias. Inspirado en ANGEL MEN.",
    stock: 50
  },
  {
    code: "ZP9H",
    name: "Dinámico Deportivo – Eau de Parfum aromático acuático masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 13990,
    description: "Fragancia vibrante y enérgica que evoca la libertad y la aventura. Inspirado en ARMANI CODE SPORT.",
    stock: 50
  },
  {
    code: "ZP10H",
    name: "Código de Elegancia – Eau de Parfum oriental amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 14990,
    description: "Fragancia sofisticada y seductora que combina frescura y calidez. Inspirado en ARMANI CODE.",
    stock: 50
  },
  {
    code: "ZP12H",
    name: "Esencia Audaz – Eau de Parfum aromático amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 14990,
    description: "Fragancia sofisticada y audaz con un toque contemporáneo. Inspirado en AZZARO.",
    stock: 50
  },
  {
    code: "ZP13H",
    name: "Elegancia Clásica – Eau de Parfum amaderado frutal masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 13990,
    description: "Fragancia sofisticada y versátil que combina notas frutales y amaderadas. Inspirado en BOSS 6.",
    stock: 50
  },
  {
    code: "ZP17H",
    name: "Azul Iconico – Eau de Parfum amaderado aromático masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 15990,
    description: "Fragancia sofisticada y moderna con un aroma distintivo y versátil. Inspirado en BLEU CHANEL.",
    stock: 50
  },
  // Body Mists
  {
    code: "ZBM-VAN",
    name: "Vanilla Woodlace - Body Mist",
    brand: "Zachary",
    category: "body",
    price: 7990,
    description: "Almizcle y vainilla para noches sensuales. Deja una estela inolvidable.",
    stock: 50
  },
  {
    code: "ZBM-PET",
    name: "Petals Embrace - Body Mist",
    brand: "Zachary",
    category: "body",
    price: 7990,
    description: "Abrazo floral con toque almendrado. Serenidad y armonía en cada aplicación.",
    stock: 50
  },
  {
    code: "ZBM-PAS",
    name: "Passion Bloom - Body Mist",
    brand: "Zachary",
    category: "body",
    price: 7990,
    description: "Ciruela, fresia y manzanilla para momentos de calma y balance.",
    stock: 50
  },
  // Home Sprays
  {
    code: "ZHS-VER",
    name: "Verbena Garden - Home Spray",
    brand: "Zachary",
    category: "home",
    price: 12990,
    description: "Jardín mediterráneo con verbena, azahar y limón. Refrescante y natural.",
    stock: 50
  },
  {
    code: "ZHS-SUM",
    name: "Summer Forever - Home Spray",
    brand: "Zachary",
    category: "home",
    price: 12990,
    description: "Notas tropicales de coco y vainilla. Calidez y sensualidad para tu hogar.",
    stock: 50
  }
];

async function loadAllZacharyProducts() {
  console.log('📦 CARGANDO TODOS LOS PRODUCTOS ZACHARY');
  console.log('='.repeat(50));
  
  try {
    console.log('✅ Conexión a MySQL OK');
    console.log(`📋 Productos a procesar: ${frontendProducts.length}`);
    
    let insertedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const frontendProduct of frontendProducts) {
      try {
        // Convertir producto
        const product = convertProduct(frontendProduct);
        
        if (!product.sku) {
          console.log(`⚠️ Producto sin SKU: ${product.name}`);
          errorCount++;
          continue;
        }
        
        // Verificar si ya existe
        const existing = await query('SELECT id FROM products WHERE sku = ?', [product.sku]);
        
        if (existing.length > 0) {
          // Actualizar producto existente
          await query(`
            UPDATE products SET
              name = ?, description = ?, price = ?, brand = ?, category = ?,
              image_url = ?, stock_quantity = ?, is_featured = ?, rating = ?
            WHERE sku = ?
          `, [
            product.name, product.description, product.price, product.brand, product.category,
            product.image_url, product.stock_quantity, product.is_featured, product.rating,
            product.sku
          ]);
          
          console.log(`🔄 Actualizado: ${product.name} (${product.sku})`);
          updatedCount++;
        } else {
          // Insertar nuevo producto
          await query(`
            INSERT INTO products (
              name, description, price, sku, brand, category,
              image_url, stock_quantity, is_featured, rating, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
          `, [
            product.name, product.description, product.price, product.sku, product.brand, product.category,
            product.image_url, product.stock_quantity, product.is_featured, product.rating
          ]);
          
          console.log(`✅ Insertado: ${product.name} (${product.sku})`);
          insertedCount++;
        }
        
      } catch (error) {
        console.error(`❌ Error con producto:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Proceso completado:`);
    console.log(`✅ Insertados: ${insertedCount}`);
    console.log(`🔄 Actualizados: ${updatedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    
    // Verificar productos cargados
    const totalCount = await query('SELECT COUNT(*) as total FROM products WHERE is_active = 1');
    console.log(`📦 Total productos activos: ${totalCount[0].total}`);
    
    // Mostrar estadísticas por categoría
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
    
    return { insertedCount, updatedCount, errorCount };
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  loadAllZacharyProducts()
    .then(() => {
      console.log('\n🎉 CARGA COMPLETADA');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { loadAllZacharyProducts };