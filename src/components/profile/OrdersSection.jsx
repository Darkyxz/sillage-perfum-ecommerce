import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Eye, Calendar, CreditCard, MapPin, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { orderService } from '@/lib/orderService';
import { toast } from '@/components/ui/use-toast';
import { formatPrice } from '@/utils/formatPrice';

const OrdersSection = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const userOrders = await orderService.getUserOrders();
            setOrders(userOrders);
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

    const getPaymentStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'processing':
                return <CreditCard className="w-4 h-4 text-blue-500" />;
            case 'paid':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'failed':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'refunded':
                return <XCircle className="w-4 h-4 text-gray-500" />;
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

    const getPaymentStatusText = (status) => {
        const statusMap = {
            'pending': 'Pendiente',
            'processing': 'Procesando',
            'paid': 'Pagado',
            'failed': 'Fallido',
            'refunded': 'Reembolsado'
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
            'cancelled': 'bg-red-100 text-red-800',
            'paid': 'bg-green-100 text-green-800',
            'failed': 'bg-red-100 text-red-800',
            'refunded': 'bg-gray-100 text-gray-800'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setDetailsOpen(true);
    };
    
    const handleContinuePayment = (order) => {
        // Redirigir a Webpay con los datos del pedido
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
        montoField.value = Math.round(parseFloat(order.total_amount));
        form.appendChild(montoField);

        const correoField = document.createElement('input');
        correoField.type = 'hidden';
        correoField.name = 'Correo';
        correoField.value = order.user_email || '';
        form.appendChild(correoField);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        toast({
            title: "Redirigiendo a Webpay",
            description: "Serás redirigido a la página de pago seguro...",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sillage-gold"></div>
                <span className="ml-2 text-gray-600">Cargando pedidos...</span>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes pedidos aún</h3>
                    <p className="text-gray-500 mb-6">Cuando realices tu primera compra, aparecerá aquí.</p>
                    <Button
                        onClick={() => window.location.href = '/productos'}
                        className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white"
                    >
                        Explorar Productos
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-sillage-gold-dark">Mis Pedidos</h2>
                <Badge variant="outline" className="text-sillage-gold-dark border-sillage-gold">
                    {orders.length} pedido{orders.length !== 1 ? 's' : ''}
                </Badge>
            </div>

            <div className="space-y-4">
                {orders.map((order, index) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    {/* Información principal */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                Pedido #{order.id}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(order.status)}
                                                <Badge className={getStatusColor(order.status)}>
                                                    {getStatusText(order.status)}
                                                </Badge>
                                            </div>
                                            {order.payment_status && (
                                                <div className="flex items-center gap-2">
                                                    {getPaymentStatusIcon(order.payment_status)}
                                                    <Badge className={getStatusColor(order.payment_status)}>
                                                        Pago: {getPaymentStatusText(order.payment_status)}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(order.created_at)}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" />
                                                <span>{formatPrice(order.total_amount)}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4" />
                                                <span>{order.items?.length || 0} producto{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>

                                        {order.shipping_address && (
                                            <div className="flex items-start gap-2 mt-2 text-sm text-gray-500">
                                                <MapPin className="w-4 h-4 mt-0.5" />
                                                <span>
                                                    {order.shipping_address}, {order.shipping_city}, {order.shipping_region}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(order)}
                                            className="border-sillage-gold text-sillage-gold-dark hover:bg-sillage-gold/10"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Ver Detalles
                                        </Button>
                                        
                                        {/* Botón de continuar pago para órdenes pendientes */}
                                        {(order.status === 'pending' || order.payment_status === 'pending') && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleContinuePayment(order)}
                                                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                                            >
                                                <CreditCard className="w-4 h-4 mr-2" />
                                                Continuar Pago
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
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
                            {/* Estado y fecha */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            </div>

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
                                                        Cantidad: {item.quantity} • Precio unitario: {formatPrice(item.unit_price)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        {formatPrice(item.total_price)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="border-t pt-3">
                                            <div className="flex justify-between items-center text-lg font-bold text-sillage-gold-dark">
                                                <span>Total</span>
                                                <span>{formatPrice(selectedOrder.total_amount)}</span>
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

export default OrdersSection;