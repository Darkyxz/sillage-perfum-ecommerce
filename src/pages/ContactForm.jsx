import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://formspree.io/f/ventas@sillageperfum.cl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Mensaje enviado con éxito');
        setFormData({
          name: '',
          lastName: '',
          email: '',
          message: ''
        });
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (error) {
      alert('Error al enviar el mensaje: ' + error.message);
    }
  };

  return (
    <section id="contact-section" className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-14 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-sillage-gold mb-4 md:mb-6">
            Contáctenos
          </h2>
          <p className="text-lg md:text-xl text-sillage-gold-dark max-w-2xl mx-auto leading-relaxed">
            ¿Tienes preguntas sobre nuestros productos? Déjanos tus datos y nos comunicaremos contigo a la brevedad.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-center">
          {/* Imagen circular - tamaño aumentado */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center order-last lg:order-first"
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border-4 border-sillage-gold overflow-hidden shadow-xl">
              <img
                src="./sillageround.jpg"
                alt="Sillage Perfum Spa"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sillage-dark/30 to-transparent"></div>
            </div>
          </motion.div>

          {/* Formulario de contacto (se mantiene igual que antes) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-lg"
          >
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-sillage-gold mb-3">
                Completa el formulario
              </h3>
              <p className="text-sillage-gold-dark text-sm sm:text-base">
                Describe tu consulta con detalle para que podamos ayudarte de la mejor manera posible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-sillage-gold-dark mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-border rounded-lg focus:ring-2 focus:ring-sillage-gold focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-sillage-gold-dark mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-border rounded-lg focus:ring-2 focus:ring-sillage-gold focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-sillage-gold-dark mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-border rounded-lg focus:ring-2 focus:ring-sillage-gold focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-sillage-gold-dark mb-1">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-border rounded-lg focus:ring-2 focus:ring-sillage-gold focus:border-transparent"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-medium text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-3 rounded-lg shadow hover:shadow-md transform hover:scale-[1.02] transition-all duration-300 w-full"
              >
                Enviar Mensaje
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-sillage-gold-dark">ventas@sillageperfum.cl</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-sillage-gold-dark">+56 973749375</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;