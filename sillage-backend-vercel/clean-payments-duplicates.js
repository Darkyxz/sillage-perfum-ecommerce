const { query } = require('./config/database');

async function cleanPaymentsDuplicates() {
  console.log('🧹 LIMPIANDO ENTRADAS DUPLICADAS EN PAYMENTS');
  console.log('='.repeat(50));
  
  try {
    // Verificar conexión
    const testQuery = await query('SELECT 1 as test');
    console.log('✅ Conexión a base de datos OK');
    
    // Buscar entradas con payment_id vacío o duplicado
    console.log('\n🔍 Buscando entradas problemáticas...');
    
    // Entradas con payment_id vacío o NULL
    const emptyPaymentIds = await query(
      'SELECT id, order_id FROM payments WHERE payment_id IS NULL OR payment_id = ""'
    );
    
    console.log(`📋 Encontradas ${emptyPaymentIds.length} entradas con payment_id vacío`);
    
    if (emptyPaymentIds.length > 0) {
      console.log('🔧 Corrigiendo entradas con payment_id vacío...');
      
      for (const payment of emptyPaymentIds) {
        const newPaymentId = `PAY_FIX_${Date.now()}_${payment.order_id}_${payment.id}`;
        await query(
          'UPDATE payments SET payment_id = ? WHERE id = ?',
          [newPaymentId, payment.id]
        );
        console.log(`✅ Corregido payment ID: ${payment.id} -> ${newPaymentId}`);
      }
    }
    
    // Buscar duplicados reales
    const duplicates = await query(`
      SELECT payment_id, COUNT(*) as count 
      FROM payments 
      WHERE payment_id IS NOT NULL AND payment_id != ''
      GROUP BY payment_id 
      HAVING COUNT(*) > 1
    `);
    
    console.log(`📋 Encontrados ${duplicates.length} payment_id duplicados`);
    
    if (duplicates.length > 0) {
      console.log('🔧 Corrigiendo duplicados...');
      
      for (const duplicate of duplicates) {
        // Obtener todas las entradas con este payment_id
        const entries = await query(
          'SELECT id, order_id FROM payments WHERE payment_id = ? ORDER BY created_at ASC',
          [duplicate.payment_id]
        );
        
        // Mantener la primera, renombrar las demás
        for (let i = 1; i < entries.length; i++) {
          const entry = entries[i];
          const newPaymentId = `PAY_DUP_${Date.now()}_${entry.order_id}_${entry.id}`;
          await query(
            'UPDATE payments SET payment_id = ? WHERE id = ?',
            [newPaymentId, entry.id]
          );
          console.log(`✅ Renombrado duplicado: ${entry.id} -> ${newPaymentId}`);
        }
      }
    }
    
    // Verificar resultado final
    console.log('\n📊 Verificando resultado final...');
    const finalCount = await query('SELECT COUNT(*) as total FROM payments');
    const emptyCount = await query('SELECT COUNT(*) as empty FROM payments WHERE payment_id IS NULL OR payment_id = ""');
    const duplicateCount = await query(`
      SELECT COUNT(*) as duplicates FROM (
        SELECT payment_id 
        FROM payments 
        WHERE payment_id IS NOT NULL AND payment_id != ''
        GROUP BY payment_id 
        HAVING COUNT(*) > 1
      ) as dup_table
    `);
    
    console.log(`📈 Total de pagos: ${finalCount[0].total}`);
    console.log(`🚫 Payment_id vacíos: ${emptyCount[0].empty}`);
    console.log(`🔄 Payment_id duplicados: ${duplicateCount[0].duplicates}`);
    
    if (emptyCount[0].empty === 0 && duplicateCount[0].duplicates === 0) {
      console.log('\n🎉 LIMPIEZA COMPLETADA - No hay entradas problemáticas');
      return true;
    } else {
      console.log('\n⚠️ Aún hay entradas problemáticas');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error en limpieza:', error.message);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  cleanPaymentsDuplicates()
    .then((success) => {
      if (success) {
        console.log('\n✅ LIMPIEZA EXITOSA');
        console.log('💳 La tabla payments está ahora sin duplicados');
      } else {
        console.log('\n❌ PROBLEMAS EN LA LIMPIEZA');
        console.log('🔧 Revisa manualmente la tabla payments');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { cleanPaymentsDuplicates };
