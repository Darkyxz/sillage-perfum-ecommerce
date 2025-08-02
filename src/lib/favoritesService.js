import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class FavoritesService {
    // Obtener todos los favoritos del usuario
    async getFavorites() {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            const response = await fetch(`${API_BASE_URL}/favorites`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error obteniendo favoritos');
            }

            return data;
        } catch (error) {
            console.error('Error en getFavorites:', error);
            throw error;
        }
    }

    // Verificar si un producto está en favoritos
    async checkFavorite(productId) {
        try {
            const token = authService.getToken();
            if (!token) {
                return { isFavorite: false };
            }

            const response = await fetch(`${API_BASE_URL}/favorites/check/${productId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error verificando favorito');
            }

            return data;
        } catch (error) {
            console.error('Error en checkFavorite:', error);
            return { isFavorite: false };
        }
    }

    // Agregar producto a favoritos
    async addFavorite(productId) {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            const response = await fetch(`${API_BASE_URL}/favorites`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product_id: productId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error agregando a favoritos');
            }

            return data;
        } catch (error) {
            console.error('Error en addFavorite:', error);
            throw error;
        }
    }

    // Remover producto de favoritos
    async removeFavorite(productId) {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            const response = await fetch(`${API_BASE_URL}/favorites/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error removiendo de favoritos');
            }

            return data;
        } catch (error) {
            console.error('Error en removeFavorite:', error);
            throw error;
        }
    }

    // Toggle favorito (agregar/remover)
    async toggleFavorite(productId) {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            const response = await fetch(`${API_BASE_URL}/favorites/toggle`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product_id: productId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error procesando favorito');
            }

            return data;
        } catch (error) {
            console.error('Error en toggleFavorite:', error);
            throw error;
        }
    }
}

export const favoritesService = new FavoritesService();