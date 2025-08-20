@echo off
echo ============================================
echo 🚀 BUILDING SILLAGE PERFUM FOR PRODUCTION
echo ============================================

echo.
echo 📋 Paso 1: Limpiando archivos anteriores...
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build
echo ✅ Limpieza completada

echo.
echo 📋 Paso 2: Verificando archivos de configuración...
if exist .env.production (
    echo ✅ .env.production encontrado
) else (
    echo ❌ .env.production no encontrado
    echo 🔧 Creando archivo .env.production básico...
    echo VITE_API_BASE_URL=https://sillageperfum.cl/api-proxy.php > .env.production
    echo VITE_BASE_URL=https://sillageperfum.cl >> .env.production
    echo VITE_NODE_ENV=production >> .env.production
)

echo.
echo 📋 Paso 3: Mostrando configuración actual...
echo ------------------------------------------
echo FRONTEND_URL será: https://sillageperfum.cl
echo API_URL será: https://sillageperfum.cl/api-proxy.php
echo PAYMENT_RETURN_URL será: https://sillageperfum.cl/pago-exitoso
echo PAYMENT_FAILURE_URL será: https://sillageperfum.cl/pago-fallido
echo ------------------------------------------

echo.
echo 📋 Paso 4: Construyendo para producción...
bun run build

echo.
echo 📋 Paso 5: Verificando build...
if exist dist (
    echo ✅ Build completado exitosamente
    echo 📁 Archivos generados en: dist/
    
    echo.
    echo 📋 Archivos principales:
    dir dist /b
    
    echo.
    echo 🚀 PRÓXIMOS PASOS:
    echo ==========================================
    echo 1. Sube el contenido de la carpeta 'dist/' a tu servidor
    echo 2. Asegúrate de que el backend esté configurado para producción
    echo 3. Verifica que el archivo api-proxy.php esté en tu servidor
    echo 4. Prueba el flujo de pago completo
    echo.
    echo 🔍 URLs importantes a verificar:
    echo • https://sillageperfum.cl - Frontend
    echo • https://sillageperfum.cl/api-proxy.php - API
    echo • https://sillageperfum.cl/pago-exitoso - Confirmación pagos
    echo • https://sillageperfum.cl/pago-fallido - Pagos fallidos
    
) else (
    echo ❌ Error en el build
    echo 🔍 Revisa los errores anteriores
)

echo.
pause
