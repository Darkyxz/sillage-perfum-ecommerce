import { supabase } from './supabase';

export const cartService = {
  // Obtener el carrito del usuario actual
  async getCart(userId) {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:product_id(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  // Agregar un producto al carrito
  async addToCart(userId, productId, quantity = 1) {
    // Si ya existe, actualizar cantidad
    const { data: existing, error: fetchError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    if (existing) {
      return await cartService.updateQuantity(userId, productId, existing.quantity + quantity);
    }
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{ user_id: userId, product_id: productId, quantity }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Actualizar cantidad de un producto
  async updateQuantity(userId, productId, quantity) {
    if (quantity <= 0) {
      return await cartService.removeFromCart(userId, productId);
    }
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Eliminar un producto del carrito
  async removeFromCart(userId, productId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;
    return true;
  },

  // Vaciar el carrito
  async clearCart(userId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
    return true;
  }
}; 