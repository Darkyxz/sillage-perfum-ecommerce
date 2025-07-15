import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const UrgencyBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mostrar banner después de 5 segundos si no se ha visto antes
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenBanner = sessionStorage.getItem('hasSeenUrgencyBanner');
      if (!hasSeenBanner) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Función para cerrar el banner y marcar como visto
  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenUrgencyBanner', 'true');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <div className="bg-gradient-to-r from-sillage-gold via-sillage-gold-bright to-sillage-gold-dark rounded-xl shadow-2xl border border-sillage-gold/50 p-4 backdrop-blur-md">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-white hover:text-sillage-gold transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center mb-3">
            <div className="bg-white/20 rounded-full p-2 mr-3">
              <Clock className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-sillage-gold font-bold text-lg">¡Oferta Flash!</h3>
              <p className="text-sillage-gold-dark text-sm">40% OFF en toda la tienda</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sillage-gold">
              <p className="text-sm font-medium">Termina en:</p>
              <div className="flex space-x-2 text-lg font-bold">
                <span className="bg-white/20 px-2 py-1 rounded">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          <Link to="/productos" className="block" onClick={handleClose}>
            <Button className="w-full bg-white text-sillage-gold-dark hover:bg-white/90 font-bold py-2 transition-all duration-300 transform hover:scale-105">
              <ShoppingCart className="mr-2 h-4 w-4" />
              ¡Comprar Ahora!
            </Button>
          </Link>

          <p className="text-sillage-gold-dark/90 text-xs text-center mt-2">
            *Solo válido por tiempo limitado
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UrgencyBanner;
