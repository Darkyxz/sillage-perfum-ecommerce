import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Loader2,
  CheckCircle,
  XCircle,
  User
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { checkoutService } from '../lib/checkoutService';
import { formatPrice } from '@/utils/formatPrice';
import { getPaymentReturnUrl, getPaymentFailureUrl } from '@/utils/config';

import { useToast } from '../components/ui/use-toast';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      // Redirigir a checkout de invitados en lugar de forzar login
      navigate('/checkout-invitado');
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de proceder",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingCheckout(true);
    const total = getTotalPrice();

    try {
      const result = await checkoutService.processWebpayCheckout(
        user.id,
        items,
        total,
        getPaymentReturnUrl(),
        getPaymentFailureUrl()
      );

      console.log('📊 Debug resultado completo:', result);

      if (result.url && result.token) {
        console.log('🚀 Redirigiendo a Webpay:');
        console.log('URL:', result.url);
        console.log('Token:', result.token);
        
        // Crear un formulario POST para enviar el token a Webpay
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = result.url;
        form.style.display = 'none';
        
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'token_ws';
        tokenInput.value = result.token;
        form.appendChild(tokenInput);
        
        document.body.appendChild(form);
        form.submit();
        
        // Limpiar el formulario después de enviarlo
        setTimeout(() => {
          document.body.removeChild(form);
        }, 100);
      } else {
        throw new Error('Error al iniciar el pago con Webpay - No se recibió URL o token');
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      toast({
        title: "Error en el checkout",
        description: error.message || "Hubo un problema procesando tu pedido",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando carrito...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !isLoadingCheckout) {
    return (
      <div className="min-h-screen py-8">
        <Helmet>
          <title>Carrito de Compras - Sillage-Perfum</title>
          <meta name="description" content="Revisa tu carrito de compras y completa tu pedido de perfumes premium." />
        </Helmet>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="glass-effect w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-primary" />
            </div>

            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              Tu carrito está vacío
            </h1>

            <p className="text-muted-foreground text-lg mb-8">
              Descubre nuestra increíble colección de perfumes
            </p>

            <Link to="/productos">
              <Button className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold px-8 py-3 transition-all duration-300">
                Explorar Productos
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>Carrito de Compras - Sillage-Perfum</title>
        <meta name="description" content="Revisa tu carrito de compras y completa tu pedido de perfumes premium." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/productos"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuar comprando
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-foreground">
              Carrito de Compras
            </h1>

            <Button
              variant="outline"
              onClick={() => {
                clearCart();
              }}
              className="glass-effect border-border/30 text-foreground hover:bg-accent/15 w-full sm:w-auto"
            >
              Vaciar carrito
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect border-border/20">
                  <CardContent className="p-4 sm:p-6">
                    {/* Layout móvil */}
                    <div className="block sm:hidden">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden glass-effect flex-shrink-0">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="h-6 w-6 text-muted-foreground/60" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground line-clamp-2">{item.name}</h3>
                          <p className="text-muted-foreground text-sm">{item.brand}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-muted-foreground/80 text-xs truncate">SKU: {item.sku}</span>
                            {item.size && (
                              <span className="bg-sillage-gold/20 text-sillage-gold-dark px-2 py-0.5 rounded text-xs font-medium flex-shrink-0">
                                {item.size}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="glass-effect border-border/30 text-foreground hover:bg-destructive/20 hover:border-destructive/50 flex-shrink-0 w-8 h-8"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="glass-effect border-border/30 text-foreground hover:bg-accent/15 w-8 h-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="text-foreground font-semibold min-w-[2rem] text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="glass-effect border-border/30 text-foreground hover:bg-accent/15 w-8 h-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-primary font-semibold text-sm">
                            {formatPrice(parseFloat(item.price) * item.quantity)}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatPrice(parseFloat(item.price))} c/u
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Layout desktop */}
                    <div className="hidden sm:flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden glass-effect">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground/60" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-foreground line-clamp-2">{item.name}</h3>
                        <p className="text-muted-foreground text-sm">{item.brand}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-muted-foreground/80 text-xs">SKU: {item.sku}</span>
                          {item.size && (
                            <span className="bg-sillage-gold/20 text-sillage-gold-dark px-2 py-0.5 rounded text-xs font-medium">
                              {item.size}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="glass-effect border-border/30 text-foreground hover:bg-accent/15"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="text-foreground font-semibold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="glass-effect border-border/30 text-foreground hover:bg-accent/15"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-primary font-semibold">
                          {formatPrice(parseFloat(item.price) * item.quantity)}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {formatPrice(parseFloat(item.price))} c/u
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="glass-effect border-border/30 text-foreground hover:bg-destructive/20 hover:border-destructive/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-effect border-border/20 sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                    Resumen del Pedido
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({items.length} productos)</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>

                    <div className="flex justify-between text-muted-foreground">
                      {/* <span>Envío</span>
                      <span>{formatPrice(5000)}</span> */}
                    </div>

                    <div className="border-t border-border/30 pt-4">
                      <div className="flex justify-between text-foreground font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">
                          {formatPrice(getTotalPrice() + 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de pago con Webpay */}
                  {user ? (
                    <div className="w-full">
                      <Button
                        onClick={handleCheckout}
                        disabled={isLoadingCheckout || items.length === 0}
                        className="w-full bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold py-3 transition-all duration-300"
                      >
                        {isLoadingCheckout ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            🚀 Pagar con Webpay
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        onClick={() => navigate('/checkout-invitado')}
                        className="w-full bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold py-3 transition-all duration-300"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Comprar como Invitado
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border/30" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-2 bg-card text-muted-foreground">o</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => navigate('/login')}
                        variant="outline"
                        className="w-full border-sillage-gold/30 hover:bg-sillage-gold/10 text-sillage-gold-dark font-semibold py-3 transition-all duration-300"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Iniciar sesión
                      </Button>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground text-center">
                      Serás redirigido a Webpay para completar tu pago de forma segura
                    </p>
                    {user && (
                      <p className="text-xs text-muted-foreground text-center">
                        Se usará el correo: <span className="font-medium">{user.email}</span>
                      </p>
                    )}
                    <div className="mt-4">
                      <img
                        src="https://www.webpay.cl/assets/img/boton_webpaycl.svg"
                        alt="Webpay"
                        className="h-12 mx-auto cursor-pointer"
                        onClick={handleCheckout}
                      />
                    </div>
                  </div>

                  {!user && (
                    <p className="text-muted-foreground text-sm text-center mt-4">
                      Debes{' '}
                      <Link
                        to="/login"
                        className="text-sillage-gold-dark hover:text-sillage-gold transition-colors relative inline-block"
                      >
                        iniciar sesión
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sillage-gold-dark"></span>
                      </Link>
                      {' '}para continuar
                    </p>
                  )}

                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;