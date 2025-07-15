import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Award, Users } from 'lucide-react';

const About = () => {
  return (
    <section id="about-section" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-sillage-gold mb-6">
            Sillage Perfum Spa
          </h2>
          <p className="text-xl text-sillage-gold-dark max-w-3xl mx-auto leading-relaxed">
          Fue creada, con la misión de promover perfumes de alta calidad. La idea surge, en tiempos de reinversión. 
          Y crecimiento permitiéndonos llegar a nuestros clientes, ofreciendo una  línea completa  de nuestras mejores interpretaciones, 
          inspiradas en fragancias. de alta gama, para quienes gustan dejar una huella. 
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Texto principal */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-display font-semibold text-sillage-gold mb-4">
            "Sillage”
            </h3>
            <p className="text-sillage-gold-dark leading-relaxed">
             proviene del francés y significa "estela" o "rastro". En perfumes, describe la huella olfativa que deja una fragancia en el ambiente.
            </p>
            <p className="text-sillage-gold-dark leading-relaxed">
              Trabajamos con las mejores casas perfumeras del mundo para ofrecerte fragancias que van 
              más allá de lo ordinario. Desde notas florales delicadas hasta composiciones orientales 
              intensas, tenemos la fragancia perfecta para cada momento y personalidad.
            </p>
            <p className="text-sillage-gold-dark leading-relaxed">
              Nuestro compromiso es brindarte no solo un perfume, sino una experiencia sensorial completa 
              que despierte emociones y cree recuerdos inolvidables.
            </p>
          </motion.div>

          {/* Imagen - Contenedor circular modificado */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div className="relative w-96 h-96 rounded-full border-4 border-sillage-gold overflow-hidden shadow-2xl">
              <img 
                src="./sillageround.png"
                alt="Colección de perfumes premium"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sillage-dark/30 to-transparent"></div>
            </div>
            
            {/* Elemento decorativo */}
            <motion.div
              className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </motion.div>
          </motion.div>
        </div>

        {/* Valores de la empresa */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <div className="text-center bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-sillage-gold mb-2">Calidad Premium</h4>
            <p className="text-sillage-gold-dark text-sm">
              Solo trabajamos con ingredientes de la más alta calidad y procesos artesanales
            </p>
          </div>

          <div className="text-center bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-sillage-gold mb-2">Pasión por el Arte</h4>
            <p className="text-sillage-gold-dark text-sm">
              Cada fragancia es una obra de arte creada con pasión y dedicación
            </p>
          </div>

          <div className="text-center bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-sillage-gold mb-2">Experiencia Personal</h4>
            <p className="text-sillage-gold-dark text-sm">
              Atención personalizada para ayudarte a encontrar tu fragancia ideal
            </p>
          </div>

          <div className="text-center bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-sillage-gold mb-2">Exclusividad</h4>
            <p className="text-sillage-gold-dark text-sm">
              Fragancias exclusivas y ediciones limitadas que no encontrarás en otro lugar
            </p>
          </div>
        </motion.div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8">
            <h3 className="text-2xl font-display font-semibold text-sillage-gold mb-4">
              ¿Listo para descubrir tu fragancia perfecta?
            </h3>
            <p className="text-sillage-gold-dark mb-6 max-w-2xl mx-auto">
              Nuestro equipo de expertos está aquí para guiarte en un viaje sensorial único. 
              Cada cliente merece una experiencia de compra excepcional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Contactar Experto
              </button>
              <button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-all duration-300">
                Ver Nuestra Historia
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;