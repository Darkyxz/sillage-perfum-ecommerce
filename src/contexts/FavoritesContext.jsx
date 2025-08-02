import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { favoritesService } from '@/lib/favoritesService';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Cargar favoritos cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setError(null);
    }
  }, [user, isAuthenticated]);

  const loadFavorites = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const response = await favoritesService.getFavorites();
      setFavorites(response.data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError('Error cargando favoritos');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (product) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para agregar favoritos');
      return false;
    }

    try {
      // Verificar si ya está en favoritos
      const isAlreadyFavorite = favorites.some(fav => fav.id === product.id);
      if (isAlreadyFavorite) {
        setError('El producto ya está en favoritos');
        return false;
      }

      const response = await favoritesService.addFavorite(product.id);

      // Actualizar estado local
      setFavorites(prev => [...prev, product]);
      setError(null);

      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setError(error.message || 'Error agregando a favoritos');
      return false;
    }
  };

  const removeFromFavorites = async (productId) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión');
      return false;
    }

    try {
      await favoritesService.removeFavorite(productId);

      // Actualizar estado local
      setFavorites(prev => prev.filter(fav => fav.id !== productId));
      setError(null);

      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setError(error.message || 'Error removiendo de favoritos');
      return false;
    }
  };

  const toggleFavorite = async (product) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para gestionar favoritos');
      return { success: false, action: null };
    }

    try {
      const response = await favoritesService.toggleFavorite(product.id);

      if (response.action === 'added') {
        // Agregar al estado local
        setFavorites(prev => [...prev, product]);
      } else if (response.action === 'removed') {
        // Remover del estado local
        setFavorites(prev => prev.filter(fav => fav.id !== product.id));
      }

      setError(null);
      return {
        success: true,
        action: response.action,
        message: response.message,
        isFavorite: response.isFavorite
      };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError(error.message || 'Error procesando favorito');
      return { success: false, action: null };
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav.id === productId);
  };

  const checkFavorite = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      const response = await favoritesService.checkFavorite(productId);
      return response.isFavorite;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    checkFavorite,
    loadFavorites,
    clearError,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};