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

  // Cargar carrito al iniciar - solo una vez
  useEffect(() => {
    const loadCart = () => {
      try {
        const cartData = safeStorage.getItem('cart');
        console.log('🛒 Cargando carrito desde storage:', cartData);
        const localCart = JSON.parse(cartData || '[]');
        console.log('🛒 Carrito parseado:', localCart);
        if (localCart.length > 0) {
          setItems(localCart);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setItems([]);
      }
    };
    
    // Solo cargar si no hay items ya
    if (items.length === 0) {
      loadCart();
    }
  }, []); // Dependencias vacías para que solo se ejecute una vez

  // Guardar en storage cuando cambie el carrito
  useEffect(() => {
    if (!loading) {
      console.log('🛒 Guardando carrito en storage:', items);
      safeStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, loading]);

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