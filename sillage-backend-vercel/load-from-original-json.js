const { query } = require('./config/database');
const fs = require('fs');
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

async function loadFromOriginalJSON() {
    console.log('🚀 CARGANDO PRODUCTOS DESDE productos_sku_originales.json');
    console.log('='.repeat(70));

    try {
        // Actualizar estructura de tabla
        await updateTableStructure();

        console.log('✅ Conexión a MySQL OK');

        // Leer el archivo JSON
        const jsonPath = path.join(__dirname, 'productos_sku_originales.json');

        if (!fs.existsSync(jsonPath)) {
            throw new Error(`Archivo JSON no encontrado: ${jsonPath}`);
        }

        const jsonContent = fs.readFileSync(jsonPath, 'utf8');
        const products = JSON.parse(jsonContent);

        console.log(`📋 Productos encontrados en JSON: ${products.length}`);

        // 1. ELIMINAR todos los productos de hombre existentes
        console.log('🧹 Eliminando productos de hombre existentes...');
        const deleteResult = await query('DELETE FROM products WHERE category = "Hombre"');
        console.log(`✅ Eliminados ${deleteResult.affectedRows} productos de hombre`);

        let insertedCount = 0;
        let errorCount = 0;

        // 2. INSERTAR todos los productos del JSON
        for (const product of products) {
            try {
                if (!product.sku) {
                    console.log(`⚠️ Producto sin SKU: ${product.name}`);
                    errorCount++;
                    continue;
                }

                // Insertar producto con todos los campos del JSON
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
                    product.is_featured || false,
                    product.rating,
                    product.notes || '',
                    product.duration || '6-8 horas',
                    product.original_inspiration || 'Perfume Imitacion',
                    product.size,
                    product.concentration || 'Eau de Parfum'
                ]);

                console.log(`✅ Insertado: ${product.sku} - ${product.name.substring(0, 50)}...`);
                insertedCount++;

            } catch (error) {
                console.error(`❌ Error con producto ${product.sku}:`, error.message);
                errorCount++;
            }
        }

        console.log(`\n🎉 Proceso completado:`);
        console.log(`✅ Insertados: ${insertedCount}`);
        console.log(`❌ Errores: ${errorCount}`);

        // 3. VERIFICAR resultado final
        const finalProducts = await query(`
      SELECT sku, name, is_active, size, price 
      FROM products 
      WHERE category = 'Hombre' 
      ORDER BY sku
    `);

        console.log(`\n📦 Total productos de hombre en BD: ${finalProducts.length}`);
        console.log(`✅ Productos activos: ${finalProducts.filter(p => p.is_active).length}`);

        // Agrupar por fragancia (sin el tamaño)
        const fragranceGroups = {};
        finalProducts.forEach(product => {
            const baseCode = product.sku.replace(/-\d+ML$/, ''); // Remover -30ML, -50ML, -100ML
            if (!fragranceGroups[baseCode]) {
                fragranceGroups[baseCode] = [];
            }
            fragranceGroups[baseCode].push(product);
        });

        console.log(`\n🧪 Fragancias únicas: ${Object.keys(fragranceGroups).length}`);
        console.log(`📊 Productos por fragancia:`);

        Object.entries(fragranceGroups).forEach(([baseCode, products]) => {
            const sizes = products.map(p => p.size).join(', ');
            const prices = products.map(p => `$${p.price.toLocaleString('es-CL')}`).join(', ');
            console.log(`   ${baseCode}: ${products.length} tamaños (${sizes}) - Precios: ${prices}`);
        });

        // Verificar precios
        const priceCheck = {
            '30ml': finalProducts.filter(p => p.size === '30ml' && p.price !== 9000).length,
            '50ml': finalProducts.filter(p => p.size === '50ml' && p.price !== 14000).length,
            '100ml': finalProducts.filter(p => p.size === '100ml' && p.price !== 18000).length
        };

        console.log(`\n💰 Verificación de precios:`);
        console.log(`   30ml con precio incorrecto: ${priceCheck['30ml']}`);
        console.log(`   50ml con precio incorrecto: ${priceCheck['50ml']}`);
        console.log(`   100ml con precio incorrecto: ${priceCheck['100ml']}`);

        if (priceCheck['30ml'] === 0 && priceCheck['50ml'] === 0 && priceCheck['100ml'] === 0) {
            console.log(`✅ Todos los precios están correctos`);
        }

        return { insertedCount, errorCount, total: finalProducts.length, fragrances: Object.keys(fragranceGroups).length };

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    loadFromOriginalJSON()
        .then((result) => {
            console.log('\n🎉 CARGA DESDE JSON COMPLETADA EXITOSAMENTE');
            console.log(`📊 Resultado: ${result.insertedCount} productos insertados`);
            console.log(`🧪 ${result.fragrances} fragancias únicas cargadas`);
            console.log('✅ SKUs originales mantenidos como están en el JSON');
            console.log('💰 Precios: 30ml=$9,000 | 50ml=$14,000 | 100ml=$18,000');
            console.log('\n🔗 Verifica en: http://localhost:5173/categoria/perfume-varon');

            if (result.total < 129) {
                console.log(`\n⚠️ NOTA: Se cargaron ${result.total} productos, pero para 43 fragancias`);
                console.log(`   completas necesitas 129 productos (43 × 3 tamaños).`);
                console.log(`   Actualmente tienes ${result.fragrances} fragancias únicas.`);
            }

            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Error:', error);
            process.exit(1);
        });
}

module.exports = { loadFromOriginalJSON };