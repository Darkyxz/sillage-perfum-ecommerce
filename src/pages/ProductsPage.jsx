
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Filter, Search, ShoppingCart as ShoppingCartIcon, Loader2 } from 'lucide-react';
import { productService } from '@/lib/productService';
import { useCart } from '@/contexts/CartContext';

const ProductsPage = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts(1, 50);
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error cargando productos",
        description: "No se pudieron cargar los productos. Intenta recargar la página.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast({
      title: "¡Producto agregado!",
      description: `${product.name} se agregó al carrito`,
    });
  };

  const handleNotImplemented = (feature) => {
    toast({
      title: `🚧 ¡${feature} en camino!`,
      description: `La función de ${feature.toLowerCase()} estará lista pronto. ¡Gracias por esperar! 🚀`,
      variant: "default",
    });
  };

  // Filtrar productos por categoría
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => {
      const category = product.category?.toLowerCase().trim();
      if (selectedCategory === 'men') return category === 'hombre';
      if (selectedCategory === 'women') return category === 'mujer';
      if (selectedCategory === 'unisex') return category === 'unisex';
      return false;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    );
  }


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
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="text-sm"
            >
              Todos ({products.length})
            </Button>
            <Button
              onClick={() => setSelectedCategory('women')}
              variant={selectedCategory === 'women' ? 'default' : 'outline'}
              className="text-sm"
            >
              Mujer ({products.filter(p => p.category?.toLowerCase() === 'mujer').length})
            </Button>
            <Button
              onClick={() => setSelectedCategory('men')}
              variant={selectedCategory === 'men' ? 'default' : 'outline'}
              className="text-sm"
            >
              Hombre ({products.filter(p => p.category?.toLowerCase() === 'hombre').length})
            </Button>
            <Button
              onClick={() => setSelectedCategory('unisex')}
              variant={selectedCategory === 'unisex' ? 'default' : 'outline'}
              className="text-sm"
            >
              Unisex ({products.filter(p => p.category?.toLowerCase() === 'unisex').length})
            </Button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <img alt="Icono de caja de perfume vacía" class="w-32 h-32 mx-auto mb-4 text-gray-500" src="https://images.unsplash.com/photo-1637054235856-429a094805f9" />
            <p className="text-2xl text-gray-500">
              {products.length === 0 ? 'Aún no hay perfumes cargados.' : 'No hay productos en esta categoría.'}
            </p>
            <p className="text-gray-600">
              {products.length === 0 ? '¡Vuelve pronto o contacta al administrador!' : 'Prueba con otra categoría.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
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
                  {product.is_featured && (
                    <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">DESTACADO</span>
                  )}
                  {product.rating >= 4.5 && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">TOP RATED</span>
                  )}
                </div>

                {/* Indicador de stock bajo */}
                {product.stock_quantity <= 5 && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-red-600/90 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                      ¡Solo {product.stock_quantity} disponibles!
                    </span>
                  </div>
                )}

                <div className="p-1 bg-gradient-to-r from-primary/80 to-primary/60">
                  <img
                    alt={product.name}
                    className="w-full h-64 object-cover"
                    src={product.image_url || "/images/sillapH.jpg"} />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {product.name} | {product.sku}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating || 0) ? "text-amber-400" : "text-muted-foreground/30"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-muted-foreground text-sm">({product.rating || 0})</span>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 flex-grow">{product.description}</p>

                  {/* Precios */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-semibold text-primary">${product.price?.toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/60 text-primary-foreground font-medium flex-1"
                      onClick={() => handleAddToCart(product)}
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
