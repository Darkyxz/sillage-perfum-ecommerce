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

// Importar datos de productos para información adicional
const zacharProducts = [
  // MUJERES
  { code: "ZP1W", name: "Noche Vibrante – Eau de Parfum almizcle floral amaderado femenino", brand: "Zachary Perfumes", category: "women", price: 1299, description: "Fragancia moderna y energética para la mujer urbana contemporánea. Inspirada en 212 de Carolina Herrera.", notes: "Bergamota, Gardenia, Sándalo", duration: "6-8 horas", originalInspiration: "212 - Carolina Herrera" },
  { code: "ZP2W", name: "Seducción Nocturna – Eau de Parfum oriental floral femenino", brand: "Zachary Perfumes", category: "women", price: 1399, description: "Seducción pura en una botella, ideal para noches especiales. Inspirada en 212 Sexy de Carolina Herrera.", notes: "Bergamota, Vainilla, Sándalo", duration: "6-8 horas", originalInspiration: "212 Sexy - Carolina Herrera" },
  { code: "ZP3W", name: "Elegancia VIP – Eau de Parfum floral frutal femenino", brand: "Zachary Perfumes", category: "women", price: 1499, description: "La esencia de la elegancia y el lujo en una fragancia única. Inspirada en 212 VIP de Carolina Herrera.", notes: "Lima, Champagne, Gardenia", duration: "6-8 horas", originalInspiration: "212 VIP - Carolina Herrera" },
  { code: "ZP4W", name: "Rosa de Lujo – Eau de Parfum floral frutal femenino", brand: "Zachary Perfumes", category: "women", price: 1599, description: "Romance y sofisticación en una fragancia floral irresistible. Inspirada en 212 VIP Rosé de Carolina Herrera.", notes: "Champagne, Rosa, Almizcle", duration: "6-8 horas", originalInspiration: "212 VIP Rosé - Carolina Herrera" },
  { code: "ZP5W", name: "Brisa Marina – Eau de Parfum acuático floral femenino", brand: "Zachary Perfumes", category: "women", price: 1699, description: "Frescura marina con un toque de elegancia mediterránea. Inspirada en Acqua di Gio de Giorgio Armani.", notes: "Limón, Jazmín, Cedro", duration: "6-8 horas", originalInspiration: "Acqua di Gio - Giorgio Armani" },
  // HOMBRES
  { code: "ZP1H", name: "Urbano Moderno – Eau de Parfum cítrico aromático masculino", brand: "Zachary Perfumes", category: "men", price: 1399, description: "Masculinidad urbana con un toque de elegancia moderna. Inspirado en 212 Men de Carolina Herrera.", notes: "Bergamota, Especias, Sándalo", duration: "6-8 horas", originalInspiration: "212 Men - Carolina Herrera" },
  { code: "ZP2H", name: "Seducción Masculina – Eau de Parfum oriental especiado masculino", brand: "Zachary Perfumes", category: "men", price: 1499, description: "Seducción masculina en su máxima expresión. Inspirado en 212 Sexy Men de Carolina Herrera.", notes: "Mandarina, Vainilla, Sándalo", duration: "6-8 horas", originalInspiration: "212 Sexy Men - Carolina Herrera" },
  // UNISEX
  { code: "ZPU1", name: "Uno Universal – Eau de Parfum cítrico aromático unisex", brand: "Zachary Perfumes", category: "unisex", price: 1349, description: "Libertad y naturalidad en una fragancia revolucionaria. Inspirado en CK One de Calvin Klein.", notes: "Limón, Cardamomo, Almizcle", duration: "5-7 horas", originalInspiration: "CK One - Calvin Klein" }
  // Agregar más según sea necesario...
];

