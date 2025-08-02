import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SEOStatus = () => {
  const [indexationStatus, setIndexationStatus] = useState('checking');
  const [showDetails, setShowDetails] = useState(false);

  // Solo mostrar en desarrollo o con parámetro debug
  const shouldShow = import.meta.env.DEV || 
    new URLSearchParams(window.location.search).get('seo-debug') === 'true';

  useEffect(() => {
    // Simular verificación de indexación
    const checkIndexation = async () => {
      try {
        // En producción, esto podría hacer una llamada real a una API
        setTimeout(() => {
          setIndexationStatus('pending');
        }, 2000);
      } catch (error) {
        setIndexationStatus('error');
      }
    };

    if (shouldShow) {
      checkIndexation();
    }
  }, [shouldShow]);

  if (!shouldShow) return null;

  const statusConfig = {
    checking: {
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      title: 'Verificando indexación...',
      description: 'Comprobando si el sitio está en Google'
    },
    pending: {
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      title: 'Pendiente de indexación',
      description: 'El sitio aún no aparece en Google'
    },
    indexed: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      title: 'Sitio indexado',
      description: 'El sitio aparece en Google'
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      title: 'Error de verificación',
      description: 'No se pudo verificar el estado'
    }
  };

  const currentStatus = statusConfig[indexationStatus];
  const Icon = currentStatus.icon;

  const seoTasks = [
    {
      task: 'Registrar en Google Search Console',
      status: 'pending',
      url: 'https://search.google.com/search-console/',
      priority: 'high'
    },
    {
      task: 'Subir sitemap.xml',
      status: 'ready',
      url: '/sitemap.xml',
      priority: 'high'
    },
    {
      task: 'Verificar robots.txt',
      status: 'ready',
      url: '/robots.txt',
      priority: 'medium'
    },
    {
      task: 'Crear Google My Business',
      status: 'pending',
      url: 'https://business.google.com',
      priority: 'high'
    },
    {
      task: 'Registrar en directorios chilenos',
      status: 'pending',
      url: 'https://www.amarillas.cl',
      priority: 'medium'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 max-w-sm z-50"
    >
      <div className={`${currentStatus.bg} ${currentStatus.border} border rounded-lg p-4 shadow-lg`}>
        <div className="flex items-center gap-3 mb-3">
          <Icon className={`h-5 w-5 ${currentStatus.color}`} />
          <div>
            <h3 className="font-semibold text-gray-800">{currentStatus.title}</h3>
            <p className="text-sm text-gray-600">{currentStatus.description}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs"
          >
            {showDetails ? 'Ocultar' : 'Ver tareas'} SEO
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open('https://search.google.com/search-console/', '_blank')}
            className="text-xs"
          >
            Search Console
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <h4 className="font-medium text-gray-800 mb-2 text-sm">Tareas SEO pendientes:</h4>
            <div className="space-y-2">
              {seoTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'ready' ? 'bg-green-500' : 
                      task.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className={`${task.priority === 'high' ? 'font-medium' : ''}`}>
                      {task.task}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(task.url, '_blank')}
                    className="h-6 px-2 text-xs"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 Tip: Busca "site:sillageperfum.cl" en Google para verificar indexación
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SEOStatus;