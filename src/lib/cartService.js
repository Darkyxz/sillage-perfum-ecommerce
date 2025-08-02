// Servicio de carrito simplificado para localStorage
// Ya no necesitamos persistencia en servidor para el carrito
export const cartService = {
  // Obtener el carrito (solo localStorage)
  async getCart(userId) {
    // Para compatibilidad, devolvemos array vacío
    // El carrito ahora se maneja completamente en localStorage
    return [];
  },

  // Agregar un producto al carrito (no hace nada, se maneja en CartContext)
  async addToCart(userId, productId, quantity = 1) {
    // No hace nada, el carrito se maneja en localStorage
    return { success: true };
  },

  // Actualizar cantidad (no hace nada, se maneja en CartContext)
  async updateQuantity(userId, productId, quantity) {
    // No hace nada, el carrito se maneja en localStorage
    return { success: true };
  },

  // Eliminar del carrito (no hace nada, se maneja en CartContext)
  async removeFromCart(userId, productId) {
    // No hace nada, el carrito se maneja en localStorage
    return true;
  },

  // Vaciar el carrito (no hace nada, se maneja en CartContext)
  async clearCart(userId) {
    // No hace nada, el carrito se maneja en localStorage
    return true;
  }
}; 