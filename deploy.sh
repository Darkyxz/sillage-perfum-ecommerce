#!/bin/bash

echo "🚀 Desplegando Sillage Perfum..."

# 1. Construir frontend con configuración de producción
echo "📦 Construyendo frontend..."
bun build

# 2. Verificar que se creó la carpeta dist
if [ ! -d "dist" ]; then
  echo "❌ Error: carpeta dist no se creó"
  exit 1
fi

# 3. Copiar .htaccess a dist
cp public/.htaccess dist/.htaccess
echo "✅ .htaccess copiado a dist/"

# 4. Mostrar instrucciones
echo ""
echo "📋 INSTRUCCIONES DE DESPLIEGUE:"
echo "1. Sube el contenido de dist/ a public_html/"
echo "2. Asegúrate de que tu backend esté corriendo en el puerto 3001"
echo "3. Verifica que el .htaccess esté en public_html/"
echo ""
echo "🔧 Para verificar:"
echo "curl https://sillageperfum.cl/api/health"
echo ""
echo "✅ Build completado en dist/"
