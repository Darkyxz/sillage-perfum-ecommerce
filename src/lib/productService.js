import { apiClient } from './apiClient';

// Obtener la URL base de la API desde las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Asegura que la URL de la imagen sea correcta para el entorno actual
 * @param {string} url - URL de la imagen (puede ser relativa o absoluta)
 * @returns {string} URL de la imagen formateada correctamente
 */
function ensureAbsoluteImageUrl(url) {
  if (!url) return '';

  // Si la URL ya es absoluta o es un data URL, devolverla tal cual
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url;
  }

  // En desarrollo, usar URLs relativas que pasarán por el proxy de Vite
  if (import.meta.env.DEV) {
    // Si la URL ya empieza con /, devolverla tal cual
    if (url.startsWith('/')) {
      // Asegurarse de que no tenga // duplicados
      return url.replace(/^\/+/, '/');
    }
    // Para cualquier otra ruta relativa, asegurarse de que empiece con /
    return `/${url}`.replace(/^\/+/, '/');
  }

  // En producción, construir la URL completa
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  // Eliminar la parte /api si existe al final de la URL base
  const cleanBaseUrl = baseUrl.endsWith('/api')
    ? baseUrl.slice(0, -3)
    : baseUrl;

  // Asegurarse de que la URL base termine con /
  const normalizedBase = cleanBaseUrl.endsWith('/')
    ? cleanBaseUrl
    : `${cleanBaseUrl}/`;

  // Eliminar / inicial de la URL si existe para evitar doble barra
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;

  return `${normalizedBase}${cleanUrl}`;
}

