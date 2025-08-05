import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, Star, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { toast } from '@/components/ui/use-toast';
import { productService } from '@/lib/productService';
import { QuantityDialog } from '@/components/QuantityDialog';
import { ProductSkeletonGrid } from '@/components/ProductSkeleton';


const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Cargar productos desde MySQL con paginación
  useEffect(() => {
    loadProducts(true);
  }, []);

  const loadProducts = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }

      const pageToLoad = reset ? 1 : currentPage + 1;
      const result = await productService.getAllProducts(pageToLoad, 48); // Aumentamos a 48 para obtener más fragancias únicas

      if (reset) {
        setProducts(result.products);
      } else {
        setProducts(prev => [...prev, ...result.products]);
        setCurrentPage(pageToLoad);
      }

      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);

    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error al cargar productos",
        description: "No se pudieron cargar los productos. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Cargar más productos (infinite scroll)
  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      loadProducts(false);
    }
  };

  // Filtrar productos localmente (más rápido)
  useEffect(() => {
    let filtered = [...products];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory && selectedCategory !== 'all') {
      const categoryMap = {
        'men': 'Hombre',
        'women': 'Mujer',
        'unisex': 'Unisex',
        'home': 'Hogar',
        'body': 'Body Mist'
      };
      filtered = filtered.filter(product => product.category === categoryMap[selectedCategory]);
    }

    // Agrupar productos por fragancia base (SKU sin tamaño)
    const groupedProducts = {};
    filtered.forEach(product => {
      const baseSKU = product.sku.replace(/-\d+ML$/i, '');
      if (!groupedProducts[baseSKU]) {
        groupedProducts[baseSKU] = {
          ...product,
          baseSKU,
          variants: [product],
          availableSizes: [product.size]
        };
      } else {
        groupedProducts[baseSKU].variants.push(product);
        if (!groupedProducts[baseSKU].availableSizes.includes(product.size)) {
          groupedProducts[baseSKU].availableSizes.push(product.size);
        }
      }
    });

    // Convertir a array y seleccionar el producto representativo (preferir 50ml, luego 30ml, luego 100ml)
    let uniqueProducts = Object.values(groupedProducts).map(group => {
      const representative = group.variants.find(v => v.size === '50ml') ||
        group.variants.find(v => v.size === '30ml') ||
        group.variants[0];

      return {
        ...representative,
        variants: group.variants,
        availableSizes: group.availableSizes.sort((a, b) => {
          const sizeOrder = { '30ml': 1, '50ml': 2, '100ml': 3 };
          return sizeOrder[a] - sizeOrder[b];
        })
      };
    });

    // Ordenar productos
    switch (sortOption) {
      case 'price-low':
        uniqueProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        uniqueProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        uniqueProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'popular':
        uniqueProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Ordenar por SKU
        uniqueProducts.sort((a, b) => {
          const numA = parseInt(a.sku.match(/\d+/)?.[0] || '0', 10);
          const numB = parseInt(b.sku.match(/\d+/)?.[0] || '0', 10);
          return numA - numB;
        });
        break;
    }

    setFilteredProducts(uniqueProducts);
  }, [products, searchTerm, selectedCategory, sortOption]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 // Cargar cuando falten 1000px
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

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



        <div className="grid lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 order-2 lg:order-1"
          >
            <Card className="glass-effect border-sillage-gold/20 lg:sticky lg:top-24">
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
                      { value: 'unisex', label: 'Unisex' },
                      { value: 'home', label: 'Hogar' },
                      { value: 'body', label: 'Body Mist' }
                    ].map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.value
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
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${sortOption === sort.value
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
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                {searchTerm || selectedCategory !== 'all' ? ' (filtrados)' : ''}
              </p>
              {loadingMore && (
                <div className="flex items-center space-x-2 text-sillage-gold">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Cargando más...</span>
                </div>
              )}
            </div>

            {loading ? (
              <ProductSkeletonGrid count={12} />
            ) : filteredProducts.length === 0 ? (
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
              <>
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
                        <Card className="glass-effect border-sillage-gold/20 hover:border-sillage-gold/40 transition-all duration-300 hover:shadow-2xl h-full flex flex-col rounded-xl overflow-hidden group">
                          <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <p>Sin imagen</p>
                              </div>
                            )}
                            {/* Favorite button */}
                            <button
                              className={`absolute top-3 right-3 p-2 rounded-full bg-sillage-gold/90 hover:bg-sillage-gold-bright transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 z-10`}
                              onClick={() => toggleFavorite(product)}
                            >
                              <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'text-white fill-current' : 'text-white'}`} />
                            </button>
                          </div>

                          <CardContent className="p-4 flex flex-col flex-grow">
                            <div className="flex-grow">
                              {/* Brand */}
                              <p className="text-foreground text-sm font-medium mb-2">
                                Zachary Perfumes
                              </p>

                              {/* Product Name */}
                              <h3 className="text-sm font-semibold text-sillage-gold-dark mb-2 leading-tight line-clamp-2">
                                {product.name}
                              </h3>

                              {/* Description */}
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {product.description || 'Fragancia radiante y sofisticada, que irradia confianza y elegancia. Inspirada en SOLEIL Escada, captura la esencia del sol con notas florales y afrutadas, perfecta para la mujer moderna.'}
                              </p>
                            </div>

                            <div className="mt-auto pt-3 border-t border-sillage-gold/10">
                              {/* SKU */}
                              <p className="text-gray-500 text-xs mb-2">
                                {product.sku}
                              </p>

                              {/* Price */}
                              <p className="text-2xl font-bold text-sillage-gold-dark mb-3">
                                ${product.price ? Math.round(product.price).toLocaleString('es-CL') : '0'}
                              </p>

                              {/* Buttons */}
                              <div className="flex items-center gap-2">
                                <Link to={`/productos/${product.sku}`} className="flex-1">
                                  <Button
                                    variant="outline"
                                    className="w-full border-sillage-gold/30 text-sillage-gold-dark hover:bg-sillage-gold hover:text-white transition-all duration-300 font-medium text-sm py-2"
                                  >
                                    Ver Detalles
                                  </Button>
                                </Link>
                                <Button
                                  className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white px-3 py-2"
                                  size="icon"
                                  onClick={() => openQuantityDialog(product)}
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ));
                  })()}
                </div>

                {/* Botón cargar más o skeleton de carga */}
                {hasMore && !loadingMore && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={loadMoreProducts}
                      variant="outline"
                      className="border-sillage-gold/30 text-sillage-gold-dark hover:bg-sillage-gold hover:text-white transition-all duration-300"
                    >
                      Cargar más productos
                    </Button>
                  </div>
                )}

                {loadingMore && (
                  <div className="mt-8">
                    <ProductSkeletonGrid count={6} />
                  </div>
                )}

                {!hasMore && filteredProducts.length > 0 && (
                  <div className="text-center mt-12 py-8">
                    <p className="text-muted-foreground">
                      Has visto todos los productos disponibles
                    </p>
                  </div>
                )}
              </>
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