@echo off
echo ============================================
echo 🧪 PROBANDO FLUJO COMPLETO DE PAGO
echo ============================================

echo.
echo 📋 Paso 1: Verificando servidor backend...
curl -s -o NUL -w "%%{http_code}" http://localhost:3001/api/webpay/test > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt

if "%STATUS%"=="200" (
    echo ✅ Servidor backend funcionando
) else (
    echo ❌ Servidor backend no responde (Status: %STATUS%)
    echo 🔧 Iniciando servidor backend...
    cd sillage-backend-vercel
    start "Backend Test" cmd /k "npm run start"
    cd ..
    echo ⏳ Esperando 10 segundos...
    timeout /t 10 /nobreak > nul
)

echo.
echo 📋 Paso 2: Verificando estructura de base de datos...
cd sillage-backend-vercel
node fix-payments-table.js
cd ..

echo.
echo 📋 Paso 3: Verificando frontend...
echo 🌐 El frontend debería estar en http://localhost:5173
echo.

echo 🧪 PASOS PARA PROBAR MANUALMENTE:
echo ============================================
echo.
echo 1. Ve a http://localhost:5173
echo 2. Agrega productos al carrito
echo 3. Ve al carrito y verifica los productos
echo 4. Inicia sesión con una cuenta válida
echo 5. Procede al pago con Webpay
echo 6. En el simulador, aprueba el pago
echo 7. Verifica que:
echo    ✓ La página muestre "Pago Exitoso"
echo    ✓ El carrito esté vacío
echo    ✓ El stock se haya descontado
echo.
echo 🔍 VERIFICACIONES EN BASE DE DATOS:
echo ============================================
echo.
echo Para verificar que todo funcionó:
echo 1. Revisa la tabla 'orders' - debe haber una orden con status 'paid'
echo 2. Revisa la tabla 'payments' - debe haber un pago 'completed'
echo 3. Revisa la tabla 'products' - el stock_quantity debe haber disminuido
echo 4. Revisa la tabla 'order_items' - debe tener los productos comprados
echo.
echo 📊 QUERIES ÚTILES:
echo ============================================
echo SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
echo SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;
echo SELECT name, stock_quantity FROM products WHERE id IN (SELECT DISTINCT product_id FROM order_items);
echo.
echo 🔧 SI HAY PROBLEMAS:
echo ============================================
echo 1. Revisa logs del backend en la consola
echo 2. Abre DevTools del navegador y verifica errores
echo 3. Verifica que la base de datos esté funcionando
echo 4. Ejecuta: fix-payment-system.bat si hay errores de estructura
echo.
pause
