
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Package, Calendar, DollarSign, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/lib/orderService';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const { user, profile, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserOrders();
    }
  }, [user]);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error al cargar pedidos",
        description: "No se pudieron cargar tus pedidos. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-500 dark:text-green-400';
      case 'pending':
        return 'text-amber-500 dark:text-amber-400';
      case 'cancelled':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Pagado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Inicia sesión para ver tu perfil
            </h1>
            <p className="text-muted-foreground">
              Necesitas estar logueado para acceder a esta página.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>Mi Perfil - Sillage-Perfum</title>
        <meta name="description" content="Gestiona tu perfil, pedidos y preferencias de cuenta." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Mi Perfil
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu cuenta y revisa tu historial de compras
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información del Usuario */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-background/80 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Mi Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-border/50 text-foreground hover:bg-accent/50 hover:text-foreground"
                  onClick={logout}
                >
                  Cerrar sesión
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Historial de Pedidos */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-background/80 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Mis Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="text-foreground/80 text-lg font-medium">No hay pedidos</h3>
                    <p className="text-muted-foreground mt-1">Tus pedidos aparecerán aquí</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="bg-accent/5 border-border/50 hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-foreground">Pedido #{order.id}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span 
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                order.status === 'paid' 
                                  ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                                  : order.status === 'pending' 
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                                    : 'bg-destructive/10 text-destructive'
                              }`}
                            >
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          
                          <div className="mt-4 space-y-3">
                            {order.order_items?.map((item, index) => (
                              <div key={index} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                                    {item.product?.image_url ? (
                                      <img
                                        src={item.product.image_url}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover rounded-md"
                                      />
                                    ) : (
                                      <Package className="h-5 w-5 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-foreground font-medium">{item.product?.name || 'Producto no disponible'}</p>
                                    {item.product?.brand && (
                                      <p className="text-muted-foreground text-sm">{item.product.brand}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-muted-foreground text-sm">
                                    {item.quantity} x ${item.unit_price?.toFixed(2) || '0.00'}
                                  </p>
                                  <p className="text-foreground font-semibold">
                                    ${((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {order.shipping_address && (
                            <div className="mt-3 pt-3 border-t border-border/20">
                              <p className="text-muted-foreground text-sm">
                                Envío: {order.shipping_address}
                              </p>
                            </div>
                          )}

                          {order.payment_id && (
                            <div className="mt-2">
                              <p className="text-muted-foreground text-xs">
                                ID de Pago: {order.payment_id}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
