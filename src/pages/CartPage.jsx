
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Trash2, PlusCircle, MinusCircle, ShoppingBag, CreditCard } from 'lucide-react';

const CartPage = () => {
  const { toast } = useToast();

  // Datos de ejemplo para el carrito, se gestionarán con estado/localStorage/Supabase
  const cartItems = [
    { id: 1, name: "Eau de Mystique", brand: "Chanel", price: 120, quantity: 1, imageAlt: "Botella de Eau de Mystique" },
    { id: 2, name: "Citrus Bloom", brand: "Dior", price: 95, quantity: 2, imageAlt: "Botella de Citrus Bloom" },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 10; // Envío gratis sobre 50€
  const total = subtotal + shipping;

  const handleNotImplemented = (action) => {
    toast({
      title: `🚧 ¡${action} en desarrollo!`,
      description: `Esta funcionalidad (${action.toLowerCase()}) estará disponible pronto. ¡Gracias por tu comprensión! 🚀`,
      variant: "default",
    });
  };

  return (
    <>
      <Helmet>
        <title>Tu Carrito de Compras - PerfumeParadise</title>
        <meta name="description" content="Revisa los artículos en tu carrito de compras en PerfumeParadise y procede al pago seguro." />
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
                  <img  alt={item.imageAlt} class="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6" src="https://images.unsplash.com/photo-1670538528394-18075d01726a" />
                  <div className="flex-grow text-center sm:text-left">
                    <h2 className="text-xl font-semibold text-pink-400">{item.name}</h2>
                    <p className="text-sm text-gray-400">{item.brand}</p>
                    <p className="text-lg font-medium text-green-400 mt-1">{item.price}€</p>
                  </div>
                  <div className="flex items-center space-x-3 my-4 sm:my-0 sm:mx-6">
                    <Button variant="ghost" size="icon" onClick={() => handleNotImplemented(`Disminuir cantidad de ${item.name}`)} className="text-gray-400 hover:text-white">
                      <MinusCircle size={20} />
                    </Button>
                    <span className="text-lg w-8 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleNotImplemented(`Aumentar cantidad de ${item.name}`)} className="text-gray-400 hover:text-white">
                      <PlusCircle size={20} />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleNotImplemented(`Eliminar ${item.name}`)} className="text-red-500 hover:text-red-400">
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
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>{shipping === 0 ? "Gratis" : `${shipping.toFixed(2)}€`}</span>
                </div>
                <hr className="border-slate-700 my-2" />
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total:</span>
                  <span className="text-green-400">{total.toFixed(2)}€</span>
                </div>
              </div>
              {/* Elementos de urgencia */}
              <div className="mb-4 p-3 bg-orange-600/20 border border-orange-500 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-orange-400 mr-2">⚡</span>
                  <span className="text-orange-300 font-semibold text-sm">¡Últimas unidades disponibles!</span>
                </div>
                <p className="text-orange-200 text-xs">Otros 3 clientes están viendo estos productos</p>
              </div>
              
              {/* Beneficios del envío */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✅</span>
                  <span className="text-sm">Envío express gratis (compra sobre $50)</span>
                </div>
                <div className="flex items-center text-blue-400">
                  <span className="mr-2">🔒</span>
                  <span className="text-sm">Pago 100% seguro y encriptado</span>
                </div>
                <div className="flex items-center text-purple-400">
                  <span className="mr-2">📦</span>
                  <span className="text-sm">Empaque premium incluido</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-4 text-lg rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all animate-pulse"
                onClick={() => handleNotImplemented("Proceder al Pago")}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                🚀 Finalizar Compra Segura
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">Serás redirigido a una pasarela de pago segura.</p>
                <div className="flex justify-center items-center mt-2 space-x-2">
                  <span className="text-xs text-gray-400">Aceptamos:</span>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">VISA</span>
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">MC</span>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">MP</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CartPage;
  