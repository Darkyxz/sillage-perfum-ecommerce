import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Star, Sparkles, Gift, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { productService } from '@/lib/productService';
import Testimonials from '@/components/Testimonials';
import About from '@/components/About';
import TrustSignals from '@/components/TrustSignals';

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
        <html lang="es-CL" />
        <title>Sillage Perfum Chile - Perfumes Premium de Lujo | Compra Online </title>
        <meta name="description" content="🌟 Perfumes premium de lujo en Chile. Fragancias originales para hombre y mujer.  🚚 Entrega rápida. ⭐ +2,500 clientes satisfechos." />
        <meta name="keywords" content="perfumes chile, perfumes de lujo chile, fragancias premium, comprar perfumes online chile, perfumes originales, sillage perfum" />
        <link rel="canonical" href="https://sillageperfum.cl/" />

        <meta http-equiv="content-language" content="es-CL" />
        <meta name="language" content="Spanish" />

        {/* Open Graph optimizado */}
        <meta property="og:locale" content="es_CL" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sillage Perfum" />
        <meta property="og:title" content="Sillage Perfum Chile - Perfumes Premium de Lujo" />
        <meta property="og:description" content="🌟 Perfumes premium de lujo en Chile. Fragancias originales. ✅ +2,500 clientes satisfechos." />
        <meta property="og:url" content="https://sillageperfum.cl/" />
        <meta property="og:image" content="https://sillageperfum.cl/hero.png" />

        {/* Schema.org para la página principal */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Sillage Perfum",
            "url": "https://sillageperfum.cl",
            "description": "Tienda online de perfumes premium de lujo en Chile",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://sillageperfum.cl/productos?search={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Sillage Perfum",
              "logo": {
                "@type": "ImageObject",
                "url": "https://sillageperfum.cl/images/icon.svg"
              }
            }
          })}
        </script>

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://sillageperfum.cl/"
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden mb-0">
        {/* Background layer */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <div className="absolute inset-0 bg-background" />
        </div>

        {/* Background image behind text - Desktop */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center" style={{ zIndex: 1 }}>
          <img
            src="/hero.png"
            alt="Background perfume desktop"
            className="w-auto h-[400px] lg:h-[600px] xl:h-[800px] object-contain opacity-100"
            style={{ filter: 'none', backdropFilter: 'none' }}
          />
        </div>

        {/* Background image behind text - Mobile */}
        <div className="absolute inset-0 flex items-start justify-center md:hidden" style={{ zIndex: 1 }}>
          <img
            src="/hero.png"
            alt="Background perfume mobile"
            className="w-auto h-48 xs:h-64 sm:h-72 object-contain opacity-60 mt-0"
            style={{ filter: 'none', backdropFilter: 'none' }}
          />
        </div>
        {/* Video */}
        <motion.div
          className="absolute right-2 md:right-10 top-2 md:top-5 w-16 h-16 md:w-[150px] md:h-[150px]"
          style={{
            zIndex: 2,
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


        {/* Botones posicionados al final de la imagen */}
        <div className="absolute bottom-4 md:bottom-20 left-4 right-4 sm:left-14 sm:right-auto" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              className="flex flex-row gap-2 sm:gap-4 justify-center sm:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/productos">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold px-3 py-2 sm:px-8 sm:py-3 text-xs sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="hidden sm:inline">Explorar Colección</span>
                  <span className="sm:hidden">Explorar</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-5 sm:w-5" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                className="border-sillage-gold text-sillage-gold-dark hover:bg-sillage-gold hover:text-white transition-all duration-300 px-3 py-2 sm:px-8 sm:py-3 text-xs sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => {
                  toast({
                    title: "Catálogo",
                    description: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
                  });
                }}
              >
                <span className="hidden sm:inline">Ver Catálogo</span>
                <span className="sm:hidden">Catálogo</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements - Solo dejamos el Gift */}
        <motion.div
          className="absolute bottom-4 md:bottom-20 right-4 md:right-10 text-sillage-gold/60"
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
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
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
                          src={product.image_url || "./hero.jpg"}
                          onError={(e) => {
                            e.target.src = "./hero.jpg";
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
      {/* Trust Signals <TrustSignals variant="compact" />*/}


    </div>
  );
};

export default Home;