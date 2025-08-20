@echo off
echo 🔄 REINICIANDO BACKEND CON CORRECCIONES
echo =======================================

echo.
echo 🛑 Deteniendo servidor backend actual...
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak > nul

echo.
echo 🚀 Iniciando servidor backend corregido...
cd sillage-backend-vercel
start "Backend Corregido" cmd /k "bun run start"

echo.
echo ✅ BACKEND REINICIADO
echo =====================
echo.
echo 🎯 Cambios aplicados:
echo   • Estructura de order_items corregida
echo   • Inserción con todos los campos necesarios  
echo   • payment_id único generado automáticamente
echo   • Duplicados limpiados
echo.
echo 🧪 Prueba ahora:
echo   1. Ve al carrito en tu frontend
echo   2. Haz clic en "Pagar con Webpay"
echo   3. Debería funcionar sin errores 500
echo.
pause
