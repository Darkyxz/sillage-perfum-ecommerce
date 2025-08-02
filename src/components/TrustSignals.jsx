import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock, Star, MapPin, CreditCard } from 'lucide-react';

const TrustSignals = ({ variant = 'default' }) => {
  const signals = [
    {
      icon: Shield,
      title: "Productos de Calidad",
      description: "Perfumes auténticos garantizados",
      color: "text-green-600"
    },
    {
      icon: Truck,
      title: "Envío",
      description: "A todo Chile",
      color: "text-blue-600"
    },
    {
      icon: Clock,
      title: "Entrega Rápida",
      description: "24-48 horas en Santiago",
      color: "text-orange-600"
    },
    {
      icon: Star,
      title: "+1,150 Clientes",
      description: "Satisfechos nos recomiendan",
      color: "text-yellow-600"
    },
    {
      icon: MapPin,
      title: "Empresa Chilena",
      description: "Con sede en Chile",
      color: "text-red-600"
    },
    {
      icon: CreditCard,
      title: "Pago Seguro",
      description: "SSL + Encriptación",
      color: "text-purple-600"
    }
  ];

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap justify-center gap-4 py-4">
        {signals.slice(0, 4).map((signal, index) => {
          const Icon = signal.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-2 text-sm"
            >
              <Icon className={`h-4 w-4 ${signal.color}`} />
              <span className="font-medium text-foreground">{signal.title}</span>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            ¿Por qué elegir Sillage Perfum?
          </h2>
          <p className="text-muted-foreground">
            Tu confianza es nuestra prioridad
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-4 bg-background rounded-lg border border-border hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3`}>
                  <Icon className={`h-6 w-6 ${signal.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-1 text-sm">
                  {signal.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {signal.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Schema.org para señales de confianza */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Sillage Perfum",
            "description": "Tienda de perfumes premium con garantía de autenticidad",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Perfumes Premium",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Perfumes de Lujo"
                  }
                }
              ]
            },
            "areaServed": {
              "@type": "Country",
              "name": "Chile"
            },
            "paymentAccepted": ["Credit Card", "Debit Card", "Bank Transfer"],
            "priceRange": "$$"
          })}
        </script>
      </div>
    </section>
  );
};

export default TrustSignals;