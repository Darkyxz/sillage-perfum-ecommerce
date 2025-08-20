# Script para arrancar frontend y backend simultáneamente en Windows
Write-Host "🚀 Iniciando servidores de desarrollo..." -ForegroundColor Green

# Arrancar backend en segundo plano
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd sillage-backend-vercel; Write-Host '🔧 Iniciando Backend...' -ForegroundColor Yellow; bun start"

# Esperar un poco para que el backend arranque
Start-Sleep -Seconds 3

# Arrancar frontend
Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Blue
bun run dev
