const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');

// Importar y configurar la aplicación Express
const express = require('express');
const { createServer } = require('http');
const multer = require('multer');
const cors = require('cors');

// Configuración de rutas y middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads', 'products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'test-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  }
});

// Ruta para subir imágenes
app.post('/api/upload/product-image', 
  (req, res, next) => {
    // Middleware de autenticación simulado
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No autorizado' });
    }
    next();
  },
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se proporcionó ninguna imagen' });
    }
    
    const imageUrl = `/uploads/products/${req.file.filename}`;
    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: imageUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${imageUrl}`
      }
    });
  }
);

// Ruta para eliminar imágenes
app.delete('/api/upload/product-image/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', 'products', filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'Archivo no encontrado' });
  }
  
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error al eliminar el archivo:', err);
      return res.status(500).json({ success: false, error: 'Error al eliminar el archivo' });
    }
    res.json({ success: true, message: 'Archivo eliminado correctamente' });
  });
});

// Iniciar el servidor para pruebas
const server = createServer(app);
const PORT = process.env.TEST_PORT || 3002;

// Configuración
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const PRODUCTS_DIR = path.join(UPLOAD_DIR, 'products');
const TEST_IMAGE = path.join(__dirname, 'test-image.jpg');
const TEST_TOKEN = 'test-token';

// Script para probar que el directorio de uploads esté configurado correctamente
async function testUploadSetup() {
    console.log('🧪 Probando configuración de uploads...');

    try {
        // Verificar que el directorio uploads existe
        if (!fs.existsSync(UPLOAD_DIR)) {
            console.log('📁 Creando directorio uploads...');
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        // Verificar que el directorio products existe
        if (!fs.existsSync(PRODUCTS_DIR)) {
            console.log('📁 Creando directorio uploads/products...');
            fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
        }

        // Probar permisos de escritura
        const testFile = path.join(PRODUCTS_DIR, 'test-write.txt');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);

        console.log('✅ Directorio uploads configurado correctamente');
        console.log(`📍 Ruta: ${PRODUCTS_DIR}`);

        // Mostrar archivos existentes
        const files = fs.readdirSync(PRODUCTS_DIR);
        console.log(`📊 Archivos actuales: ${files.length}`);
        if (files.length > 0) {
            files.forEach(file => console.log(`  - ${file}`));
        }

        return true;
    } catch (error) {
        console.error('❌ Error en configuración de uploads:', error.message);
        return false;
    }
}

// Función para probar la subida de archivos
async function testFileUpload() {
    console.log('\n🧪 Probando subida de archivos...');

    // Verificar si el archivo de prueba existe
    if (!fs.existsSync(TEST_IMAGE)) {
        console.log(`⚠️  No se encontró la imagen de prueba en: ${TEST_IMAGE}`);
        console.log('   Crea un directorio test/fixtures/ y añade una imagen de prueba llamada test-image.jpg');
        return false;
    }

    try {
        const response = await request(app)
            .post('/api/upload/product-image')
            .set('Authorization', `Bearer ${TEST_TOKEN}`)
            .attach('image', TEST_IMAGE);

        if (response.status !== 200) {
            throw new Error(`Error en la respuesta: ${response.status} - ${JSON.stringify(response.body)}`);
        }

        console.log('✅ Prueba de subida exitosa');
        console.log('   URL de la imagen:', response.body.data?.url || response.body.data?.fullUrl);
        
        // Retornar el nombre del archivo para pruebas posteriores
        return response.body.data?.filename || null;
    } catch (error) {
        console.error('❌ Error en la prueba de subida:', error.message);
        return false;
    }
}

// Función para probar la eliminación de archivos
async function testFileDeletion(filename) {
    if (!filename) {
        console.log('⚠️  No se puede probar la eliminación sin un nombre de archivo');
        return false;
    }

    console.log('\n🧪 Probando eliminación de archivos...');

    try {
        const response = await request(app)
            .delete(`/api/upload/product-image/${filename}`)
            .set('Authorization', `Bearer ${TEST_TOKEN}`);

        if (response.status !== 200) {
            throw new Error(`Error en la respuesta: ${response.status} - ${JSON.stringify(response.body)}`);
        }

        console.log('✅ Prueba de eliminación exitosa');
        return true;
    } catch (error) {
        console.error('❌ Error en la prueba de eliminación:', error.message);
        return false;
    }
}

// Función principal para ejecutar todas las pruebas
async function runTests() {
    console.log('🚀 Iniciando pruebas de carga de archivos\n');
    
    // 1. Probar configuración de directorios
    const setupOk = await testUploadSetup();
    if (!setupOk) {
        console.log('💥 No se pudo completar la configuración inicial');
        return false;
    }

    // 2. Probar subida de archivo
    const filename = await testFileUpload();
    if (!filename) {
        console.log('💥 No se pudo completar la prueba de subida');
        return false;
    }

    // 3. Probar eliminación de archivo
    const deleteOk = await testFileDeletion(filename);
    if (!deleteOk) {
        console.log('💥 No se pudo completar la prueba de eliminación');
        return false;
    }

    console.log('\n🎉 ¡Todas las pruebas se completaron con éxito!');
    return true;
}

// Ejecutar si se llama directamente
if (require.main === module) {
    runTests()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Error inesperado:', error);
            process.exit(1);
        });
}

module.exports = { 
    testUploadSetup, 
    testFileUpload, 
    testFileDeletion,
    runTests
};