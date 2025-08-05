const { query } = require('./config/database');

async function checkCurrentProducts() {
    console.log('🔍 VERIFICANDO PRODUCTOS ACTUALES EN LA BASE DE DATOS');
    console.log('='.repeat(70));

    try {
        // Verificar productos de mujer
        const womenProducts = await query(`
      SELECT sku, name, category, is_active 
      FROM products 
      WHERE category = 'Mujer' 
      ORDER BY sku
    `);

        console.log(`📋 Productos de mujer en BD: ${womenProducts.length}`);
        console.log('\n👩 PRODUCTOS DE MUJER ACTUALES:');
        womenProducts.forEach((product, index) => {
            const status = product.is_active ? '✅' : '❌';
            console.log(`${index + 1}. ${status} ${product.sku} - ${product.name.substring(0, 60)}...`);
        });

        // Verificar productos activos vs inactivos
        const activeWomen = await query(`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE category = 'Mujer' AND is_active = 1
    `);

        const inactiveWomen = await query(`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE category = 'Mujer' AND is_active = 0
    `);

        console.log(`\n📊 ESTADÍSTICAS:`);
        console.log(`✅ Productos activos: ${activeWomen[0].count}`);
        console.log(`❌ Productos inactivos: ${inactiveWomen[0].count}`);
        console.log(`📦 Total: ${womenProducts.length}`);

        // Verificar SKUs únicos (sin duplicados)
        const uniqueSKUs = await query(`
      SELECT sku, COUNT(*) as count 
      FROM products 
      WHERE category = 'Mujer' 
      GROUP BY sku 
      HAVING count > 1
    `);

        if (uniqueSKUs.length > 0) {
            console.log(`\n⚠️ SKUs DUPLICADOS ENCONTRADOS:`);
            uniqueSKUs.forEach(sku => {
                console.log(`   ${sku.sku}: ${sku.count} veces`);
            });
        } else {
            console.log(`\n✅ No hay SKUs duplicados`);
        }

        // Verificar patrones de SKU
        const skuPatterns = womenProducts.map(p => p.sku.match(/ZP(\d+)W/)?.[1]).filter(Boolean);
        const numbers = skuPatterns.map(n => parseInt(n)).sort((a, b) => a - b);

        console.log(`\n🔢 NÚMEROS DE SKU ENCONTRADOS:`);
        console.log(`Números: [${numbers.join(', ')}]`);

        // Detectar saltos
        const gaps = [];
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i] - numbers[i - 1] > 1) {
                gaps.push(`Salto de ${numbers[i - 1]} a ${numbers[i]}`);
            }
        }

        if (gaps.length > 0) {
            console.log(`\n⚠️ SALTOS DETECTADOS:`);
            gaps.forEach(gap => console.log(`   ${gap}`));
        } else {
            console.log(`\n✅ SKUs son correlativos`);
        }

        return {
            total: womenProducts.length,
            active: activeWomen[0].count,
            inactive: inactiveWomen[0].count,
            duplicates: uniqueSKUs.length,
            gaps: gaps.length
        };

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    checkCurrentProducts()
        .then((stats) => {
            console.log('\n🎯 RESUMEN:');
            console.log(`- Total productos de mujer: ${stats.total}`);
            console.log(`- Productos activos: ${stats.active}`);
            console.log(`- Productos inactivos: ${stats.inactive}`);
            console.log(`- SKUs duplicados: ${stats.duplicates}`);
            console.log(`- Saltos en numeración: ${stats.gaps}`);

            if (stats.active < 43) {
                console.log('\n⚠️ PROBLEMA: Faltan productos activos en la BD');
            }
            if (stats.gaps > 0) {
                console.log('⚠️ PROBLEMA: Los SKUs no son correlativos');
            }

            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Error:', error);
            process.exit(1);
        });
}

module.exports = { checkCurrentProducts };