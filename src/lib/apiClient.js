// Cliente API para reemplazar Supabase
class ApiClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    this.token = this.getToken();
  }

  // Gestión de token
  getToken() {
    return localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Método principal para hacer requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Si el token expiró, limpiar y solo lanzar error si es una ruta que requiere auth
      if (response.status === 401) {
        this.setToken(null);
        // Solo lanzar "Sesión expirada" si se requiere autenticación
        if (options.requireAuth !== false) {
          throw new Error('Sesión expirada');
        }
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Método para hacer requests públicos (sin token)
  async publicRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Métodos HTTP específicos
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Métodos de autenticación
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async register(email, password, full_name) {
    const response = await this.post('/auth/register', { email, password, full_name });
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    if (!this.token) return null;
    try {
      const response = await this.get('/auth/me');
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Métodos de productos
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    return this.publicRequest(url);
  }

  async getFeaturedProducts(limit = 6) {
    const queryString = new URLSearchParams({ limit }).toString();
    return this.publicRequest(`/products/featured?${queryString}`);
  }

  async getProductBySku(sku) {
    return this.publicRequest(`/products/${sku}`);
  }

  async createProduct(productData) {
    return this.post('/products', productData);
  }

  async updateProduct(id, productData) {
    return this.put(`/products/${id}`, productData);
  }

  async deleteProduct(id) {
    return this.delete(`/products/${id}`);
  }

  async clearAllProducts() {
    return this.delete('/products/clear-all');
  }

  async hardClearProducts() {
    return this.delete('/products/hard-clear');
  }

  // Métodos de órdenes
  async createOrder(orderData) {
    return this.post('/orders', orderData);
  }

  async getOrders(params = {}) {
    return this.get('/orders', params);
  }

  async getOrderById(id) {
    return this.get(`/orders/${id}`);
  }

  // Métodos de usuarios
  async updateProfile(userId, profileData) {
    return this.put(`/users/${userId}`, profileData);
  }

  async getUsers(params = {}) {
    return this.get('/users', params);
  }

  // Métodos de favoritos
  async getFavorites() {
    return this.get('/favorites');
  }

  async addToFavorites(productId) {
    return this.post('/favorites', { product_id: productId });
  }

  async removeFromFavorites(productId) {
    return this.delete(`/favorites/${productId}`);
  }

  async checkFavorite(productId) {
    return this.get(`/favorites/check/${productId}`);
  }

  // Método para verificar salud de la API
  async healthCheck() {
    try {
      return await this.get('/health');
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'ERROR', error: error.message };
    }
  }
}

// Crear instancia singleton
export const apiClient = new ApiClient();

// Exportar también la clase para casos específicos
export { ApiClient };