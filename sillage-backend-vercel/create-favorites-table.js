const mysql = require('mysql2/promise');
require('dotenv').config();

async function createFavoritesTable() {
    let connection;

    try {
        console.log('🔧 Conectando a la base de datos de Hostinger...');

        // Crear conexión a tu base de datos de Hostinger
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            ssl: {
                rejectUnauthorized: false
            }
        });

        console.log('✅ Conectado a la base de datos');

        // Verificar si la tabla ya existe
        const [tableExists] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = ? 
      AND table_name = 'favorites'
    `, [process.env.DB_NAME]);

        if (tableExists[0].count > 0) {
            console.log('✅ La tabla favorites ya existe');

            // Verificar estructura
            const [columns] = await connection.execute('DESCRIBE favorites');
            console.log('📋 Estructura actual:');
            console.table(columns);
            return;
        }

        console.log('🔧 Creando tabla de favoritos...');

        // Crear tabla de favoritos
        const createTableSQL = `
      CREATE TABLE favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_product (user_id, product_id),
        INDEX idx_user_id (user_id),
        INDEX idx_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

        await connection.execute(createTableSQL);
        console.log('✅ Tabla favorites creada exitosamente');

        // Verificar la tabla creada
        const [newColumns] = await connection.execute('DESCRIBE favorites');
        console.log('📋 Estructura de la nueva tabla:');
        console.table(newColumns);

        // Verificar que las tablas users y products existen
        const [userTable] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'users'
    `, [process.env.DB_NAME]);

        const [productTable] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'products'
    `, [process.env.DB_NAME]);

        console.log(`📊 Tabla users existe: ${userTable[0].count > 0 ? '✅' : '❌'}`);
        console.log(`📊 Tabla products existe: ${productTable[0].count > 0 ? '✅' : '❌'}`);

    } catch (error) {
        console.error('❌ Error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            console.error('🔥 No se puede conectar a la base de datos. Verifica:');
            console.error('   - DB_HOST:', process.env.DB_HOST);
            console.error('   - DB_USER:', process.env.DB_USER);
            console.error('   - DB_NAME:', process.env.DB_NAME);
            console.error('   - DB_PORT:', process.env.DB_PORT);
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexión cerrada');
        }
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    createFavoritesTable()
        .then(() => {
            console.log('🎉 Proceso completado');
            process.exit(0);
        })
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = { createFavoritesTable };