import React from 'react';
import { motion } from 'framer-motion';

const PoliticaPrivacidad = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-background"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-display font-bold text-sillage-gold mb-6">Política de Privacidad</h2>
        
        <div className="space-y-6 text-sillage-gold-dark">
          <p><strong>Última actualización:</strong> {new Date().getFullYear()}</p>
          
          <div>
            <h3 className="text-xl font-semibold text-sillage-gold">1. Información que recopilamos</h3>
            <p>Recopilamos información que nos proporcionas al registrarte, comprar o navegar en nuestro sitio.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-sillage-gold">2. Uso de la información</h3>
            <p>Utilizamos tu información para procesar transacciones, mejorar tu experiencia y comunicarnos contigo.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-sillage-gold">3. Protección de datos</h3>
            <p>Implementamos medidas de seguridad para proteger tu información personal.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-sillage-gold">4. Terceros</h3>
            <p>No vendemos ni compartimos tu información con terceros sin tu consentimiento.</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default PoliticaPrivacidad;