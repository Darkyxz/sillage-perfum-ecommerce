import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, Star, Heart, ShoppingCart, Loader2, ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { productService } from '@/lib/productService';
import { toast } from '@/components/ui/use-toast';
import { QuantityDialog } from '@/components/QuantityDialog';
import { formatPrice } from '@/utils/formatPrice';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductSkeletonGrid } from '@/components/ProductSkeleton';

// Mapeo de categorías - Actualizado para MySQL
const categoryMapping = {
  'perfume-dama': {
    db: 'Mujer',
    display: 'Perfume Diseñador Dama',
    description: 'Fragancias femeninas de diseñador premium',
    seo: 'Perfumes de diseñador para mujer - Fragancias femeninas premium'
  },
  'perfume-varon': {
    db: 'Hombre',
    display: 'Perfume Diseñador Varón',
    description: 'Fragancias masculinas de diseñador premium',
    seo: 'Perfumes de diseñador para hombre - Fragancias masculinas premium'
  },
  'inspirado-nicho': {
    db: 'Nicho',
    display: 'Inspirado Nicho',
    description: 'Fragancias inspiradas en perfumes de nicho exclusivos',
    seo: 'Perfumes inspirados en nicho - Fragancias exclusivas'
  },
  'body-mist': {
    db: 'Body Mist',
    display: 'Body Mist',
    description: 'Brumas corporales refrescantes y ligeras',
    seo: 'Body mist - Brumas corporales refrescantes'
  },
  'by-zachary': {
    // Filtrar por brand en lugar de category
    filterBy: 'brand',
    db: 'Zachary Perfumes',
    display: 'By Zachary',
    description: 'Colección exclusiva de la marca Zachary',
    seo: 'Perfumes By Zachary - Colección exclusiva'
  },
  'home-spray': {
    db: 'Hogar',
    display: 'Home Spray',
    description: 'Aromatizadores para el hogar y espacios',
    seo: 'Home spray - Aromatizadores para el hogar'
  }
};

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const { addToCart } = useCart();
  // TODO: Implementar favoritos
  const toggleFavorite = (product) => {
    console.log('Toggle favorite:', product);
  };
  const isFavorite = (productId) => false;

  const categoryInfo = categoryMapping[categorySlug];

  // Cargar productos de la categoría
  useEffect(() => {
    loadCategoryProducts(true);
  }, [categorySlug]);

  // Filtrar productos cuando cambie el término de búsqueda o el ordenamiento
  useEffect(() => {
    filterProducts();
  }, [searchTerm, sortOption, products]);

  const loadCategoryProducts = async (reset = false) => {
    if (!categoryInfo) {
      setLoading(false);
      return;
    }

    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }

      const pageToLoad = reset ? 1 : currentPage + 1;

      let result;

      // Manejar filtros especiales
      if (categorySlug === 'by-zachary') {
        // Para by-zachary, obtener todos los productos y filtrar por brand
        const allProductsResult = await productService.getAllProducts(1, 500);
        const zacharyProducts = allProductsResult.products.filter(product =>
          product.brand === 'Zachary Perfumes' &&
          (product.concentration === 'Eau de Parfum' || product.sku.startsWith('ZP'))
        );

        result = {
          products: zacharyProducts,
          totalCount: zacharyProducts.length,
          currentPage: 1,
          totalPages: 1,
          hasMore: false
        };
      } else if (categorySlug === 'body-mist') {
        // Para body-mist, filtrar por concentración
        const allProductsResult = await productService.getAllProducts(1, 500);
        const bodyMistProducts = allProductsResult.products.filter(product =>
          product.concentration === 'Body Mist' || product.category === 'Body Mist'
        );

        result = {
          products: bodyMistProducts,
          totalCount: bodyMistProducts.length,
          currentPage: 1,
          totalPages: 1,
          hasMore: false
        };
      } else {
        // Para otras categorías, cargar todos los productos de la categoría
        const allProductsResult = await productService.getProductsByCategory(categoryInfo.db, 1, 500);

        result = {
          products: allProductsResult.products,
          totalCount: allProductsResult.totalCount,
          currentPage: 1,
          totalPages: 1,
          hasMore: false
        };
      }

      setProducts(result.products);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);

    } catch (error) {
      console.error('Error loading category products:', error);
      toast({
        title: "Error al cargar productos",
        description: "No se pudieron cargar los productos de esta categoría.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      loadCategoryProducts(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
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

    // Ordenar por SKU de menor a mayor
    uniqueProducts.sort((a, b) => {
      const numA = parseInt(a.sku.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.sku.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });

    // Orden extra si el usuario selecciona un sortOption distinto
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
        // Ya ordenado por SKU
        break;
    }

    setFilteredProducts(uniqueProducts);
  };

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

  // Si la categoría no existe
  if (!categoryInfo) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Categoría no encontrada</h1>
          <p className="text-gray-600 mb-8">La categoría que buscas no existe.</p>
          <Link to="/productos">
            <Button>Ver todos los productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <Helmet>
          <title>{categoryInfo.display} - Sillage Perfum</title>
          <meta name="description" content={categoryInfo.seo} />
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
        <title>{categoryInfo.display} - Sillage Perfum</title>
        <meta name="description" content={categoryInfo.seo} />
        <meta name="keywords" content={`perfumes, fragancias, ${categoryInfo.display.toLowerCase()}, sillage`} />
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Productos', href: '/productos' },
            { label: categoryInfo.display }
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <Link to="/productos" className="mr-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-sillage-gold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>

          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            {categoryInfo.display}
          </h1>
          <p className="text-muted-foreground text-lg">
            {categoryInfo.description}
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
                    Buscar en esta categoría
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
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm
                    ? `No hay productos que coincidan con "${searchTerm}" en esta categoría.`
                    : 'Esta categoría aún no tiene productos disponibles.'
                  }
                </p>
                <Link to="/productos">
                  <Button>Ver todos los productos</Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
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
                            {formatPrice(
                              categorySlug === 'home-spray' ? 7500 : product.price
                            )}
                          </p>
                          <div className="flex items-center space-x-2 mt-3">
                            <Link to={`/productos/${product.sku}`} className="flex-1">
                              <Button variant="outline" className="w-full border-sillage-gold/30 text-sillage-gold-dark hover:bg-sillage-gold hover:text-white transition-all duration-300">
                                Ver Detalles
                              </Button>
                            </Link>
                            <Button
                              size="icon"
                              className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white"
                              onClick={() => openQuantityDialog(product)}
                            >
                              <ShoppingCart className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
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

export default CategoryPage;