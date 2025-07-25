// Script para debuggear SKUs en la base de datos
// Ejecutar desde la consola del navegador

import { supabase } from './src/lib/supabase.js';

async function debugSKUs() {
  try {
    console.log('🔍 DEBUGGING SKUs EN LA BASE DE DATOS');
    console.log('=' .repeat(50));
    
    // Obtener todos los productos con sus SKUs
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, brand, sku, size')
      .order('name, size');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`📊 Total productos encontrados: ${products.length}`);
    console.log('');

    // Agrupar por producto base
    const grouped = {};
    products.forEach(product => {
      const baseName = `${product.name} - ${product.brand}`;
      if (!grouped[baseName]) {
        grouped[baseName] = [];
      }
      grouped[baseName].push({
        id: product.id,
        sku: product.sku,
        size: product.size
      });
    });

    console.log('📋 PRODUCTOS Y SUS SKUs:');
    console.log('');

    Object.entries(grouped).forEach(([productName, variants]) => {
      console.log(`🔸 ${productName}:`);
      variants.forEach(variant => {
        console.log(`   ${variant.sku} (${variant.size}) - ID: ${variant.id}`);
      });
      console.log('');
    });

    // Buscar SKUs problemáticos (sin formato correcto)
    const problematicSKUs = products.filter(p => 
      !p.sku || 
      p.sku.length < 3 || 
      !p.sku.includes('-') ||
      /^\d+$/.test(p.sku) // Solo números
    );

    if (problematicSKUs.length > 0) {
      console.log('⚠️  SKUs PROBLEMÁTICOS:');
      problematicSKUs.forEach(product => {
        console.log(`   ${product.sku} - ${product.name} (ID: ${product.id})`);
      });
    } else {
      console.log('✅ Todos los SKUs tienen formato correcto');
    }

    // Verificar SKUs duplicados
    const skuCounts = {};
    products.forEach(product => {
      skuCounts[product.sku] = (skuCounts[product.sku] || 0) + 1;
    });

    const duplicatedSKUs = Object.entries(skuCounts).filter(([sku, count]) => count > 1);
    
    if (duplicatedSKUs.length > 0) {
      console.log('⚠️  SKUs DUPLICADOS:');
      duplicatedSKUs.forEach(([sku, count]) => {
        console.log(`   ${sku}: ${count} veces`);
      });
    } else {
      console.log('✅ No hay SKUs duplicados');
    }

    return {
      totalProducts: products.length,
      uniqueProducts: Object.keys(grouped).length,
      problematicSKUs: problematicSKUs.length,
      duplicatedSKUs: duplicatedSKUs.length
    };

  } catch (error) {
    console.error('❌ Error en debug:', error);
  }
}

// Ejecutar automáticamente
debugSKUs();