const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/products');

        // Crear directorio si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, 'product-' + uniqueSuffix + extension);
    }
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten: JPEG, JPG, PNG, WEBP'), false);
    }
};

// Configurar multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
    }
});

// POST /api/upload/product-image - Subir imagen de producto
router.post('/product-image', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No se proporcionó ningún archivo'
            });
        }

        // Construir URL de la imagen
        const imageUrl = `/uploads/products/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Imagen subida exitosamente',
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                url: imageUrl,
                fullUrl: `${req.protocol}://${req.get('host')}${imageUrl}`
            }
        });

    } catch (error) {
        console.error('Error subiendo imagen:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor al subir imagen'
        });
    }
});

// DELETE /api/upload/product-image/:filename - Eliminar imagen de producto
router.delete('/product-image/:filename', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads/products', filename);

        // Verificar si el archivo existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'Archivo no encontrado'
            });
        }

        // Eliminar el archivo
        fs.unlinkSync(filePath);

        res.json({
            success: true,
            message: 'Imagen eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error eliminando imagen:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor al eliminar imagen'
        });
    }
});

// Middleware para manejar errores de multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'El archivo es demasiado grande. Máximo 5MB permitido.'
            });
        }
    }

    if (error.message.includes('Tipo de archivo no permitido')) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }

    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

module.exports = router;