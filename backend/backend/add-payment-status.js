const { query, closePool } = require('./config/database');

(async () => {
  try {
    // Verificar si la columna payment_status existe
    const columns = await query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'orders' 
      AND COLUMN_NAME = 'payment_status'
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
    
    // Verificar si la columna webpay_token existe
    const tokenColumns = await query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'orders' 
      AND COLUMN_NAME = 'webpay_token'
    `);
    
    if (tokenColumns.length === 0) {
      console.log('Agregando columna webpay_token...');
      await query(`
        ALTER TABLE orders 
        ADD COLUMN webpay_token VARCHAR(255) NULL 
        AFTER payment_status
      `);
      console.log('✅ Columna webpay_token agregada exitosamente');
    } else {
      console.log('✅ La columna webpay_token ya existe');
    }
    
    // Verificar si la columna payment_date existe
    const dateColumns = await query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'orders' 
      AND COLUMN_NAME = 'payment_date'
    `);
    
    if (dateColumns.length === 0) {
      console.log('Agregando columna payment_date...');
      await query(`
        ALTER TABLE orders 
        ADD COLUMN payment_date DATETIME NULL 
        AFTER webpay_token
      `);
      console.log('✅ Columna payment_date agregada exitosamente');
    } else {
      console.log('✅ La columna payment_date ya existe');
    }
    
    console.log('\n✅ Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
  } finally {
    await closePool();
    process.exit(0);
  }
})();
