import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import safeStorage from '@/lib/utils';
import { checkoutService } from '@/lib/checkoutService';
import { useToast } from '@/components/ui/use-toast';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token_ws');
  const { toast } = useToast();

  useEffect(() => {
    const confirmPayment = async () => {
      if (token) {
        try {
          await checkoutService.confirmWebpayPayment(token);
          // Limpiar el carrito después de confirmar el pago
          safeStorage.removeItem('cart');
          window.dispatchEvent(new Event('cartCleared'));
        } catch (error) {
          console.error('Error confirmando pago:', error);
          toast({
            title: "Error confirmando pago",
            description: "El pago fue exitoso pero hubo un problema registrándolo en nuestro sistema. Por favor contacta a soporte.",
            variant: "destructive"
          });
        }
      }
    };

    confirmPayment();
  }, [token, toast]);

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

          {token && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Token de Transacción</p>
              <p className="font-mono text-sm text-gray-700 break-all">
                {token}
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