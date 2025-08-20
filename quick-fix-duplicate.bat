@echo off
echo ⚡ CORRECCIÓN RÁPIDA - ERROR DUPLICATE ENTRY
echo ============================================

echo.
echo 🧹 Paso 1: Limpiando entradas duplicadas en payments...
cd sillage-backend-vercel
node clean-payments-duplicates.js

echo.
echo 🔄 Paso 2: Reiniciando servidor backend...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak > nul
start "Backend Fixed" cmd /k "bun run start"

echo.
echo ✅ CORRECCIÓN COMPLETADA
echo ============================================
echo.
echo 🎯 Ahora prueba el flujo de pago nuevamente:
echo   1. Ve a la página de pago exitoso
echo   2. Debería funcionar sin errores
echo   3. El carrito se limpiará y el stock se descontará
echo.
echo 📊 Si quieres verificar la base de datos:
echo   SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;
echo.
pause
