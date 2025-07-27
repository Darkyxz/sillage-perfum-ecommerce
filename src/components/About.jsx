import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Award, Users } from 'lucide-react';

const About = () => {
  return (
    <section id="about-section" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
          {/* Todo el contenido de texto a la izquierda */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                Sillage Perfum Spa
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-justify"
            >
              <p className="text-sillage-gold-deep leading-relaxed">
                Fue creada con la misión de promover perfumes de alta calidad. La idea surge en tiempos de reinversión y crecimiento, permitiéndonos llegar a nuestros clientes ofreciendo una línea completa de nuestras mejores interpretaciones, inspiradas en fragancias de alta gama para quienes gustan dejar una huella.
              </p>

              <h3 className="text-xl md:text-4xl font-display font-semibold text-foreground mb-2">
                "Sillage"
              </h3>

              <p className="text-sillage-gold-deep leading-relaxed">
                Proviene del francés y significa "estela" o "rastro". En perfumes, describe la huella olfativa que deja una fragancia en el ambiente.
              </p>

              
            </motion.div>
          </div>

          {/* Imagen circular a la derecha - Grande y centrada verticalmente */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 flex justify-center"
          >
            <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-lg border-4 border-sillage-gold-dark overflow-hidden shadow-2xl">
              <img
                src="./sillagerounabout.png"
                alt="Colección de perfumes premium"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sillage-dark/30 to-transparent"></div>
            </div>
          </motion.div>
        </div>

        {/* Valores de la empresa */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* ... (los valores de la empresa se mantienen igual) ... */}
        </motion.div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          {/* ... (el CTA final se mantiene igual) ... */}
        </motion.div>
      </div>
    </section>
  );
};

export default About;