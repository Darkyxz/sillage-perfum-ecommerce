// Script para debuggear la carga de productos
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zspwhagjbcsiazyyydaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcHdoYWdqYmNzaWF6eXl5ZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTcyMjcsImV4cCI6MjA2NjAzMzIyN30.DJ18OWXH9-I_7LrgLeA-atlfwJdkrFabh5wN7LTkRPM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugProducts() {
  console.log('🔍 Iniciando debug de productos...');
  
  try {
    // 1. Verificar conexión
    console.log('📡 Verificando conexión a Supabase...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Error de conexión:', connectionError);
      return;
    }
    
    console.log('✅ Conexión exitosa');
    
    // 2. Contar productos
    console.log('📊 Contando productos...');
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error contando productos:', countError);
      return;
    }
    
    console.log(`📦 Total de productos en la base de datos: ${count}`);
    
    if (count === 0) {
      console.log('⚠️ No hay productos en la base de datos');
      return;
    }
    
    // 3. Obtener primeros 5 productos
    console.log('🔍 Obteniendo primeros 5 productos...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Error obteniendo productos:', productsError);
      return;
    }
    
    console.log('📋 Productos encontrados:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} - SKU: ${product.sku}`);
    });
    
    // 4. Verificar estructura de la tabla
    console.log('🏗️ Verificando estructura de la tabla...');
    const sampleProduct = products[0];
    console.log('📝 Campos disponibles:', Object.keys(sampleProduct));
    
    // 5. Verificar productos con imágenes
    const productsWithImages = products.filter(p => p.image_url);
    console.log(`🖼️ Productos con imágenes: ${productsWithImages.length}/${products.length}`);
    
    // 6. Verificar productos en stock
    const productsInStock = products.filter(p => p.in_stock);
    console.log(`📦 Productos en stock: ${productsInStock.length}/${products.length}`);
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar debug
debugProducts();