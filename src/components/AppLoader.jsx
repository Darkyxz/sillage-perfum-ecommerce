import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import safeStorage from '@/utils/storage';

const AppLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSteps, setLoadingSteps] = useState([]);

  useEffect(() => {
    const initializeApp = async () => {
      const steps = [];
      
      try {
        // Paso 1: Verificar storage
        steps.push('Verificando almacenamiento...');
        setLoadingSteps([...steps]);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const storageInfo = safeStorage.getStorageInfo();
        console.log('🔧 Storage info:', storageInfo);
        
        // Paso 2: Inicializar configuración
        steps.push('Inicializando configuración...');
        setLoadingSteps([...steps]);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Paso 3: Preparar contextos
        steps.push('Preparando contextos...');
        setLoadingSteps([...steps]);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Paso 4: Listo
        steps.push('¡Listo!');
        setLoadingSteps([...steps]);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error inicializando app:', error);
        // Continuar de todos modos
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-sillage-gold" />
            <h2 className="text-xl font-semibold text-sillage-gold">
              Sillage-Perfum
            </h2>
          </div>
          
          <div className="space-y-2">
            {loadingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-sm text-muted-foreground"
              >
                {step}
              </motion.div>
            ))}
          </div>
          
          <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sillage-gold"
              initial={{ width: 0 }}
              animate={{ width: `${(loadingSteps.length / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default AppLoader;