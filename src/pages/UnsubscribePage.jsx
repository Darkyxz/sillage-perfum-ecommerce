import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const { token } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  const status = searchParams.get('status');
  const email = searchParams.get('email');

  // Procesar token si está presente en la URL
  useEffect(() => {
    if (token && !status) {
      setIsProcessing(true);
      // Redirigir directamente al backend de Vercel
      window.location.href = `https://sillage-backend-iae11t8w2-sillageperfums-projects.vercel.app/api/subscribers/unsubscribe/${token}`;
    }
  }, [token, status]);

  // Countdown para redirigir automáticamente al home
  useEffect(() => {
    if (!isProcessing) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [navigate, isProcessing]);

  const getContent = () => {
    switch (status) {
      case 'success':
        return {
          icon: '✅',
          title: 'Suscripción cancelada exitosamente',
          message: email 
            ? `Tu email ${decodeURIComponent(email)} ha sido eliminado de nuestra lista de suscriptores.`
            : 'Tu suscripción ha sido cancelada exitosamente.',
          subtitle: 'Lamentamos que te vayas. Si fue un error, puedes volver a suscribirte en cualquier momento.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800'
        };
      case 'not_found':
        return {
          icon: '❌',
          title: 'Suscripción no encontrada',
          message: 'No encontramos una suscripción asociada a este enlace.',
          subtitle: 'Es posible que el enlace haya expirado o ya hayas cancelado tu suscripción anteriormente.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800'
        };
      case 'error':
        return {
          icon: '⚠️',
          title: 'Error al cancelar suscripción',
          message: 'Ocurrió un error al procesar tu solicitud.',
          subtitle: 'Por favor intenta nuevamente más tarde o contáctanos si el problema persiste.',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800'
        };
      default:
        return {
          icon: '🔄',
          title: 'Procesando solicitud...',
          message: 'Por favor espera mientras procesamos tu solicitud de cancelación.',
          subtitle: '',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800'
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Helmet>
        <title>Cancelar Suscripción - Sillage Perfums</title>
        <meta name="description" content="Página de confirmación para cancelar suscripción al newsletter de Sillage Perfums" />
      </Helmet>

      <div className="max-w-2xl w-full">
        <div className={`${content.bgColor} border ${content.borderColor} rounded-xl shadow-lg p-8 text-center`}>
          {/* Icono */}
          <div className={`text-6xl ${content.iconColor} mb-6`}>
            {content.icon}
          </div>

          {/* Título */}
          <h1 className={`text-3xl font-bold ${content.titleColor} mb-4`}>
            {content.title}
          </h1>

          {/* Mensaje principal */}
          <p className="text-gray-700 text-lg mb-4 leading-relaxed">
            {content.message}
          </p>

          {/* Subtítulo */}
          {content.subtitle && (
            <p className="text-gray-600 mb-6 leading-relaxed">
              {content.subtitle}
            </p>
          )}

          {/* Botones de acción */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-sillage-gold hover:bg-sillage-gold-dark text-white font-medium py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Volver al sitio web
            </button>

            {status === 'success' && (
              <button
                onClick={() => navigate('/', { state: { openNewsletter: true } })}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition duration-300"
              >
                Volver a suscribirme
              </button>
            )}

            {(status === 'error' || status === 'not_found') && (
              <button
                onClick={() => navigate('/contacto')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
              >
                Contactar soporte
              </button>
            )}
          </div>

          {/* Countdown */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Serás redirigido automáticamente al inicio en <strong>{countdown}</strong> segundos
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Si tienes alguna pregunta sobre nuestros productos o servicios, no dudes en contactarnos.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <button
                onClick={() => navigate('/contacto')}
                className="text-sillage-gold hover:text-sillage-gold-dark font-medium transition duration-200"
              >
                📧 Contacto
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => navigate('/productos')}
                className="text-sillage-gold hover:text-sillage-gold-dark font-medium transition duration-200"
              >
                🛍️ Ver productos
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => navigate('/')}
                className="text-sillage-gold hover:text-sillage-gold-dark font-medium transition duration-200"
              >
                🏠 Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribePage;
