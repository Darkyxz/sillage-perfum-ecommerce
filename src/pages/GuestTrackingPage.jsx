import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Package,
  Search,
  Mail,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { guestCheckoutService } from '@/lib/guestCheckoutService';

const GuestTrackingPage = () => {
  const [searchData, setSearchData] = useState({
    orderId: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchData.orderId.trim() || !searchData.email.trim()) {
      setError('Por favor ingresa el número de orden y el email');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const result = await guestCheckoutService.trackGuestOrder(
        searchData.orderId,
        searchData.email
      );

      if (result.success && result.data.order) {
        setOrder(result.data.order);
      } else {
        setError('No se encontró la orden. Verifica los datos ingresados.');
      }
    } catch (error) {
      console.error('Error buscando orden:', error);
      setError(error.message || 'Error al buscar la orden');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Pendiente de pago',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado',
      'failed': 'Pago fallido'
    };
    return statusMap[status] || 'Desconocido';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'processing': 'text-blue-600 bg-blue-50 border-blue-200',
      'shipped': 'text-purple-600 bg-purple-50 border-purple-200',
      'delivered': 'text-green-600 bg-green-50 border-green-200',
      'cancelled': 'text-red-600 bg-red-50 border-red-200',
      'failed': 'text-red-600 bg-red-50 border-red-200'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sillage-cream via-white to-sillage-gold/10 py-8">
      <Helmet>
        <title>Rastrear Pedido - Sillage Perfum</title>
        <meta name="description" content="Rastrea tu pedido de Sillage Perfum con tu número de orden y email" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-sillage-gold-dark mb-2">
            Rastrear mi Pedido
          </h1>
          <p className="text-gray-600">
            Ingresa tu número de orden y email para ver el estado de tu pedido
          </p>
        </motion.div>

        {/* Formulario de búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sillage-gold-dark">
                <Search className="w-5 h-5" />
                Buscar Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderId">Número de Orden</Label>
                    <div className="relative">
                      <Package className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="orderId"
                        name="orderId"
                        type="text"
                        value={searchData.orderId}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="Ej: 12345"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={searchData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Buscar Pedido
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Información del pedido */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Resumen del pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pedido #{order.id}</span>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Fecha del pedido</p>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold text-lg text-sillage-gold-dark">
                      ${Math.round(parseFloat(order.total_amount)).toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>

                {/* Información de envío */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Información de Envío
                  </h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Nombre:</strong> {order.guest_name}</p>
                    <p><strong>Email:</strong> {order.guest_email}</p>
                    {order.guest_phone && <p><strong>Teléfono:</strong> {order.guest_phone}</p>}
                    <p><strong>Dirección:</strong> {order.shipping_address}</p>
                    <p>
                      {order.shipping_city}, {order.shipping_region}
                      {order.shipping_postal_code && ` - CP: ${order.shipping_postal_code}`}
                    </p>
                    {order.shipping_notes && (
                      <p className="text-gray-600 italic">
                        <strong>Notas:</strong> {order.shipping_notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Productos del pedido */}
                {order.items && Array.isArray(order.items) && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Productos</h4>
                    <div className="space-y-2">
                      {JSON.parse(order.items).map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            {item.product_image && (
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-gray-500">Cantidad: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium">
                            ${Math.round(item.unit_price * item.quantity).toLocaleString('es-CL')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información adicional */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-gray-700">
                <strong>¿Necesitas ayuda?</strong> Si tienes alguna pregunta sobre tu pedido,
                contáctanos a través de nuestro formulario de contacto o escríbenos a
                ventas@sillageperfum.cl con tu número de orden.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GuestTrackingPage;
