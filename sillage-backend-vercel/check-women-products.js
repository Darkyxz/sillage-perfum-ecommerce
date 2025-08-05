const { query } = require('./config/database');

async function checkWomenProducts() {
    console.log('🔍 VERIFICANDO PRODUCTOS DE MUJER EN LA BASE DE DATOS');
    console.log('='.repeat(60));

    try {
        // Obtener todos los productos de mujer
        const allWomenProducts = await query(`
      SELECT sku, name, size, price, is_active 
      FROM products 
      WHERE category = 'Mujer' 
      ORDER BY sku
    `);

        console.log(`📦 Total productos de mujer en BD: ${allWomenProducts.length}`);
        console.log(`✅ Productos activos: ${allWomenProducts.filter(p => p.is_active).length}`);

        // Agrupar por fragancia base (SKU sin tamaño)
        const fragranceGroups = {};
        allWomenProducts.forEach(product => {
            const baseSKU = product.sku.replace(/-\d+ML$/i, '');
            if (!fragranceGroups[baseSKU]) {
                fragranceGroups[baseSKU] = [];
            }
            fragranceGroups[baseSKU].push(product);
        });

        console.log(`\n🧪 Fragancias únicas: ${Object.keys(fragranceGroups).length}`);
        console.log(`📊 Detalle por fragancia:`);

        Object.entries(fragranceGroups).forEach(([baseCode, products]) => {
            const sizes = products.map(p => p.size).join(', ');
            const prices = products.map(p => `$${p.price.toLocaleString('es-CL')}`).join(', ');
            const activeCount = products.filter(p => p.is_active).length;
            console.log(`   ${baseCode}: ${products.length} productos (${sizes}) - Activos: ${activeCount} - Precios: ${prices}`);
        });

        // Verificar si hay productos incompletos (sin todos los tamaños)
        const incompleteFragrances = Object.entries(fragranceGroups).filter(([_, products]) => products.length < 3);
        if (incompleteFragrances.length > 0) {
            console.log(`\n⚠️ Fragancias incompletas (menos de 3 tamaños):`);
            incompleteFragrances.forEach(([baseCode, products]) => {
                const sizes = products.map(p => p.size).join(', ');
                console.log(`   ${baseCode}: ${products.length} tamaños (${sizes})`);
            });
        }

        // Mostrar los primeros 10 productos como muestra
        console.log(`\n📋 Muestra de productos (primeros 10):`);
        allWomenProducts.slice(0, 10).forEach(product => {
            console.log(`   ${product.sku} - ${product.name.substring(0, 50)}... - ${product.size} - $${product.price.toLocaleString('es-CL')} - ${product.is_active ? 'Activo' : 'Inactivo'}`);
        });

        return {
            totalProducts: allWomenProducts.length,
            activeProducts: allWomenProducts.filter(p => p.is_active).length,
            uniqueFragrances: Object.keys(fragranceGroups).length,
            incompleteFragrances: incompleteFragrances.length
        };

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    checkWomenProducts()
        .then((result) => {
            console.log('\n🎉 VERIFICACIÓN COMPLETADA');
            console.log(`📊 Resumen:`);
            console.log(`   - Total productos: ${result.totalProducts}`);
            console.log(`   - Productos activos: ${result.activeProducts}`);
            console.log(`   - Fragancias únicas: ${result.uniqueFragrances}`);
            console.log(`   - Fragancias incompletas: ${result.incompleteFragrances}`);

            if (result.uniqueFragrances < 31) {
                console.log(`\n⚠️ NOTA: Se esperaban 31 fragancias únicas, pero solo hay ${result.uniqueFragrances}`);
                console.log(`   Esto puede explicar por qué no aparecen todas en la página web.`);
            }

            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Error:', error);
            process.exit(1);
        });
}

module.exports = { checkWomenProducts };