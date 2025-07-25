import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ShoppingBag, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { orderService } from '@/lib/orderService';
import { checkoutService } from '@/lib/checkoutService';
import { toast } from '@/components/ui/use-toast';

const PaymentSuccessPage = () => {
  const { clearCart } = useCart();
  const { user, loading: authLoading } = useAuth(); // <-- Usar 'loading' del AuthContext
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [processing, setProcessing] = useState(true); // <-- Renombrado para claridad
  const [error, setError] = useState(null);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      // Si la autenticación aún está cargando, no hacer nada todavía.
      if (authLoading) {
        return;
      }

      // Si terminó de cargar y no hay usuario, es un error.
      if (!user) {
        setError("Debes iniciar sesión para ver esta página.");
        setProcessing(false);
        return;
      }
      
      setProcessing(true);
      setError(null);

      const queryParams = new URLSearchParams(location.search);
      const paymentId = queryParams.get('payment_id');
      const status = queryParams.get('status');
      const orderId = queryParams.get('external_reference'); // Usamos external_reference como nuestro ID de pedido

      console.log("Datos recibidos de MercadoPago:", { paymentId, status, orderId });

      if (orderId && paymentId && status === 'approved') {
        try {
          // 1. Actualizar el pedido en la base de datos
          console.log(`Actualizando pedido ${orderId} con Payment ID: ${paymentId}`);
          await orderService.updatePaymentId(orderId, paymentId);
          
          // 2. Obtener los detalles del pedido actualizado para mostrarlos
          console.log(`Obteniendo detalles del pedido ${orderId}`);
          const orderData = await orderService.getOrderById(orderId);
          setOrder(orderData);

          // 3. Limpiar el carrito de compras
          console.log("Limpiando el carrito.");
          clearCart();
          
          toast({
            title: "¡Pago exitoso!",
            description: "Tu pedido ha sido confirmado y está siendo procesado.",
          });

        } catch (err) {
          console.error('Error al procesar el éxito del pago:', err);
          setError("Hubo un error al actualizar tu pedido. Por favor, contacta a soporte.");
          toast({
            title: "Error al procesar el pedido",
            description: "Tu pago fue exitoso, pero no pudimos actualizar tu pedido. Contacta a soporte.",
            variant: "destructive",
          });
        }
      } else {
        console.warn("No se encontraron los parámetros necesarios para procesar el pago.");
        setError("No se pudo verificar tu pago. Faltan parámetros en la URL.");
      }
      
      setProcessing(false);
    };

    handlePaymentSuccess();
    // Dependemos de `user` para asegurarnos de que se ejecute cuando esté disponible.
  }, [user, authLoading, location.search, clearCart]); // <-- Añadir authLoading

  if (processing) { // <-- Usar 'processing'
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-sillage-gold mx-auto mb-4" />
          <p className="text-muted-foreground">Procesando tu pago...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <Card className="glass-effect border-destructive/50 text-center max-w-md">
          <CardHeader>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-destructive to-destructive/80 mb-4">
              <XCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-display font-bold text-foreground">
              Ocurrió un Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-lg">
              {error}
            </p>
            <Link to="/perfil">
              <Button variant="outline" className="w-full sm:w-auto border-sillage-gold text-sillage-gold-dark hover:bg-sillage-gold hover:text-white">
                Ver Mis Pedidos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <Helmet>
        <title>Pago Exitoso - Sillage-Perfum</title>
        <meta name="description" content="Tu pago ha sido procesado exitosamente. Gracias por tu compra." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 max-w-md"
      >
        <Card className="glass-effect border-sillage-gold/20 text-center">
          <CardHeader>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-sillage-gold to-sillage-gold-bright mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-display font-bold text-foreground">
              ¡Pago Exitoso!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-lg">
              Gracias por tu compra. Tu pedido ha sido confirmado y está siendo procesado.
            </p>
            
            {order && (
              <div className="bg-sillage-gold/5 border border-sillage-gold/20 rounded-lg p-4 text-left">
                <h4 className="text-sillage-gold-dark font-semibold mb-2">Detalles del Pedido:</h4>
                <p className="text-muted-foreground text-sm">ID: #{order.id}</p>
                <p className="text-muted-foreground text-sm">Total: ${order.total_amount}</p>
                <p className="text-muted-foreground text-sm">Estado: {order.status === 'paid' ? 'Pagado' : order.status}</p>
              </div>
            )}
            
            <p className="text-muted-foreground text-sm">
              Recibirás un email con los detalles de tu pedido en breve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/productos">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Seguir Comprando
                </Button>
              </Link>
              <Link to="/perfil">
                <Button variant="outline" className="w-full sm:w-auto border-sillage-gold text-sillage-gold-dark hover:bg-sillage-gold hover:text-white">
                  Ver Mis Pedidos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;