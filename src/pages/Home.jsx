
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

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Obtener productos destacados usando la función específica
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


  // Hook para manejar la reproducción del video de fondo
  useEffect(() => {
    const video = document.querySelector('.hero-video');
    if (video) {
      // Intentar reproducir el video si el navegador lo permite
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Auto-play fue prevenido, pero esto es normal y esperado
          console.log('Video autoplay was prevented, which is normal:', error);
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
        {/* Background layer - usa el mismo fondo que el body */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          {/* Fondo para modo oscuro - mismo que el body */}
          <div className="absolute inset-0 dark:opacity-100 opacity-0 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, #3C2415 0%, #2D1810 50%, #1F0F0A 100%)' }} />
          {/* Fondo para modo claro - mismo que el body */}
          <div className="absolute inset-0 dark:opacity-0 opacity-100 transition-opacity duration-500 bg-white" />
        </div>
        
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="hero-video absolute inset-0 w-full h-full object-cover"
          style={{ pointerEvents: 'none', zIndex: 2 }}
        >
          <source src="/logo.webm" type="video/webm" />
          {/* Fallback para navegadores que no soporten el video */}
          Tu navegador no soporta videos HTML5.
        </video>
        
        {/* Decorative Coco Images - Above video */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 3 }}>
          {/* Coco Noir (left side) */}
          <div 
            className="absolute top-1/2 left-16 md:left-32 w-56 md:w-64 h-60 md:h-80 opacity-60 transform -translate-y-1/2"
            style={{
              backgroundImage: 'url(/coco2.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
            }}
          ></div>
          
          {/* Coco Eau de Parfum (right side) */}
          <div 
            className="absolute top-1/2 right-16 md:right-32 w-56 md:w-64 h-60 md:h-80 opacity-60 transform -translate-y-1/2"
            style={{
              backgroundImage: 'url(/coco.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
            }}
          ></div>
        </div>
        
        {/* Overlay para mejor legibilidad del texto - adaptativo al tema */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {/* Overlay para modo oscuro - sutil para que se vea el fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30 dark:opacity-100 opacity-0 transition-opacity duration-500" />
          {/* Overlay para modo claro - completamente transparente */}
          <div className="absolute inset-0 dark:opacity-0 opacity-0 transition-opacity duration-500" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Descubre tu
              <span className="gradient-text block">Fragancia Perfecta</span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Colección exclusiva de perfumes de lujo que definen tu personalidad única
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/productos">
                <Button size="lg" className="floating-button text-primary-foreground font-semibold px-8 py-3">
                  Explorar Colección
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button
                variant="outline"
                size="lg"
                className="glass-effect text-foreground border-border/50 hover:bg-accent/50 px-8 py-3"
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
          className="absolute top-20 left-10 text-amber-400/50"
          style={{ zIndex: 15 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles size={40} />
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 right-10 text-amber-400/50"
          style={{ zIndex: 15 }}
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Gift size={35} />
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Productos Destacados
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestras fragancias más populares y exclusivas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              // Estado de carga
              Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="perfume-card border-0 overflow-hidden">
                    <div className="aspect-square overflow-hidden bg-gray-700/50 animate-pulse">
                      <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-yellow-400/60 animate-spin" />
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
              // Productos disponibles - reordenar para poner el de nombre más largo al centro
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
                        src={product.image_url || "https://images.unsplash.com/photo-1635865165118-917ed9e20936"}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1635865165118-917ed9e20936";
                        }}
                      />
                    </div>
                    
                    <CardContent className="p-6 bg-card">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-foreground pr-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-muted-foreground text-sm font-medium">{product.rating || 4.5}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">
                        {product.brand || 'Marca Premium'}
                      </p>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </p>
                        <Link to={`/producto/${product.id}`}>
                          <Button variant="outline" className="glass-effect border-border/50 text-foreground hover:bg-accent/50">
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
              // No hay productos disponibles
              <div className="col-span-3 text-center py-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="glass-effect w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-yellow-50 mb-2">
                    No hay productos destacados disponibles
                  </h3>
                  <p className="text-yellow-100/80 mb-6">
                    Pronto tendremos nuevas fragancias exclusivas para ti
                  </p>
                  <Link to="/productos">
                    <Button className="floating-button text-primary-foreground">
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
              <div className="glass-effect w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Fragancias Exclusivas
              </h3>
              <p className="text-muted-foreground">
                Perfumes únicos creados por los mejores perfumistas del mundo
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="glass-effect w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Envío Gratuito
              </h3>
              <p className="text-muted-foreground">
                Entrega gratuita en compras superiores a $50
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <div className="glass-effect w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Calidad Premium
              </h3>
              <p className="text-muted-foreground">
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
