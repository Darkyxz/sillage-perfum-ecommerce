const Joi = require('joi');

// Esquemas de validación
const schemas = {
  // Validación para productos (más flexible)
  product: Joi.object({
    name: Joi.string().min(1).max(255).allow('').messages({
      'string.max': 'El nombre no puede exceder 255 caracteres'
    }),
    description: Joi.string().max(2000).allow('').messages({
      'string.max': 'La descripción no puede exceder 2000 caracteres'
    }),
    price: Joi.number().min(0).allow(null).messages({
      'number.base': 'El precio debe ser un número',
      'number.min': 'El precio no puede ser negativo'
    }),
    sku: Joi.string().max(100).allow('').messages({
      'string.max': 'El SKU no puede exceder 100 caracteres'
    }),
    brand: Joi.string().max(100).allow('').messages({
      'string.max': 'La marca no puede exceder 100 caracteres'
    }),
    category: Joi.string().max(100).allow('').messages({
      'string.max': 'La categoría no puede exceder 100 caracteres'
    }),
    image_url: Joi.string().allow('').messages({}),
    stock_quantity: Joi.number().integer().min(0).allow(null).messages({
      'number.base': 'La cantidad en stock debe ser un número',
      'number.integer': 'La cantidad en stock debe ser un número entero',
      'number.min': 'La cantidad en stock no puede ser negativa'
    }),
    is_featured: Joi.boolean().allow(null),
    is_active: Joi.boolean().allow(null),
    rating: Joi.number().min(0).max(5).allow(null).messages({
      'number.min': 'La calificación debe ser entre 0 y 5',
      'number.max': 'La calificación debe ser entre 0 y 5'
    }),
    // Campos adicionales que pueden existir
    notes: Joi.string().allow(''),
    duration: Joi.string().allow(''),
    original_inspiration: Joi.string().allow(''),
    size: Joi.string().allow(''),
    concentration: Joi.string().allow(''),
    in_stock: Joi.boolean().allow(null)
  }).unknown(true),

  // Validación para registro de usuario
  userRegister: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido'
    }),
    password: Joi.string()
      .min(8)
      .max(100)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.max': 'La contraseña no puede exceder 100 caracteres',
        'string.pattern.base': 'La contraseña debe contener al menos: una mayúscula, una minúscula, un número y un símbolo',
        'any.required': 'La contraseña es requerida'
      }),
    full_name: Joi.string()
      .min(2)
      .max(255)
      .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 255 caracteres',
        'string.pattern.base': 'El nombre solo puede contener letras y espacios',
        'any.required': 'El nombre completo es requerido'
      }),
    phone: Joi.string().max(20).allow('').messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    })
  }),

  // Validación para login (más permisiva)
  userLogin: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido'
    }),
    password: Joi.string().min(1).required().messages({
      'string.min': 'La contraseña es requerida',
      'any.required': 'La contraseña es requerida'
    })
  }),

  // Validación para actualizar perfil
  userUpdate: Joi.object({
    full_name: Joi.string().min(2).max(255).messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 255 caracteres'
    }),
    phone: Joi.string().max(20).allow('').messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    }),
    address: Joi.string().max(500).allow('').messages({
      'string.max': 'La dirección no puede exceder 500 caracteres'
    }),
    city: Joi.string().max(100).allow('').messages({
      'string.max': 'La ciudad no puede exceder 100 caracteres'
    }),
    region: Joi.string().max(100).allow('').messages({
      'string.max': 'La región no puede exceder 100 caracteres'
    }),
    postal_code: Joi.string().max(10).allow('').messages({
      'string.max': 'El código postal no puede exceder 10 caracteres'
    })
  }),

  // Validación para órdenes
  order: Joi.object({
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
        unit_price: Joi.number().positive().precision(2).required()
      })
    ).min(1).required().messages({
      'array.min': 'La orden debe tener al menos un producto'
    }),
    shipping_address: Joi.string().max(500).required().messages({
      'any.required': 'La dirección de envío es requerida',
      'string.max': 'La dirección no puede exceder 500 caracteres'
    }),
    shipping_city: Joi.string().max(100).required().messages({
      'any.required': 'La ciudad de envío es requerida'
    }),
    shipping_region: Joi.string().max(100).required().messages({
      'any.required': 'La región de envío es requerida'
    }),
    shipping_postal_code: Joi.string().max(10).allow(''),
    notes: Joi.string().max(1000).allow('')
  })
};

// Middleware de validación genérico
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Mostrar todos los errores
      stripUnknown: true // Remover campos no definidos
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: errors
      });
    }

    // Reemplazar req.body con los datos validados y limpiados
    req.body = value;
    next();
  };
};

// Middlewares específicos
const validateProduct = validate(schemas.product);
const validateUserRegister = validate(schemas.userRegister);
const validateUserLogin = validate(schemas.userLogin);
const validateUserUpdate = validate(schemas.userUpdate);
const validateOrder = validate(schemas.order);

// Validación de parámetros de query
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Parámetros de consulta inválidos',
        details: errors
      });
    }

    req.query = value;
    next();
  };
};

// Esquema para paginación
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().valid('name', 'price', 'created_at', 'rating').default('created_at'),
  order: Joi.string().valid('asc', 'desc').default('desc')
});

const validatePagination = validateQuery(paginationSchema);

module.exports = {
  validate,
  validateProduct,
  validateUserRegister,
  validateUserLogin,
  validateUserUpdate,
  validateOrder,
  validateQuery,
  validatePagination,
  schemas
};