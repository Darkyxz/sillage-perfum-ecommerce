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
  const [sortOption, setSortOption] = useState('all');
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
          sortOption
        );
        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error filtering products:', error);
      }
    };

    filterProducts();
  }, [searchTerm, selectedCategory, sortOption]);

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
              <Loader2 className="h-12 w-12 animate-spin text-sillage-gold mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando productos...</p>
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
          <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-sillage-gold via-sillage-gold-bright to-sillage-gold-dark mb-4">
            Nuestra Colección
          </h1>
          <p className="text-muted-foreground text-lg">
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
            <Card className="glass-effect border-sillage-gold/20 sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Filter className="h-5 w-5 text-sillage-gold mr-2" />
                  <h2 className="text-xl font-semibold text-sillage-gold-dark">Filtros</h2>
                </div>

                {/* Búsqueda */}
                <div className="mb-6">
                  <label className="text-muted-foreground text-sm font-medium mb-3 block">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar productos..."
                      className="pl-10 glass-effect border-sillage-gold/30 text-foreground placeholder:text-muted-foreground focus:border-sillage-gold"
                    />
                  </div>
                </div>

                {/* Filtro de Categoría */}
                <div className="mb-6">
                  <label className="text-muted-foreground text-sm font-medium mb-3 block">
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
                            ? 'bg-sillage-gold/20 text-sillage-gold-dark border border-sillage-gold/30'
                            : 'text-muted-foreground hover:bg-sillage-gold/10 hover:text-sillage-gold-dark'
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtro de Ordenamiento */}
                <div className="mb-6">
                  <label className="text-muted-foreground text-sm font-medium mb-3 block">
                    Ordenar por
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Más relevantes' },
                      { value: 'price-low', label: 'Precio: menor a mayor' },
                      { value: 'price-high', label: 'Precio: mayor a menor' },
                      { value: 'newest', label: 'Más recientes' },
                      { value: 'popular', label: 'Más populares' }
                    ].map((sort) => (
                      <button
                        key={sort.value}
                        onClick={() => setSortOption(sort.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          sortOption === sort.value
                            ? 'bg-sillage-gold/20 text-sillage-gold-dark border border-sillage-gold/30'
                            : 'text-muted-foreground hover:bg-sillage-gold/10 hover:text-sillage-gold-dark'
                        }`}
                      >
                        {sort.label}
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
              <p className="text-muted-foreground">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground text-lg">
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
                    <Card className="glass-effect border-sillage-gold/20 group hover:border-sillage-gold/40 transition-all duration-300 h-full flex flex-col">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <div className="aspect-square bg-sillage-gold/10 flex items-center justify-center">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-muted-foreground/50 text-center p-8">
                              <p>Sin imagen</p>
                            </div>
                          )}
                        </div>
                        
                        <button
                          className={`absolute top-3 right-3 p-2 rounded-full glass-effect opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                            isInFavorites(product.id) 
                              ? 'bg-sillage-gold/80 hover:bg-sillage-gold/90' 
                              : 'hover:bg-sillage-gold/20'
                          }`}
                          onClick={() => toggleFavorite(product)}
                        >
                          <Heart className={`h-5 w-5 transition-colors ${
                            isInFavorites(product.id) 
                              ? 'text-white fill-current' 
                              : 'text-sillage-gold-dark hover:text-sillage-gold'
                          }`} />
                        </button>
                      </div>

                      <CardContent className="p-4 flex flex-col flex-grow">
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {product.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            {product.brand || 'Marca Premium'}
                          </p>
                          <p className="text-muted-foreground/80 text-xs mb-4 line-clamp-2">
                            {product.description || 'Fragancia exclusiva de alta calidad'}
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-sillage-gold/20">
                          <p className="text-xl font-bold text-sillage-gold-dark">
                            ${product.price?.toLocaleString('es-CL') || '0'} CLP
                          </p>
                          <div className="flex items-center space-x-2">
                            <Link to={`/productos/${product.sku}`} className="flex-1">
                              <Button variant="outline" className="w-full border-sillage-gold/30 text-sillage-gold-dark hover:bg-sillage-gold hover:text-white transition-all duration-300">Ver Detalles</Button>
                            </Link>
                            <Button size="icon" className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white" onClick={() => openQuantityDialog(product)}>
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