import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import safeStorage from '@/lib/utils';

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
  const [loading, setLoading] = useState(false);

  // Función para obtener la clave del carrito específica del usuario
  const getCartKey = () => {
    return user?.id ? `cart_${user.id}` : 'cart_guest';
  };

  // Cargar carrito cuando cambie el usuario
  useEffect(() => {
    const loadCart = () => {
      try {
        const cartKey = getCartKey();
        const cartData = safeStorage.getItem(cartKey);
        console.log(`🛒 Cargando carrito para ${user?.email || 'invitado'} con clave:`, cartKey);
        console.log('🛒 Datos del carrito:', cartData);

        const localCart = JSON.parse(cartData || '[]');
        setItems(localCart);
        console.log('🛒 Carrito cargado:', localCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        setItems([]);
      }
    };

    // Cargar carrito cada vez que cambie el usuario (incluyendo logout)
    loadCart();
  }, [user?.id]); // Dependencia del ID del usuario

  // Guardar en storage cuando cambie el carrito o el usuario
  useEffect(() => {
    if (!loading) {
      const cartKey = getCartKey();
      console.log(`🛒 Guardando carrito para ${user?.email || 'invitado'} con clave:`, cartKey);
      console.log('🛒 Items a guardar:', items);
      safeStorage.setItem(cartKey, JSON.stringify(items));
    }
  }, [items, loading, user?.id]);

  const addToCart = (product, quantity = 1) => {
    try {
      setItems(prevItems => {
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

      toast({
        title: "Producto agregado",
        description: `${product.name} se agregó al carrito`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar al carrito',
        variant: 'destructive'
      });
    }
  };

  const removeFromCart = (productId) => {
    try {
      setItems(prev => prev.filter(item => item.id !== productId));
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó del carrito",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar del carrito',
        variant: 'destructive'
      });
    }
  };

  const updateQuantity = (productId, quantity) => {
    try {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la cantidad',
        variant: 'destructive'
      });
    }
  };

  const clearCart = () => {
    try {
      setItems([]);
      // También limpiar del storage específico del usuario
      const cartKey = getCartKey();
      safeStorage.removeItem(cartKey);
      console.log(`🛒 Carrito limpiado para ${user?.email || 'invitado'}`);

      toast({
        title: "Carrito vaciado",
        description: "Se eliminaron todos los productos del carrito",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: 'Error',
        description: 'No se pudo vaciar el carrito',
        variant: 'destructive'
      });
    }
  };

  // Función para limpiar carrito silenciosamente (sin toast) - para después de compras exitosas
  const clearCartSilently = () => {
    try {
      setItems([]);
      const cartKey = getCartKey();
      safeStorage.removeItem(cartKey);
      console.log(`🛒 Carrito limpiado silenciosamente para ${user?.email || 'invitado'}`);
    } catch (error) {
      console.error("Error clearing cart silently:", error);
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10);
      if (!isNaN(price) && !isNaN(quantity)) {
        return total + price * quantity;
      }
      return total;
    }, 0);
  };

  const getCartTotal = () => getTotalPrice();

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
    clearCartSilently,
    getTotalItems,
    getTotalPrice,
    getCartTotal,
    getCartSummary,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};