const ProductDetail = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Validar que el SKU existe y tiene el formato correcto
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

        const productData = await productService.getProductBySku(sku);

        if (!productData) {
          console.error('Producto no encontrado para SKU:', sku);
          toast({
            title: "Producto no encontrado",
            description: `No se encontró el producto con SKU: ${sku}`,
            variant: "destructive",
          });
          navigate('/productos');
          return;
        }

        // Procesar las notas de fragancia desde la base de datos
        let notes = {
          top: [],
          middle: [],
          base: []
        };

        let fragranceProfile = [];

        // Obtener información adicional basada en el SKU (fallback para productos antiguos)
        const getProductExtraInfo = (sku) => {
          const productData = zacharProducts.find(p => p.code === sku);
          return {
            notes: productData?.notes || "Notas no disponibles",
            duration: productData?.duration || "6-8 horas",
            originalInspiration: productData?.originalInspiration || ""
          };
        };

        const extraInfo = getProductExtraInfo(productData.sku);

        // Procesar perfil de fragancia desde la base de datos
        if (productData.fragrance_profile) {
          try {
            fragranceProfile = typeof productData.fragrance_profile === 'string'
              ? JSON.parse(productData.fragrance_profile)
              : productData.fragrance_profile;
          } catch (e) {
            console.warn('Error parsing fragrance_profile JSON:', e);
            fragranceProfile = [];
          }
        }

        // Procesar notas olfativas desde la base de datos
        if (productData.fragrance_notes_top) {
          try {
            notes.top = typeof productData.fragrance_notes_top === 'string'
              ? JSON.parse(productData.fragrance_notes_top)
              : productData.fragrance_notes_top;
          } catch (e) {
            console.warn('Error parsing fragrance_notes_top JSON:', e);
            notes.top = [];
          }
        }

        if (productData.fragrance_notes_middle) {
          try {
            notes.middle = typeof productData.fragrance_notes_middle === 'string'
              ? JSON.parse(productData.fragrance_notes_middle)
              : productData.fragrance_notes_middle;
          } catch (e) {
            console.warn('Error parsing fragrance_notes_middle JSON:', e);
            notes.middle = [];
          }
        }

        if (productData.fragrance_notes_base) {
          try {
            notes.base = typeof productData.fragrance_notes_base === 'string'
              ? JSON.parse(productData.fragrance_notes_base)
              : productData.fragrance_notes_base;
          } catch (e) {
            console.warn('Error parsing fragrance_notes_base JSON:', e);
            notes.base = [];
          }
        }

        // Fallback si no hay notas en la base de datos
        if (notes.top.length === 0 && notes.middle.length === 0 && notes.base.length === 0) {
          if (extraInfo.notes && extraInfo.notes !== "Notas no disponibles") {
            const notesArray = extraInfo.notes.split(', ');
            notes = {
              top: notesArray.slice(0, Math.ceil(notesArray.length / 3)),
              middle: notesArray.slice(Math.ceil(notesArray.length / 3), Math.ceil(2 * notesArray.length / 3)),
              base: notesArray.slice(Math.ceil(2 * notesArray.length / 3))
            };
          } else if (productData.notes) {
            const notesArray = productData.notes.split(', ');
            notes = {
              top: notesArray.slice(0, Math.ceil(notesArray.length / 3)),
              middle: notesArray.slice(Math.ceil(notesArray.length / 3), Math.ceil(2 * notesArray.length / 3)),
              base: notesArray.slice(Math.ceil(2 * notesArray.length / 3))
            };
          }
        }

        // Crear array de imágenes
        const images = productData.image_url ? [productData.image_url] : [
          "https://images.unsplash.com/photo-1595872018818-97555653a011"
        ];

        const processedProduct = {
          ...productData,
          images,
          notes,
          fragrance_profile: fragranceProfile,
          rating: productData.rating || 4.5,
          reviews: productData.reviews || Math.floor(Math.random() * 50) + 15,
          sku: productData.sku || `SKU-${productData.id}`,
          size: productData.size || "100ml",
          concentration: productData.concentration || "Eau de Parfum",
          longDescription: productData.description || "Descripción detallada no disponible.",
          duration: productData.duration || extraInfo.duration,
          originalInspiration: productData.original_inspiration || extraInfo.originalInspiration,
          // Valores por defecto para campos que pueden no existir
          stock_quantity: productData.stock_quantity || 0,
          in_stock: productData.in_stock !== undefined ? productData.in_stock : true
        };

        setProduct(processedProduct);
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

  const handleAddToCart = () => {
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
      title: "¡Agregado al carrito!",
      description: `${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${product.name} agregada${quantity === 1 ? '' : 's'} al carrito`,
    });
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product?.stock_quantity) {
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
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">
              {product.name} | {product.sku}
            </h1>

            {/* Price */}
            <div className="text-3xl font-bold text-foreground">
              ${product.price?.toLocaleString('es-CL') || '0'}
            </div>
            <p className="text-sm text-muted-foreground">
              Impuesto incluido. <span className="underline cursor-pointer">gastos de envío</span> se calculan en la pantalla de pagos.
            </p>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-sillage-gold text-sillage-gold" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.reviews} reseñas
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">En stock, listo para enviar</span>
            </div>

            {/* Shipping Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>RM De 2 a 4 días hábiles, por $4.000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>regiones De 3 a 10 días hábiles, por $5.000</span>
              </div>
            </div>

            {/* Golden Divider */}
            <div className="border-t border-sillage-gold-dark my-6"></div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Tamaño: {selectedSize}</label>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex space-x-2">
                {['30 ml', '50 ml', '100 ml'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border rounded-md transition-all ${selectedSize === size
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-foreground border-border hover:border-sillage-gold-dark'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

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
                  disabled={quantity >= product.stock_quantity}
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
                        🌿 Fresco especiado
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                        🌰 Ámbar
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        🍋 Cítrico
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
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      {product.originalInspiration ? `Inspirado en ${product.originalInspiration.split(' - ')[0]}` : 'Fragancia Premium'}
                    </h4>
                  </div>
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
                    <div>
                      <span className="text-muted-foreground">Categoría:</span>
                      <p className="text-foreground font-medium capitalize">
                        {product.category === 'women' ? 'Femenino' : product.category === 'men' ? 'Masculino' : 'Unisex'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Add to Cart and Favorites */}
            <div className="flex space-x-4 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
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