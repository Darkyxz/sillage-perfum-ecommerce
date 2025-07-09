
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Filter, Star, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { toast } from '@/components/ui/use-toast';
import { productService } from '@/lib/productService';
import { QuantityDialog } from '@/components/QuantityDialog';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const { addToCart } = useCart();
  const { toggleFavorite, isInFavorites } = useFavorites();

  // Cargar productos desde Supabase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error al cargar productos",
        description: "No se pudieron cargar los productos. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  useEffect(() => {
    const filterProducts = async () => {
      try {
        const filtered = await productService.searchProducts(
          searchTerm, 
          selectedCategory, 
          priceRange
        );
        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error filtering products:', error);
      }
    };

    filterProducts();
  }, [searchTerm, selectedCategory, priceRange]);

  const handleAddToCart = (product, quantity) => {
    if (!product.in_stock) {
      toast({
        title: "Producto agotado",
        description: "Este producto no está disponible en este momento",
        variant: "destructive",
      });
      return;
    }
    addToCart(product, quantity);
    toast({
      title: "¡Producto añadido!",
      description: `${quantity} x ${product.name} se ha añadido al carrito.`,
    });
  };

  const openQuantityDialog = (product) => {
    setSelectedProduct(product);
    setIsQuantityDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <Helmet>
          <title>Productos - Essence Luxe</title>
          <meta name="description" content="Explora nuestra exclusiva colección de perfumes de lujo." />
        </Helmet>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-amber-600 dark:text-amber-400 mx-auto mb-4" />
              <p className="text-amber-800 dark:text-amber-100/80">Cargando productos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>Nuestra Colección - Sillage-Perfum</title>
        <meta name="description" content="Explora nuestra completa colección de perfumes premium. Encuentra tu fragancia perfecta." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-amber-900 dark:text-amber-50 mb-4">
            Nuestra Colección
          </h1>
          <p className="text-amber-800 dark:text-amber-100/80 text-lg">
            Descubre fragancias únicas que cuentan historias
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="glass-effect border-amber-400/20 sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Filter className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                  <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-50">Filtros</h2>
                </div>

                {/* Búsqueda */}
                <div className="mb-6">
                  <label className="text-amber-800 dark:text-amber-100/80 text-sm font-medium mb-3 block">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600/70 dark:text-amber-400/50" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar productos..."
                      className="pl-10 glass-effect border-amber-400/30 text-amber-900 dark:text-amber-50 placeholder:text-amber-700 dark:placeholder:text-amber-100/50"
                    />
                  </div>
                </div>

                {/* Filtro de Categoría */}
                <div className="mb-6">
                  <label className="text-amber-800 dark:text-amber-100/80 text-sm font-medium mb-3 block">
                    Categoría
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Todos' },
                      { value: 'men', label: 'Hombres' },
                      { value: 'women', label: 'Mujeres' },
                      { value: 'unisex', label: 'Unisex' }
                    ].map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.value
                            ? 'bg-amber-400/20 text-amber-900 dark:text-amber-50'
                            : 'text-amber-700 dark:text-amber-100/70 hover:bg-amber-400/10 hover:text-amber-900 dark:hover:text-amber-50'
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtro de Precio */}
                <div className="mb-6">
                  <label className="text-amber-800 dark:text-amber-100/80 text-sm font-medium mb-3 block">
                    Precio
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Todos los precios' },
                      { value: 'under50', label: 'Menos de $50' },
                      { value: '50to100', label: '$50 - $100' },
                      { value: 'over100', label: 'Más de $100' }
                    ].map((price) => (
                      <button
                        key={price.value}
                        onClick={() => setPriceRange(price.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          priceRange === price.value
                            ? 'bg-amber-400/20 text-amber-900 dark:text-amber-50'
                            : 'text-amber-700 dark:text-amber-100/70 hover:bg-amber-400/10 hover:text-amber-900 dark:hover:text-amber-50'
                        }`}
                      >
                        {price.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Grid de Productos */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-amber-800 dark:text-amber-100/80">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-amber-800 dark:text-amber-100/80 text-lg">
                  No se encontraron productos que coincidan con tus filtros.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {(() => {
                  const sortedProducts = [...filteredProducts];
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-effect border-amber-400/20 group hover:border-amber-400/40 transition-all duration-300 h-full flex flex-col">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <div className="aspect-square bg-gradient-to-br from-amber-900/20 to-amber-900/20 flex items-center justify-center">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-amber-800 dark:text-amber-100/50 text-center p-8">
                              <p>Sin imagen</p>
                            </div>
                          )}
                        </div>
                        
                        <button
                          className={`absolute top-3 right-3 p-2 rounded-full glass-effect opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                            isInFavorites(product.id) 
                              ? 'bg-red-500/80 hover:bg-red-600/80' 
                              : 'hover:bg-amber-400/20'
                          }`}
                          onClick={() => toggleFavorite(product)}
                        >
                          <Heart className={`h-5 w-5 transition-colors ${
                            isInFavorites(product.id) 
                              ? 'text-white fill-current' 
                              : 'text-amber-100/80 hover:text-amber-50'
                          }`} />
                        </button>
                      </div>

                      <CardContent className="p-4 flex flex-col flex-grow">
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-amber-700 dark:text-amber-100/70 text-sm mb-2">
                            {product.brand || 'Marca Premium'}
                          </p>
                          <p className="text-amber-600 dark:text-amber-100/60 text-xs mb-4 line-clamp-2">
                            {product.description || 'Fragancia exclusiva de alta calidad'}
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-amber-400/20">
                          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                            ${product.price?.toLocaleString('es-CL') || '0'} CLP
                          </p>
                          <div className="flex items-center space-x-2">
                            <Link to={`/productos/${product.id}`} className="flex-1">
                              <Button variant="outline" className="w-full glass-effect border-amber-400/30 text-amber-800 dark:text-amber-50 hover:bg-amber-400/10">Ver Detalles</Button>
                            </Link>
                            <Button size="icon" className="floating-button text-black" onClick={() => openQuantityDialog(product)}>
                              <ShoppingCart className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
      <QuantityDialog 
        open={isQuantityDialogOpen}
        onOpenChange={setIsQuantityDialogOpen}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Products;
