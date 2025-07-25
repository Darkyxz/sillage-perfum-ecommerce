// Script para verificar las categorías de productos
// Ejecutar desde la consola del navegador

import { supabase } from './src/lib/supabase.js';

async function verifyCategories() {
  try {
    console.log('🔍 Verificando categorías de productos...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('category')
      .order('category');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    // Contar productos por categoría
    const categoryCounts = {};
    products.forEach(product => {
      const category = product.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    console.log('📊 CATEGORÍAS ENCONTRADAS:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} productos`);
    });

    // Verificar si hay categorías en español
    const spanishCategories = Object.keys(categoryCounts).filter(cat => 
      ['mujeres', 'hombres'].includes(cat)
    );

    if (spanishCategories.length > 0) {
      console.log('⚠️  PROBLEMA DETECTADO:');
      console.log('   Hay categorías en español:', spanishCategories);
      console.log('   El frontend espera: women, men, unisex');
      console.log('');
      console.log('🔧 SOLUCIÓN:');
      console.log('   Ejecuta el script loadZacharProducts() actualizado');
    } else {
      console.log('✅ Las categorías están correctas (en inglés)');
    }

    return categoryCounts;
  } catch (error) {
    console.error('❌ Error verificando categorías:', error);
  }
}

// Ejecutar verificación
verifyCategories();