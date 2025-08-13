const { query, closePool } = require('./config/database');

/**
 * Este script busca todos los productos de las categorías 'Hombre' y 'Mujer'
 * cuyos SKUs comienzan con 'ZP' y los actualiza reemplazando la 'Z' inicial por una 'S'.
 * Utiliza transacciones y ejecuta las actualizaciones de forma secuencial para mayor seguridad.
 */
async function updateSkus() {
  console.log('🚀 Iniciando la versión corregida del script de actualización de SKUs...');
  try {
    console.log('🔍 Buscando productos para actualizar (categoría Hombre/Mujer con SKU que empiece en \'ZP\')...');

    const productsToUpdate = await query(
      "SELECT id, sku, name, category FROM products WHERE (category = 'Hombre' OR category = 'Mujer') AND sku LIKE 'ZP%'"
    );

    if (productsToUpdate.length === 0) {
      console.log('✅ No se encontraron más productos que necesiten actualización.');
      return;
    }

    console.log(`Se encontraron ${productsToUpdate.length} productos para actualizar.`);
    console.log('-------------------------------------------------');

    // Iniciar transacción
    await query('BEGIN');
    console.log('🚦 Transacción iniciada. Procesando actualizaciones una por una...');

    for (const product of productsToUpdate) {
      const newSku = 'S' + product.sku.substring(1);
      console.log(`  - Actualizando ID: ${product.id} | ${product.sku} -> ${newSku}`);
      await query('UPDATE products SET sku = ? WHERE id = ?', [newSku, product.id]);
    }

    console.log('✅ Actualizaciones completadas. Confirmando transacción...');
    // Confirmar transacción
    await query('COMMIT');
    
    console.log('-------------------------------------------------');
    console.log('🎉 ¡Éxito! Transacción completada. Todos los SKUs han sido actualizados correctamente.');

  } catch (error) {
    // Si hay un error, revertir la transacción
    console.error('❌ ERROR: Ocurrió un error durante la actualización.');
    console.error(error);
    console.log('⏪ Revertiendo transacción...');
    await query('ROLLBACK');
    console.log('Transacción revertida. No se realizaron cambios en la base de datos en esta ejecución.');
  } finally {
    // Cerrar la conexión a la base de datos
    console.log('🔌 Cerrando conexión a la base de datos...');
    await closePool();
  }
}

updateSkus();
