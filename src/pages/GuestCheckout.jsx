import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft, Banknote,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  ShoppingBag,
  Info,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';
import { guestCheckoutService } from '@/lib/guestCheckoutService';

const GuestCheckout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Estado para información del invitado
  const [guestInfo, setGuestInfo] = useState({
    full_name: '',
    email: '',
    phone: ''
  });

  // Estado para información de envío
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    region: '',
    postal_code: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Cargar información guardada del invitado si existe
  useEffect(() => {
    const savedInfo = guestCheckoutService.getGuestInfo();
    if (savedInfo) {
      setGuestInfo(savedInfo.guestInfo || guestInfo);
      setShippingInfo(savedInfo.shippingInfo || shippingInfo);
    }
  }, []);

  // Set default shipping info on component mount
  useEffect(() => {
    setShippingInfo({
      address: 'Retiro en tienda',
      city: 'Santiago',
      region: 'Región Metropolitana',
      postal_code: '0000000',
      notes: 'Retiro en tienda'
    });
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate]);

  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({ ...prev, [name]: value }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar información del invitado
    if (!guestInfo.full_name.trim()) {
      newErrors.full_name = 'El nombre completo es requerido';
    }

    if (!guestInfo.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!guestInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
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

    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de proceder",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Guardar información del invitado para futuras compras
      guestCheckoutService.saveGuestInfo({ guestInfo, shippingInfo });

      // Calcular totales
      const subtotal = getCartTotal();
      const shipping = 0; // Envío fijo
      const total = subtotal + shipping;

      // Crear orden como invitado
      const orderResult = await guestCheckoutService.createGuestOrder(
        items,
        guestInfo,
        shippingInfo,
        total
      );

      if (orderResult.success) {
        const orderId = orderResult.data.order_id;
        const guestEmail = guestInfo.email;

        // Procesar pago con Webpay
        const paymentResult = await guestCheckoutService.processGuestPayment(
          orderId,
          guestEmail,
          total,
          `${window.location.origin}/pago-exitoso?guest=true&order=${orderId}&email=${encodeURIComponent(guestEmail)}`,
          `${window.location.origin}/pago-fallido?guest=true&order=${orderId}`
        );

        if (paymentResult.success && paymentResult.data.url) {
          // Limpiar carrito
          clearCart();

          // Redirigir a Webpay
          window.location.href = paymentResult.data.url;
        } else {
          throw new Error('Error al iniciar el pago con Webpay');
        }
      }
    } catch (error) {
      console.error('Error en checkout de invitado:', error);
      toast({
        title: "Error en el proceso",
        description: error.message || "Hubo un problema procesando tu pedido",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sillage-cream via-white to-sillage-gold/10 py-8">
      <Helmet>
        <title>Checkout Invitado - Sillage Perfum</title>
        <meta name="description" content="Completa tu compra como invitado en Sillage Perfum" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
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
            Checkout como Invitado
          </h1>
          <p className="text-gray-600">
            Completa tu compra sin necesidad de crear una cuenta
          </p>
        </motion.div>

        {/* Alert informativo */}
        <Alert className="mb-6 border-sillage-gold/30 bg-sillage-gold/5">
          <Info className="h-4 w-4 text-sillage-gold-dark" />
          <AlertDescription className="text-gray-700">
            <strong>Compra como invitado:</strong> Podrás completar tu pedido sin registrarte.
            Te enviaremos un email con los detalles para retirar tu compra.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario principal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sillage-gold-dark">
                    <User className="w-5 h-5" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nombre Completo *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="full_name"
                          name="full_name"
                          value={guestInfo.full_name}
                          onChange={handleGuestInfoChange}
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
                          value={guestInfo.email}
                          onChange={handleGuestInfoChange}
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
                        value={guestInfo.phone}
                        onChange={handleGuestInfoChange}
                        className="pl-10"
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Información de envío 
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sillage-gold-dark">
                    <MapPin className="w-5 h-5" />
                    Información de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección Completa *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingInfoChange}
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
                        value={shippingInfo.city}
                        onChange={handleShippingInfoChange}
                        placeholder="Santiago"
                      />
                      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Región *</Label>
                      <Input
                        id="region"
                        name="region"
                        value={shippingInfo.region}
                        onChange={handleShippingInfoChange}
                        placeholder="Región Metropolitana"
                      />
                      {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Código Postal</Label>
                      <Input
                        id="postal_code"
                        name="postal_code"
                        value={shippingInfo.postal_code}
                        onChange={handleShippingInfoChange}
                        placeholder="7500000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas de Entrega (Opcional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={shippingInfo.notes}
                      onChange={handleShippingInfoChange}
                      placeholder="Instrucciones especiales para la entrega..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>*/}

              {/* Términos y condiciones */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="acceptTerms"
                      checked={acceptTerms}
                      onCheckedChange={setAcceptTerms}
                      className="mt-0.5"
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="acceptTerms"
                        className="text-sm text-foreground cursor-pointer leading-relaxed"
                      >
                        Acepto los términos y condiciones y la política de privacidad *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Al continuar, aceptas nuestras políticas y que podemos usar tu email para
                        enviarte información sobre tu pedido.
                      </p>
                    </div>
                  </div>
                  {errors.terms && <p className="text-sm text-red-500 mt-2">{errors.terms}</p>}
                </CardContent>
              </Card>

              {/* Opción de crear cuenta */}
              <Alert className="border-blue-200 bg-blue-50">
                <ShoppingBag className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-gray-700">
                  <strong>¿Quieres guardar tu información?</strong> Puedes crear una cuenta después
                  de completar tu compra para acceder a beneficios exclusivos y rastrear todos tus pedidos.
                </AlertDescription>
              </Alert>
            </form>
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
                      ${Math.round(parseFloat(item.price) * item.quantity).toLocaleString('es-CL')}
                    </p>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${Math.round(subtotal).toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    {/* <span>Envío</span>
                    <span>${shipping.toLocaleString('es-CL')}</span>*/}
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-sillage-gold-dark pt-2 border-t">
                    <span>Total</span>
                    <span>${Math.round(total).toLocaleString('es-CL')}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    aria-label="Pagar con Webpay"
                    className="focus:outline-none"
                    style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
                    onClick={() => {
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
                      montoField.value = total;
                      form.appendChild(montoField);

                      document.body.appendChild(form);
                      form.submit();
                      document.body.removeChild(form);

                      window.location.href = '/Pago-realizado';
                    }}
                  >
                    <img
                      src="https://www.webpay.cl/assets/img/boton_webpaycl.svg"
                      alt="Webpay"
                      className="h-12 mx-auto"
                      draggable="false"
                      style={{ pointerEvents: 'none' }}
                    />
                  </button>
                  <button
                    type="button"
                    aria-label="Transferencia bancaria"
                    onClick={() => { window.location.href = '/como-comprar'; }}
                    className="flex flex-col items-center justify-center gap-1 p-2 text-center hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sillage-gold"
                  >
                    <Banknote className="h-6 w-6 text-sillage-gold-dark" /> {/* Icono más grande */}
                    <span className="text-xs text-gray-600">Transferencia bancaria</span> {/* Texto pequeño */}
                  </button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Serás redirigido a Webpay para completar tu pago de forma segura
                </p>
                <span className="text-xs text-center text-muted-foreground">
                  <strong>Nota:</strong> El cliente asume los costos de envío.
                </span>
              </CardContent>
            </Card>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GuestCheckout;
