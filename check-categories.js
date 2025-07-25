// Script para verificar las categorías disponibles
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zspwhagjbcsiazyyydaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcHdoYWdqYmNzaWF6eXl5ZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTcyMjcsImV4cCI6MjA2NjAzMzIyN30.DJ18OWXH9-I_7LrgLeA-atlfwJdkrFabh5wN7LTkRPM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
  console.log('🔍 Verificando categorías disponibles...');

  try {
    // Obtener categorías únicas
    const { data: categories, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    // Extraer categorías únicas
    const uniqueCategories = [...new Set(categories.map(item => item.category))];

    console.log('📋 Categorías encontradas:');
    uniqueCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category}`);
    });

    // Contar productos por categoría
    console.log('\n📊 Productos por categoría:');
    for (const category of uniqueCategories) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category', category);

      console.log(`${category}: ${count} productos`);
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

checkCategories();