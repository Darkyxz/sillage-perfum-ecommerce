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
import { orderService } from '../lib/orderService';
import { formatPrice } from '@/utils/formatPrice';

import { useToast } from '../components/ui/use-toast';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  const handleCheckout = async () => {
    if (!items.length) {
      toast({ title: "Carrito vacío", description: "Añade productos para continuar.", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({
        title: "Inicia sesión para continuar",
        description: "Debes iniciar sesión para poder realizar un pedido.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingCheckout(true);
    setPreferenceId(null);
    let order;

    console.log("🛒 Iniciando proceso de checkout...");
    const total = getTotalPrice();
    console.log("💰 Total del carrito calculado:", total);

    try {
      // Debug del usuario
      console.log("👤 Debug usuario completo:", user);
      console.log("🆔 Debug user.id:", user?.id);

      if (!user?.id) {
        throw new Error('Usuario no válido o sin ID');
      }

      // Paso 1: Crear el pedido en la base de datos de forma aislada.
      console.log("📦 Intentando crear el pedido en la base de datos...");

      // Datos de envío por defecto (el usuario los actualizará más tarde)
      const shippingData = {
        address: user.address || 'Por confirmar',
        city: user.city || 'Santiago',
        region: user.region || 'Región Metropolitana',
        postal_code: user.postal_code || '',
        notes: 'Pedido creado desde el carrito. Envío a coordinar.'
      };

      order = await orderService.createOrder(user.id, items, total, null, shippingData);

      console.log("📄 Pedido creado:", order);

      // El backend puede devolver order.id o order.order_id
      const orderId = order?.id || order?.order_id;

      if (!order || !orderId) {
        console.error("❌ ERROR: El pedido se creó pero no tiene ID.");
        throw new Error("El pedido fue creado, pero no se recibió un ID válido. No se puede continuar con el pago.");
      }

      // Normalizar la estructura del pedido
      const normalizedOrder = {
        ...order,
        id: orderId
      };
      setCurrentOrder(normalizedOrder);
      console.log("✅ Pedido creado exitosamente con ID:", orderId);

      // Paso 2: Proceso de pago temporal (hasta tener credenciales)
      console.log("� Rediriagiendo a checkout...");

      // Redirigir a la página de Webpay
      const form = document.createElement('form');
      form.method = 'post';
      form.action = 'https://www.webpay.cl/backpub/external/form-pay';
      form.target = '_blank';

      const idFormularioField = document.createElement('input');
      idFormularioField.type = 'hidden';
      idFormularioField.name = 'idFormulario';
      idFormularioField.value = '299617';
      form.appendChild(idFormularioField);

      const montoField = document.createElement('input');
      montoField.type = 'hidden';
      montoField.name = 'monto';
      montoField.value = Math.round(total + 5000);
      form.appendChild(montoField);

      const correoField = document.createElement('input');
      correoField.type = 'hidden';
      correoField.name = 'Correo';
      correoField.value = user.email;
      form.appendChild(correoField);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      // Limpiar carrito inmediatamente
      clearCart();

      // Mostrar toast de éxito
      toast({
        title: "¡Pedido creado con éxito!",
        description: `Tu pedido #${orderId} ha sido creado. Redirigiendo a Webpay...`,
      });

      // Esperar un momento antes de redirigir al perfil
      setTimeout(() => {
        navigate('/perfil');
      }, 2000);

      console.log("🎉 Proceso de checkout completado exitosamente");

    } catch (error) {
      console.error("💥 Error detallado en el proceso de pago:", error);

      // Si el error ocurrió después de crear el pedido, intentamos marcarlo como fallido.
      const orderId = order?.id || order?.order_id;
      if (order && orderId) {
        console.log(`🔥 Marcando pedido ${orderId} como fallido.`);
        try {
          await orderService.updateOrderStatus(orderId, 'failed');
        } catch (updateError) {
          console.error("Error actualizando estado del pedido:", updateError);
        }
        toast({
          title: "Error al contactar al procesador de pago",
          description: "Se creó tu pedido, pero no pudimos generar el enlace de pago. El pedido ha sido marcado como 'fallido'. Intenta de nuevo.",
          variant: "destructive",
        });
      } else {
        // Si el error fue al crear el pedido mismo.
        toast({
          title: "Error al crear el pedido",
          description: error.message || "No se pudo registrar tu pedido en la base de datos. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
      }
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
                setPreferenceId(null);
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
                            Procesar Pago - {formatPrice(getTotalPrice() + 5000)}
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

                  {preferenceId && (
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center text-primary">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span className="text-sm">Preferencia creada: {preferenceId}</span>
                      </div>
                    </div>
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