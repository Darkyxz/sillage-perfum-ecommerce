
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-white/60';
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
            <h1 className="text-3xl font-bold text-white mb-4">
              Inicia sesión para ver tu perfil
            </h1>
            <p className="text-white/70">
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
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Mi Perfil
          </h1>
          <p className="text-white/70">
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
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm">Email</label>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-white/60 text-sm">Nombre</label>
                  <p className="text-white font-medium">
                    {profile?.full_name || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="text-white/60 text-sm">Rol</label>
                  <p className="text-white font-medium">
                    {profile?.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </p>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="w-full glass-effect border-white/30 text-white hover:bg-white/10"
                >
                  Cerrar Sesión
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
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Historial de Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-white mr-2" />
                    <span className="text-white/70">Cargando pedidos...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/70 text-lg mb-2">No tienes pedidos aún</p>
                    <p className="text-white/50">¡Haz tu primera compra para ver tu historial aquí!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-white/10 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <Package className="h-5 w-5 text-white/60" />
                            <div>
                              <h3 className="text-white font-semibold">
                                Pedido #{order.id}
                              </h3>
                              <p className="text-white/60 text-sm">
                                {new Date(order.created_at).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </p>
                            <p className="text-white font-bold text-lg">
                              ${order.total_amount}
                            </p>
                          </div>
                        </div>

                        {/* Items del pedido */}
                        <div className="space-y-2">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-white/5 rounded p-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                                  {item.product?.image_url ? (
                                    <img
                                      src={item.product.image_url}
                                      alt={item.product.name}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  ) : (
                                    <Package className="h-5 w-5 text-white/50" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{item.product?.name}</p>
                                  <p className="text-white/60 text-sm">{item.product?.brand}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white/70 text-sm">
                                  {item.quantity} x ${item.unit_price}
                                </p>
                                <p className="text-white font-semibold">
                                  ${(item.quantity * item.unit_price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.payment_id && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-white/60 text-sm">
                              ID de Pago: {order.payment_id}
                            </p>
                          </div>
                        )}
                      </motion.div>
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
