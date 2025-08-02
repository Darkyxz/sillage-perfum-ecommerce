#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Arreglando configuración de API para producción...');

// 1. Verificar que el backend esté configurado correctamente
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(backendEnvPath)) {
    const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
    console.log('✅ Backend .env encontrado');

    // Verificar configuración CORS
    if (!backendEnv.includes('ALLOWED_ORIGINS')) {
        console.log('⚠️  Agregando configuración CORS al backend...');
        const corsConfig = `
# CORS Configuration para producción
ALLOWED_ORIGINS=https://sillageperfum.cl,https://www.sillageperfum.cl,http://localhost:5173
FRONTEND_URL=https://sillageperfum.cl
`;
        fs.appendFileSync(backendEnvPath, corsConfig);
    }
} else {
    console.log('❌ Backend .env no encontrado');
}

// 2. Crear script de verificación de API
const verifyScript = `#!/bin/bash

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
`;

fs.writeFileSync('verify-api.sh', verifyScript);
fs.chmodSync('verify-api.sh', '755');

// 3. Crear configuración alternativa para Hostinger
const hostingerConfig = `
# CONFIGURACIÓN PARA HOSTINGER
# Copia este contenido al .htaccess en public_html/

RewriteEngine On

# Proxy API requests to Node.js backend
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

# Si el proxy no funciona, usar esta alternativa:
# RewriteCond %{REQUEST_URI} ^/api/(.*)$
# RewriteRule ^api/(.*)$ http://127.0.0.1:3001/api/$1 [P,L]

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# CORS Headers
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
`;

fs.writeFileSync('hostinger-htaccess.txt', hostingerConfig);

// 4. Crear script de despliegue
const deployScript = `#!/bin/bash

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
`;

fs.writeFileSync('deploy.sh', deployScript);
fs.chmodSync('deploy.sh', '755');

console.log('');
console.log('✅ Configuración completada!');
console.log('');
console.log('📋 PRÓXIMOS PASOS:');
console.log('1. Ejecuta: ./deploy.sh');
console.log('2. Sube dist/* a tu servidor');
console.log('3. Asegúrate de que tu backend esté corriendo');
console.log('4. Verifica con: ./verify-api.sh');
console.log('');
console.log('🔧 Si el proxy no funciona en Hostinger:');
console.log('- Copia el contenido de hostinger-htaccess.txt a tu .htaccess');
console.log('- O cambia VITE_API_BASE_URL a la IP directa de tu backend');