const fs = require('fs');
const path = require('path');

async function prepareProduction() {
    console.log('🚀 Preparando aplicación para producción...');

    try {
        // 1. Crear directorios necesarios
        const directories = [
            'uploads',
            'uploads/products',
            'logs'
        ];

        for (const dir of directories) {
            const dirPath = path.join(__dirname, dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`✅ Directorio creado: ${dir}`);
            } else {
                console.log(`✅ Directorio ya existe: ${dir}`);
            }
        }

        // 2. Verificar archivos de configuración
        const configFiles = [
            '.env.production',
            'server.js'
        ];

        for (const file of configFiles) {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                console.log(`✅ Archivo de configuración encontrado: ${file}`);
            } else {
                console.log(`❌ Archivo de configuración faltante: ${file}`);
            }
        }

        // 3. Crear archivo .htaccess para Apache (Hostinger)
        const htaccessContent = `
# Configuración para Node.js en Hostinger
RewriteEngine On

# Redirigir todas las solicitudes a server.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ server.js [L]

# Configurar headers de seguridad
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Configurar CORS
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization"

# Configurar cache para archivos estáticos
<FilesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>

# Proteger archivos sensibles
<Files ".env*">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>
`;

        fs.writeFileSync(path.join(__dirname, '.htaccess'), htaccessContent.trim());
        console.log('✅ Archivo .htaccess creado');

        // 4. Crear archivo de configuración para PM2 (si se usa)
        const pm2Config = {
            apps: [{
                name: 'sillage-perfum-api',
                script: 'server.js',
                instances: 1,
                exec_mode: 'cluster',
                env: {
                    NODE_ENV: 'production',
                    PORT: 3001
                },
                error_file: './logs/err.log',
                out_file: './logs/out.log',
                log_file: './logs/combined.log',
                time: true
            }]
        };

        fs.writeFileSync(
            path.join(__dirname, 'ecosystem.config.js'),
            `module.exports = ${JSON.stringify(pm2Config, null, 2)};`
        );
        console.log('✅ Configuración PM2 creada');

        // 5. Crear script de inicio para Hostinger
        const startScript = `#!/bin/bash
# Script de inicio para Hostinger

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias..."
    npm install --production
fi

# Ejecutar migraciones de base de datos
echo "Ejecutando migraciones..."
node add-fragrance-fields.js

# Iniciar servidor
echo "Iniciando servidor..."
NODE_ENV=production node server.js
`;

        fs.writeFileSync(path.join(__dirname, 'start.sh'), startScript);
        console.log('✅ Script de inicio creado');

        // 6. Crear archivo de verificación de salud
        const healthCheck = `
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3001,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(\`Status: \${res.statusCode}\`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Health check:', response);
      process.exit(res.statusCode === 200 ? 0 : 1);
    } catch (error) {
      console.error('Error parsing response:', error);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('Health check failed:', error);
  process.exit(1);
});

req.end();
`;

        fs.writeFileSync(path.join(__dirname, 'health-check.js'), healthCheck.trim());
        console.log('✅ Script de verificación de salud creado');

        console.log('\n🎉 Preparación para producción completada!');
        console.log('\n📋 Archivos creados:');
        console.log('   - .htaccess (configuración Apache)');
        console.log('   - ecosystem.config.js (configuración PM2)');
        console.log('   - start.sh (script de inicio)');
        console.log('   - health-check.js (verificación de salud)');
        console.log('\n📁 Directorios creados:');
        console.log('   - uploads/products (para imágenes)');
        console.log('   - logs (para registros)');

        console.log('\n🚀 Para desplegar en Hostinger:');
        console.log('1. Sube todos los archivos del backend a tu hosting');
        console.log('2. Configura las variables de entorno en .env.production');
        console.log('3. Ejecuta: chmod +x start.sh && ./start.sh');
        console.log('4. Verifica con: node health-check.js');

    } catch (error) {
        console.error('❌ Error preparando para producción:', error);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    prepareProduction();
}

module.exports = { prepareProduction };