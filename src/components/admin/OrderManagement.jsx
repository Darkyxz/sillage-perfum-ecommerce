import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, User, Calendar, DollarSign, Loader2, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { orderService } from '@/lib/orderService';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error al cargar pedidos",
        description: "No se pudieron cargar los pedidos. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await loadOrders(); // Recargar pedidos
      toast({
        title: "Estado actualizado",
        description: `El pedido #${orderId} ha sido marcado como ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error al actualizar estado",
        description: "No se pudo actualizar el estado del pedido.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-500/20';
      case 'shipped':
        return 'text-blue-400 bg-blue-500/20';
      case 'delivered':
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-white/60 bg-white/10';
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
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white/70">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Gestión de Pedidos</h2>
        <div className="text-white/60">
          Total: {orders.length} pedidos
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/70 text-lg mb-2">No hay pedidos aún</p>
          <p className="text-white/50">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Package className="h-8 w-8 text-white/60" />
                    <div>
                      <h3 className="text-white font-semibold text-lg">
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
                    <p className="text-white font-bold text-xl">
                      ${order.total_amount}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* Información del cliente */}
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-white/60" />
                    <span className="text-white/60 text-sm">Cliente:</span>
                  </div>
                  <p className="text-white font-medium">
                    {order.user?.profiles?.full_name || order.user?.email || 'Cliente'}
                  </p>
                  <p className="text-white/60 text-sm">{order.user?.email}</p>
                </div>

                {/* Items del pedido */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-white font-semibold mb-2">Productos:</h4>
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-white/5 rounded p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center">
                          {item.product?.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-white/50" />
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

                {/* Acciones */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    {order.payment_id && (
                      <span className="text-white/60 text-sm">
                        ID Pago: {order.payment_id}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="bg-white/10 border border-white/30 text-white rounded px-3 py-1 text-sm"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="paid">Pagado</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default OrderManagement;