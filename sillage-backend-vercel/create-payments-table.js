const { query } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function createPaymentsTable() {
  try {
    console.log('📋 Creando tabla de pagos...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '..', 'sql', 'create-payments-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Ejecutar el SQL
    await query(sql);
    
    console.log('✅ Tabla de pagos creada exitosamente');
    
  } catch (error) {
    console.error('❌ Error creando tabla de pagos:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createPaymentsTable()
    .then(() => {
      console.log('🎉 Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { createPaymentsTable };