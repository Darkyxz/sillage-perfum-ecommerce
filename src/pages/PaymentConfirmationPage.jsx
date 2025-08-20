import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkoutService } from '../lib/checkoutService'; // Ajusta la ruta si es necesario
import { useCart } from '../contexts/CartContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

const PaymentConfirmationPage = () => {
    const [status, setStatus] = useState('processing'); // 'processing', 'success', 'failed'
    const [message, setMessage] = useState('Procesando tu pago, por favor espera...');
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useCart();

    useEffect(() => {
        const confirmPayment = async () => {
            // Token enviado por Transbank en la URL (puede variar el nombre del parámetro)
            const params = new URLSearchParams(location.search);
            const token = params.get('token_ws');

            // O si fue guardado en localStorage
            const storedToken = localStorage.getItem('webpay_token');

            if (!token && !storedToken) {
                setStatus('failed');
                setMessage('No se encontró un token de transacción para verificar.');
                return;
            }

            try {
                const finalToken = token || storedToken;
                const response = await checkoutService.confirmWebpayPayment(finalToken);

                if (response.status === 'AUTHORIZED') {
                    setStatus('success');
                    setMessage(`¡Pago exitoso! Tu número de orden es: ${response.buy_order}.`);
                    clearCart(); // Limpiar el carrito después de un pago exitoso
                    localStorage.removeItem('webpay_token');
                } else {
                    setStatus('failed');
                    setMessage(`El pago fue rechazado o cancelado. Estado: ${response.status}`);
                }
            } catch (error) {
                setStatus('failed');
                setMessage(error.message || 'Hubo un error al confirmar tu pago.');
                console.error('Error de confirmación:', error);
            }
        };

        confirmPayment();
    }, [location, clearCart]);

    return (
        <div className="container mx-auto text-center py-20">
            {status === 'processing' && <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4" />}
            {status === 'success' && <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />}
            {status === 'failed' && <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />}

            <h1 className={`text-3xl font-bold mb-4 ${status === 'success' ? 'text-green-500' : status === 'failed' ? 'text-red-500' : ''}`}>
                {status === 'processing' ? 'Procesando Pago' : status === 'success' ? 'Pago Exitoso' : 'Pago Fallido'}
            </h1>
            <p className="text-lg mb-8">{message}</p>

            <Button onClick={() => navigate('/productos')}>Seguir Comprando</Button>
            {status === 'success' && (
                <Button variant="outline" className="ml-4" onClick={() => navigate('/perfil')}>Ver Mis Pedidos</Button>
            )}
        </div>
    );
};

export default PaymentConfirmationPage;