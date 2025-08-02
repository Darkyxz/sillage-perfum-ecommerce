const fs = require('fs');
const path = require('path');

// Script para probar que el directorio de uploads esté configurado correctamente
async function testUploadSetup() {
    console.log('🧪 Probando configuración de uploads...');

    const uploadsDir = path.join(__dirname, 'uploads');
    const productsDir = path.join(uploadsDir, 'products');

    try {
        // Verificar que el directorio uploads existe
        if (!fs.existsSync(uploadsDir)) {
            console.log('📁 Creando directorio uploads...');
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Verificar que el directorio products existe
        if (!fs.existsSync(productsDir)) {
            console.log('📁 Creando directorio uploads/products...');
            fs.mkdirSync(productsDir, { recursive: true });
        }

        // Probar permisos de escritura
        const testFile = path.join(productsDir, 'test-write.txt');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);

        console.log('✅ Directorio uploads configurado correctamente');
        console.log(`📍 Ruta: ${productsDir}`);

        // Mostrar archivos existentes
        const files = fs.readdirSync(productsDir);
        console.log(`📊 Archivos actuales: ${files.length}`);
        if (files.length > 0) {
            files.forEach(file => console.log(`  - ${file}`));
        }

    } catch (error) {
        console.error('❌ Error en configuración de uploads:', error.message);
        return false;
    }

    return true;
}

// Ejecutar si se llama directamente
if (require.main === module) {
    testUploadSetup()
        .then(success => {
            if (success) {
                console.log('🎉 Configuración de uploads lista para producción');
            } else {
                console.log('💥 Hay problemas con la configuración de uploads');
            }
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = { testUploadSetup };