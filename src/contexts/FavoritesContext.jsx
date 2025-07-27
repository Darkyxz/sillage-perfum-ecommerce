import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import safeStorage from '@/utils/storage';

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

  // Cargar favoritos del storage al inicializar
  useEffect(() => {
    const storedFavorites = safeStorage.getItem('sillage-favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from storage:', error);
      }
    }
  }, []);

  // Guardar favoritos en storage cuando cambien
  useEffect(() => {
    // Siempre guardar en storage seguro
    safeStorage.setItem('sillage-favorites', JSON.stringify(favorites));

    // Intentar usar cookies funcionales si están disponibles
    try {
      const consent = safeStorage.getItem('cookie-consent');
      if (consent) {
        const parsed = JSON.parse(consent);
        if (parsed.functional) {
          // Guardar contador de favoritos como cookie funcional
          document.cookie = `favorites_count=${favorites.length}; path=/; SameSite=Lax; max-age=${365 * 24 * 60 * 60}`;
        }
      }
    } catch (e) {
      // Ignorar errores de cookies
    }
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
