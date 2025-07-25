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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-display font-bold mb-4 text-foreground">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Más de 2,500 clientes satisfechos confían en nosotros para sus fragancias favoritas
          </p>
          <div className="flex justify-center items-center mt-6 space-x-1">
            <span className="text-3xl font-bold text-foreground">4.9</span>
            <div className="flex text-primary ml-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} fill="currentColor" className="h-6 w-6" />
              ))}
            </div>
            <span className="text-muted-foreground ml-2">(2,543 reseñas)</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="testimonial-card bg-background/95 backdrop-blur-md rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 text-foreground"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={`Foto de ${testimonial.name}`}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
                {testimonial.verified && (
                  <div className="ml-auto">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full border border-primary/50 shadow-sm">
                      ✓ Verificado
                    </span>
                  </div>
                )}
              </div>

              <div className="flex text-primary mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} fill="currentColor" className="h-4 w-4" />
                ))}
              </div>

              <p className="text-muted-foreground mb-4 leading-relaxed">
                "{testimonial.comment}"
              </p>

              <div className="text-sm text-muted-foreground">
                Producto: <span className="font-medium text-foreground">{testimonial.product}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Estadísticas de confianza */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center"
        >
          <div className="bg-background/95 border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50">
            <div className="text-3xl font-bold text-foreground">2,500+</div>
            <div className="text-muted-foreground text-sm mt-1">Clientes Felices</div>
          </div>
          <div className="bg-background/95 border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50">
            <div className="text-3xl font-bold text-foreground">24h</div>
            <div className="text-muted-foreground text-sm mt-1">Envío Express</div>
          </div>
          <div className="bg-background/95 border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50">
            <div className="text-3xl font-bold text-foreground">100%</div>
            <div className="text-muted-foreground text-sm mt-1">Productos Auténticos</div>
          </div>
          <div className="bg-background/95 border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50">
            <div className="text-3xl font-bold text-foreground">4.9★</div>
            <div className="text-muted-foreground text-sm mt-1">Calificación Promedio</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
