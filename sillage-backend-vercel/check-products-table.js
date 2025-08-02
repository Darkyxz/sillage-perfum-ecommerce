const { query } = require('./config/database');

async function checkProductsTable() {
    try {
        console.log('🔍 Verificando estructura de la tabla products...');

        // Verificar si la tabla existe
        const tableExists = await query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'products'
    `);

        if (tableExists[0].count === 0) {
            console.log('❌ La tabla products no existe');
            return;
        }

        console.log('✅ La tabla products existe');

        // Obtener estructura de la tabla
        const columns = await query('DESCRIBE products');
        console.log('\n📋 Estructura actual de la tabla products:');
        console.table(columns);

        // Verificar campos requeridos
        const requiredFields = [
            'id', 'name', 'description', 'price', 'sku', 'brand', 'category',
            'image_url', 'stock_quantity', 'is_featured', 'is_active', 'rating',
            'in_stock', 'notes', 'duration', 'original_inspiration', 'size', 'concentration',
            'created_at', 'updated_at'
        ];

        const existingFields = columns.map(col => col.Field);
        const missingFields = requiredFields.filter(field => !existingFields.includes(field));

        if (missingFields.length > 0) {
            console.log('\n❌ Campos faltantes:');
            missingFields.forEach(field => console.log(`  - ${field}`));

            console.log('\n🔧 Agregando campos faltantes...');

            for (const field of missingFields) {
                let sql = '';

                switch (field) {
                    case 'in_stock':
                        sql = 'ALTER TABLE products ADD COLUMN in_stock BOOLEAN DEFAULT TRUE';
                        break;
                    case 'notes':
                        sql = 'ALTER TABLE products ADD COLUMN notes TEXT';
                        break;
                    case 'duration':
                        sql = 'ALTER TABLE products ADD COLUMN duration VARCHAR(50)';
                        break;
                    case 'original_inspiration':
                        sql = 'ALTER TABLE products ADD COLUMN original_inspiration VARCHAR(255)';
                        break;
                    case 'size':
                        sql = 'ALTER TABLE products ADD COLUMN size VARCHAR(50)';
                        break;
                    case 'concentration':
                        sql = 'ALTER TABLE products ADD COLUMN concentration VARCHAR(50)';
                        break;
                    case 'updated_at':
                        sql = 'ALTER TABLE products ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP';
                        break;
                    default:
                        console.log(`⚠️  Campo ${field} no reconocido, saltando...`);
                        continue;
                }

                if (sql) {
                    try {
                        await query(sql);
                        console.log(`✅ Campo ${field} agregado`);
                    } catch (error) {
                        console.log(`❌ Error agregando campo ${field}:`, error.message);
                    }
                }
            }
        } else {
            console.log('\n✅ Todos los campos requeridos están presentes');
        }

        // Contar productos
        const productCount = await query('SELECT COUNT(*) as count FROM products');
        console.log(`\n📊 Total de productos en la base de datos: ${productCount[0].count}`);

        // Mostrar algunos productos de ejemplo
        if (productCount[0].count > 0) {
            const sampleProducts = await query('SELECT id, name, sku, price, category FROM products LIMIT 5');
            console.log('\n📦 Productos de ejemplo:');
            console.table(sampleProducts);
        }

        console.log('\n✅ Verificación completada');

    } catch (error) {
        console.error('❌ Error verificando tabla products:', error);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    checkProductsTable()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = { checkProductsTable };