import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import safeStorage from '@/utils/storage';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('external_reference');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    // Limpiar el carrito después de un pago exitoso
    if (orderId) {
      safeStorage.removeItem('cart');
      // Disparar evento para actualizar el contexto del carrito
      window.dispatchEvent(new Event('cartCleared'));
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Pago Exitoso!
            </h1>
            <p className="text-gray-600">
              Tu pedido ha sido procesado correctamente
            </p>
          </div>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Número de Pedido</p>
              <p className="font-mono text-lg font-semibold text-gray-900">
                #{orderId}
              </p>
            </div>
          )}

          {paymentId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">ID de Pago</p>
              <p className="font-mono text-sm text-gray-700">
                {paymentId}
              </p>
            </div>
          )}

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
          </div>
        </div>
      </div>
    </div>
  );
}