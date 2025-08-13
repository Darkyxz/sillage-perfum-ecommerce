import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Heart, ShoppingCart, ArrowLeft, Plus, Minus, Loader2, ChevronDown, ChevronUp, Clock, Truck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { toast } from '@/components/ui/use-toast';
import { productService } from '@/lib/productService';

const ProductDetail = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [allVariants, setAllVariants] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Detectar si es un producto Home Spray
  const isHomeSpray = sku?.startsWith('ZHS-') || product?.category === 'Hogar';

  // Scroll to top al cambiar de producto
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [sku]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        if (!sku || sku.trim() === '') {
          console.error('SKU inválido:', sku);
          toast({
            title: "Error",
            description: "SKU de producto inválido",
            variant: "destructive",
          });
          navigate('/productos');
          return;
        }

        // Obtener el producto específico por SKU
        const productData = await productService.getProductBySku(sku);

        if (!productData) {
          toast({
            title: "Producto no encontrado",
            description: `No se encontró el producto con SKU: ${sku}`,
            variant: "destructive",
          });
          navigate('/productos');
          return;
        }

        // Extraer SKU base para buscar variantes
        const baseSKU = sku.replace(/-\d+ML$/i, '');

        // Buscar todas las variantes del mismo producto
        const response = await productService.getAllProducts(1, 500);
        const variants = response.products.filter(p =>
          p.sku.replace(/-\d+ML$/i, '') === baseSKU
        );

        // Ordenar variantes por tamaño
        const sortedVariants = variants.sort((a, b) => {
          const sizeOrder = { '30ml': 1, '50ml': 2, '100ml': 3 };
          return sizeOrder[a.size] - sizeOrder[b.size];
        });

        // Procesar y asignar las notas olfativas correctamente desde la base de datos
        const parseNotesArray = (field) => {
          if (Array.isArray(field)) return field;
          if (typeof field === 'string' && field.trim().startsWith('[')) {
            try {
              return JSON.parse(field);
            } catch {
              return [];
            }
          }
          return [];
        };

        const processedProduct = {
          ...productData,
          images: productData.image_url ? [productData.image_url] : [
            "https://images.unsplash.com/photo-1595872018818-97555653a011"
          ],
          notes: {
            top: parseNotesArray(productData.fragrance_profile),
            middle: parseNotesArray(productData.fragrance_notes_middle),
            base: parseNotesArray(productData.fragrance_notes_base)
          },
          fragrance_profile: parseNotesArray(productData.fragrance_profile),
          fragrance_notes_middle: parseNotesArray(productData.fragrance_notes_middle),
          fragrance_notes_base: parseNotesArray(productData.fragrance_notes_base),
          rating: productData.rating || 4.5,
          reviews: productData.reviews || Math.floor(Math.random() * 50) + 15,
          longDescription: productData.description || "Descripción detallada no disponible.",
          duration: productData.duration || "6-8 horas",
          originalInspiration: productData.original_inspiration || "",
          stock_quantity: productData.stock_quantity || 50,
          in_stock: productData.in_stock !== undefined ? productData.in_stock : true
        };

        setAllVariants(sortedVariants);
        setProduct(processedProduct);
        setSelectedProduct(processedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar el producto",
          variant: "destructive",
        });
        navigate('/productos');
      } finally {
        setLoading(false);
      }
    };

    if (sku) {
      fetchProduct();
    }
  }, [sku, navigate]);

  // Función para manejar el cambio de tamaño
  const handleSizeChange = (updatedProduct, newSize) => {
    // Buscar la variante correspondiente al nuevo tamaño
    const newVariant = allVariants.find(variant => variant.size === newSize);

    if (newVariant && newVariant.sku !== sku) {
      // Navegar a la nueva URL
      navigate(`/productos/${newVariant.sku}`);
    }
  };

  const handleAddToCart = () => {
    const currentProduct = selectedProduct || product;

    if (!currentProduct.in_stock) {
      toast({
        title: "Producto agotado",
        description: "Este producto no está disponible en este momento",
        variant: "destructive",
      });
      return;
    }

    const productToAdd = isHomeSpray ? {
      ...currentProduct,
      price: 7500,
      size: '200ml'
    } : currentProduct;

    addToCart(productToAdd, quantity);
    toast({
      title: "¡Agregado al carrito!",
      description: `${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${currentProduct.name} - ${currentProduct.size} agregada${quantity === 1 ? '' : 's'} al carrito`,
    });
  };

  const handleQuantityChange = (change) => {
    const currentProduct = selectedProduct || product;
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (currentProduct?.stock_quantity || 50)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <div className="text-muted-foreground text-xl">Cargando producto...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-foreground text-xl mb-4">Producto no encontrado</div>
          <Link to="/productos">
            <Button className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold transition-all duration-300">
              Volver a productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>{product.name} - {product.brand} | Sillage-Perfum</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/productos"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a productos
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square overflow-hidden rounded-xl glass-effect">
                <img
                  alt={`${product.name} - Vista principal`}
                  className="w-full h-full object-cover"
                  src={product.image_url || "https://images.unsplash.com/photo-1595872018818-97555653a011"}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1595872018818-97555653a011";
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg transition-all ${selectedImage === index
                      ? 'ring-2 ring-primary/50'
                      : 'opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img
                      alt={`${product.name} - Vista ${index + 1}`}
                      className="w-full h-full object-cover"
                      src={image}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1595872018818-97555653a011";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Inspiration Badge */}
            {product.originalInspiration && (
              <div className="inline-block">
                <span className="bg-sillage-gold text-black text-xs font-medium px-3 py-1 rounded-full">
                  Inspirado en {product.originalInspiration.split(' - ')[0]}
                </span>
              </div>
            )}

            {/* Brand */}
            <div>
              <h2 className="text-2xl font-bold text-foreground">{product.brand}</h2>
            </div>

            {/* Product Name */}
            <h1 className="text-xl md:text-2xl font-display font-bold text-sillage-gold-dark leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-3xl font-bold text-mute-foreground">
              {isHomeSpray ? '$7.500' : (selectedProduct?.price ? `$${Math.round(selectedProduct.price).toLocaleString('es-CL')}` : '$0')}
            </div>
            <p className="text-sm text-muted-foreground">
              Valor Incluye IVA.
            </p>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Productos en stock</span>
            </div>

            {/* Golden Divider */}
            <div className="border-t border-sillage-gold-dark my-6"></div>

            {/* Size Selection with Button Style */}
            {isHomeSpray ? (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Tamaño</label>
                <div className="bg-sillage-gold/10 rounded-lg p-4 border border-sillage-gold/30">
                  <p className="text-sm font-medium text-foreground mb-1">Tamaño único</p>
                  <p className="text-lg font-bold text-sillage-gold-dark">200ml</p>
                  <p className="text-sm text-muted-foreground mt-1">$7.500</p>
                </div>
              </div>
            ) : (
              allVariants.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Tamaño</label>
                  <div className="flex items-center gap-3">
                    {allVariants.map((variant) => (
                      <button
                        key={variant.size}
                        onClick={() => handleSizeChange(null, variant.size)}
                        className={`px-4 py-2 rounded-lg border transition-all ${variant.sku === sku
                          ? 'bg-sillage-gold text-white border-sillage-gold'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-sillage-gold'
                          }`}
                      >
                        <div className="text-sm font-medium">{variant.size}</div>
                        <div className="text-xs">${variant.price ? Math.round(variant.price).toLocaleString('es-CL') : '0'}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Cantidad</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10 border-border hover:border-sillage-gold-dark"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-foreground font-medium text-lg w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (selectedProduct?.stock_quantity || product.stock_quantity)}
                  className="h-10 w-10 border-border hover:border-sillage-gold-dark"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Golden Divider */}
            <div className="border-t border-sillage-gold-dark my-6"></div>

            {/* Collapsible Notes Section */}
            <div className="space-y-4">
              <button
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                className="w-full flex items-center justify-between py-3 text-left"
              >
                <span className="text-lg font-medium text-foreground">Notas principales</span>
                {isNotesOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {isNotesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Fragrance Profile - Dynamic */}
                  {product.fragrance_profile && product.fragrance_profile.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {product.fragrance_profile.map((profileId) => {
                        // Mapear IDs a información visual
                        const profileMap = {
                          'fresh_spicy': { emoji: '🌿', label: 'Fresco especiado', color: 'bg-amber-100 text-amber-800' },
                          'amber': { emoji: '🌰', label: 'Ámbar', color: 'bg-amber-100 text-amber-800' },
                          'citrus': { emoji: '🍋', label: 'Cítrico', color: 'bg-green-100 text-green-800' },
                          'aromatic': { emoji: '🌸', label: 'Aromático', color: 'bg-purple-100 text-purple-800' },
                          'musky': { emoji: '🧊', label: 'Almizclado', color: 'bg-blue-100 text-blue-800' },
                          'woody': { emoji: '🌳', label: 'Amaderado', color: 'bg-brown-100 text-brown-800' },
                          'floral': { emoji: '🌺', label: 'Floral', color: 'bg-pink-100 text-pink-800' },
                          'oriental': { emoji: '🌙', label: 'Oriental', color: 'bg-indigo-100 text-indigo-800' }
                        };

                        const profile = profileMap[profileId];
                        if (!profile) return null;

                        return (
                          <span key={profileId} className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${profile.color}`}>
                            {profile.emoji} {profile.label}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    // Fallback para productos sin perfil definido
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                        Fresco especiado
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                        Ámbar
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Cítrico
                      </span>
                    </div>
                  )}

                  {/* Notes Details */}
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-foreground">Notas olfativas:</span>
                    </div>
                    <div className="ml-4 space-y-2">
                      <div>
                        <span className="text-muted-foreground">- Notas de salida:</span>
                        <span className="ml-2 text-foreground">
                          {product.notes.top.length > 0 ? product.notes.top.join(', ') : 'bergamota de Calabria, pimienta'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">- Notas de corazón:</span>
                        <span className="ml-2 text-foreground">
                          {product.notes.middle.length > 0 ? product.notes.middle.join(', ') : 'pimienta de Sichuan, lavanda, pimienta rosa, vetiver, pachulí, geranio, elemi'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">- Notas de fondo:</span>
                        <span className="ml-2 text-foreground">
                          {product.notes.base.length > 0 ? product.notes.base.join(', ') : 'ambroxan, cedro, ládano'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Golden Divider */}
            <div className="border-t border-sillage-gold-dark my-6"></div>

            {/* Collapsible Details Section */}
            <div className="space-y-4">
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="w-full flex items-center justify-between py-3 text-left"
              >
                <span className="text-lg font-medium text-foreground">Detalles</span>
                {isDetailsOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {isDetailsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 text-sm"
                >
                  {/* <div>
                    <h4 className="font-medium text-foreground mb-2">
                      {product.originalInspiration ? `Inspirado en ${product.originalInspiration.split(' - ')[0]}` : 'Fragancia Premium'}
                    </h4>
                  </div>*/}
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Descripción general:</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description || product.longDescription || 'Una fragancia audaz y sofisticada, diseñada para el hombre moderno que busca dejar una impresión duradera. Con un aroma fresco y especiado, este perfume ofrece una intensidad equilibrada que se adapta tanto a eventos formales como a encuentros casuales. Inspirado en la naturaleza salvaje, refleja una personalidad segura y carismática.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <span className="text-muted-foreground">SKU:</span>
                      <p className="text-foreground font-medium">{product.sku}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Concentración:</span>
                      <p className="text-foreground font-medium">{product.concentration || 'Eau de Parfum'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duración:</span>
                      <p className="text-foreground font-medium">{product.duration}</p>
                    </div>
                    {/* <div>
                      <span className="text-muted-foreground">Categoría:</span>
                      <p className="text-foreground font-medium capitalize">
                        {product.category === 'women' ? 'Femenino' : product.category === 'men' ? 'Masculino' : 'Unisex'}
                      </p>
                    </div>*/}
                  </div>
                </motion.div>
              )}
            </div>


            {/* 
            <div className="space-y-4">
              <button
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                className="w-full flex items-center justify-between py-3 text-left"
              >
                <span className="text-lg font-medium text-foreground">Notas olfativas</span>
                {isNotesOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {isNotesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 text-sm"
                >
                   Mostrar cada sección solo si hay datos, igual que detalles 
                  {((Array.isArray(product.fragrance_profile) && product.fragrance_profile.length > 0) ||
                    (Array.isArray(product.fragrance_notes_middle) && product.fragrance_notes_middle.length > 0) ||
                    (Array.isArray(product.fragrance_notes_base) && product.fragrance_notes_base.length > 0)) ? (
                    <>
                      {Array.isArray(product.fragrance_profile) && product.fragrance_profile.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Notas de Salida:</h4>
                          <p className="text-muted-foreground leading-relaxed">{product.fragrance_profile.join(', ')}</p>
                        </div>
                      )}
                      {Array.isArray(product.fragrance_notes_middle) && product.fragrance_notes_middle.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Notas de Corazón:</h4>
                          <p className="text-muted-foreground leading-relaxed">{product.fragrance_notes_middle.join(', ')}</p>
                        </div>
                      )}
                      {Array.isArray(product.fragrance_notes_base) && product.fragrance_notes_base.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Notas de Base:</h4>
                          <p className="text-muted-foreground leading-relaxed">{product.fragrance_notes_base.join(', ')}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">No hay notas olfativas registradas para este producto.</p>
                  )}
                </motion.div>
              )}
            </div>

             Collapsible Details Section 
            <div className="space-y-4">
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="w-full flex items-center justify-between py-3 text-left"
              >
                <span className="text-lg font-medium text-foreground">Detalles</span>
                {isDetailsOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {isDetailsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 text-sm"
                >
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      {product.originalInspiration ? `Inspirado en ${product.originalInspiration.split(' - ')[0]}` : 'Fragancia Premium'}
                    </h4>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Descripción general:</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description || product.longDescription || 'Una fragancia audaz y sofisticada, diseñada para el hombre moderno que busca dejar una impresión duradera.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <span className="text-muted-foreground">SKU:</span>
                      <p className="text-foreground font-medium">{selectedProduct?.sku || product.sku}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duración:</span>
                      <p className="text-foreground font-medium">{product.duration}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
             este codigo funciona con la base de datos a segun
            */}
            {/* Add to Cart and Favorites */}
            <div className="flex space-x-4 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={!(selectedProduct?.in_stock ?? product.in_stock)}
                className="flex-1 bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold py-3 disabled:opacity-50 transition-all duration-300"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Agregar al Carrito
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={`p-3 transition-all duration-200 ${isFavorite(product.id)
                  ? 'bg-destructive/80 border-destructive text-white hover:bg-destructive/90'
                  : 'border-sillage-gold-dark text-foreground hover:bg-sillage-gold/10'
                  }`}
                onClick={() => toggleFavorite(product)}
              >
                <Heart className={`h-5 w-5 transition-colors ${isFavorite(product.id) ? 'fill-current' : ''
                  }`} />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 