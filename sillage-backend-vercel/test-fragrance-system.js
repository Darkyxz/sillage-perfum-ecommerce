const { query } = require('./config/database');

async function testFragranceSystem() {
    try {
        console.log('🧪 Probando sistema de notas olfativas...');

        // 1. Verificar que los campos existen en la base de datos
        console.log('\n1️⃣ Verificando estructura de la tabla...');
        const columns = await query('DESCRIBE products');
        const fragranceFields = columns.filter(col =>
            col.Field.includes('fragrance_profile') ||
            col.Field.includes('fragrance_notes')
        );

        console.log('📋 Campos de notas olfativas encontrados:');
        fragranceFields.forEach(field => {
            console.log(`  ✅ ${field.Field} (${field.Type})`);
        });

        if (fragranceFields.length < 4) {
            console.log('❌ Faltan campos de notas olfativas');
            return false;
        }

        // 2. Probar inserción de datos de prueba
        console.log('\n2️⃣ Probando inserción de notas olfativas...');

        const testProduct = {
            name: 'Test Fragrance System',
            description: 'Producto de prueba para notas olfativas',
            price: 99.99,
            sku: 'TEST-FRAG-001',
            brand: 'Test Brand',
            category: 'Unisex',
            fragrance_profile: ['citrus', 'woody', 'fresh_spicy'],
            fragrance_notes_top: ['Bergamota', 'Limón', 'Mandarina'],
            fragrance_notes_middle: ['Rosa', 'Jazmín', 'Lavanda'],
            fragrance_notes_base: ['Sándalo', 'Ámbar', 'Almizcle']
        };

        const insertSql = `
      INSERT INTO products (
        name, description, price, sku, brand, category,
        fragrance_profile, fragrance_notes_top, fragrance_notes_middle, fragrance_notes_base
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const result = await query(insertSql, [
            testProduct.name,
            testProduct.description,
            testProduct.price,
            testProduct.sku,
            testProduct.brand,
            testProduct.category,
            JSON.stringify(testProduct.fragrance_profile),
            JSON.stringify(testProduct.fragrance_notes_top),
            JSON.stringify(testProduct.fragrance_notes_middle),
            JSON.stringify(testProduct.fragrance_notes_base)
        ]);

        console.log(`✅ Producto de prueba insertado con ID: ${result.insertId}`);

        // 3. Probar lectura de datos
        console.log('\n3️⃣ Probando lectura de notas olfativas...');

        const selectSql = `
      SELECT id, name, sku, fragrance_profile, fragrance_notes_top, 
             fragrance_notes_middle, fragrance_notes_base
      FROM products 
      WHERE sku = ?
    `;

        const products = await query(selectSql, [testProduct.sku]);

        if (products.length > 0) {
            const product = products[0];
            console.log('📦 Producto recuperado:');
            console.log(`  - Nombre: ${product.name}`);
            console.log(`  - SKU: ${product.sku}`);

            // Parsear y mostrar notas
            try {
                const profile = JSON.parse(product.fragrance_profile || '[]');
                const topNotes = JSON.parse(product.fragrance_notes_top || '[]');
                const middleNotes = JSON.parse(product.fragrance_notes_middle || '[]');
                const baseNotes = JSON.parse(product.fragrance_notes_base || '[]');

                console.log(`  - Perfil: ${profile.join(', ')}`);
                console.log(`  - Notas de salida: ${topNotes.join(', ')}`);
                console.log(`  - Notas de corazón: ${middleNotes.join(', ')}`);
                console.log(`  - Notas de base: ${baseNotes.join(', ')}`);

                console.log('✅ Notas olfativas leídas correctamente');
            } catch (parseError) {
                console.log('❌ Error parseando JSON de notas:', parseError.message);
                return false;
            }
        } else {
            console.log('❌ No se pudo recuperar el producto de prueba');
            return false;
        }

        // 4. Limpiar datos de prueba
        console.log('\n4️⃣ Limpiando datos de prueba...');
        await query('DELETE FROM products WHERE sku = ?', [testProduct.sku]);
        console.log('🧹 Producto de prueba eliminado');

        console.log('\n🎉 Sistema de notas olfativas funcionando correctamente');
        return true;

    } catch (error) {
        console.error('❌ Error probando sistema de notas olfativas:', error);
        return false;
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    testFragranceSystem()
        .then(success => {
            if (success) {
                console.log('\n✅ Todas las pruebas pasaron - Sistema listo para producción');
            } else {
                console.log('\n❌ Hay problemas con el sistema de notas olfativas');
            }
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = { testFragranceSystem };