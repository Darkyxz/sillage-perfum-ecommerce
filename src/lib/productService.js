import { supabase } from './supabase';

// Servicio para manejar productos con Supabase
export const productService = {
  // Obtener todos los productos con paginación
  async getAllProducts(page = 1, limit = 24) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      // Convertir precios a CLP
      const productsWithCLP = (data || []).map(product => ({
        ...product,
        price: product.price * 10
      }));
      
      return {
        products: productsWithCLP,
        totalCount: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        hasMore: to < count - 1
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Obtener todos los productos (sin paginación) - para casos específicos
  async getAllProductsNoPagination() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const productsWithCLP = (data || []).map(product => ({
        ...product,
        price: product.price * 10
      }));
      
      return productsWithCLP;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Obtener un producto por ID
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Convertir precio a CLP
      const productWithCLP = data ? {
        ...data,
        price: data.price * 10 // Convertir a CLP
      } : null;
      
      return productWithCLP;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Obtener un producto por SKU
  async getProductBySku(sku) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single();

      if (error) throw error;
      
      // Convertir precio a CLP
      const productWithCLP = data ? {
        ...data,
        price: data.price * 10 // Convertir a CLP
      } : null;
      
      return productWithCLP;
    } catch (error) {
      console.error('Error fetching product by SKU:', error);
      throw error;
    }
  },

  // Crear un nuevo producto
  async createProduct(productData) {
    // Quitamos el ID nulo del objeto para que la DB genere uno nuevo.
    const { id, ...newProductData } = productData;

    // Preparar datos para la base de datos
    const dataForDb = {
      ...newProductData,
      price: parseFloat(newProductData.price) / 10, // Convertir de CLP a unidad base
      // Asegurar que las notas olfativas estén en el formato correcto
      fragrance_profile: newProductData.fragrance_profile || [],
      fragrance_notes: newProductData.fragrance_notes || { top: [], middle: [], base: [] }
    };

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([dataForDb])
        .select()
        .single();

      if (error) throw error;
      
      // La data de la DB viene con el precio base, lo convertimos para la UI.
      const productWithCLP = {
        ...data,
        price: data.price * 10
      };

      return productWithCLP;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Actualizar un producto (REEMPLAZADO POR LAS SIGUIENTES DOS FUNCIONES)
  /*
  async updateProduct(id, productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  */

  // Actualiza solo los detalles de texto/numéricos de un producto
  async updateProductDetails(id, productDetails) {
    // Excluimos SKU para evitar conflictos de llaves únicas.
    // El SKU solo se debe asignar al crear un producto.
    const { id: productId, sku, ...details } = productDetails;

    // Revertir la conversión de CLP a la unidad base antes de guardar en la DB.
    const detailsForDb = {
      ...details,
      price: parseFloat(details.price) / 10,
      // Asegurar que las notas olfativas estén en el formato correcto
      fragrance_profile: details.fragrance_profile || [],
      fragrance_notes: details.fragrance_notes || { top: [], middle: [], base: [] }
    };

    try {
      const { data, error } = await supabase
        .from('products')
        .update(detailsForDb)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Convertir el precio de la DB a CLP para la UI
      const productWithCLP = {
        ...data,
        price: data.price * 10
      };

      return productWithCLP;
    } catch (error) {
      console.error('Error updating product details:', error);
      throw error;
    }
  },

  // Actualiza solo la URL de la imagen de un producto
  async updateProductImage(id, imageUrl) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ image_url: imageUrl })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product image:', error);
      throw error;
    }
  },

  // Marcar/desmarcar un producto como destacado
  async toggleFeaturedStatus(productId, currentStatus) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ is_featured: !currentStatus })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      
      // Devolvemos el producto con el precio convertido para mantener la consistencia en la UI
      const productWithCLP = data ? {
        ...data,
        price: data.price * 10
      } : null;

      return productWithCLP;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
    }
  },

  // Eliminar un producto
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Subir imagen a Supabase Storage
  async uploadProductImage(file, productId) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Buscar productos
  async searchProducts(searchTerm, category = null, sortOption = null) {
    try {
      let query = supabase
        .from('products')
        .select('*');

      // Filtro de búsqueda
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Filtro de categoría
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // Aplicar ordenamiento
      if (sortOption && sortOption !== 'all') {
        switch (sortOption) {
          case 'price-low':
            query = query.order('price', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'popular':
            // Asumir que productos con más stock o destacados son más populares
            query = query.order('stock_quantity', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Convertir precios a CLP (multiplicar por 10 para simular precios reales)
      const productsWithCLP = (data || []).map(product => ({
        ...product,
        price: product.price * 10 // Convertir a CLP
      }));
      
      return productsWithCLP;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Actualizar stock de producto
  async updateStock(productId, quantity) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: quantity,
          in_stock: quantity > 0 
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },

  // Obtener productos destacados
  async getFeaturedProducts(limit = 3) {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Si la columna is_featured existe, usarla
      try {
        query = query.eq('is_featured', true);
      } catch (error) {
        // Si is_featured no existe, usar los primeros productos
        console.log('Columna is_featured no encontrada, usando productos recientes');
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Convertir precios a CLP (multiplicar por 10 para simular precios reales)
      const productsWithCLP = (data || []).map(product => ({
        ...product,
        price: product.price * 10 // Convertir a CLP
      }));
      
      return productsWithCLP;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Obtener productos por categoría con paginación
  async getProductsByCategory(category, page = 1, limit = 24) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      const productsWithCLP = (data || []).map(product => ({
        ...product,
        price: product.price * 10
      }));
      
      return {
        products: productsWithCLP,
        totalCount: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        hasMore: to < count - 1
      };
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Función para convertir precio a CLP
  convertToCLP(price) {
    return price * 10; // Multiplicar por 10 para simular precios en CLP
  }
}; 