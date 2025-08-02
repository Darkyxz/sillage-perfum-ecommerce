const { testConnection } = require('./config/database');
const { testUploadSetup } = require('./test-upload');
const { testFragranceSystem } = require('./test-fragrance-system');
const fs = require('fs');
const path = require('path');

async function verifyProductionReady() {
    console.log('🚀 VERIFICACIÓN COMPLETA PARA PRODUCCIÓN');
    console.log('=====================================\n');

    let allTestsPassed = true;
    const results = [];

    // 1. Verificar conexión a base de datos
    console.log('1️⃣ Probando conexión a base de datos...');
    try {
        const dbConnected = await testConnection();
        if (dbConnected) {
            console.log('✅ Base de datos conectada correctamente\n');
            results.push({ test: 'Database Connection', status: 'PASS' });
        } else {
            console.log('❌ Error de conexión a base de datos\n');
            results.push({ test: 'Database Connection', status: 'FAIL' });
            allTestsPassed = false;
        }
    } catch (error) {
        console.log('❌ Error de conexión a base de datos:', error.message, '\n');
        results.push({ test: 'Database Connection', status: 'FAIL' });
        allTestsPassed = false;
    }

    // 2. Verificar sistema de uploads
    console.log('2️⃣ Probando sistema de uploads...');
    try {
        const uploadReady = await testUploadSetup();
        if (uploadReady) {
            console.log('✅ Sistema de uploads configurado correctamente\n');
            results.push({ test: 'Upload System', status: 'PASS' });
        } else {
            console.log('❌ Problemas con sistema de uploads\n');
            results.push({ test: 'Upload System', status: 'FAIL' });
            allTestsPassed = false;
        }
    } catch (error) {
        console.log('❌ Error en sistema de uploads:', error.message, '\n');
        results.push({ test: 'Upload System', status: 'FAIL' });
        allTestsPassed = false;
    }

    // 3. Verificar sistema de notas olfativas
    console.log('3️⃣ Probando sistema de notas olfativas...');
    try {
        const fragranceReady = await testFragranceSystem();
        if (fragranceReady) {
            console.log('✅ Sistema de notas olfativas funcionando correctamente\n');
            results.push({ test: 'Fragrance System', status: 'PASS' });
        } else {
            console.log('❌ Problemas con sistema de notas olfativas\n');
            results.push({ test: 'Fragrance System', status: 'FAIL' });
            allTestsPassed = false;
        }
    } catch (error) {
        console.log('❌ Error en sistema de notas olfativas:', error.message, '\n');
        results.push({ test: 'Fragrance System', status: 'FAIL' });
        allTestsPassed = false;
    }

    // 4. Verificar archivos críticos
    console.log('4️⃣ Verificando archivos críticos...');
    const criticalFiles = [
        'server.js',
        'routes/upload.js',
        'routes/products.js',
        'routes/auth.js',
        'config/database.js',
        '.env'
    ];

    let filesOk = true;
    for (const file of criticalFiles) {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            console.log(`  ✅ ${file}`);
        } else {
            console.log(`  ❌ ${file} - FALTANTE`);
            filesOk = false;
        }
    }

    if (filesOk) {
        console.log('✅ Todos los archivos críticos están presentes\n');
        results.push({ test: 'Critical Files', status: 'PASS' });
    } else {
        console.log('❌ Faltan archivos críticos\n');
        results.push({ test: 'Critical Files', status: 'FAIL' });
        allTestsPassed = false;
    }

    // 5. Verificar dependencias
    console.log('5️⃣ Verificando dependencias...');
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
        const requiredDeps = ['express', 'multer', 'mysql2', 'cors', 'helmet', 'joi'];

        let depsOk = true;
        for (const dep of requiredDeps) {
            if (packageJson.dependencies[dep]) {
                console.log(`  ✅ ${dep} v${packageJson.dependencies[dep]}`);
            } else {
                console.log(`  ❌ ${dep} - FALTANTE`);
                depsOk = false;
            }
        }

        if (depsOk) {
            console.log('✅ Todas las dependencias están presentes\n');
            results.push({ test: 'Dependencies', status: 'PASS' });
        } else {
            console.log('❌ Faltan dependencias críticas\n');
            results.push({ test: 'Dependencies', status: 'FAIL' });
            allTestsPassed = false;
        }
    } catch (error) {
        console.log('❌ Error verificando dependencias:', error.message, '\n');
        results.push({ test: 'Dependencies', status: 'FAIL' });
        allTestsPassed = false;
    }

    // Resumen final
    console.log('📊 RESUMEN DE VERIFICACIÓN');
    console.log('==========================');
    console.table(results);

    if (allTestsPassed) {
        console.log('\n🎉 ¡TODAS LAS VERIFICACIONES PASARON!');
        console.log('✅ El sistema está listo para producción');
        console.log('\n📋 PASOS PARA DESPLIEGUE:');
        console.log('1. Subir archivos del backend al servidor');
        console.log('2. Ejecutar: npm install');
        console.log('3. Crear directorio uploads/products con permisos 755');
        console.log('4. Verificar variables de entorno (.env)');
        console.log('5. Reiniciar servidor: npm start');
    } else {
        console.log('\n❌ HAY PROBLEMAS QUE RESOLVER');
        console.log('🔧 Revisa los errores arriba antes de desplegar');
    }

    return allTestsPassed;
}

// Ejecutar si se llama directamente
if (require.main === module) {
    verifyProductionReady()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Error en verificación:', error);
            process.exit(1);
        });
}

module.exports = { verifyProductionReady };