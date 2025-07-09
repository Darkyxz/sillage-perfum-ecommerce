import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "María García",
      location: "Santiago, Chile",
      rating: 5,
      comment: "¡Increíble! El perfume llegó súper rápido y la calidad es excepcional. Exactamente como lo describían.",
      product: "Eau de Mystique",
      verified: true,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      location: "Valparaíso, Chile",
      rating: 5,
      comment: "Servicio al cliente excelente. Me ayudaron a elegir el perfume perfecto para mi esposa. ¡Muy recomendado!",
      product: "Citrus Bloom",
      verified: true,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Ana Rodríguez",
      location: "Concepción, Chile",
      rating: 5,
      comment: "La mejor tienda online de perfumes en Chile. Precios justos, envío rápido y productos auténticos.",
      product: "Velvet Oud",
      verified: true,
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c3aa?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-16 bg-yellow-900/20 dark:bg-slate-800/70 rounded-2xl my-16 border border-yellow-400/20 dark:border-slate-600/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-yellow-100/80 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Más de 2,500 clientes satisfechos confían en nosotros para sus fragancias favoritas
          </p>
          <div className="flex justify-center items-center mt-4 space-x-1">
            <span className="text-3xl font-bold text-yellow-400">4.9</span>
            <div className="flex text-yellow-400 ml-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} fill="currentColor" className="h-6 w-6" />
              ))}
            </div>
            <span className="text-yellow-200/70 dark:text-gray-400 ml-2">(2,543 reseñas)</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-yellow-900/20 dark:bg-slate-700/50 backdrop-blur-md rounded-xl p-6 border border-yellow-400/30 dark:border-slate-600/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-yellow-400/50 dark:hover:border-slate-500/60"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={`Foto de ${testimonial.name}`}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-yellow-50 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-yellow-200/70 dark:text-gray-400">{testimonial.location}</p>
                </div>
                {testimonial.verified && (
                  <div className="ml-auto">
                    <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                      ✓ Verificado
                    </span>
                  </div>
                )}
              </div>

              <div className="flex text-yellow-400 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} fill="currentColor" className="h-4 w-4" />
                ))}
              </div>

              <p className="text-yellow-100/80 dark:text-gray-300 mb-4 italic">
                "{testimonial.comment}"
              </p>

              <div className="text-sm text-yellow-400">
                Producto: <span className="font-medium">{testimonial.product}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Estadísticas de confianza */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center"
        >
          <div className="bg-yellow-900/20 dark:bg-slate-700/50 border border-yellow-400/30 dark:border-slate-600/40 rounded-lg p-4">
            <div className="text-3xl font-bold text-yellow-400">2,500+</div>
            <div className="text-yellow-100/80 dark:text-gray-300">Clientes Felices</div>
          </div>
          <div className="bg-yellow-900/20 dark:bg-slate-700/50 border border-yellow-400/30 dark:border-slate-600/40 rounded-lg p-4">
            <div className="text-3xl font-bold text-yellow-400">24h</div>
            <div className="text-yellow-100/80 dark:text-gray-300">Envío Express</div>
          </div>
          <div className="bg-yellow-900/20 dark:bg-slate-700/50 border border-yellow-400/30 dark:border-slate-600/40 rounded-lg p-4">
            <div className="text-3xl font-bold text-yellow-400">100%</div>
            <div className="text-yellow-100/80 dark:text-gray-300">Productos Auténticos</div>
          </div>
          <div className="bg-yellow-900/20 dark:bg-slate-700/50 border border-yellow-400/30 dark:border-slate-600/40 rounded-lg p-4">
            <div className="text-3xl font-bold text-yellow-400">4.9★</div>
            <div className="text-yellow-100/80 dark:text-gray-300">Calificación Promedio</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
