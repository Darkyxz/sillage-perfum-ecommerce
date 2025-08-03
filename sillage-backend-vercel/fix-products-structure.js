const { query } = require('./config/database');

// Precios fijos finales
const FIXED_PRICES = {
  '30ml': 9000,   // $9,000 CLP
  '50ml': 14000,  // $14,000 CLP  
  '100ml': 18000  // $18,000 CLP
};

class ProductStructureFixer {
  constructor() {
    this.fixedCount = 0;
    this.errorCount = 0;
  }

  // Extraer nombre limpio de productos con descripciones
  extractCleanName(longName, sku) {
    // Patrones comunes para extraer el nombre real
    const patterns = [
      // "Inspirado en X" al inicio
      /^Inspirado en ([^–\-]+)(?:\s*–?\s*.*)?$/i,
      /^Inspirado en (.+?)(?:\s+es una fragancia|\s+captura|\s+combina)/i,
      
      // Nombres con "–" separador
      /^(.+?)\s*–\s*.*$/,
      
      // Solo tomar las primeras palabras importantes
      /^(.{1,50}?)(?:\s+es una|\s+captura|\s+combina|\s+fragancia)/i,
    ];

    let cleanName = longName;

    // Aplicar patrones de limpieza
    for (const pattern of patterns) {
      const match = longName.match(pattern);
      if (match && match[1]) {
        cleanName = match[1].trim();
        break;
      }
    }

    // Si el nombre sigue siendo muy largo, truncar inteligentemente
    if (cleanName.length > 60) {
      // Buscar un punto de corte natural
      const cutPoints = ['. ', ', ', ' - ', ' – '];
      let bestCut = cleanName.substring(0, 50);
      
      for (const cutPoint of cutPoints) {
        const cutIndex = cleanName.indexOf(cutPoint);
        if (cutIndex > 10 && cutIndex < 60) {
          bestCut = cleanName.substring(0, cutIndex);
          break;
        }
      }
      
      cleanName = bestCut;
    }

    // Limpiezas finales
    cleanName = cleanName
      .replace(/^es una fragancia\s*/i, '')
      .replace(/^sofisticada y etérea,?\s*/i, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Si el nombre quedó muy corto o vacío, usar una versión basada en el SKU
    if (cleanName.length < 5) {
      cleanName = this.generateNameFromSKU(sku);
    }

    return cleanName;
  }

  // Generar nombre basado en SKU cuando no se puede extraer uno bueno
  generateNameFromSKU(sku) {
    const skuBase = sku.replace(/-\d+ML$/i, '');
    const isWoman = skuBase.includes('W');
    const isMan = skuBase.includes('H');
    
    let baseName = `Fragancia ${skuBase}`;
    
    if (isWoman) baseName += ' para Mujer';
    if (isMan) baseName += ' para Hombre';
    
    return baseName;
  }

  // Corregir un producto individual
  async fixProduct(product) {
    try {
      let needsUpdate = false;
      let newName = product.name;
      let newPrice = product.price;

      // 1. Corregir nombre si es muy largo (probablemente es una descripción)
      if (product.name && product.name.length > 60) {
        newName = this.extractCleanName(product.name, product.sku);
        needsUpdate = true;
        console.log(`📝 Nombre largo detectado en ${product.sku}:`);
        console.log(`   Antes: ${product.name.substring(0, 80)}...`);
        console.log(`   Después: ${newName}`);
      }

      // 2. Corregir precio según el tamaño
      const size = product.size;
      if (size && FIXED_PRICES[size]) {
        const correctPrice = FIXED_PRICES[size];
        if (parseFloat(product.price) !== correctPrice) {
          newPrice = correctPrice;
          needsUpdate = true;
          console.log(`💰 Precio corregido para ${product.sku} (${size}): $${product.price} → $${correctPrice}`);
        }
      }

      // 3. Aplicar cambios si es necesario
      if (needsUpdate) {
        await query(`
          UPDATE products 
          SET name = ?, price = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [newName, newPrice, product.id]);

        this.fixedCount++;
        return { fixed: true, changes: { name: newName !== product.name, price: newPrice !== product.price } };
      }

      return { fixed: false };

    } catch (error) {
      console.error(`❌ Error corrigiendo producto ${product.sku}:`, error.message);
      this.errorCount++;
      return { fixed: false, error: error.message };
    }
  }

  // Procesar todos los productos
  async fixAllProducts() {
    console.log('🔧 INICIANDO CORRECCIÓN DE ESTRUCTURA DE PRODUCTOS');
    console.log('='.repeat(80));

    try {
      // Obtener todos los productos
      const products = await query(`
        SELECT id, name, sku, price, size, brand
        FROM products 
        WHERE brand = "Zachary Perfumes"
        ORDER BY sku
      `);

      console.log(`📦 Productos a revisar: ${products.length}`);
      console.log('⚡ Analizando y corrigiendo...\n');

      // Procesar cada producto
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const progress = `(${i + 1}/${products.length})`;
        
        const result = await this.fixProduct(product);
        
        if (!result.fixed && !result.error) {
          // Producto sin cambios necesarios
          if (i % 20 === 0) { // Mostrar progreso cada 20 productos
            console.log(`✅ ${progress} Sin cambios: ${product.sku}`);
          }
        }
      }

      await this.showFinalReport();

    } catch (error) {
      console.error('💥 Error durante la corrección:', error);
      throw error;
    }
  }

  // Mostrar reporte final
  async showFinalReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 REPORTE FINAL DE CORRECCIONES:');
    console.log(`✅ Productos corregidos: ${this.fixedCount}`);
    console.log(`❌ Errores: ${this.errorCount}`);

    // Verificar que todos los precios estén correctos
    const priceCheck = await query(`
      SELECT size, price, COUNT(*) as count
      FROM products 
      WHERE brand = "Zachary Perfumes"
      GROUP BY size, price
      ORDER BY size, price
    `);

    console.log('\n💰 VERIFICACIÓN DE PRECIOS:');
    console.table(priceCheck);

    // Verificar nombres largos restantes
    const longNamesCheck = await query(`
      SELECT sku, LENGTH(name) as name_length, LEFT(name, 60) as name_preview
      FROM products 
      WHERE brand = "Zachary Perfumes" AND LENGTH(name) > 60
      ORDER BY LENGTH(name) DESC
      LIMIT 5
    `);

    if (longNamesCheck.length > 0) {
      console.log('\n⚠️ NOMBRES LARGOS RESTANTES:');
      console.table(longNamesCheck);
    } else {
      console.log('\n✅ Todos los nombres tienen longitud adecuada');
    }

    // Estadísticas finales
    const totalStats = await query(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(DISTINCT SUBSTRING_INDEX(sku, '-', 1)) as unique_base_skus
      FROM products 
      WHERE brand = "Zachary Perfumes"
    `);

    console.log('\n📈 ESTADÍSTICAS FINALES:');
    console.log(`📦 Total productos: ${totalStats[0].total_products}`);
    console.log(`🏷️ SKUs base únicos: ${totalStats[0].unique_base_skus}`);
  }
}

// Ejecutar corrector si se llama directamente
if (require.main === module) {
  const fixer = new ProductStructureFixer();
  
  fixer.fixAllProducts()
    .then(() => {
      console.log('\n🎉 CORRECCIÓN COMPLETADA EXITOSAMENTE');
      console.log('\n🚀 SIGUIENTES PASOS:');
      console.log('1. 🌐 Verificar productos en el frontend');
      console.log('2. 🛠️ Implementar selector dinámico de ML');
      console.log('3. 🎨 Actualizar componentes de producto');
      console.log('4. 🧪 Probar funcionalidad completa');
      
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error durante la corrección:', error);
      process.exit(1);
    });
}

module.exports = { ProductStructureFixer };
