const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

// Precios fijos según especificación del usuario
const FIXED_PRICES = {
  30: 9000,   // $9,000 CLP
  50: 14000,  // $14,000 CLP
  100: 18000  // $18,000 CLP
};

// Mapeo de categorías basado en nombres de archivos
const CATEGORY_MAPPING = {
  'Woman': 'Mujer',
  'Man': 'Hombre', 
  'Bodymist': 'Body Mist',
  'Aromatizantes': 'Hogar',
  'BySachary': 'Zachary' // Productos principales
};

class WordProductExtractor {
  constructor() {
    this.extractedProducts = [];
    this.wordFilesPath = path.join(__dirname, '..', 'perfumenes');
  }

  // Extraer texto desde archivo Word
  async extractTextFromWord(filePath) {
    try {
      console.log(`📄 Extrayendo texto de: ${path.basename(filePath)}`);
      const result = await mammoth.extractRawText({ path: filePath });
      
      if (result.messages.length > 0) {
        console.log(`⚠️ Advertencias en ${path.basename(filePath)}:`, result.messages);
      }
      
      return result.value;
    } catch (error) {
      console.error(`❌ Error extrayendo ${filePath}:`, error.message);
      return null;
    }
  }

  // Determinar categoría basada en nombre de archivo
  determineCategoryFromFilename(filename) {
    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.includes('woman')) return 'Mujer';
    if (lowerFilename.includes('man')) return 'Hombre';
    if (lowerFilename.includes('bodymist')) return 'Body Mist';
    if (lowerFilename.includes('aromatizantes')) return 'Hogar';
    if (lowerFilename.includes('bysachary')) return 'Zachary';
    
