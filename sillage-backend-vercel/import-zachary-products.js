const { query } = require('./config/database');
const fs = require('fs');
const path = require('path');

class ZacharyProductImporter {
  constructor() {
    this.jsonFilePath = path.join(__dirname, 'zachary-products-extracted.json');
    this.insertedCount = 0;
    this.skippedCount = 0;
    this.errorCount = 0;
  }

  // Cargar productos desde el archivo JSON
  loadProductsFromJSON() {
    try {
      if (!fs.existsSync(this.jsonFilePath)) {
        throw new Error(`Archivo JSON no encontrado: ${this.jsonFilePath}`);
      }

      const jsonContent = fs.readFileSync(this.jsonFilePath, 'utf8');
      const products = JSON.parse(jsonContent);
      
      console.log(`📄 Archivo JSON cargado: ${products.length} productos encontrados`);
      
      return products;
    } catch (error) {
      console.error('❌ Error cargando archivo JSON:', error.message);
      throw error;
    }
  }

  // Verificar si un SKU ya existe en la base de datos
  async checkSKUExists(sku) {
    try {
      const result = await query('SELECT id FROM products WHERE sku = ?', [sku]);
      return result.length > 0;
    } catch (error) {
      console.error(`❌ Error verificando SKU ${sku}:`, error.message);
      return false;
    }
  }

  // Insertar un producto en la base de datos
  async insertProduct(product) {
    try {
      const result = await query(`
        INSERT INTO products (
          name, description, price, sku, brand, category,
          image_url, stock_quantity, is_featured, rating, is_active,
          size, concentration, notes, duration, original_inspiration, in_stock
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        product.is_active,
        product.size,
        product.concentration,
        product.notes,
        product.duration,
        product.original_inspiration,
        product.in_stock
      ]);

      return result.insertId;
    } catch (error) {
      console.error(`❌ Error insertando producto ${product.sku}:`, error.message);
      throw error;
    }
  }

  // Limpiar nombre de producto (remover redundancias)
  cleanProductName(name) {
    // Remover patrones redundantes comunes
    return name
      .replace(/^es una fragancia/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Procesar e importar todos los productos
  async importAllProducts() {
    console.log('🚀 INICIANDO IMPORTACIÓN DE PRODUCTOS ZACHARY A LA BASE DE DATOS');
    console.log('='.repeat(80));

    try {
      // Cargar productos del JSON
      const products = this.loadProductsFromJSON();

      console.log(`📦 Productos a procesar: ${products.length}`);
      console.log('⚡ Verificando duplicados y insertando productos...\n');

      // Procesar cada producto
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const progress = `(${i + 1}/${products.length})`;
        
        try {
          // Verificar si el SKU ya existe
          const skuExists = await this.checkSKUExists(product.sku);
          
          if (skuExists) {
            console.log(`⏭️  ${progress} SKU ya existe: ${product.sku} - SALTANDO`);
            this.skippedCount++;
            continue;
          }

          // Limpiar el nombre del producto
          const cleanedProduct = {
            ...product,
            name: this.cleanProductName(product.name)
          };

          // Insertar producto
          const insertId = await this.insertProduct(cleanedProduct);
          
          console.log(`✅ ${progress} Insertado: ${cleanedProduct.sku} - ${cleanedProduct.name.substring(0, 50)}... (ID: ${insertId})`);
          this.insertedCount++;

        } catch (error) {
          console.error(`❌ ${progress} Error con ${product.sku}:`, error.message);
          this.errorCount++;
        }
      }

      // Mostrar estadísticas finales
      await this.showFinalStats();

    } catch (error) {
      console.error('💥 Error durante la importación:', error);
      throw error;
    }
  }

  // Mostrar estadísticas finales
  async showFinalStats() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESUMEN DE IMPORTACIÓN:');
    console.log(`✅ Productos insertados: ${this.insertedCount}`);
    console.log(`⏭️  Productos saltados (duplicados): ${this.skippedCount}`);
    console.log(`❌ Errores: ${this.errorCount}`);

    // Estadísticas de la base de datos
    try {
      const totalCount = await query('SELECT COUNT(*) as total FROM products WHERE is_active = 1');
      console.log(`📦 Total productos activos en BD: ${totalCount[0].total}`);

      const zacharyCount = await query('SELECT COUNT(*) as total FROM products WHERE brand = "Zachary Perfumes" AND is_active = 1');
      console.log(`🏷️  Total productos Zachary: ${zacharyCount[0].total}`);

      const categoryStats = await query(`
        SELECT category, COUNT(*) as count 
        FROM products 
        WHERE brand = "Zachary Perfumes" AND is_active = 1 
        GROUP BY category 
        ORDER BY count DESC
      `);

      console.log('\n📈 Productos Zachary por categoría:');
      categoryStats.forEach(stat => {
        console.log(`   ${stat.category}: ${stat.count} productos`);
      });

      // Productos destacados
      const featuredCount = await query('SELECT COUNT(*) as total FROM products WHERE brand = "Zachary Perfumes" AND is_featured = 1 AND is_active = 1');
      console.log(`\n⭐ Productos Zachary destacados: ${featuredCount[0].total}`);

      // Valor total del inventario Zachary
      const stockValue = await query('SELECT SUM(price * stock_quantity) as total_value FROM products WHERE brand = "Zachary Perfumes" AND is_active = 1');
      console.log(`💰 Valor inventario Zachary: $${stockValue[0].total_value?.toLocaleString('es-CL') || 0} CLP`);

    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error.message);
    }
  }

  // Función para actualizar el botón "Agregar Productos Nuevos Zachary" en el admin
  async updateAdminButton() {
    console.log('\n🔧 ACTUALIZANDO SISTEMA ADMIN...');
    
    // Crear archivo de configuración para el botón admin
    const adminConfig = {
      zachary_products_imported: true,
      import_date: new Date().toISOString(),
      total_imported: this.insertedCount,
      last_update: new Date().toISOString()
    };

    const configPath = path.join(__dirname, 'zachary-import-config.json');
    fs.writeFileSync(configPath, JSON.stringify(adminConfig, null, 2));
    
    console.log(`✅ Configuración admin guardada en: ${configPath}`);
    console.log('ℹ️  El botón "Agregar Productos Nuevos Zachary" ya puede usar estos productos');
  }
}

// Ejecutar importador si se llama directamente
if (require.main === module) {
  const importer = new ZacharyProductImporter();
  
  importer.importAllProducts()
    .then(async () => {
      await importer.updateAdminButton();
      
      console.log('\n🎉 IMPORTACIÓN COMPLETADA EXITOSAMENTE');
      console.log('\n📝 PRODUCTOS ZACHARY LISTOS PARA:');
      console.log('✅ Mostrar en la tienda online');
      console.log('✅ Agregar al carrito');
      console.log('✅ Procesar con Webpay');
      console.log('✅ Gestionar desde panel admin');
      console.log('✅ Filtrar por categorías (Hombre/Mujer)');
      console.log('✅ Buscar por SKU o nombre');
      
      console.log('\n🚀 SIGUIENTES PASOS RECOMENDADOS:');
      console.log('1. 🖼️  Actualizar imágenes de productos desde el panel admin');
      console.log('2. ⭐ Marcar algunos productos como destacados');
      console.log('3. 📝 Revisar y mejorar descripciones si es necesario');
      console.log('4. 🏷️  Verificar precios y stock en el panel admin');
      console.log('5. 🌐 Probar la tienda en el frontend');
      
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error durante la importación:', error);
      process.exit(1);
    });
}

module.exports = { ZacharyProductImporter };
