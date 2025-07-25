// Script de prueba para cargar productos Zachary con variantes
// Ejecutar desde la consola del navegador en el panel de admin

import { loadZacharProducts, verifyZacharProducts } from './src/scripts/loadZacharProducts.js';

async function testLoadZacharyVariants() {
    try {
        console.log('🚀 INICIANDO CARGA DE PRODUCTOS ZACHARY CON VARIANTES');
        console.log('='.repeat(60));

        // Cargar productos
        const results = await loadZacharProducts();

        console.log('\\n' + '='.repeat(60));
        console.log('✅ CARGA COMPLETADA');
        console.log('='.repeat(60));

        // Verificar resultados
        await verifyZacharProducts();

        console.log('\\n🎉 PROCESO COMPLETADO EXITOSAMENTE');
        console.log(`📊 Total variantes cargadas: ${results.length}`);

        return results;
    } catch (error) {
        console.error('❌ ERROR EN EL PROCESO:', error);
        throw error;
    }
}

// Ejecutar automáticamente
testLoadZacharyVariants();