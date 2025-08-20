import { CheckCircle, AlertTriangle, Loader2, XCircle, Ban, Clock, RefreshCw } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import safeStorage from '@/utils/storage';
import { checkoutService } from '@/lib/checkoutService';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token_ws');
  const tbkToken = searchParams.get('TBK_TOKEN');
  const tbkIdSesion = searchParams.get('TBK_ID_SESION');
  const tbkOrdenCompra = searchParams.get('TBK_ORDEN_COMPRA');
  const { toast } = useToast();
  const { clearCartSilently } = useCart();
  const { user } = useAuth();
  const [confirmationStatus, setConfirmationStatus] = useState('processing'); // 'processing', 'success', 'error', 'rejected', 'cancelled'
  const [errorMessage, setErrorMessage] = useState('');
  const confirmationAttempted = useRef(false);

  useEffect(() => {
    const confirmPayment = async () => {
      // Caso 1: Timeout de sesión (solo TBK_ID_SESION + TBK_ORDEN_COMPRA, sin token ni TBK_TOKEN)
      if (!token && !tbkToken && (tbkIdSesion || tbkOrdenCompra)) {
        console.log('⏰ Timeout de sesión en Webpay');
        console.log('TBK_ID_SESION:', tbkIdSesion);
        console.log('TBK_ORDEN_COMPRA:', tbkOrdenCompra);
        
        setConfirmationStatus('timeout');
        setErrorMessage('La sesión de pago expiró por inactividad (más de 5 minutos).');
        return;
      }
      
      // Caso 2: Error en formulario + intentar nuevamente (token_ws + TBK_TOKEN + otros)
      if (token && tbkToken) {
        console.log('🔄 Error en formulario de pago - Intentar nuevamente');
        console.log('token_ws:', token);
        console.log('TBK_TOKEN:', tbkToken);
        console.log('TBK_ID_SESION:', tbkIdSesion);
        console.log('TBK_ORDEN_COMPRA:', tbkOrdenCompra);
        
        setConfirmationStatus('form_error');
        setErrorMessage('Hubo un error en el formulario de pago de Webpay.');
        return;
      }
      
      // Caso 3: Cancelación normal (solo TBK_TOKEN presente)
      if (tbkToken && !token) {
        console.log('❌ Pago cancelado por el usuario en Webpay');
        console.log('TBK_TOKEN:', tbkToken);
        console.log('TBK_ID_SESION:', tbkIdSesion);
        console.log('TBK_ORDEN_COMPRA:', tbkOrdenCompra);
        
        setConfirmationStatus('cancelled');
        setErrorMessage('La transacción fue cancelada por el usuario en el formulario de pago de Webpay.');
        return;
      }
      
      // Evitar múltiples llamadas simultáneas para pagos normales
      if (confirmationAttempted.current || !token) {
        return;
      }
      
      confirmationAttempted.current = true;
      
      try {
        console.log('🔄 Iniciando confirmación de pago con token:', token);
        setConfirmationStatus('processing');
        
        const result = await checkoutService.confirmWebpayPayment(token);
        console.log('✅ Resultado de confirmación:', result);
        
        // Verificar el estado del pago
        const paymentStatus = result?.data?.status || result?.status;
        console.log('🔍 Estado del pago recibido:', paymentStatus);
        
        if (paymentStatus === 'AUTHORIZED') {
          // Limpiar el carrito usando el contexto (que maneja las claves específicas por usuario)
          clearCartSilently();
          
          // También limpiar claves genéricas por compatibilidad
          safeStorage.removeItem('cart');
          safeStorage.removeItem('cart_guest');
          
          // Disparar evento para otros componentes
          window.dispatchEvent(new Event('cartCleared'));
          
          setConfirmationStatus('success');
          console.log('✅ Pago confirmado y carrito limpiado completamente');
        } else if (paymentStatus === 'FAILED') {
          // Pago rechazado por el banco/usuario
          setConfirmationStatus('rejected');
          setErrorMessage('El pago fue rechazado. Esto puede deberse a fondos insuficientes, datos incorrectos o cancelación por parte del usuario.');
          console.log('❌ Pago rechazado por el banco/usuario');
        } else {
          throw new Error(`Estado de pago inesperado: ${paymentStatus}`);
        }
        
      } catch (error) {
        console.error('❌ Error confirmando pago:', error);
        setConfirmationStatus('error');
        
        // Determinar el mensaje de error basado en el tipo de error
        let errorMsg = "El pago fue exitoso pero hubo un problema registrándolo en nuestro sistema.";
        
        if (error.message?.includes('already processed') || 
            error.message?.includes('ya procesada') ||
            error.message?.includes('Transaction already locked')) {
          // Si la transacción ya fue procesada, no es realmente un error
          console.log('ℹ️ Transacción ya procesada previamente');
          
          // Limpiar el carrito usando el contexto (que maneja las claves específicas por usuario)
          clearCartSilently();
          
          // También limpiar claves genéricas por compatibilidad
          safeStorage.removeItem('cart');
          safeStorage.removeItem('cart_guest');
          
          // Disparar evento para otros componentes
          window.dispatchEvent(new Event('cartCleared'));
          
          setConfirmationStatus('success');
          console.log('✅ Transacción ya procesada - carrito limpiado completamente');
          return;
        }
        
        if (error.message?.includes('Network Error') || error.message?.includes('fetch')) {
          errorMsg = "Error de conexión. Por favor verifica tu conexión a internet.";
        } else if (error.message?.includes('500')) {
          errorMsg = "Error en el servidor. El pago fue exitoso, contacta a soporte para confirmar tu pedido.";
        }
        
        setErrorMessage(errorMsg);
        
        toast({
          title: "Error confirmando pago",
          description: errorMsg + " Por favor contacta a soporte si el problema persiste.",
          variant: "destructive"
        });
      }
    };

    // Pequeño delay para evitar llamadas muy rápidas
    const timeoutId = setTimeout(confirmPayment, 500);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [token, tbkToken, tbkIdSesion, tbkOrdenCompra, toast]);

  // Determinar el fondo y colores según el estado
  const getBackgroundClass = () => {
    switch (confirmationStatus) {
      case 'processing':
        return 'bg-gradient-to-br from-blue-50 to-indigo-100';
      case 'error':
      case 'rejected':
        return 'bg-gradient-to-br from-red-50 to-rose-100';
      case 'cancelled':
        return 'bg-gradient-to-br from-yellow-50 to-orange-100';
      case 'timeout':
        return 'bg-gradient-to-br from-orange-50 to-red-100';
      case 'form_error':
        return 'bg-gradient-to-br from-amber-50 to-yellow-100';
      default:
        return 'bg-gradient-to-br from-green-50 to-emerald-100';
    }
  };

  const renderIcon = () => {
    switch (confirmationStatus) {
      case 'processing':
        return <Loader2 className="w-20 h-20 text-blue-500 mx-auto mb-4 animate-spin" />;
      case 'rejected':
        return <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />;
      case 'cancelled':
        return <Ban className="w-20 h-20 text-yellow-600 mx-auto mb-4" />;
      case 'timeout':
        return <Clock className="w-20 h-20 text-orange-600 mx-auto mb-4" />;
      case 'form_error':
        return <RefreshCw className="w-20 h-20 text-amber-600 mx-auto mb-4" />;
      case 'error':
        return <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-4" />;
      default:
        return <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />;
    }
  };

  const getTitle = () => {
    switch (confirmationStatus) {
      case 'processing':
        return 'Confirmando Pago...';
      case 'rejected':
        return 'Pago Rechazado';
      case 'cancelled':
        return 'Pago Cancelado';
      case 'timeout':
        return 'Sesión Expirada';
      case 'form_error':
        return 'Error en Formulario';
      case 'error':
        return '¡Pago Exitoso!';
      default:
        return '¡Pago Exitoso!';
    }
  };

  const getDescription = () => {
    switch (confirmationStatus) {
      case 'processing':
        return 'Por favor espera mientras confirmamos tu pago con el banco...';
      case 'rejected':
        return errorMessage || 'El pago fue rechazado por el banco o usuario.';
      case 'cancelled':
        return errorMessage || 'La transacción fue cancelada por el usuario.';
      case 'timeout':
        return errorMessage || 'La sesión de pago expiró por inactividad.';
      case 'form_error':
        return errorMessage || 'Hubo un problema con el formulario de pago.';
      case 'error':
        return errorMessage || 'Tu pago fue procesado exitosamente, pero hubo un problema técnico.';
      default:
        return 'Tu pedido ha sido procesado correctamente';
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${getBackgroundClass()}`}>
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            {renderIcon()}
            <h1 className={`text-2xl font-bold mb-2 ${
              confirmationStatus === 'error' || confirmationStatus === 'rejected' ? 'text-red-900' :
              confirmationStatus === 'cancelled' ? 'text-yellow-800' :
              confirmationStatus === 'timeout' ? 'text-orange-800' :
              confirmationStatus === 'form_error' ? 'text-amber-800' :
              confirmationStatus === 'processing' ? 'text-blue-900' : 'text-gray-900'
            }`}>
              {getTitle()}
            </h1>
            <p className="text-gray-600">
              {getDescription()}
            </p>
          </div>

          {/* Mostrar información adicional durante el procesamiento */}
          {confirmationStatus === 'processing' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>No cierres esta ventana</strong><br />
                Estamos verificando tu pago con Transbank...
              </p>
            </div>
          )}

          {/* Mostrar error específico */}
          {confirmationStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>¿Qué hacer ahora?</strong><br />
                • Tu pago fue aprobado por el banco<br />
                • Contacta a soporte para confirmar tu pedido<br />
                • Guarda el token de transacción como referencia
              </p>
            </div>
          )}

          {/* Mostrar información para pago rechazado */}
          {confirmationStatus === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Posibles razones del rechazo:</strong><br />
                • Fondos insuficientes en la tarjeta<br />
                • Datos de la tarjeta incorrectos<br />
                • Transacción cancelada por el usuario<br />
                • Límites de transacción excedidos
              </p>
              <p className="text-sm text-red-800 mt-2">
                <strong>Puedes intentar nuevamente:</strong><br />
                • Verificando los datos de tu tarjeta<br />
                • Contactando a tu banco si es necesario
              </p>
            </div>
          )}

          {/* Mostrar información para pago cancelado */}
          {confirmationStatus === 'cancelled' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>¿Qué pasó?</strong><br />
                • La transacción fue cancelada en el formulario de Webpay<br />
                • No se realizó ningún cargo a tu tarjeta<br />
                • Los productos siguen en tu carrito de compras
              </p>
              <p className="text-sm text-yellow-800 mt-2">
                <strong>Puedes:</strong><br />
                • Intentar el pago nuevamente<br />
                • Modificar tu carrito si es necesario<br />
                • Contactar a soporte si tienes dudas
              </p>
            </div>
          )}

          {/* Mostrar información para timeout de sesión */}
          {confirmationStatus === 'timeout' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-800">
                <strong>¿Qué pasó?</strong><br />
                • La sesión de pago expiró por inactividad (más de 5 minutos)<br />
                • No se realizó ningún cargo a tu tarjeta<br />
                • Los productos siguen en tu carrito de compras
              </p>
              <p className="text-sm text-orange-800 mt-2">
                <strong>Para continuar:</strong><br />
                • Inicia un nuevo proceso de pago<br />
                • Completa el pago dentro del tiempo límite<br />
                • Contacta a soporte si necesitas ayuda
              </p>
            </div>
          )}

          {/* Mostrar información para error en formulario */}
          {confirmationStatus === 'form_error' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>¿Qué pasó?</strong><br />
                • Hubo un error técnico en el formulario de Webpay<br />
                • El usuario hizo clic en "Intentar nuevamente"<br />
                • No se realizó ningún cargo a tu tarjeta
              </p>
              <p className="text-sm text-amber-800 mt-2">
                <strong>Puedes:</strong><br />
                • Intentar el pago nuevamente<br />
                • Verificar tu conexión a internet<br />
                • Contactar a soporte si el problema persiste
              </p>
            </div>
          )}

          {/* Mostrar token para pagos normales */}
          {token && confirmationStatus !== 'processing' && confirmationStatus !== 'cancelled' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Token de Transacción</p>
              <p className="font-mono text-sm text-gray-700 break-all">
                {token}
              </p>
            </div>
          )}

          {/* Mostrar información de cancelación */}
          {tbkToken && confirmationStatus === 'cancelled' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Información de Cancelación</p>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">TBK_TOKEN:</p>
                <p className="font-mono text-xs text-gray-700 break-all mb-2">{tbkToken}</p>
                {tbkIdSesion && (
                  <>
                    <p className="text-xs text-gray-500">TBK_ID_SESION:</p>
                    <p className="font-mono text-xs text-gray-700 break-all mb-2">{tbkIdSesion}</p>
                  </>
                )}
                {tbkOrdenCompra && (
                  <>
                    <p className="text-xs text-gray-500">TBK_ORDEN_COMPRA:</p>
                    <p className="font-mono text-xs text-gray-700 break-all">{tbkOrdenCompra}</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Mostrar botones solo cuando no está procesando */}
          {confirmationStatus !== 'processing' && (
            <div className="space-y-3">
              <Link
                to="/perfil"
                className="block w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Ver Mis Pedidos
              </Link>
              <Link
                to="/productos"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Seguir Comprando
              </Link>
              <Link
                to="/"
                className="block w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
              >
                Volver al Inicio
              </Link>
              {confirmationStatus === 'error' && (
                <Link
                  to="/contacto"
                  className="block w-full bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Contactar Soporte
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}