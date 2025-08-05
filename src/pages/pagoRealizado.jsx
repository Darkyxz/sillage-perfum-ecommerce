import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PagoRealizado() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="mb-6">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            ¡Pago realizado con éxito!
                        </h1>
                        <p className="text-gray-600">
                            Gracias por tu compra. Pronto recibirás un correo con la confirmación y los detalles de tu pedido.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <Link
                            to="/productos"
                            className="block w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
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