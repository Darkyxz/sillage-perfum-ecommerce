import React from 'react';
import { motion } from 'framer-motion';

const TerminosCondiciones = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-background"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-display font-bold text-sillage-gold mb-6">Términos y Condiciones</h2>
        
        <div className="space-y-6 text-sillage-gold-dark">
          <p><strong>Última actualización:</strong> {new Date().getFullYear()}</p>
          
          <div>
            <h3 className="text-xl font-semibold text-sillage-gold">1. Uso del sitio</h3>
            <p>Al acceder a este sitio, aceptas cumplir con estos términos y todas las leyes aplicables.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-sillage-gold">2. Compras</h3>
            <p>Los productos están sujetos a disponibilidad. Nos reservamos el derecho de limitar cantidades.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-sillage-gold">3. Precios</h3>
            <p>Los precios pueden cambiar sin previo aviso. No aceptamos responsabilidad por errores tipográficos.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-sillage-gold">4. Devoluciones</h3>
            <p>Consulta nuestra política de devoluciones en la sección correspondiente.</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TerminosCondiciones;