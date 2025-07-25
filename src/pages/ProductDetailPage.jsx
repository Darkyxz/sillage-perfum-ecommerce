import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Star, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "✨ ¡Añadido al carrito! (Simulado)",
      description: `El perfume (ID: ${id}) ha sido añadido a tu carrito. Esta es una simulación por ahora. 🚀`,
      variant: "default",
    });
  };
  
  const product = { // Datos de ejemplo, se cargarán desde la API/localStorage más adelante
    id: id,
    name: "Aura Magnifique",
    brand: "Maison de Luxe",
    price: "185€",
    description: "Una fragancia opulenta y radiante que evoca la elegancia atemporal. Con notas de salida de bergamota y pimienta rosa, un corazón floral de jazmín y rosa de Damasco, y un fondo cálido de sándalo, vainilla y ámbar. Perfecto para ocasiones especiales o para sentirte extraordinario cada día.",
    rating: 4.8,
    reviews: 127,
    sizes: ["30ml", "50ml", "100ml"],
    availability: "En Stock",
    imageAlt: "Lujosa botella del perfume Aura Magnifique sobre un fondo de seda"
  };


  return (
    <>
      <Helmet>
        <title>{product.name} por {product.brand} - PerfumeParadise</title>
        <meta name="description" content={`Descubre los detalles de ${product.name}, una fragancia exclusiva de ${product.brand}. ${product.description.substring(0,150)}...`} />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-8"
      >
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
            <ChevronLeft className="mr-1 h-5 w-5" />
            Volver a todos los perfumes
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.div 
            className="bg-accent/70 p-2 rounded-xl shadow-2xl border border-border"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img  
              alt={product.imageAlt} 
              class="w-full h-auto object-cover rounded-lg aspect-square"
             src="https://images.unsplash.com/photo-1670538528394-18075d01726a" />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <p className="text-sm text-primary uppercase tracking-wider mb-1">{product.brand}</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-sillage-gold-warm to-primary">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center text-primary">
                {[...Array(Math.floor(product.rating))].map((_, i) => <Star key={i} fill="currentColor" className="h-5 w-5" />)}
                {product.rating % 1 !== 0 && <Star fill="currentColor" className="h-5 w-5 opacity-50" />} 
                {[...Array(5 - Math.ceil(product.rating))].map((_, i) => <Star key={i} className="h-5 w-5 text-muted-foreground" />)}
              </div>
              <span className="ml-2 text-muted-foreground text-sm">({product.reviews} reseñas)</span>
            </div>

            <p className="text-3xl font-semibold text-green-500 mb-6">{product.price}</p>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Descripción:</h2>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Tamaños Disponibles:</h2>
              <div className="flex space-x-2">
                {product.sizes.map(size => (
                  <Button key={size} variant="outline" className="border-border text-muted-foreground hover:bg-accent hover:text-foreground" onClick={() => toast({title: `Seleccionado: ${size}`, description:"Funcionalidad de selección de tamaño en desarrollo."})}>
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className={`text-lg ${product.availability === "En Stock" ? "text-green-500" : "text-red-500"}`}>
                {product.availability}
              </p>
              {product.availability === "En Stock" && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-orange-500">
                    <span className="mr-2">⚡</span>
                    <span className="text-sm">Solo quedan 3 unidades - ¡Últimas disponibles!</span>
                  </div>
                  <div className="flex items-center text-blue-500">
                    <span className="mr-2">🚚</span>
                    <span className="text-sm">Envío gratis en 24-48h si compras antes de las 18:00</span>
                  </div>
                  <div className="flex items-center text-primary">
                    <span className="mr-2">🎁</span>
                    <span className="text-sm">Incluye muestra gratis de otra fragancia</span>
                  </div>
                </div>
              )}
            </div>

            <Button 
              size="lg" 
              className="w-full md:w-auto bg-gradient-to-r from-primary to-sillage-gold hover:from-primary/90 hover:to-sillage-gold/90 text-white font-semibold text-lg px-10 py-6 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-3 h-6 w-6" />
              Añadir al Carrito
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductDetailPage;