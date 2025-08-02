import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Eye, Calendar, CreditCard, MapPin, Truck, CheckCircle, Clock, XCircle, User, Phone, Mail, Filter, RefreshCw, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { orderService } from '@/lib/orderService';
import { toast } from '@/components/ui/use-toast';

const OrderManagementAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingStatus, setUpdatingStatus] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [statusFilter]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAllOrdersAdmin(statusFilter);
            setOrders(data.orders);
            setStats(data.stats);
        } catch (error) {
            console.error('Error loading orders:', error);
            toast({
                title: "Error",
                description: "No se pudieron cargar los pedidos",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdatingStatus(orderId);
            await orderService.updateOrderStatusAdmin(orderId, newStatus);

            // Actualizar el pedido en la lista
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
                        : order
                )
            );

            // Si hay un pedido seleccionado, actualizarlo también
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            }

            toast({
                title: "Estado actualizado",
                description: `El pedido #${orderId} ahora está ${getStatusText(newStatus)}`
            });

        } catch (error) {
            console.error('Error updating status:', error);
            toast({
                title: "Error",
                description: "No se pudo actualizar el estado del pedido",
                variant: "destructive"
            });
        } finally {
            setUpdatingStatus(null);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'confirmed':
                return <CheckCircle className="w-4 h-4 text-blue-500" />;
            case 'processing':
                return <Package className="w-4 h-4 text-orange-500" />;
            case 'shipped':
                return <Truck className="w-4 h-4 text-purple-500" />;
            case 'delivered':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmado',
            'processing': 'Procesando',
            'shipped': 'Enviado',
            'delivered': 'Entregado',
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status) => {
        const colorMap = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'processing': 'bg-orange-100 text-orange-800',
            'shipped': 'bg-purple-100 text-purple-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setDetailsOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sillage-gold"></div>
                <span className="ml-2 text-gray-600">Cargando pedidos...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header y estadísticas */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-sillage-gold-dark">Gestión de Pedidos</h2>
                    <p className="text-gray-600">Administra todos los pedidos de la tienda</p>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={loadOrders}
                        variant="outline"
                        size="sm"
                        className="border-sillage-gold text-sillage-gold-dark hover:bg-sillage-gold/10"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Actualizar
                    </Button>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-sillage-gold-dark">{stats.total_orders || 0}</div>
                        <div className="text-sm text-gray-600">Total</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending_orders || 0}</div>
                        <div className="text-sm text-gray-600">Pendientes</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.confirmed_orders || 0}</div>
                        <div className="text-sm text-gray-600">Confirmados</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.processing_orders || 0}</div>
                        <div className="text-sm text-gray-600">Procesando</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.shipped_orders || 0}</div>
                        <div className="text-sm text-gray-600">Enviados</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.delivered_orders || 0}</div>
                        <div className="text-sm text-gray-600">Entregados</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{stats.cancelled_orders || 0}</div>
                        <div className="text-sm text-gray-600">Cancelados</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="pending">Pendientes</SelectItem>
                                <SelectItem value="confirmed">Confirmados</SelectItem>
                                <SelectItem value="processing">Procesando</SelectItem>
                                <SelectItem value="shipped">Enviados</SelectItem>
                                <SelectItem value="delivered">Entregados</SelectItem>
                                <SelectItem value="cancelled">Cancelados</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de pedidos */}
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pedidos</h3>
                            <p className="text-gray-500">No se encontraron pedidos con los filtros seleccionados.</p>
                        </CardContent>
                    </Card>
                ) : (
                    orders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                                        {/* Información principal */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-lg text-gray-900">
                                                    Pedido #{order.id}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(order.status)}
                                                    <Badge className={getStatusColor(order.status)}>
                                                        {getStatusText(order.status)}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Información del cliente */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    <span>{order.customer?.name || 'Cliente desconocido'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{order.customer?.email}</span>
                                                </div>
                                                {order.customer?.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{order.customer.phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Detalles del pedido */}
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(order.created_at)}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4" />
                                                    <span>${parseFloat(order.total_amount).toLocaleString('es-CL')} CLP</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4" />
                                                    <span>{order.items?.length || 0} producto{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4" />
                                                    <span>{order.payment_method || 'No especificado'}</span>
                                                </div>
                                            </div>

                                            {order.shipping_address && (
                                                <div className="flex items-start gap-2 text-sm text-gray-500">
                                                    <MapPin className="w-4 h-4 mt-0.5" />
                                                    <span>
                                                        {order.shipping_address}, {order.shipping_city}, {order.shipping_region}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Select
                                                value={order.status}
                                                onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                                                disabled={updatingStatus === order.id}
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pendiente</SelectItem>
                                                    <SelectItem value="confirmed">Confirmado</SelectItem>
                                                    <SelectItem value="processing">Procesando</SelectItem>
                                                    <SelectItem value="shipped">Enviado</SelectItem>
                                                    <SelectItem value="delivered">Entregado</SelectItem>
                                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(order)}
                                                className="border-sillage-gold text-sillage-gold-dark hover:bg-sillage-gold/10"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Ver Detalles
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Dialog de detalles */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-sillage-gold-dark">
                            <Package className="w-5 h-5" />
                            Detalles del Pedido #{selectedOrder?.id}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Estado y información básica */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-600">Estado del Pedido</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(selectedOrder.status)}
                                            <Badge className={getStatusColor(selectedOrder.status)}>
                                                {getStatusText(selectedOrder.status)}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-600">Fecha del Pedido</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-bold text-lg text-sillage-gold-dark">
                                            ${parseFloat(selectedOrder.total_amount).toLocaleString('es-CL')} CLP
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Información del cliente */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sillage-gold-dark">
                                        <User className="w-5 h-5" />
                                        Información del Cliente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Nombre</p>
                                            <p className="font-medium">{selectedOrder.customer?.name || 'No especificado'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{selectedOrder.customer?.email || 'No especificado'}</p>
                                        </div>
                                        {selectedOrder.customer?.phone && (
                                            <div>
                                                <p className="text-sm text-gray-600">Teléfono</p>
                                                <p className="font-medium">{selectedOrder.customer.phone}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Productos */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sillage-gold-dark">Productos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item) => (
                                            <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{item.product_name}</h4>
                                                    <p className="text-sm text-gray-500">SKU: {item.product_sku}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Cantidad: {item.quantity} • Precio unitario: ${parseFloat(item.unit_price).toLocaleString('es-CL')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        ${parseFloat(item.total_price).toLocaleString('es-CL')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="border-t pt-3">
                                            <div className="flex justify-between items-center text-lg font-bold text-sillage-gold-dark">
                                                <span>Total</span>
                                                <span>${parseFloat(selectedOrder.total_amount).toLocaleString('es-CL')} CLP</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Información de envío */}
                            {selectedOrder.shipping_address && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-sillage-gold-dark">
                                            <MapPin className="w-5 h-5" />
                                            Información de Envío
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <p><strong>Dirección:</strong> {selectedOrder.shipping_address}</p>
                                            <p><strong>Ciudad:</strong> {selectedOrder.shipping_city}</p>
                                            <p><strong>Región:</strong> {selectedOrder.shipping_region}</p>
                                            {selectedOrder.shipping_postal_code && (
                                                <p><strong>Código Postal:</strong> {selectedOrder.shipping_postal_code}</p>
                                            )}
                                            {selectedOrder.notes && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm font-medium text-blue-900 mb-1">Notas de entrega:</p>
                                                    <p className="text-sm text-blue-700">{selectedOrder.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OrderManagementAdmin;