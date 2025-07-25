import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  XCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../lib/orderService';
import { createMercadoPagoPreference } from '../lib/mercadopagoService';
import { useToast } from '../components/ui/use-toast';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
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
      // Paso 1: Crear el pedido en la base de datos de forma aislada.
      console.log("📦 Intentando crear el pedido en la base de datos...");
      order = await orderService.createOrder(user.id, items, total);
      
      console.log("📄 Pedido creado:", order);

      if (!order || !order.id) {
        console.error("❌ ERROR: El pedido se creó pero no tiene ID.");
        throw new Error("El pedido fue creado, pero no se recibió un ID válido. No se puede continuar con el pago.");
      }
      setCurrentOrder(order);
      console.log("✅ Pedido creado exitosamente con ID:", order.id);

      // Paso 2: Crear la preferencia de pago usando el servicio simplificado
      console.log("💳 Creando preferencia de pago en Mercado Pago...");
      
      // --- DEBUG: Simplificando el payload para aislar el problema ---
      const itemsForMercadoPago = items.map(item => ({
        title: item.name,
        description: `SKU: ${item.sku || 'N/A'}`, // Usamos el SKU para identificarlo
        quantity: item.quantity,
        unit_price: parseFloat(item.price),
        currency_id: 'CLP'
      }));

      const payer = {
        name: user.user_metadata?.full_name || 'Usuario',
        surname: 'Cliente',
        email: user.email,
      };

      const backUrls = {
        success: `${window.location.origin}/pago-exitoso`,
        failure: `${window.location.origin}/pago-fallido`,
        pending: `${window.location.origin}/pago-pendiente`,
      };

      console.log("📋 Datos para Mercado Pago:", {
        items: itemsForMercadoPago,
        payer,
        backUrls,
        externalReference: order.id.toString()
      });

      const preference = await createMercadoPagoPreference(
        itemsForMercadoPago,
        payer,
        backUrls,
        order.id.toString()
      );
      
      console.log("🚀 Preferencia de pago creada:", preference);
      setPreferenceId(preference.id);

      // Redirigir al usuario a MercadoPago
      if (preference.sandbox_init_point) {
        window.location.href = preference.sandbox_init_point;
      } else if (preference.init_point) {
        window.location.href = preference.init_point;
      } else {
        throw new Error("No se recibió URL de pago de MercadoPago");
      }

    } catch (error) {
      console.error("💥 Error detallado en el proceso de pago:", error);

      // Si el error ocurrió después de crear el pedido, intentamos marcarlo como fallido.
      if (order && order.id) {
        console.log(`🔥 Marcando pedido ${order.id} como fallido.`);
        try {
          await orderService.updateOrderStatus(order.id, 'failed');
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
                          <h3 className="text-base font-semibold text-foreground truncate">{item.name}</h3>
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
                            ${(parseFloat(item.price) * item.quantity).toLocaleString('es-CL')}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            ${parseFloat(item.price).toLocaleString('es-CL')} c/u
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
                        <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
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
                          ${(parseFloat(item.price) * item.quantity).toLocaleString('es-CL')}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          ${parseFloat(item.price).toLocaleString('es-CL')} c/u
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
                      <span>${getTotalPrice().toLocaleString('es-CL')}</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>Envío</span>
                      <span className="text-primary">Gratis</span>
                    </div>
                    
                    <div className="border-t border-border/30 pt-4">
                      <div className="flex justify-between text-foreground font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">${getTotalPrice().toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleCheckout}
                    disabled={isLoadingCheckout || !user}
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
                        Proceder al Pago
                      </>
                    )}
                  </Button>
                  
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