    return 'Unisex'; // Por defecto
  }

  // Extraer códigos SKU del formato ZP42H
  extractSKUs(text) {
    // Buscar patrones como ZP42H, ZP1W, ZP23H, etc.
    const skuRegex = /ZP\d+[A-Z]/g;
    const skus = text.match(skuRegex) || [];
    return [...new Set(skus)]; // Eliminar duplicados
  }

  // Extraer nombres de productos
  extractProductNames(text, skus) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const productNames = [];
    
    skus.forEach(sku => {
      // Buscar líneas que contengan el SKU y extraer el nombre cercano
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(sku)) {
          // El nombre puede estar en la misma línea o en líneas cercanas
          let possibleName = lines[i].replace(sku, '').trim();
          
          // Si la línea está muy vacía, buscar en líneas anteriores/posteriores
          if (possibleName.length < 10) {
            if (i > 0) possibleName = lines[i - 1].trim();
            if (possibleName.length < 10 && i < lines.length - 1) {
              possibleName = lines[i + 1].trim();
            }
          }
          
          // Limpiar el nombre
          possibleName = this.cleanProductName(possibleName);
          
          if (possibleName.length > 0) {
            productNames.push({ sku, name: possibleName });
          }
          break;
        }
      }
    });
    
    return productNames;
  }

  // Limpiar nombres de productos
  cleanProductName(name) {
    return name
      .replace(/ZP\d+[A-Z]/g, '') // Remover SKUs
      .replace(/^\W+|\W+$/g, '') // Remover caracteres especiales al inicio/final
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
  }

  // Generar descripción genérica basada en categoría
  generateDescription(name, category) {
    const descriptions = {
      'Mujer': `Fragancia elegante y sofisticada para mujer. ${name} captura la esencia de la feminidad moderna con notas cuidadosamente seleccionadas.`,
      'Hombre': `Fragancia masculina de carácter y distinción. ${name} proyecta confianza y elegancia en cada aplicación.`,
      'Body Mist': `Body mist refrescante y duradero. ${name} proporciona una fragancia ligera perfecta para el uso diario.`,
      'Hogar': `Aromatizante para el hogar que transforma espacios. ${name} crea un ambiente acogedor y sofisticado.`,
      'Zachary': `Fragancia de la colección principal Zachary Perfumes. ${name} representa la excelencia en perfumería.`
    };
    
    return descriptions[category] || `Fragancia ${name} de Zachary Perfumes con notas distintivas y duración excepcional.`;
  }

  // Procesar un archivo Word específico
  async processWordFile(filePath) {
    const filename = path.basename(filePath);
    console.log(`\n🔍 Procesando archivo: ${filename}`);
    
    const text = await this.extractTextFromWord(filePath);
    if (!text) {
      console.log(`❌ No se pudo extraer texto de ${filename}`);
      return [];
    }
    
    console.log(`📝 Texto extraído (${text.length} caracteres)`);
    console.log(`📄 Muestra del contenido:\n${text.substring(0, 500)}...\n`);
    
    // Extraer SKUs
    const skus = this.extractSKUs(text);
    console.log(`🔍 SKUs encontrados (${skus.length}):`, skus);
    
    // Determinar categoría
    const category = this.determineCategoryFromFilename(filename);
    console.log(`📂 Categoría determinada: ${category}`);
    
    // Extraer nombres de productos
    const productNames = this.extractProductNames(text, skus);
    console.log(`📝 Productos con nombres (${productNames.length}):`);
    productNames.forEach(p => console.log(`   ${p.sku}: ${p.name}`));
    
    // Generar productos para cada SKU encontrado
    const products = [];
    
    skus.forEach(sku => {
      const productData = productNames.find(p => p.sku === sku);
      const baseName = productData ? productData.name : `Producto ${sku}`;
      
      // Generar variantes para cada tamaño (30ml, 50ml, 100ml)
      Object.entries(FIXED_PRICES).forEach(([size, price]) => {
        const product = {
          name: `${baseName} ${size}ml`,
          description: this.generateDescription(baseName, category),
          price: price,
          sku: `${sku}-${size}ML`,
          brand: "Zachary Perfumes",
          category: category,
          image_url: this.getDefaultImageUrl(category),
          stock_quantity: 50,
          is_featured: false,
          rating: 4.5,
          size: `${size}ml`,
          concentration: "Eau de Parfum",
          notes: "Notas por definir",
          duration: "6-8 horas",
          original_inspiration: "Creación Zachary Perfumes",
          in_stock: true,
          is_active: true
        };
        
        products.push(product);
      });
    });
    
    console.log(`✅ Productos generados: ${products.length}`);
    return products;
  }

  // Obtener URL de imagen por defecto según categoría
  getDefaultImageUrl(category) {
    const imageMap = {
      'Mujer': '/images/sillapM.jpg',
      'Hombre': '/images/sillapH.jpg',
      'Body Mist': '/images/body-mist.jpg',
      'Hogar': '/images/home-spray.jpg',
      'Zachary': '/images/zachary-perfume.jpg'
    };
    
    return imageMap[category] || '/images/product-default.jpg';
  }

  // Procesar todos los archivos Word
  async extractAllProducts() {
    console.log('🚀 INICIANDO EXTRACCIÓN DE PRODUCTOS ZACHARY DESDE ARCHIVOS WORD');
    console.log('='.repeat(80));
    
    // Verificar que la carpeta existe
    if (!fs.existsSync(this.wordFilesPath)) {
      console.error(`❌ Carpeta de archivos Word no encontrada: ${this.wordFilesPath}`);
      return [];
    }
    
    // Buscar archivos .docx
    const wordFiles = fs.readdirSync(this.wordFilesPath)
      .filter(file => file.endsWith('.docx'))
      .map(file => path.join(this.wordFilesPath, file));
    
    console.log(`📁 Archivos Word encontrados (${wordFiles.length}):`);
    wordFiles.forEach(file => console.log(`   - ${path.basename(file)}`));
    
    if (wordFiles.length === 0) {
      console.log('❌ No se encontraron archivos .docx');
      return [];
    }
    
    let allProducts = [];
    
    // Procesar cada archivo
    for (const filePath of wordFiles) {
      try {
        const products = await this.processWordFile(filePath);
        allProducts = allProducts.concat(products);
      } catch (error) {
        console.error(`❌ Error procesando ${path.basename(filePath)}:`, error.message);
      }
    }
    
    console.log('\n📊 RESUMEN DE EXTRACCIÓN:');
    console.log(`✅ Total productos extraídos: ${allProducts.length}`);
    
    // Estadísticas por categoría
    const categoryStats = {};
    allProducts.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = 0;
      }
      categoryStats[product.category]++;
    });
    
    console.log('\n📈 Productos por categoría:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} productos`);
    });
    
    // Guardar en archivo JSON
    const outputPath = path.join(__dirname, 'zachary-products-extracted.json');
    fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), 'utf8');
    console.log(`\n💾 Productos guardados en: ${outputPath}`);
    
    return allProducts;
  }
}

// Ejecutar extractor si se llama directamente
if (require.main === module) {
  const extractor = new WordProductExtractor();
  
  extractor.extractAllProducts()
    .then(products => {
      console.log('\n🎉 EXTRACCIÓN COMPLETADA EXITOSAMENTE');
      console.log(`📦 ${products.length} productos listos para importar a la base de datos`);
      console.log('\n📋 Muestra de productos extraídos:');
      
      // Mostrar los primeros 3 productos como muestra
      products.slice(0, 3).forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   SKU: ${product.sku}`);
        console.log(`   Precio: $${product.price.toLocaleString('es-CL')} CLP`);
        console.log(`   Categoría: ${product.category}`);
        console.log(`   Tamaño: ${product.size}`);
      });
      
      if (products.length > 3) {
        console.log(`\n... y ${products.length - 3} productos más`);
      }
      
      console.log('\n🚀 SIGUIENTE PASO: Revisa el archivo "zachary-products-extracted.json"');
      console.log('    y usa el script de importación para subirlos a la base de datos');
    })
    .catch(error => {
      console.error('💥 Error durante la extracción:', error);
      process.exit(1);
    });
}

module.exports = { WordProductExtractor };