// Servicio para manejar productos con API MySQL
export const productService = {
  // Obtener todos los productos con paginación
  async getAllProducts(page = 1, limit = 24) {
    try {
      const offset = (page - 1) * limit;

      const response = await apiClient.getProducts({
        limit,
        offset
      });

      if (response.success) {
        // Asegurar que todas las URLs de imágenes sean absolutas
        const productsWithAbsoluteUrls = (response.data || []).map(product => ({
          ...product,
          image_url: ensureAbsoluteImageUrl(product.image_url)
        }));

        return {
          products: productsWithAbsoluteUrls,
          totalCount: response.total || 0,
          currentPage: page,
          totalPages: Math.ceil((response.total || 0) / limit),
          hasMore: (response.data || []).length === limit
        };
      } else {
        throw new Error(response.error || 'Error obteniendo productos');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Obtener todos los productos (sin paginación) - para casos específicos
  async getAllProductsNoPagination() {
    try {
      // Primero intentar con la ruta pública con límite alto
      const response = await apiClient.getProducts({ limit: 1000 });

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error obteniendo productos');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Si falla, intentar con la ruta /all
      try {
        const fallbackResponse = await apiClient.get('/products/all');
        if (fallbackResponse.success) {
          return fallbackResponse.data;
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
      throw error;
    }
  },

  // Obtener un producto por ID
  async getProductById(id) {
    try {
      const response = await apiClient.get(`/products/${id}`);

      if (response.success) {
        // Asegurar que la URL de la imagen sea absoluta
        if (response.data && response.data.image_url) {
          response.data.image_url = ensureAbsoluteImageUrl(response.data.image_url);
        }
        return response.data;
      } else {
        throw new Error(response.error || 'Producto no encontrado');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Obtener un producto por SKU
  async getProductBySku(sku) {
    try {
      const response = await apiClient.getProductBySku(sku);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Producto no encontrado');
      }
    } catch (error) {
      console.error('Error fetching product by SKU:', error);
      throw error;
    }
  },

  // Crear un nuevo producto
  async createProduct(productData) {
    try {
      const response = await apiClient.post('/products', productData);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error creando producto');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Actualizar un producto (REEMPLAZADO POR LAS SIGUIENTES DOS FUNCIONES)


  // Actualizar un producto
  async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error actualizando producto');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Actualiza solo los detalles de texto/numéricos de un producto
  async updateProductDetails(id, productDetails) {
    return this.updateProduct(id, productDetails);
  },

  // Actualiza solo la URL de la imagen de un producto
  async updateProductImage(id, imageUrl) {
    return this.updateProduct(id, { image_url: imageUrl });
  },

  // Marcar/desmarcar un producto como destacado
  async toggleFeaturedStatus(productId, currentStatus) {
    try {
      const response = await apiClient.put(`/products/${productId}`, {
        is_featured: !currentStatus
      });

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error actualizando estado destacado');
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
    }
  },

  // Eliminar un producto
  async deleteProduct(id) {
    try {
      const response = await apiClient.delete(`/products/${id}`);

      if (response.success) {
        return true;
      } else {
        throw new Error(response.error || 'Error eliminando producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Subir imagen al servidor
  async uploadProductImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Usar la URL base de la API desde las variables de entorno
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      let uploadUrl;
      if (baseUrl.includes('api-proxy.php')) {
        uploadUrl = baseUrl.replace(/\?.*$/, '') + '?action=upload-image';
      } else if (baseUrl.endsWith('/api')) {
        uploadUrl = `${baseUrl}/upload/product-image`;
      } else {
        uploadUrl = `${baseUrl}/api/upload/product-image`;
      }
      console.log('Subiendo imagen a:', uploadUrl);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          ...(apiClient.getToken() ? { 'Authorization': `Bearer ${apiClient.getToken()}` } : {})
        },
        body: formData
      });

      const responseData = await response.json();
      if (response.ok && responseData.success) {
        return responseData.url || responseData.fullUrl || responseData.data?.url || responseData.data?.fullUrl;
      } else {
        throw new Error(responseData.error || 'Error subiendo imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Buscar productos
  async searchProducts(searchTerm, category = null, sortOption = null) {
    try {
      const params = {};

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (category && category !== 'all') {
        params.category = category;
      }

      // Mapear opciones de ordenamiento
      if (sortOption && sortOption !== 'all') {
        switch (sortOption) {
          case 'price-low':
            params.sort = 'price';
            params.order = 'asc';
            break;
          case 'price-high':
            params.sort = 'price';
            params.order = 'desc';
            break;
          case 'newest':
            params.sort = 'created_at';
            params.order = 'desc';
            break;
          case 'popular':
            params.sort = 'stock_quantity';
            params.order = 'desc';
            break;
          default:
            params.sort = 'created_at';
            params.order = 'desc';
        }
      }

      const response = await apiClient.getProducts(params);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error buscando productos');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Actualizar stock de producto
  async updateStock(productId, quantity) {
    try {
      const response = await apiClient.put(`/products/${productId}`, {
        stock_quantity: quantity,
        in_stock: quantity > 0
      });

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error actualizando stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },

  // Obtener productos destacados
  async getFeaturedProducts(limit = 3) {
    try {
      const response = await apiClient.getFeaturedProducts(limit);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error obteniendo productos destacados');
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Obtener productos por categoría con paginación
  async getProductsByCategory(category, page = 1, limit = 24) {
    try {
      const offset = (page - 1) * limit;

      const response = await apiClient.getProducts({
        category,
        limit,
        offset
      });

      if (response.success) {
        return {
          products: response.data,
          totalCount: response.total || response.data.length,
          currentPage: page,
          totalPages: Math.ceil((response.total || response.data.length) / limit),
          hasMore: response.data.length === limit
        };
      } else {
        throw new Error(response.error || 'Error obteniendo productos por categoría');
      }
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Limpiar todos los productos (soft delete)
  async clearAllProducts() {
    try {
      const response = await apiClient.delete('/products/clear-all');

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error limpiando productos');
      }
    } catch (error) {
      console.error('Error clearing products:', error);
      throw error;
    }
  },

  // Eliminar permanentemente todos los productos
  async hardClearProducts() {
    try {
      const response = await apiClient.delete('/products/hard-clear');

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error eliminando productos permanentemente');
      }
    } catch (error) {
      console.error('Error hard clearing products:', error);
      throw error;
    }
  },

  // Función para convertir precio a CLP
  convertToCLP(price) {
    return price * 10; // Multiplicar por 10 para simular precios en CLP
  }
}; 