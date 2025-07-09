import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const UrgencyBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
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
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl shadow-2xl border border-red-400 p-4 backdrop-blur-md">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-white hover:text-red-200 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center mb-3">
            <div className="bg-white/20 rounded-full p-2 mr-3">
              <Clock className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">¡Oferta Flash!</h3>
              <p className="text-red-100 text-sm">40% OFF en toda la tienda</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-white">
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

          <Link to="/products" className="block">
            <Button className="w-full bg-white text-red-600 hover:bg-red-50 font-bold py-2 transition-all duration-300 transform hover:scale-105">
              <ShoppingCart className="mr-2 h-4 w-4" />
              ¡Comprar Ahora!
            </Button>
          </Link>

          <p className="text-red-100 text-xs text-center mt-2">
            *Solo válido por tiempo limitado
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UrgencyBanner;
