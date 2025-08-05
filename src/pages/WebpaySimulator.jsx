import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';

const WebpaySimulator = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token');
  const amount = searchParams.get('amount');
  const order = searchParams.get('order');

  const handleApprove = async () => {
    setLoading(true);
    // Simular delay de procesamiento
    setTimeout(() => {
      navigate(`/pago-exitoso?token_ws=${token}`);
    }, 2000);
  };

  const handleReject = () => {
    navigate(`/pago-fallido?token_ws=${token}&buy_order=${order}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Simulador Webpay
          </h1>
          <p className="text-gray-600">
            Ambiente de desarrollo
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Monto:</span>
              <span className="font-semibold">${parseInt(amount || 0).toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Orden:</span>
              <span className="font-mono text-xs">{order}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Token:</span>
              <span className="font-mono text-xs">{token?.substring(0, 20)}...</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleApprove}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprobar Pago
              </div>
            )}
          </Button>

          <Button
            onClick={handleReject}
            disabled={loading}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50 py-3"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Rechazar Pago
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Este es un simulador para desarrollo.<br />
            En producción se usará Webpay real.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebpaySimulator;