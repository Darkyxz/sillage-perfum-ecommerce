
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Testimonials from '@/components/Testimonials';

const HomePage = () => {
  const { toast } = useToast();

  const handleFeatureNotImplemented = (featureName) => {
    toast({
      title: "🚧 ¡Función en desarrollo!",
      description: `La característica "${featureName}" aún no está implementada, ¡pero estará lista pronto! 🚀`,
      variant: "default",
    });
  };

  return (
    <>
      <Helmet>
        <title>PerfumeParadise - Tu Destino de Fragancias Exquisitas</title>
        <meta name="description" content="Descubre una colección curada de los perfumes más finos y lujosos en PerfumeParadise. Encuentra tu aroma perfecto hoy." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center py-12 md:py-20"
      >
        <motion.div
          className="inline-block p-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mb-8"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={48} className="text-white bg-slate-800 rounded-full p-2" />
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Perfumes de Lujo
          </span>
          <br />
          <span className="text-gray-800 dark:text-white text-4xl md:text-5xl">
            Hasta 40% OFF
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-6">
          ✨ <strong>Envío GRATIS</strong> en compras sobre $50.000 • 🎁 <strong>Regalo exclusivo</strong> en tu primera compra
        </p>
        <div className="bg-red-600/20 border border-red-500 rounded-lg p-4 max-w-md mx-auto mb-8">
          <p className="text-red-700 dark:text-red-300 font-semibold">⏰ Oferta limitada: Solo quedan 3 días</p>
          <p className="text-sm text-red-600 dark:text-red-200">Más de 500 clientes ya aprovecharon esta oferta</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          <Link to="/products">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold text-lg px-8 py-6 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <ShoppingBag className="mr-3 h-6 w-6" />
              Explorar Colección
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => handleFeatureNotImplemented("Únete a la Exclusividad")}
            className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-slate-900 font-semibold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Únete a la Exclusividad
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div 
            className="bg-slate-800/70 p-6 rounded-xl shadow-2xl border border-slate-700"
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(236, 72, 153, 0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => handleFeatureNotImplemented("Fragancias Únicas")}
          >
            <h2 className="text-2xl font-semibold text-pink-400 mb-3">Fragancias Únicas</h2>
            <p className="text-gray-400">Selección artesanal de perfumes de nicho y diseñador.</p>
            <img  alt="Botella de perfume elegante sobre fondo oscuro" className="w-full h-48 object-cover rounded-lg mt-4 opacity-70" src="https://images.unsplash.com/photo-1684762870187-47219389c8f7" />
          </motion.div>
          <motion.div 
            className="bg-slate-800/70 p-6 rounded-xl shadow-2xl border border-slate-700"
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(192, 132, 252, 0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => handleFeatureNotImplemented("Calidad Garantizada")}
          >
            <h2 className="text-2xl font-semibold text-purple-400 mb-3">Calidad Garantizada</h2>
            <p className="text-gray-400">Solo productos 100% auténticos y de la más alta calidad.</p>
            <img  alt="Sello de autenticidad dorado sobre textura de seda" className="w-full h-48 object-cover rounded-lg mt-4 opacity-70" src="https://images.unsplash.com/photo-1646834423037-a0201579bdb5" />
          </motion.div>
          <motion.div 
            className="bg-slate-800/70 p-6 rounded-xl shadow-2xl border border-slate-700"
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(248, 113, 113, 0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => handleFeatureNotImplemented("Envío Rápido y Seguro")}
          >
            <h2 className="text-2xl font-semibold text-red-400 mb-3">Envío Rápido y Seguro</h2>
            <p className="text-gray-400">Recibe tus fragancias favoritas en la puerta de tu casa.</p>
            <img  alt="Paquete de envío elegante con lazo de seda" className="w-full h-48 object-cover rounded-lg mt-4 opacity-70" src="https://images.unsplash.com/photo-1665768885401-353ee9a5f6fd" />
          </motion.div>
        </div>
        
        {/* Testimonials Section */}
        <Testimonials />
      </motion.div>
    </>
  );
};

export default HomePage;
  