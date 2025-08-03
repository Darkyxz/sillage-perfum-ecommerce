const { query, closePool } = require('./config/database');

(async () => {
  try {
    console.log('🔄 Iniciando migración de payment_status...');
    
    // Verificar si la columna payment_status existe
    const columns = await query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'orders' 
      AND COLUMN_NAME = 'payment_status'
      AND TABLE_SCHEMA = DATABASE()
    `);
    
    if (columns.length === 0) {
      console.log('Agregando columna payment_status...');
      await query(`
        ALTER TABLE orders 
        ADD COLUMN payment_status ENUM('pending', 'processing', 'paid', 'failed', 'refunded') 
        DEFAULT 'pending' 
        AFTER status
      `);
      console.log('✅ Columna payment_status agregada exitosamente');
    } else {
      console.log('✅ La columna payment_status ya existe');
    }
    
    console.log('\n✅ Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
  } finally {
    await closePool();
    process.exit(0);
  }
})();
