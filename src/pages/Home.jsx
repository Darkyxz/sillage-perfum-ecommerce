import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight, Star, Sparkles, Gift, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { productService } from '@/lib/productService';
import Testimonials from '@/components/Testimonials';
import About from '@/components/About';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await productService.getFeaturedProducts(3);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos destacados",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const video = document.querySelector('.hero-video');
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Video autoplay was prevented:', error);
        });
      }
    }
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Sillage-Perfum - Perfumes Premium de Lujo</title>
        <meta name="description" content="Descubre nuestra exclusiva colección de perfumes de lujo. Fragancias únicas que definen tu personalidad y estilo." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layer */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <div className="absolute inset-0 bg-background" />
        </div>

        {/* Background image behind text - Desktop */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center" style={{ zIndex: 1 }}>
          <img
            src="/sillap-2.png"
            alt="Background perfume desktop"
            className="w-auto h-[500px] lg:h-[700px] xl:h-[900px] object-contain opacity-60"
            style={{ filter: 'none', backdropFilter: 'none' }}
          />
        </div>

        {/* Background image behind text - Mobile */}
        <div className="absolute inset-0 flex items-center justify-center md:hidden" style={{ zIndex: 1 }}>
          <img
            src="/sillap-3.png"
            alt="Background perfume mobile"
            className="w-auto h-64 xs:h-72 sm:h-80 object-contain opacity-60"
            style={{ filter: 'none', backdropFilter: 'none' }}
          />
        </div>

        {/* Video reposicionado más arriba y a la izquierda */}
        <motion.div
          className="absolute left-1 top-1" // Ajustado más arriba (top-24) y más a la izquierda (left-4)
          style={{
            zIndex: 2,
            width: '400px',
            height: '400px',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="hero-video w-full h-full object-contain rounded-lg"
          >
            <source src="/logo.webm" type="video/webm" />
            Tu navegador no soporta videos HTML5.
          </video>
        </motion.div>

        {/* Contenido del hero centrado */}
        <div className="container mx-auto px-4 text-center relative" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-display font-bold text-sillage-gold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Descubre tu
              <span className="block font-bold drop-shadow-lg" style={{
                background: 'linear-gradient(135deg, #f0c674, #DAA520, #c4965a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '2px 2px 4px rgba(218, 165, 32, 0.3)'
              }}>
                Fragancia Perfecta
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-sillage-gold-dark mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Colección exclusiva de perfumes de lujo que definen tu personalidad única
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/productos">
                <Button size="lg" className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Explorar Colección
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="border-sillage-gold text-sillage-gold-dark hover:bg-sillage-gold hover:text-white transition-all duration-300 px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => {
                  toast({
                    title: "Catálogo",
                    description: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
                  });
                }}
              >
                Ver Catálogo
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 text-sillage-gold/60"
          style={{ zIndex: 15 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles size={40} />
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-10 text-sillage-gold/60"
          style={{ zIndex: 15 }}
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Gift size={35} />
        </motion.div>
      </section>

      {/* About Section */}
      <About />

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-sillage-gold mb-4">
              Productos Destacados
            </h2>
            <p className="text-xl text-sillage-gold-dark max-w-2xl mx-auto">
              Descubre nuestras fragancias más populares y exclusivas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="perfume-card border-0 overflow-hidden">
                    <div className="aspect-square overflow-hidden bg-muted/50 animate-pulse">
                      <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-primary/60 animate-spin" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <div className="h-6 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
                        <div className="h-8 bg-muted rounded animate-pulse w-1/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : featuredProducts.length > 0 ? (
              (() => {
                const sortedProducts = [...featuredProducts];
                const longestNameProduct = sortedProducts.reduce((longest, current) =>
                  current.name.length > longest.name.length ? current : longest
                );
                const otherProducts = sortedProducts.filter(p => p.id !== longestNameProduct.id);
                const middleIndex = Math.floor(otherProducts.length / 2);
                const reorderedProducts = [
                  ...otherProducts.slice(0, middleIndex),
                  longestNameProduct,
                  ...otherProducts.slice(middleIndex)
                ];
                return reorderedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <Card className="perfume-card border-0 overflow-hidden group cursor-pointer">
                      <div className="aspect-square overflow-hidden">
                        <img
                          alt={`Perfume ${product.name}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={product.image_url || "./sillap-3.png"}
                          onError={(e) => {
                            e.target.src = "./sillap-3.png";
                          }}
                        />
                      </div>

                      <CardContent className="p-6 bg-card">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-sillage-gold pr-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <Star className="h-4 w-4 fill-sillage-gold text-sillage-gold" />
                            <span className="text-sillage-gold-dark text-sm font-medium">{product.rating || 4.5}</span>
                          </div>
                        </div>
                        <p className="text-sillage-gold-dark text-sm mb-4">
                          {product.brand || 'Marca Premium'}
                        </p>

                        <div className="mt-4 flex justify-between items-center">
                          <p className="text-2xl font-bold text-sillage-gold-dark">
                            {formatPrice(product.price)}
                          </p>
                          <Link to={`/productos/${product.sku}`}>
                            <Button variant="outline" className="border-sillage-gold text-sillage-gold-dark hover:bg-sillage-gold hover:text-white transition-all duration-300">
                              Ver Detalles
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ));
              })()
            ) : (
              <div className="col-span-3 text-center py-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="glass-effect w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-sillage-gold mb-2">
                    No hay productos destacados disponibles
                  </h3>
                  <p className="text-sillage-gold-dark mb-6">
                    Pronto tendremos nuevas fragancias exclusivas para ti
                  </p>
                  <Link to="/productos">
                    <Button className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      Ver Todos los Productos
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="bg-sillage-gold/10 border border-sillage-gold/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-sillage-gold" />
              </div>
              <h3 className="text-xl font-semibold text-sillage-gold mb-2">
                Fragancias Exclusivas
              </h3>
              <p className="text-sillage-gold-dark">
                Perfumes únicos creados por los mejores perfumistas del mundo
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-sillage-gold/10 border border-sillage-gold/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-sillage-gold" />
              </div>
              <h3 className="text-xl font-semibold text-sillage-gold mb-2">
                Envío Gratuito
              </h3>
              <p className="text-sillage-gold-dark">
                Entrega gratuita en compras superiores a $50
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-sillage-gold/10 border border-sillage-gold/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-sillage-gold" />
              </div>
              <h3 className="text-xl font-semibold text-sillage-gold mb-2">
                Calidad Premium
              </h3>
              <p className="text-sillage-gold-dark">
                Solo los mejores ingredientes y procesos de fabricación
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;