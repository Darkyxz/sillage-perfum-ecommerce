import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, User, Phone, Mail, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';
import { orderService } from '@/lib/orderService';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Obtener el orderId de la navegación
  const orderId = location.state?.orderId;

  const [shippingData, setShippingData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Santiago',
    region: user?.region || 'Región Metropolitana',
    postal_code: user?.postal_code || '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!shippingData.full_name.trim()) {
      newErrors.full_name = 'El nombre completo es requerido';
    }

    if (!shippingData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(shippingData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!shippingData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!shippingData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!shippingData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!shippingData.region.trim()) {
      newErrors.region = 'La región es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Si no hay orderId, crear el pedido primero
      let finalOrderId = orderId;
      
      if (!finalOrderId) {
        console.log("📦 Creando pedido con datos de envío...");
        const total = getTotalPrice();
        const order = await orderService.createOrder(user.id, items, total, null, shippingData);
        finalOrderId = order.order_id || order.id;
      } else {
        // Actualizar el pedido existente con los datos de envío
        console.log("📦 Actualizando pedido con datos de envío...");
        await orderService.updateOrderShipping(finalOrderId, shippingData);
      }

      // Simular procesamiento de pago
      console.log("💳 Procesando pago...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Limpiar carrito
      clearCart();

      // Redirigir a página de confirmación
      navigate('/pedido-confirmado', {
        state: {
          orderId: finalOrderId,
          shippingData,
          items,
          total: getTotalPrice()
        }
      });

    } catch (error) {
      console.error('Error en checkout:', error);
      toast({
        title: "Error en el proceso",
        description: error.message || "Hubo un problema procesando tu pedido",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const total = getTotalPrice();

  if (!user) {
    navigate('/');
    return null;
  }

  if (items.length === 0 && !orderId) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sillage-cream via-white to-sillage-gold/10 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/carrito')}
            className="mb-4 text-sillage-gold-dark hover:text-sillage-gold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al carrito
          </Button>
          
          <h1 className="text-3xl font-bold text-sillage-gold-dark mb-2">
            Finalizar Compra
          </h1>
          <p className="text-gray-600">
            Completa tus datos de envío para procesar tu pedido
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario de datos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sillage-gold-dark">
                  <MapPin className="w-5 h-5" />
                  Datos de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Datos personales */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nombre Completo *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="full_name"
                          name="full_name"
                          value={shippingData.full_name}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="tu@email.com"
                        />
                      </div>
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>

                  {/* Dirección */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección Completa *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingData.address}
                      onChange={handleInputChange}
                      placeholder="Calle, número, departamento, etc."
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingData.city}
                        onChange={handleInputChange}
                        placeholder="Santiago"
                      />
                      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Región *</Label>
                      <Input
                        id="region"
                        name="region"
                        value={shippingData.region}
                        onChange={handleInputChange}
                        placeholder="Región Metropolitana"
                      />
                      {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Código Postal</Label>
                      <Input
                        id="postal_code"
                        name="postal_code"
                        value={shippingData.postal_code}
                        onChange={handleInputChange}
                        placeholder="7500000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas de Entrega (Opcional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={shippingData.notes}
                      onChange={handleInputChange}
                      placeholder="Instrucciones especiales para la entrega..."
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold py-3 text-lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Procesar Pago - ${total.toLocaleString('es-CL')} CLP
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resumen del pedido */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-sillage-gold-dark">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">
                        {item.size} • Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-sm">
                      ${(parseFloat(item.price) * item.quantity).toLocaleString('es-CL')}
                    </p>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold text-sillage-gold-dark">
                    <span>Total</span>
                    <span>${total.toLocaleString('es-CL')} CLP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;