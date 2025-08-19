const { query, testConnection } = require('../config/database');

async function createSubscribersTable() {
  console.log('🔄 Creando tabla de suscriptores...');
  
  try {
    // Probar conexión
    await testConnection();

    // Crear tabla subscribers
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS subscribers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        subscribed BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_token (token),
        INDEX idx_subscribed (subscribed)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await query(createTableSQL);
    console.log('✅ Tabla subscribers creada/verificada correctamente');

    // Verificar la estructura de la tabla
    const tableInfo = await query('DESCRIBE subscribers');
    console.log('📊 Estructura de la tabla subscribers:');
    console.table(tableInfo);

  } catch (error) {
    console.error('❌ Error creando tabla subscribers:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createSubscribersTable()
    .then(() => {
      console.log('✨ Script completado exitosamente');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error ejecutando script:', error);
      process.exit(1);
    });
}

module.exports = { createSubscribersTable };
