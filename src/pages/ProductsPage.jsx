
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Filter, Search, ShoppingCart as ShoppingCartIcon } from 'lucide-react';

const ProductsPage = () => {
  const { toast } = useToast();

  const handleNotImplemented = (feature) => {
    toast({
      title: `🚧 ¡${feature} en camino!`,
      description: `La función de ${feature.toLowerCase()} estará lista pronto. ¡Gracias por esperar! 🚀`,
      variant: "default",
    });
  };
  
  const products = [
    { 
      id: 1, 
      name: "Eau de Mystique", 
      brand: "Chanel", 
      price: "120€", 
      originalPrice: "160€",
      discount: "25%",
      rating: 4.8,
      reviews: 234,
      stock: 3,
      isNew: false,
      isBestseller: true,
      imageAlt: "Elegante botella de Eau de Mystique", 
      description: "Una fragancia enigmática y seductora para noches inolvidables." 
    },
    { 
      id: 2, 
      name: "Citrus Bloom", 
      brand: "Dior", 
      price: "95€", 
      originalPrice: "110€",
      discount: "14%",
      rating: 4.6,
      reviews: 189,
      stock: 8,
      isNew: true,
      isBestseller: false,
      imageAlt: "Botella refrescante de Citrus Bloom", 
      description: "Un estallido de cítricos frescos y flores vibrantes, perfecto para el día." 
    },
    { 
      id: 3, 
      name: "Velvet Oud", 
      brand: "Tom Ford", 
      price: "250€", 
      originalPrice: "290€",
      discount: "14%",
      rating: 4.9,
      reviews: 156,
      stock: 2,
      isNew: false,
      isBestseller: true,
      imageAlt: "Lujosa botella de Velvet Oud", 
      description: "Opulento y misterioso, con notas ricas de oud y especias exóticas." 
    },
    { 
      id: 4, 
      name: "Aqua Breeze", 
      brand: "Armani", 
      price: "80€", 
      originalPrice: "95€",
      discount: "16%",
      rating: 4.4,
      reviews: 298,
      stock: 12,
      isNew: false,
      isBestseller: false,
      imageAlt: "Botella minimalista de Aqua Breeze", 
      description: "Una brisa marina capturada en una botella, fresca y revitalizante." 
    },
  ];

  return (
    <>
      <Helmet>
        <title>Nuestros Perfumes - PerfumeParadise</title>
        <meta name="description" content="Explora nuestra exclusiva colección de perfumes de lujo. Encuentra tu aroma ideal entre una variedad de fragancias para hombre y mujer." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-8"
      >
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-foreground">
            Descubre Nuestros Perfumes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Una selección curada de las fragancias más exquisitas del mundo, esperando ser descubiertas por ti.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 p-4 bg-slate-800/50 rounded-lg shadow-md">
          <div className="relative w-full md:w-1/2">
            <input 
              type="text" 
              placeholder="Buscar perfumes..." 
              className="w-full bg-slate-700/60 border border-slate-600 text-white placeholder-gray-400 focus:ring-pink-500 focus:border-pink-500 rounded-lg py-2.5 pl-10 pr-4 transition-colors"
              onChange={() => handleNotImplemented("Búsqueda de productos")}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button onClick={() => handleNotImplemented("Filtros")} variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-slate-900 w-full md:w-auto">
            <Filter className="mr-2 h-5 w-5" />
            Filtros
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <img  alt="Icono de caja de perfume vacía" class="w-32 h-32 mx-auto mb-4 text-gray-500" src="https://images.unsplash.com/photo-1637054235856-429a094805f9" />
            <p className="text-2xl text-gray-500">Aún no hay perfumes cargados.</p>
            <p className="text-gray-600">¡Vuelve pronto o contacta al administrador!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-slate-800/70 rounded-xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 ease-out relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ boxShadow: "0 10px 20px rgba(236, 72, 153, 0.2), 0 6px 6px rgba(192, 132, 252, 0.2)" }}
              >
                {/* Badges superiores */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  {product.isNew && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">NUEVO</span>
                  )}
                  {product.isBestseller && (
                    <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">BESTSELLER</span>
                  )}
                  {product.discount && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">-{product.discount}</span>
                  )}
                </div>
                
                {/* Indicador de stock bajo */}
                {product.stock <= 3 && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-red-600/90 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                      ¡Solo {product.stock} disponibles!
                    </span>
                  </div>
                )}
                
                <div className="p-1 bg-gradient-to-r from-primary/80 to-primary/60">
                  <img  
                    alt={product.imageAlt} 
                    className="w-full h-64 object-cover"
                    src="https://images.unsplash.com/photo-1670538528394-18075d01726a" />
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold text-foreground mb-1">{product.name}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                  
                  {/* Rating y reviews */}
                  <div className="flex items-center mb-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating) ? "text-amber-400" : "text-muted-foreground/30"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-muted-foreground text-sm">({product.reviews})</span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">{product.description}</p>
                  
                  {/* Precios */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-semibold text-primary">{product.price}</p>
                      {product.originalPrice && (
                        <p className="text-lg text-muted-foreground/70 line-through">{product.originalPrice}</p>
                      )}
                    </div>
                    {product.originalPrice && (
                      <p className="text-sm text-primary/80">¡Ahorras {(parseFloat(product.originalPrice.replace('€', '')) - parseFloat(product.price.replace('€', ''))).toFixed(0)}€!</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/60 text-primary-foreground font-medium flex-1"
                      onClick={() => handleNotImplemented("Añadir al carrito")}
                    >
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      Añadir al carrito
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-primary border-primary/50 hover:bg-primary/10 hover:text-primary"
                      onClick={() => handleNotImplemented("Ver detalles")}
                    >
                      Detalles
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ProductsPage;
  