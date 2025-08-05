import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, User, Phone, Mail, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { orderId, shippingData, items, total } = location.state || {};

  useEffect(() => {
    // Si no hay datos del pedido, redirigir al inicio
    if (!orderId || !shippingData) {
      navigate('/');
    }
  }, [orderId, shippingData, navigate]);

  if (!orderId || !shippingData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sillage-cream via-white to-sillage-gold/10 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header de confirmación */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-sillage-gold-dark mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600 text-lg">
            Tu pedido #{orderId} ha sido procesado exitosamente
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Detalles del pedido */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sillage-gold-dark">
                  <Package className="w-5 h-5" />
                  Detalles del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-sillage-gold/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sillage-gold-dark">Número de Pedido:</span>
                    <span className="font-mono text-lg">#{orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sillage-gold-dark">Estado:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      Confirmado
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Productos:</h4>
                  {items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{item.name}</h5>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.size} • {item.concentration}
                        </p>
                        <p className="text-xs text-gray-500">
                          Cantidad: {item.quantity} • Precio unitario: ${Math.round(parseFloat(item.price)).toLocaleString('es-CL')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${Math.round(parseFloat(item.price) * item.quantity).toLocaleString('es-CL')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold text-sillage-gold-dark">
                    <span>Total Pagado</span>
                    <span>${total ? Math.round(total).toLocaleString('es-CL') : '0'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Información de envío */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sillage-gold-dark">
                  <MapPin className="w-5 h-5" />
                  Información de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">{shippingData.full_name}</p>
                      <p className="text-sm text-gray-500">Destinatario</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">{shippingData.email}</p>
                      <p className="text-sm text-gray-500">Email de contacto</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">{shippingData.phone}</p>
                      <p className="text-sm text-gray-500">Teléfono de contacto</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Home className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">{shippingData.address}</p>
                      <p className="text-sm text-gray-500">
                        {shippingData.city}, {shippingData.region}
                        {shippingData.postal_code && ` - ${shippingData.postal_code}`}
                      </p>
                    </div>
                  </div>

                  {shippingData.notes && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">Notas de entrega:</p>
                      <p className="text-sm text-blue-700">{shippingData.notes}</p>
                    </div>
                  )}
                </div>

                <div className="bg-sillage-gold/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-sillage-gold-dark mb-2">Tiempo de entrega estimado</h4>
                  <p className="text-sm text-gray-600">
                    Tu pedido será procesado y enviado en un plazo de 2-3 días hábiles.
                    Recibirás un email con el código de seguimiento una vez que sea despachado.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Acciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/perfil')}
              variant="outline"
              className="border-sillage-gold text-sillage-gold-dark hover:bg-sillage-gold/10"
            >
              <User className="w-4 h-4 mr-2" />
              Ver Mis Pedidos
            </Button>

            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Seguir Comprando
            </Button>
          </div>

          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Hemos enviado un email de confirmación a <strong>{shippingData.email}</strong> con todos los detalles de tu pedido.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;