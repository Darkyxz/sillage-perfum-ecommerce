const { query } = require('./config/database');

async function fixPaymentsTable() {
  console.log('🔧 VERIFICANDO Y CORRIGIENDO TABLA DE PAGOS');
  console.log('='.repeat(50));
  
  try {
    // Verificar conexión
    const testQuery = await query('SELECT 1 as test');
    console.log('✅ Conexión a base de datos OK');
    
    // Verificar si la tabla payments existe
    console.log('\n💳 Verificando tabla payments...');
    try {
      const paymentColumns = await query('DESCRIBE payments');
      const columnNames = paymentColumns.map(col => col.Field);
      console.log('📋 Columnas actuales en payments:', columnNames.join(', '));
      
      // Verificar si la columna transaction_id existe
      if (!columnNames.includes('transaction_id')) {
        console.log('➕ Agregando columna transaction_id...');
        await query('ALTER TABLE payments ADD COLUMN transaction_id VARCHAR(255) NULL');
        console.log('✅ Columna transaction_id agregada');
      }
      
      // Verificar otras columnas necesarias
      const requiredColumns = [
        { name: 'payment_id', type: 'VARCHAR(255)' },
        { name: 'payment_method', type: 'VARCHAR(50)' },
        { name: 'status', type: 'VARCHAR(50)' },
        { name: 'amount', type: 'DECIMAL(10,2)' },
        { name: 'currency', type: 'VARCHAR(3) DEFAULT "CLP"' },
        { name: 'authorization_code', type: 'VARCHAR(255)' },
        { name: 'response_code', type: 'VARCHAR(10)' }
      ];
      
      for (const col of requiredColumns) {
        if (!columnNames.includes(col.name)) {
          console.log(`➕ Agregando columna ${col.name}...`);
          await query(`ALTER TABLE payments ADD COLUMN ${col.name} ${col.type}`);
        }
      }
      
    } catch (error) {
      console.log('📦 Tabla payments no existe, creándola...');
      await query(`
        CREATE TABLE payments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          payment_id VARCHAR(255) NULL,
          payment_method VARCHAR(50) DEFAULT 'webpay',
          payment_type VARCHAR(50),
          status VARCHAR(50) DEFAULT 'pending',
          amount DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'CLP',
          installments INT DEFAULT 1,
          payer_email VARCHAR(255),
          payer_identification JSON,
          payment_data JSON,
          transaction_id VARCHAR(255),
          authorization_code VARCHAR(255),
          response_code VARCHAR(10),
          processed_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_order_id (order_id),
          INDEX idx_transaction_id (transaction_id),
          INDEX idx_payment_id (payment_id),
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
      `);
      console.log('✅ Tabla payments creada con estructura completa');
    }
    
    // Verificar que la tabla orders tiene las columnas necesarias
    console.log('\n📦 Verificando tabla orders...');
    try {
      const orderColumns = await query('DESCRIBE orders');
      const columnNames = orderColumns.map(col => col.Field);
      console.log('📋 Columnas actuales en orders:', columnNames.join(', '));
      
      // Verificar si la columna preference_id existe
      if (!columnNames.includes('preference_id')) {
        console.log('➕ Agregando columna preference_id...');
        await query('ALTER TABLE orders ADD COLUMN preference_id VARCHAR(255) NULL');
        console.log('✅ Columna preference_id agregada');
      }
      
      // Agregar índice para preference_id si no existe
      try {
        await query('CREATE INDEX idx_preference_id ON orders(preference_id)');
        console.log('✅ Índice preference_id creado');
      } catch (indexError) {
        // El índice ya existe o hubo otro error
        console.log('ℹ️ Índice preference_id ya existe o no se pudo crear');
      }
      
    } catch (error) {
      console.error('❌ Error verificando tabla orders:', error.message);
    }
    
    // Mostrar estructura final de la tabla payments
    console.log('\n📊 Estructura final de la tabla payments:');
    const finalStructure = await query('DESCRIBE payments');
    finalStructure.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });
    
    console.log('\n🎉 TABLA DE PAGOS CORREGIDA EXITOSAMENTE');
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  fixPaymentsTable()
    .then((success) => {
      if (success) {
        console.log('\n✅ TABLA DE PAGOS LISTA');
        console.log('💳 Ahora los pagos se pueden procesar correctamente');
      } else {
        console.log('\n❌ HUBO PROBLEMAS AL CORREGIR LA TABLA');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { fixPaymentsTable };
