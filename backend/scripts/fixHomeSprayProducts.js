require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function fixHomeSprayProducts() {
  let connection;
  
  try {
    // Crear conexión a la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'sillage_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('🔄 Iniciando corrección de productos Home Spray...\n');

    // 1. Primero, obtener todos los productos Home Spray únicos (por nombre)
    const [homeSprayProducts] = await connection.execute(`
      SELECT DISTINCT name, brand, category, description, image_url, 
             concentration, is_featured, fragrance_profile,
             fragrance_notes_top, fragrance_notes_middle, fragrance_notes_base,
             SUBSTRING_INDEX(sku, '-', -2) as base_sku_part
      FROM products 
      WHERE category = 'Hogar' OR sku LIKE 'ZHS-%'
      GROUP BY name
    `);

    console.log(`📦 Encontrados ${homeSprayProducts.length} productos Home Spray únicos\n`);

    for (const product of homeSprayProducts) {
      console.log(`\n🔧 Procesando: ${product.name}`);
      
      // Generar nuevo SKU base sin el tamaño
      const baseSku = product.base_sku_part.replace(/-\d+ML$/i, '');
      const newSku = `${baseSku}-200ML`;
      
      try {
        // Verificar si ya existe un producto con el nuevo SKU
        const [existing] = await connection.execute(
          'SELECT id FROM products WHERE sku = ?',
          [newSku]
        );

        if (existing.length > 0) {
          console.log(`   ⚠️  Ya existe un producto con SKU ${newSku}, actualizando...`);
          
          // Actualizar el producto existente
          await connection.execute(`
            UPDATE products 
            SET price = 7500, 
                size = '200ml',
                updated_at = NOW()
            WHERE sku = ?
          `, [newSku]);
          
          // Eliminar las otras variantes
          await connection.execute(`
            DELETE FROM products 
            WHERE name = ? AND sku != ? AND (category = 'Hogar' OR sku LIKE 'ZHS-%')
          `, [product.name, newSku]);
          
        } else {
          // Buscar todas las variantes de este producto
          const [variants] = await connection.execute(`
            SELECT id, sku FROM products 
            WHERE name = ? AND (category = 'Hogar' OR sku LIKE 'ZHS-%')
            ORDER BY id ASC
          `, [product.name]);

          if (variants.length > 0) {
            // Usar el primer ID para mantener referencias
            const primaryId = variants[0].id;
            
            // Actualizar el primer registro con los nuevos valores
            await connection.execute(`
              UPDATE products 
              SET sku = ?,
                  price = 7500,
                  size = '200ml',
                  updated_at = NOW()
              WHERE id = ?
            `, [newSku, primaryId]);
            
            console.log(`   ✅ Actualizado a: SKU ${newSku}, Precio $7500, Tamaño 200ml`);
            
            // Eliminar las otras variantes (si existen)
            if (variants.length > 1) {
              const idsToDelete = variants.slice(1).map(v => v.id);
              await connection.execute(`
                DELETE FROM products WHERE id IN (${idsToDelete.map(() => '?').join(',')})
              `, idsToDelete);
              
              console.log(`   🗑️  Eliminadas ${idsToDelete.length} variantes duplicadas`);
            }
          }
        }
        
      } catch (error) {
        console.error(`   ❌ Error procesando ${product.name}:`, error.message);
      }
    }

    // 2. Verificación final
    console.log('\n\n📊 Verificando resultados...');
    const [finalProducts] = await connection.execute(`
      SELECT name, sku, price, size 
      FROM products 
      WHERE category = 'Hogar' OR sku LIKE 'ZHS-%'
      ORDER BY name
    `);

    console.log('\n✅ Productos Home Spray actualizados:');
    finalProducts.forEach(p => {
      console.log(`   - ${p.name}: SKU ${p.sku}, $${p.price}, ${p.size}`);
    });

    console.log(`\n✨ Proceso completado. Total de productos Home Spray: ${finalProducts.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar el script
fixHomeSprayProducts();
