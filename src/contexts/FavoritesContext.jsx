import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

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

  // Cargar favoritos del localStorage al inicializar
  useEffect(() => {
    const storedFavorites = localStorage.getItem('sillage-favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('sillage-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Agregar producto a favoritos
  const addToFavorites = (product) => {
    if (!isInFavorites(product.id)) {
      setFavorites(prev => [...prev, product]);
      toast({
        title: "Agregado a favoritos",
        description: `${product.name} se ha agregado a tus favoritos`,
      });
    }
  };

  // Eliminar producto de favoritos
  const removeFromFavorites = (productId) => {
    const product = favorites.find(item => item.id === productId);
    setFavorites(prev => prev.filter(item => item.id !== productId));
    if (product) {
      toast({
        title: "Eliminado de favoritos",
        description: `${product.name} se ha eliminado de tus favoritos`,
      });
    }
  };

  // Verificar si un producto está en favoritos
  const isInFavorites = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  // Alternar favorito (agregar si no está, eliminar si está)
  const toggleFavorite = (product) => {
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  // Obtener número total de favoritos
  const getFavoritesCount = () => {
    return favorites.length;
  };

  // Limpiar todos los favoritos
  const clearFavorites = () => {
    setFavorites([]);
    toast({
      title: "Favoritos eliminados",
      description: "Se han eliminado todos los productos de tus favoritos",
    });
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    toggleFavorite,
    getFavoritesCount,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
