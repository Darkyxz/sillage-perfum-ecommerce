import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Trash2, PlusCircle, MinusCircle, ShoppingBag, CreditCard, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { checkoutService } from '@/lib/checkoutService';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/utils/formatPrice';

const CartPage = () => {
  const { items: cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal();
  const shipping = 0; // Envío fijo de $5.000 
  const total = subtotal + shipping;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      // Redirigir a checkout de invitados en lugar de forzar login
      navigate('/checkout-invitado');
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de proceder",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await checkoutService.processWebpayCheckout(
        user.id,
        cartItems,
        total,
        `${window.location.origin}/pago-exitoso`,
        `${window.location.origin}/pago-fallido`
      );

      if (result.url) {
        // Redirigir a Webpay
        window.location.href = result.url;
      } else {
        throw new Error('Error al iniciar el pago con Webpay');
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      toast({
        title: "Error en el checkout",
        description: error.message || "Hubo un problema procesando tu pedido",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Tu Carrito de Compras - Sillage Perfum</title>
        <meta name="description" content="Revisa los artículos en tu carrito de compras en Sillage Perfum y procede al pago seguro con Webpay." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-8"
      >
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Tu Carrito de Compras
        </h1>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center py-12 bg-slate-800/50 rounded-xl shadow-lg"
          >
            <ShoppingBag size={64} className="mx-auto mb-6 text-purple-400" />
            <p className="text-2xl text-gray-300 mb-3">Tu carrito está vacío.</p>
            <p className="text-gray-400 mb-6">¡Añade algunas fragancias exquisitas para empezar!</p>
            <Button asChild className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white">
              <a href="/products">Explorar Perfumes</a>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row items-center bg-slate-800/70 p-4 rounded-lg shadow-md border border-slate-700"
                >
                  <img alt={item.name} className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6" src={item.image_url || "https://images.unsplash.com/photo-1670538528394-18075d01726a"} />
                  <div className="flex-grow text-center sm:text-left">
                    <h2 className="text-base font-semibold text-pink-400 line-clamp-2">{item.name}</h2>
                    <p className="text-sm text-gray-400">{item.brand}</p>
                    <p className="text-lg font-medium text-green-400 mt-1">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center space-x-3 my-4 sm:my-0 sm:mx-6">
                    <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="text-gray-400 hover:text-white">
                      <MinusCircle size={20} />
                    </Button>
                    <span className="text-lg w-8 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="text-gray-400 hover:text-white">
                      <PlusCircle size={20} />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400">
                    <Trash2 size={20} />
                  </Button>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-slate-800/80 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-700 h-fit"
            >
              <h2 className="text-2xl font-semibold mb-6 text-center text-purple-300">Resumen del Pedido</h2>
              <div className="space-y-3 mb-6 text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  {/*<span>Envío:</span>*/}
                  {/*<span>{formatPrice(shipping)}</span>*/}
                </div>
                <hr className="border-slate-700 my-2" />
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total:</span>
                  <span className="text-green-400">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-4 text-lg rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCheckout}
                disabled={isProcessing || cartItems.length === 0}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    🚀 Pagar con Webpay
                  </>
                )}
              </Button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">Serás redirigido a Webpay para completar tu pago seguro.</p>
                <div className="mt-4">
                  <img
                    src="https://www.webpay.cl/assets/img/boton_webpaycl.svg"
                    alt="Webpay"
                    className="h-12 mx-auto cursor-pointer"
                    onClick={handleCheckout}
                  />
                </div>
              </div>

              {/* Opción de checkout como invitado */}
              {!user && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <p className="text-sm text-gray-400 text-center mb-3">
                    ¿No tienes cuenta?
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 text-md rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                    onClick={() => navigate('/checkout-invitado')}
                  >
                    🛒 Comprar como Invitado
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Completa tu compra sin necesidad de registrarte
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CartPage;