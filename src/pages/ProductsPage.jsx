
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Search, ShoppingCart as ShoppingCartIcon, Loader2 } from 'lucide-react';
import { productService } from '@/lib/productService';
import { useCart } from '@/contexts/CartContext';
import ProductSizeSelector from '@/components/ProductSizeSelector';
import { QuantityDialog } from '@/components/QuantityDialog';
import { formatPrice } from '@/utils/formatPrice';

const ProductsPage = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);

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

  // Agrupar productos por SKU base para el selector dinámico
  const groupProductsByBaseSKU = (products) => {
    const grouped = {};

    products.forEach(product => {
      // Extraer SKU base (ej: ZP42H-30ML -> ZP42H)
      const baseSKU = product.sku.replace(/-\d+ML$/i, '');

      if (!grouped[baseSKU]) {
        grouped[baseSKU] = {
          ...product,
          baseSKU,
          variants: [product],
          availableSizes: [product.size]
        };
      } else {
        grouped[baseSKU].variants.push(product);
        if (!grouped[baseSKU].availableSizes.includes(product.size)) {
          grouped[baseSKU].availableSizes.push(product.size);
        }
      }
    });

    // Ordenar tamaños disponibles
    Object.values(grouped).forEach(group => {
      group.availableSizes.sort((a, b) => {
        const sizeOrder = { '30ml': 1, '50ml': 2, '100ml': 3 };
        return sizeOrder[a] - sizeOrder[b];
      });
    });

    return Object.values(grouped);
  };

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    toast({
      title: "¡Producto agregado!",
      description: `${quantity} x ${product.name} (${product.size}) se agregó al carrito`,
    });
  };

  const openQuantityDialog = (product) => {
    setSelectedProduct(product);
    setIsQuantityDialogOpen(true);
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

  // Agrupar productos filtrados por SKU base
  const groupedProducts = groupProductsByBaseSKU(filteredProducts);

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

        {groupedProducts.length === 0 ? (
          <div className="text-center py-12">
            <img alt="Icono de caja de perfume vacía" className="w-32 h-32 mx-auto mb-4 text-gray-500" src="https://images.unsplash.com/photo-1637054235856-429a094805f9" />
            <p className="text-2xl text-gray-500">
              {products.length === 0 ? 'Aún no hay perfumes cargados.' : 'No hay productos en esta categoría.'}
            </p>
            <p className="text-gray-600">
              {products.length === 0 ? '¡Vuelve pronto o contacta al administrador!' : 'Prueba con otra categoría.'}
            </p>
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <p className="text-muted-foreground text-center">
                {groupedProducts.length} fragancia{groupedProducts.length !== 1 ? 's' : ''} únicas disponibles •
                Cada una en múltiples tamaños con precios fijos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedProducts.map((productGroup, index) => {
                const [selectedProduct, setSelectedProduct] = React.useState(
                  productGroup.variants.find(v => v.size === '50ml') || productGroup.variants[0]
                );

                const handleSizeChange = (updatedProduct) => {
                  setSelectedProduct(updatedProduct);
                };

                return (
                  <motion.div
                    key={productGroup.baseSKU}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Badges superiores */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      {productGroup.is_featured && (
                        <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                          DESTACADO
                        </span>
                      )}
                      {productGroup.rating >= 4.5 && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                          TOP RATED
                        </span>
                      )}
                    </div>

                    {/* Imagen del producto */}
                    <div className="relative aspect-square bg-gradient-to-br from-sillage-gold/10 to-transparent">
                      <img
                        alt={productGroup.name}
                        className="w-full h-full object-cover"
                        src={productGroup.image_url || "/images/sillapH.jpg"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Contenido del producto */}
                    <div className="p-6 space-y-4">
                      {/* Información básica */}
                      <div>
                        <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-2">
                          {productGroup.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {productGroup.brand}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          SKU Base: {productGroup.baseSKU}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(productGroup.rating || 0) ? "text-amber-400" : "text-muted-foreground/30"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-muted-foreground text-sm">({productGroup.rating || 0})</span>
                      </div>

                      {/* Descripción */}
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {productGroup.description}
                      </p>

                      {/* Selector de tamaño compacto */}
                      <ProductSizeSelector
                        baseProduct={productGroup}
                        allSizes={productGroup.availableSizes}
                        selectedSize={selectedProduct?.size}
                        onSizeChange={handleSizeChange}
                        variant="compact"
                        className="my-3"
                      />

                      {/* Información del producto seleccionado */}
                      <div className="bg-sillage-gold/5 rounded-lg p-3 border border-sillage-gold/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {selectedProduct?.size} seleccionado
                            </p>
                            <p className="text-xs text-muted-foreground">
                              SKU: {selectedProduct?.sku}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-sillage-gold-dark">
                              {formatPrice(
                                productGroup.category === 'Home Spray' || productGroup.category_name === 'Home Spray'
                                  ? 7500
                                  : selectedProduct?.price
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-medium transition-all duration-300"
                          onClick={() => openQuantityDialog(selectedProduct)}
                        >
                          <ShoppingCartIcon className="h-4 w-4 mr-2" />
                          Agregar al Carrito
                        </Button>
                        <Button
                          variant="outline"
                          className="border-sillage-gold/30 text-sillage-gold-dark hover:bg-sillage-gold/10 hover:border-sillage-gold transition-all duration-300"
                          onClick={() => handleNotImplemented("Ver detalles")}
                        >
                          Detalles
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* QuantityDialog */}
      <QuantityDialog
        open={isQuantityDialogOpen}
        onOpenChange={setIsQuantityDialogOpen}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default ProductsPage;
