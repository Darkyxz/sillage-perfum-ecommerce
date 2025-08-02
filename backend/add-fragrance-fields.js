const { query } = require('./config/database');

async function addFragranceFields() {
    try {
        console.log('🔧 Agregando campos de notas olfativas a la tabla products...');

        // Verificar si los campos ya existen
        const columns = await query('DESCRIBE products');
        const existingFields = columns.map(col => col.Field);

        const fieldsToAdd = [
            {
                name: 'fragrance_profile',
                sql: 'ALTER TABLE products ADD COLUMN fragrance_profile JSON'
            },
            {
                name: 'fragrance_notes_top',
                sql: 'ALTER TABLE products ADD COLUMN fragrance_notes_top JSON'
            },
            {
                name: 'fragrance_notes_middle',
                sql: 'ALTER TABLE products ADD COLUMN fragrance_notes_middle JSON'
            },
            {
                name: 'fragrance_notes_base',
                sql: 'ALTER TABLE products ADD COLUMN fragrance_notes_base JSON'
            }
        ];

        for (const field of fieldsToAdd) {
            if (!existingFields.includes(field.name)) {
                try {
                    await query(field.sql);
                    console.log(`✅ Campo ${field.name} agregado`);
                } catch (error) {
                    console.log(`❌ Error agregando campo ${field.name}:`, error.message);
                }
            } else {
                console.log(`⚠️  Campo ${field.name} ya existe`);
            }
        }

        console.log('✅ Campos de notas olfativas agregados exitosamente');

    } catch (error) {
        console.error('❌ Error agregando campos de notas olfativas:', error);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    addFragranceFields()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = { addFragranceFields };