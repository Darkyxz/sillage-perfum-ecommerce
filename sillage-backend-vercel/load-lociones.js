const { query } = require('./config/database');
const fs = require('fs');
const path = require('path');

/**
 * Asegura que la tabla de productos tenga todas las columnas necesarias.
 */
async function updateTableStructure() {
  try {
    console.log('🔧 Verificando y actualizando estructura de la tabla si es necesario...');

    const tableInfo = await query('DESCRIBE products');
    const columns = tableInfo.map(col => col.Field);

    const requiredColumns = [
      { name: 'notes', type: 'TEXT' },
      { name: 'duration', type: 'VARCHAR(100)' },
      { name: 'original_inspiration', type: 'VARCHAR(255)' },
      { name: 'size', type: 'VARCHAR(20)' },
      { name: 'concentration', type: 'VARCHAR(50)' },
      { name: 'in_stock', type: 'BOOLEAN DEFAULT TRUE' },
      { name: 'is_active', type: 'BOOLEAN DEFAULT TRUE' }
    ];

    for (const col of requiredColumns) {
      if (!columns.includes(col.name)) {
        console.log(`➕ Agregando columna faltante: ${col.name}...`);
        await query(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
      }
    }

    console.log('✅ La estructura de la tabla está actualizada.');

  } catch (error) {
    console.error('❌ Error al actualizar la estructura de la tabla:', error);
    throw error; // Detiene la ejecución si la tabla no se puede preparar
  }
}

/**
 * Carga los productos desde locionesUp.js a la base de datos.
 */
async function loadLociones() {
  console.log('🚀 INICIANDO LA CARGA DE PRODUCTOS DE LOCIONES');
  console.log('='.repeat(70));

  try {
    // 1. Preparar la base de datos
    await updateTableStructure();
    console.log('✅ Conexión a MySQL establecida.');

    // 2. Leer el archivo de productos
    const locionesPath = path.join(__dirname, 'locionesUp.js');
    const locionesData = fs.readFileSync(locionesPath, 'utf-8');
    const lociones = JSON.parse(locionesData);

    console.log(`📋 Se encontraron ${lociones.length} productos de tipo "Loción" para procesar.`);
    console.log('='.repeat(70));

    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // 3. Procesar e insertar cada producto
    for (const product of lociones) {
      try {
        if (!product.sku) {
          console.warn(`⚠️ Producto omitido por no tener SKU: ${product.name}`);
          errorCount++;
          continue;
        }

        // Evitar duplicados: verificar si el SKU ya existe
        const existingProduct = await query('SELECT sku FROM products WHERE sku = ?', [product.sku]);

        if (existingProduct.length > 0) {
          console.log(`⏩ Omitiendo producto existente con SKU: ${product.sku}`);
          skippedCount++;
          continue;
        }

        // Insertar el nuevo producto
        await query(
          `INSERT INTO products (
            name, description, price, sku, brand, category, image_url, 
            stock_quantity, is_featured, rating, is_active, in_stock, notes, 
            duration, original_inspiration, size, concentration
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
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
            product.in_stock,
            product.notes,
            product.duration,
            product.original_inspiration,
            product.size,
            product.concentration
          ]
        );

        console.log(`✅ Insertado: ${product.name} (SKU: ${product.sku})`);
        insertedCount++;

      } catch (error) {
        console.error(`❌ Error al procesar el producto con SKU ${product.sku}:`, error.message);
        errorCount++;
      }
    }

    // 4. Mostrar resumen final
    console.log('='.repeat(70));
    console.log('\n🎉 PROCESO DE CARGA FINALIZADO');
    console.log(`   -> ✅ Productos nuevos insertados: ${insertedCount}`);
    console.log(`   -> ⏩ Productos omitidos (ya existían): ${skippedCount}`);
    console.log(`   -> ❌ Errores encontrados: ${errorCount}`);
    console.log('='.repeat(70));

  } catch (error) {
    console.error('💥 Error fatal durante el script de carga:', error);
    throw error;
  }
}

// Ejecutar la función principal si el script es llamado directamente
if (require.main === module) {
  loadLociones()
    .then(() => {
      console.log('\n✨ Carga de lociones completada exitosamente.');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n🚨 El script de carga de lociones falló. Error:', error);
      process.exit(1);
    });
}

module.exports = { loadLociones };
