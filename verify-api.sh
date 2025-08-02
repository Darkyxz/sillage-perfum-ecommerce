#!/bin/bash

echo "🔍 Verificando configuración de API..."

# Verificar que el backend esté corriendo
echo "📡 Verificando backend en localhost:3001..."
curl -s http://localhost:3001/api/health || echo "❌ Backend no responde"

# Verificar que el proxy funcione
echo "🌐 Verificando proxy en producción..."
curl -s https://sillageperfum.cl/api/health || echo "❌ Proxy no funciona"

# Verificar productos
echo "📦 Verificando endpoint de productos..."
curl -s https://sillageperfum.cl/api/products | head -100

echo "✅ Verificación completada"
