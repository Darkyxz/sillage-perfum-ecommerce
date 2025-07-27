import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CookiesPolicy = () => {
  const [cookiesEnabled, setCookiesEnabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkCookies = () => {
      try {
        // Test if cookies can be set/read
        document.cookie = 'cookie_test=1; SameSite=Lax; path=/';
        const cookiesWorking = document.cookie.includes('cookie_test');
        document.cookie = 'cookie_test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        setCookiesEnabled(cookiesWorking);
      } catch (e) {
        setCookiesEnabled(false);
      }
    };

    checkCookies();
  }, []);

  // Mostrar advertencia si las cookies están deshabilitadas, pero no bloquear
  const cookieWarning = !cookiesEnabled && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center space-x-2">
        <span className="text-amber-600">⚠️</span>
        <div>
          <h3 className="font-semibold text-amber-800">Cookies Deshabilitadas</h3>
          <p className="text-sm text-amber-700">
            Las cookies están deshabilitadas en tu navegador. Algunas funciones pueden tener limitaciones.
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-background min-h-screen"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-display font-bold text-sillage-gold mb-6">Política de Cookies</h2>
        
        {cookieWarning}
        
        <div className="space-y-4 text-sillage-gold-dark">
          {/* Contenido de la política de cookies */}
          <p><strong>Última actualización:</strong> {new Date().getFullYear()}</p>
          
           <h3 className="text-xl font-semibold text-sillage-gold mt-6">¿Qué son las cookies?</h3>
          <p>Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo para mejorar la experiencia de usuario.</p>
          
          <h3 className="text-xl font-semibold text-sillage-gold mt-6">Cómo usamos las cookies</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Autenticación y seguridad</li>
            <li>Preferencias del usuario</li>
            <li>Análisis de tráfico</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-sillage-gold mt-6">Control de cookies</h3>
          <p>Puedes gestionar o eliminar las cookies a través de la configuración de tu navegador.</p>
        </div>
      </div>
    </motion.section>
  );
};

export default CookiesPolicy;
