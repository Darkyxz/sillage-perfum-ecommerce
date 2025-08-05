const { query } = require('./config/database');

// Mapeo de SKUs actuales a SKUs correlativos para mujeres
const skuMapping = {
    // 212 Woman
    'ZP1W-30ML': 'ZP1W-30ML',   // Ya correcto
    'ZP1W-50ML': 'ZP1W-50ML',   // Ya correcto  
    'ZP1W-100ML': 'ZP1W-100ML', // Ya correcto

    // 212 Sexy Woman
    'ZP2W-30ML': 'ZP2W-30ML',   // Ya correcto
    'ZP2W-50ML': 'ZP2W-50ML',   // Ya correcto
    'ZP2W-100ML': 'ZP2W-100ML', // Ya correcto

    // 212 VIP Woman
    'ZP3W-30ML': 'ZP3W-30ML',   // Ya correcto
    'ZP3W-50ML': 'ZP3W-50ML',   // Ya correcto
    'ZP3W-100ML': 'ZP3W-100ML', // Ya correcto

    // 212 VIP Rose Woman
    'ZP4W-30ML': 'ZP4W-30ML',   // Ya correcto
    'ZP4W-50ML': 'ZP4W-50ML',   // Ya correcto
    'ZP4W-100ML': 'ZP4W-100ML', // Ya correcto

    // Acqua di Gio Woman
    'ZP5W-30ML': 'ZP5W-30ML',   // Ya correcto
    'ZP5W-50ML': 'ZP5W-50ML',   // Ya correcto
    'ZP5W-100ML': 'ZP5W-100ML', // Ya correcto

    // Amor Amor Woman (era ZP7W, ahora ZP6W)
    'ZP7W-30ML': 'ZP6W-30ML',
    'ZP7W-50ML': 'ZP6W-50ML',
    'ZP7W-100ML': 'ZP6W-100ML',

    // Be Delicious Woman (era ZP13W, ahora ZP7W)
    'ZP13W-30ML': 'ZP7W-30ML',
    'ZP13W-50ML': 'ZP7W-50ML',
    'ZP13W-100ML': 'ZP7W-100ML',

    // CH Woman (era ZP16W, ahora ZP8W)
    'ZP16W-30ML': 'ZP8W-30ML',
    'ZP16W-50ML': 'ZP8W-50ML',
    'ZP16W-100ML': 'ZP8W-100ML',

    // Can Can (era ZP18W, ahora ZP9W)
    'ZP18W-30ML': 'ZP9W-30ML',
    'ZP18W-50ML': 'ZP9W-50ML',
    'ZP18W-100ML': 'ZP9W-100ML',

    // Carolina Herrera Woman (era ZP20W, ahora ZP10W)
    'ZP20W-30ML': 'ZP10W-30ML',
    'ZP20W-50ML': 'ZP10W-50ML',
    'ZP20W-100ML': 'ZP10W-100ML'
};

async function fixWomenSKUs() {
    console.log('🔧 CORRIGIENDO SKUs DE PRODUCTOS DE MUJER');
    console.log('='.repeat(60));

    try {
        console.log('✅ Conexión a MySQL OK');

        let updatedCount = 0;
        let errorCount = 0;

        // Verificar productos existentes
        const existingProducts = await query('SELECT sku, name FROM products WHERE category = "Mujer"');
        console.log(`📋 Productos de mujer encontrados: ${existingProducts.length}`);

        for (const [oldSku, newSku] of Object.entries(skuMapping)) {
            try {
                // Solo actualizar si el SKU realmente cambió
                if (oldSku !== newSku) {
                    const result = await query('UPDATE products SET sku = ? WHERE sku = ?', [newSku, oldSku]);

                    if (result.affectedRows > 0) {
                        console.log(`✅ Actualizado: ${oldSku} → ${newSku}`);
                        updatedCount++;
                    } else {
                        console.log(`⚠️ No encontrado: ${oldSku}`);
                    }
                }

            } catch (error) {
                console.error(`❌ Error actualizando ${oldSku}:`, error.message);
                errorCount++;
            }
        }

        console.log(`\n🎉 Proceso completado:`);
        console.log(`✅ SKUs actualizados: ${updatedCount}`);
        console.log(`❌ Errores: ${errorCount}`);

        // Verificar resultado final
        const finalProducts = await query(`
      SELECT sku, name 
      FROM products 
      WHERE category = "Mujer" 
      ORDER BY sku
    `);

        console.log('\n📊 SKUs finales de productos de mujer:');
        finalProducts.forEach(product => {
            console.log(`   ${product.sku} - ${product.name.substring(0, 50)}...`);
        });

        return { updatedCount, errorCount };

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    fixWomenSKUs()
        .then(() => {
            console.log('\n🎉 CORRECCIÓN DE SKUs COMPLETADA');
            console.log('✅ Los productos de mujer ahora tienen SKUs correlativos');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Error:', error);
            process.exit(1);
        });
}

module.exports = { fixWomenSKUs };