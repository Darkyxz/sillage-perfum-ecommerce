
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cartService } from '@/lib/cartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar carrito al iniciar o al cambiar de usuario
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      if (user) {
        // Usuario logueado
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (localCart.length > 0) {
          await syncLocalCartToSupabase(localCart);
          localStorage.removeItem('cart');
        } else {
          await loadSupabaseCart();
        }
      } else {
        // Usuario invitado
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setItems(localCart);
        setLoading(false);
      }
    };
    loadCart();
  }, [user]);

  // Guardar en localStorage solo si es invitado
  useEffect(() => {
    if (!user && !loading) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user, loading]);

  const loadSupabaseCart = async () => {
    if (!user) return;
    try {
      const data = await cartService.getCart(user.id);
      const mapped = data.map(item => ({
        ...item.product, // Corregido de 'products' a 'product'
        quantity: item.quantity,
      }));
      setItems(mapped);
    } catch (error) {
      console.error("Error loading Supabase cart:", error);
      toast({ title: 'Error', description: 'No se pudo cargar el carrito', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const syncLocalCartToSupabase = async (localItems) => {
    if (!user) return;
    setLoading(true);
    try {
      const remoteCart = await cartService.getCart(user.id);
      
      for (const localItem of localItems) {
        // Buscar por product_id (cada variante tiene su propio ID único)
        const remoteItem = remoteCart.find(item => item.product_id === localItem.id);
        if (remoteItem) {
          // Si existe la misma variante, actualiza la cantidad (suma)
          const newQuantity = remoteItem.quantity + localItem.quantity;
          await cartService.updateQuantity(user.id, localItem.id, newQuantity);
        } else {
          // Si no existe esta variante específica, la añade
          await cartService.addToCart(user.id, localItem.id, localItem.quantity);
        }
      }
      await loadSupabaseCart(); // Cargar el carrito fusionado
    } catch (error) {
      console.error("Error syncing cart:", error);
      toast({ title: 'Error', description: 'No se pudo sincronizar el carrito', variant: 'destructive' });
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        await cartService.addToCart(user.id, product.id, quantity);
        await loadSupabaseCart();
      } catch (error) {
        console.error("Error adding to Supabase cart:", error);
        toast({ title: 'Error', description: 'No se pudo agregar al carrito', variant: 'destructive' });
      }
    } else {
      setItems(prevItems => {
        // Identificar producto único por id (que ya incluye la variante específica)
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        await cartService.removeFromCart(user.id, productId);
        setItems(prev => prev.filter(item => item.id !== productId));
      } catch (error) {
        console.error("Error removing from Supabase cart:", error);
        toast({ title: 'Error', description: 'No se pudo eliminar del carrito', variant: 'destructive' });
      }
    } else {
      setItems(prev => prev.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
     if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    if (user) {
      try {
        await cartService.updateQuantity(user.id, productId, quantity);
         setItems(prevItems =>
          prevItems.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        );
      } catch (error) {
        console.error("Error updating Supabase cart quantity:", error);
        toast({ title: 'Error', description: 'No se pudo actualizar la cantidad', variant: 'destructive' });
      }
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  const clearCart = async () => {
    if (user) {
      try {
        await cartService.clearCart(user.id);
        setItems([]);
      } catch (error) {
        console.error("Error clearing Supabase cart:", error);
        toast({ title: 'Error', description: 'No se pudo vaciar el carrito', variant: 'destructive' });
      }
    } else {
      setItems([]);
    }
  };

  const getTotalItems = () => items.reduce((total, item) => total + (item.quantity || 0), 0);
  
  const getTotalPrice = () => items.reduce((total, item) => {
    const price = parseFloat(item.price);
    const quantity = parseInt(item.quantity, 10);
    if (!isNaN(price) && !isNaN(quantity)) {
      return total + price * quantity;
    }
    return total;
  }, 0);

  // Función helper para obtener información del carrito agrupada por producto base
  const getCartSummary = () => {
    const grouped = {};
    items.forEach(item => {
      const key = `${item.name}-${item.brand}`;
      if (!grouped[key]) {
        grouped[key] = {
          name: item.name,
          brand: item.brand,
          variants: [],
          totalQuantity: 0,
          totalPrice: 0
        };
      }
      grouped[key].variants.push({
        id: item.id,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        sku: item.sku
      });
      grouped[key].totalQuantity += item.quantity;
      grouped[key].totalPrice += item.price * item.quantity;
    });
    return Object.values(grouped);
  };

  const value = {
    items,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartSummary,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
