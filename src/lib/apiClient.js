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
    let url;
    
    // Si estamos usando el proxy, necesitamos formatear la URL de manera diferente
    if (this.baseURL.includes('api-proxy.php')) {
      // Remover la barra inicial del endpoint si existe
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
      // Construir la ruta completa para el proxy
      const path = `api/${cleanEndpoint}`;
      
      // Si no hay parámetros en el endpoint, usar la sintaxis con ?path=
      if (!endpoint.includes('?')) {
        url = `${this.baseURL}?path=${encodeURIComponent(path)}`;
      } else {
        // Si hay parámetros, separarlos
        const [basePath, queryString] = endpoint.split('?');
        const cleanBasePath = basePath.startsWith('/') ? basePath.substring(1) : basePath;
        url = `${this.baseURL}?path=${encodeURIComponent(`api/${cleanBasePath}`)}&${queryString}`;
      }
    } else {
      // URL normal para conexión directa
      url = `${this.baseURL}${endpoint}`;
    }
    
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
    let url;
    
    // Si estamos usando el proxy, necesitamos formatear la URL de manera diferente
    if (this.baseURL.includes('api-proxy.php')) {
      // Remover la barra inicial del endpoint si existe
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
      // Construir la ruta completa para el proxy
      const path = `api/${cleanEndpoint}`;
      
      // Si no hay parámetros en el endpoint, usar la sintaxis con ?path=
      if (!endpoint.includes('?')) {
        url = `${this.baseURL}?path=${encodeURIComponent(path)}`;
      } else {
        // Si hay parámetros, separarlos
        const [basePath, queryString] = endpoint.split('?');
        const cleanBasePath = basePath.startsWith('/') ? basePath.substring(1) : basePath;
        url = `${this.baseURL}?path=${encodeURIComponent(`api/${cleanBasePath}`)}&${queryString}`;
      }
    } else {
      // URL normal para conexión directa
      url = `${this.baseURL}${endpoint}`;
    }
    
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
    let response;
    if (this.baseURL.includes('api-proxy.php')) {
      // Usar proxy para login
      const url = `${this.baseURL}?${new URLSearchParams({ path: 'api/auth/login' }).toString()}`;
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      };
      const res = await fetch(url, config);
      response = await res.json();
    } else {
      // Método directo al backend
      response = await this.post('/auth/login', { email, password });
    }
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async register(email, password, full_name) {
    let response;
    if (this.baseURL.includes('api-proxy.php')) {
      // Usar proxy para register
      const url = `${this.baseURL}?${new URLSearchParams({ path: 'api/auth/register' }).toString()}`;
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, full_name }),
      };
      const res = await fetch(url, config);
      response = await res.json();
    } else {
      // Método directo al backend
      response = await this.post('/auth/register', { email, password, full_name });
    }
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout() {
    try {
      if (this.baseURL.includes('api-proxy.php')) {
        // Usar proxy para logout
        const url = `${this.baseURL}?${new URLSearchParams({ path: 'api/auth/logout' }).toString()}`;
        const config = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
          },
        };
        await fetch(url, config);
      } else {
        // Método directo al backend
        await this.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    if (!this.token) return null;
    try {
      let response;
      if (this.baseURL.includes('api-proxy.php')) {
        // Usar proxy para getCurrentUser
        const url = `${this.baseURL}?${new URLSearchParams({ path: 'api/auth/me' }).toString()}`;
        const config = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        };
        const res = await fetch(url, config);
        response = await res.json();
      } else {
        // Método directo al backend
        response = await this.get('/auth/me');
      }
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Métodos de productos
  async getProducts(params = {}) {
    // Si estamos usando el proxy, los parámetros deben ir como query params separados
    if (this.baseURL.includes('api-proxy.php')) {
      const allParams = { path: 'api/products', ...params };
      const queryString = new URLSearchParams(allParams).toString();
      return this.publicRequest(`?${queryString}`);
    } else {
      // Comportamiento normal para URLs directas del backend
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/products?${queryString}` : '/products';
      return this.publicRequest(url);
    }
  }

  async getFeaturedProducts(limit = 6) {
    if (this.baseURL.includes('api-proxy.php')) {
      const allParams = { path: 'api/products/featured', limit };
      const queryString = new URLSearchParams(allParams).toString();
      return this.publicRequest(`?${queryString}`);
    } else {
      const queryString = new URLSearchParams({ limit }).toString();
      return this.publicRequest(`/products/featured?${queryString}`);
    }
  }

  async getProductBySku(sku) {
    if (this.baseURL.includes('api-proxy.php')) {
      const allParams = { path: `api/products/${sku}` };
      const queryString = new URLSearchParams(allParams).toString();
      return this.publicRequest(`?${queryString}`);
    } else {
      return this.publicRequest(`/products/${sku}`);
    }
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