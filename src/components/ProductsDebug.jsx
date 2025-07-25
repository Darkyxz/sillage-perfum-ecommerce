import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProductsDebug() {
  const [debugInfo, setDebugInfo] = useState({
    loading: true,
    error: null,
    connectionTest: null,
    productCount: 0,
    sampleProducts: [],
    rawResponse: null
  });

  useEffect(() => {
    debugProducts();
  }, []);

  const debugProducts = async () => {
    console.log('🔍 Iniciando debug de productos en React...');
    
    try {
      setDebugInfo(prev => ({ ...prev, loading: true, error: null }));

      // 1. Test de conexión básica
      console.log('📡 Test de conexión...');
      const connectionTest = await supabase
        .from('products')
        .select('count')
        .limit(1);
      
      console.log('📡 Resultado conexión:', connectionTest);

      // 2. Contar productos
      console.log('📊 Contando productos...');
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        throw new Error(`Error contando: ${countError.message}`);
      }

      console.log(`📦 Total productos: ${count}`);

      // 3. Obtener productos de muestra
      console.log('🔍 Obteniendo productos...');
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(3);

      if (productsError) {
        throw new Error(`Error obteniendo productos: ${productsError.message}`);
      }

      console.log('📋 Productos obtenidos:', products);

      setDebugInfo({
        loading: false,
        error: null,
        connectionTest: connectionTest.error ? 'Error' : 'OK',
        productCount: count,
        sampleProducts: products,
        rawResponse: products
      });

    } catch (error) {
      console.error('💥 Error en debug:', error);
      setDebugInfo(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  if (debugInfo.loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-blue-800">🔍 Debuggeando productos...</h3>
        <p className="text-blue-600">Verificando conexión y datos...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
      <h3 className="font-bold text-gray-800">🔧 Debug de Productos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold">📡 Conexión</h4>
          <p className={debugInfo.connectionTest === 'OK' ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.connectionTest}
          </p>
        </div>

        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold">📦 Total Productos</h4>
          <p className="text-lg font-bold">{debugInfo.productCount}</p>
        </div>
      </div>

      {debugInfo.error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded">
          <h4 className="font-semibold text-red-800">❌ Error</h4>
          <p className="text-red-600">{debugInfo.error}</p>
        </div>
      )}

      {debugInfo.sampleProducts.length > 0 && (
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold mb-2">📋 Productos de Muestra</h4>
          {debugInfo.sampleProducts.map((product, index) => (
            <div key={product.id} className="border-b pb-2 mb-2 last:border-b-0">
              <p className="font-medium">{index + 1}. {product.name}</p>
              <p className="text-sm text-gray-600">
                SKU: {product.sku} | Precio: ${product.price} | Stock: {product.stock_quantity}
              </p>
              <p className="text-xs text-gray-500">
                Imagen: {product.image_url ? '✅' : '❌'} | En stock: {product.in_stock ? '✅' : '❌'}
              </p>
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={debugProducts}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        🔄 Volver a probar
      </button>
    </div>
  );
}