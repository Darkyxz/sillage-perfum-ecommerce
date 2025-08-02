import { XCircle, RefreshCw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentFailurePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token_ws');
  const orderId = searchParams.get('buy_order');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pago Rechazado
            </h1>
            <p className="text-gray-600">
              No se pudo procesar tu pago. Por favor, intenta nuevamente.
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Posibles causas:</strong><br />
              • Fondos insuficientes<br />
              • Datos de tarjeta incorrectos<br />
              • Límite de compra excedido<br />
              • Problema temporal del banco
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/carrito"
              className="flex items-center justify-center w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar Nuevamente
            </Link>
            <Link
              to="/productos"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Seguir Comprando
            </Link>
            <Link
              to="/contacto"
              className="block w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
            >
              Contactar Soporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}