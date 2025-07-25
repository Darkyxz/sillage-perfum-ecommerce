// Script para verificar la migración de Zachary
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zspwhagjbcsiazyyydaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcHdoYWdqYmNzaWF6eXl5ZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTcyMjcsImV4cCI6MjA2NjAzMzIyN30.DJ18OWXH9-I_7LrgLeA-atlfwJdkrFabh5wN7LTkRPM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigration() {
  console.log('🔍 Verificando migración de categorías...');
  
  try {
    // Verificar categorías actuales
    const { data: categories } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null);
    
    const uniqueCategories = [...new Set(categories.map(item => item.category))];
    console.log('📋 Categorías actuales:', uniqueCategories);
    
    // Contar por categoría
    for (const category of uniqueCategories) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category', category);
      
      console.log(`${category}: ${count} productos`);
    }
    
    // Verificar algunos productos de muestra
    console.log('\n📦 Muestra de productos por categoría:');
    
    for (const category of uniqueCategories) {
      console.log(`\n--- Categoría: ${category} ---`);
      const { data: sampleProducts } = await supabase
        .from('products')
        .select('name, brand, category')
        .eq('category', category)
        .limit(3);
      
      sampleProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - Marca: ${product.brand || 'N/A'}`);
      });
    }
    
    // Revertir migración si es necesario
    console.log('\n🔄 ¿Revertir migración? (todos los productos fueron marcados como Zachary)');
    
    // Restaurar categorías originales basadas en género
    const { data: allProducts } = await supabase
      .from('products')
      .select('id, name, category')
      .eq('category', 'zachary');
    
    console.log(`\n📊 Productos a reclasificar: ${allProducts.length}`);
    
    // Reclasificar basado en patrones en el nombre
    let menCount = 0;
    let womenCount = 0;
    
    for (const product of allProducts) {
      let newCategory = null;
      
      // Patrones para identificar género
      const maleKeywords = ['masculino', 'varón', 'hombre', 'men', 'male'];
      const femaleKeywords = ['femenino', 'mujer', 'dama', 'women', 'female'];
      
      const productName = product.name.toLowerCase();
      
      if (maleKeywords.some(keyword => productName.includes(keyword))) {
        newCategory = 'men';
        menCount++;
      } else if (femaleKeywords.some(keyword => productName.includes(keyword))) {
        newCategory = 'women';
        womenCount++;
      }
      
      if (newCategory) {
        await supabase
          .from('products')
          .update({ category: newCategory })
          .eq('id', product.id);
      }
    }
    
    console.log(`✅ Reclasificación completada:`);
    console.log(`   - Hombres: ${menCount} productos`);
    console.log(`   - Mujeres: ${womenCount} productos`);
    console.log(`   - Sin clasificar: ${allProducts.length - menCount - womenCount} productos`);
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

verifyMigration();