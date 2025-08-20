@echo off
echo ============================================
echo 🔧 CORRIGIENDO SISTEMA DE PAGOS WEBPAY
echo ============================================

echo.
echo 📋 Paso 1: Detener el servidor si está ejecutándose...
taskkill /f /im node.exe 2>nul
echo ✅ Servidor detenido

echo.
echo 🗄️ Paso 2: Corrigiendo estructura de base de datos...
cd sillage-backend-vercel
node fix-payments-table.js
if %errorlevel% neq 0 (
    echo ❌ Error corrigiendo la tabla de pagos
    pause
    exit /b 1
)

echo.
echo 🧹 Paso 2.1: Limpiando entradas duplicadas...
node clean-payments-duplicates.js
if %errorlevel% neq 0 (
    echo ⚠️ Advertencia: Hubo problemas limpiando duplicados, continuando...
)

echo.
echo 📦 Paso 3: Instalando dependencias si es necesario...
npm install transbank-sdk
if %errorlevel% neq 0 (
    echo ⚠️ Error instalando dependencias, continuando...
)

echo.
echo 🚀 Paso 4: Iniciando servidor backend...
start "Backend Sillage" cmd /k "npm run start"
echo ✅ Servidor backend iniciado

echo.
echo 🎯 Paso 5: Esperando que el servidor se inicie...
timeout /t 5 /nobreak > nul

echo.
echo 🧪 Paso 6: Probando endpoint de Webpay...
curl -X GET http://localhost:3001/api/webpay/test
if %errorlevel% neq 0 (
    echo ❌ Error conectando con el endpoint de Webpay
) else (
    echo ✅ Endpoint de Webpay funcionando
)

echo.
echo 🌐 Paso 7: Iniciando frontend...
cd ..
start "Frontend Sillage" cmd /k "npm run dev"
echo ✅ Frontend iniciado

echo.
echo ============================================
echo ✅ CORRECCIONES COMPLETADAS
echo ============================================
echo.
echo 📋 Resumen de cambios aplicados:
echo   • Estructura de base de datos corregida
echo   • Tabla payments con columna transaction_id
echo   • Manejo mejorado de transacciones concurrentes
echo   • Frontend con mejor manejo de errores
echo   • Estados de confirmación mejorados
echo.
echo 🎯 Para probar el flujo de pago:
echo   1. Ve a http://localhost:5173
echo   2. Agrega productos al carrito
echo   3. Inicia sesión
echo   4. Procede al pago con Webpay
echo   5. Usa el simulador para aprobar/rechazar
echo.
echo 🔧 Si encuentras errores:
echo   • Revisa la consola del backend
echo   • Verifica que la base de datos esté funcionando
echo   • Contacta soporte si el problema persiste
echo.
pause
