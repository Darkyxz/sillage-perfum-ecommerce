// Script para migrar y actualizar categorías de productos
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zspwhagjbcsiazyyydaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcHdoYWdqYmNzaWF6eXl5ZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTcyMjcsImV4cCI6MjA2NjAzMzIyN30.DJ18OWXH9-I_7LrgLeA-atlfwJdkrFabh5wN7LTkRPM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeo de categorías para migración
const categoryMigration = {
  'men': 'men',        // Mantener como está
  'women': 'women',    // Mantener como está
  // Nuevas categorías se asignarán manualmente o por criterios específicos
};

async function migrateCategories() {
  console.log('🔄 Iniciando migración de categorías...');
  
  try {
    // 1. Verificar categorías actuales
    console.log('📊 Verificando categorías actuales...');
    const { data: currentCategories } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null);
    
    const uniqueCategories = [...new Set(currentCategories.map(item => item.category))];
    console.log('📋 Categorías actuales:', uniqueCategories);
    
    // 2. Contar productos por categoría actual
    for (const category of uniqueCategories) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category', category);
      
      console.log(`${category}: ${count} productos`);
    }
    
    // 3. Identificar productos de Zachary para nueva categoría
    console.log('\n🔍 Identificando productos By Zachary...');
    const { data: zacharyProducts, error: zacharyError } = await supabase
      .from('products')
      .select('id, name, brand')
      .or('brand.ilike.%zachary%,name.ilike.%zachary%');
    
    if (zacharyError) {
      console.error('❌ Error buscando productos Zachary:', zacharyError);
    } else {
      console.log(`📦 Productos Zachary encontrados: ${zacharyProducts.length}`);
      
      // Actualizar productos Zachary a nueva categoría
      if (zacharyProducts.length > 0) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ category: 'zachary' })
          .in('id', zacharyProducts.map(p => p.id));
        
        if (updateError) {
          console.error('❌ Error actualizando productos Zachary:', updateError);
        } else {
          console.log('✅ Productos Zachary actualizados a categoría "zachary"');
        }
      }
    }
    
    // 4. Verificar productos sin categoría
    console.log('\n🔍 Verificando productos sin categoría...');
    const { count: uncategorizedCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .is('category', null);
    
    console.log(`📦 Productos sin categoría: ${uncategorizedCount}`);
    
    // 5. Mostrar resumen final
    console.log('\n📊 Resumen final de categorías:');
    const { data: finalCategories } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null);
    
    const finalUniqueCategories = [...new Set(finalCategories.map(item => item.category))];
    
    for (const category of finalUniqueCategories) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category', category);
      
      console.log(`${category}: ${count} productos`);
    }
    
    console.log('\n✅ Migración completada');
    
  } catch (error) {
    console.error('💥 Error en migración:', error);
  }
}

// Función para asignar categorías manualmente
async function assignCategoryManually(productIds, newCategory) {
  try {
    const { error } = await supabase
      .from('products')
      .update({ category: newCategory })
      .in('id', productIds);
    
    if (error) {
      console.error('❌ Error asignando categoría:', error);
    } else {
      console.log(`✅ ${productIds.length} productos asignados a categoría "${newCategory}"`);
    }
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Ejecutar migración
migrateCategories();

// Exportar función para uso manual
export { assignCategoryManually };