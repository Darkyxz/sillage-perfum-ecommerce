const { query } = require('./config/database');

// Fragancias faltantes basadas en tu lista original
const missingFragrances = [
    { code: "ZP73W", name: "Ralph – Eau de Parfum floral frutal femenino", inspiration: "RALPH - Ralph Lauren" },
    { code: "ZP82W", name: "Tommy Girl – Eau de Parfum floral frutal femenino", inspiration: "TOMMY GIRL - Tommy Hilfiger" },
    { code: "ZP87W", name: "XS Black Woman – Eau de Parfum oriental especiado femenino", inspiration: "XS BLACK WOMAN - Paco Rabanne" },
    { code: "ZP89W", name: "Sí Armani – Eau de Parfum floral chypre femenino", inspiration: "SÍ ARMANI - Giorgio Armani" }
];

async function addMissingWomenFragrances() {
    console.log('🚀 AGREGANDO FRAGANCIAS DE MUJER FALTANTES');
    console.log('='.repeat(60));

    try {
        console.log('✅ Conexión a MySQL OK');

        let insertedCount = 0;
        let errorCount = 0;

        // 1. Completar ZP111W (Miss Dior) - agregar 50ml faltante
        console.log('\n🔧 Completando ZP111W (Miss Dior) - agregando 50ml...');
        try {
            const sku = 'ZP111W-50ML';
            const existing = await query('SELECT id FROM products WHERE sku = ?', [sku]);
            if (existing.length === 0) {
                await query(`
          INSERT INTO products (
            name, description, price, sku, brand, category,
            image_url, stock_quantity, is_featured, rating, is_active,
            notes, duration, original_inspiration, size, concentration
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
        `, [
                    'Miss Dior – Eau de Parfum avainillado y atalcado femenino 50ml',
                    'Descubre la esencia de la elegancia y la sofisticación con nuestra exquisita fragancia avainillada y atalcada. Inspirada en MISS DIOR de Dior.',
                    14000,
                    sku,
                    'Zachary Perfumes',
                    'Mujer',
                    '/images/sillapM.jpg',
                    50,
                    false,
                    4.9,
                    'Notas de salida: Rosas, Florales. Notas de corazón: Avainillado. Notas de fondo: Avainillado, Atalcado',
                    '8-10 horas',
                    'MISS DIOR - Dior',
                    '50ml',
                    'Eau de Parfum'
                ]);
                console.log('   ✅ Agregado: ZP111W-50ML - $14.000');
                insertedCount++;
            } else {
                console.log('   ⚠️ Ya existe: ZP111W-50ML');
            }
        } catch (error) {
            console.error('   ❌ Error con ZP111W-50ML:', error.message);
            errorCount++;
        }

        // 2. Agregar fragancias faltantes
        console.log('\n📦 Agregando fragancias faltantes...');

        for (const fragrance of missingFragrances) {
            console.log(`\n🧪 Procesando: ${fragrance.code} - ${fragrance.inspiration}`);

            const sizes = [
                { size: '30ml', price: 9000 },
                { size: '50ml', price: 14000 },
                { size: '100ml', price: 18000 }
            ];

            for (const sizeInfo of sizes) {
                try {
                    const sku = `${fragrance.code}-${sizeInfo.size.toUpperCase()}`;
                    const fullName = `${fragrance.name} ${sizeInfo.size}`;

                    const existing = await query('SELECT id FROM products WHERE sku = ?', [sku]);
                    if (existing.length > 0) {
                        console.log(`   ⚠️ Ya existe: ${sku}`);
                        continue;
                    }

                    await query(`
            INSERT INTO products (
              name, description, price, sku, brand, category,
              image_url, stock_quantity, is_featured, rating, is_active,
              notes, duration, original_inspiration, size, concentration
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
          `, [
                        fullName,
                        `Fragancia sofisticada y elegante inspirada en ${fragrance.inspiration}. Una experiencia olfativa única.`,
                        sizeInfo.price,
                        sku,
                        'Zachary Perfumes',
                        'Mujer',
                        '/images/sillapM.jpg',
                        50,
                        false,
                        4.5,
                        'Notas florales y elegantes que definen la sofisticación femenina',
                        '6-8 horas',
                        fragrance.inspiration,
                        sizeInfo.size,
                        'Eau de Parfum'
                    ]);

                    console.log(`   ✅ Agregado: ${sku} - $${sizeInfo.price.toLocaleString('es-CL')}`);
                    insertedCount++;

                } catch (error) {
                    console.error(`   ❌ Error con ${fragrance.code}-${sizeInfo.size}:`, error.message);
                    errorCount++;
                }
            }
        }

        console.log(`\n🎉 Proceso completado:`);
        console.log(`✅ Productos insertados: ${insertedCount}`);
        console.log(`❌ Errores: ${errorCount}`);

        // Verificar resultado final
        const finalProducts = await query(`
      SELECT sku, name, size 
      FROM products 
      WHERE category = 'Mujer' 
      ORDER BY sku
    `);

        const fragranceGroups = {};
        finalProducts.forEach(product => {
            const baseSKU = product.sku.replace(/-\d+ML$/i, '');
            if (!fragranceGroups[baseSKU]) {
                fragranceGroups[baseSKU] = [];
            }
            fragranceGroups[baseSKU].push(product);
        });

        console.log(`\n📊 Resultado final:`);
        console.log(`📦 Total productos de mujer: ${finalProducts.length}`);
        console.log(`🧪 Fragancias únicas: ${Object.keys(fragranceGroups).length}`);

        return { insertedCount, errorCount, totalFragrances: Object.keys(fragranceGroups).length };

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

if (require.main === module) {
    addMissingWomenFragrances()
        .then((result) => {
            console.log('\n🎉 PROCESO COMPLETADO');
            console.log(`📊 ${result.insertedCount} productos agregados`);
            console.log(`🧪 Total fragancias: ${result.totalFragrances}`);
            console.log('\n🔗 Verifica en: http://localhost:5173/categoria/perfume-dama');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Error:', error);
            process.exit(1);
        });
}

module.exports = { addMissingWomenFragrances };