import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, User, Calendar, DollarSign, Loader2, Eye, Filter, Search, CheckCircle, Clock, Truck, XCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { orderService } from '@/lib/orderService';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      // Siempre establecer array vacío sin mostrar errores
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para filtrar y ordenar pedidos
  useEffect(() => {
    let filtered = [...orders];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toString().includes(searchTerm) ||
        order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.payment_id?.includes(searchTerm)
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filtrar por fecha
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        
        switch (dateFilter) {
          case 'today':
            return orderDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'total_amount':
          aValue = a.total_amount;
          bValue = b.total_amount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

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
        return 'text-green-500 bg-green-500/20';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/20';
      case 'cancelled':
        return 'text-destructive bg-destructive/20';
      case 'shipped':
        return 'text-blue-500 bg-blue-500/20';
      case 'delivered':
        return 'text-purple-500 bg-purple-500/20';
      default:
        return 'text-muted-foreground bg-muted/20';
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
          <Loader2 className="h-12 w-12 animate-spin text-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Gestión de Pedidos</h2>
        <div className="flex items-center space-x-4">
          <Button
            onClick={loadOrders}
            variant="outline"
            size="sm"
            className="glass-effect border-border/30 text-foreground hover:bg-accent/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <div className="text-muted-foreground">
            {filteredOrders.length} de {orders.length} pedidos
          </div>
        </div>
      </div>

      {/* Controles de filtrado */}
      <Card className="glass-effect border-border/10 mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por ID, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-accent/10 border border-border/30 rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filtro por estado */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-accent/10 border border-border/30 text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>

            {/* Filtro por fecha */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-accent/10 border border-border/30 text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>

            {/* Ordenar por */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-accent/10 border border-border/30 text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="created_at">Fecha de creación</option>
              <option value="total_amount">Monto total</option>
              <option value="status">Estado</option>
            </select>

            {/* Orden */}
            <Button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              variant="outline"
              className="glass-effect border-border/30 text-foreground hover:bg-accent/10"
            >
              {sortOrder === 'desc' ? '↓' : '↑'} {sortOrder === 'desc' ? 'Desc' : 'Asc'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">
            {orders.length === 0 ? 'No hay pedidos aún' : 'No se encontraron pedidos con los filtros aplicados'}
          </p>
          <p className="text-muted-foreground/80">
            {orders.length === 0 ? 'Los pedidos aparecerán aquí cuando los clientes realicen compras' : 'Intenta ajustar los filtros de búsqueda'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="glass-effect border-border/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h3 className="text-foreground font-semibold text-lg">
                        Pedido #{order.id}
                      </h3>
                      <p className="text-muted-foreground text-sm">
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
                    <p className="text-foreground font-bold text-xl">
                      ${order.total_amount}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* Información del cliente */}
                <div className="bg-accent/5 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">Cliente:</span>
                  </div>
                  <p className="text-foreground font-medium">
                    {order.user?.profiles?.full_name || order.user?.email || 'Cliente'}
                  </p>
                  <p className="text-muted-foreground text-sm">{order.user?.email}</p>
                </div>

                {/* Items del pedido */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-foreground font-semibold mb-2">Productos:</h4>
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-accent/5 rounded p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded bg-accent/10 flex items-center justify-center">
                          {item.product?.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground/80" />
                          )}
                        </div>
                        <div>
                          <p className="text-foreground font-medium">{item.product?.name}</p>
                          <p className="text-muted-foreground text-sm">{item.product?.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">
                          {item.quantity} x ${item.unit_price}
                        </p>
                        <p className="text-foreground font-semibold">
                          ${(item.quantity * item.unit_price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-4 border-t border-border/10">
                  <div className="flex items-center space-x-2">
                    {order.payment_id && (
                      <span className="text-muted-foreground text-sm">
                        ID Pago: {order.payment_id}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="bg-accent/10 border border-border/30 text-foreground rounded px-3 py-1 text-sm"
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