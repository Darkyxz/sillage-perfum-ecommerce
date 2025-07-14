import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Star, Heart, ShoppingCart, ArrowLeft, Plus, Minus, Loader2 } from 'lucide-react';
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
  const { addToCart } = useCart();
  const { toggleFavorite, isInFavorites } = useFavorites();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductBySku(sku);
        
        if (!productData) {
          toast({
            title: "Producto no encontrado",
            description: "El producto que buscas no existe",
            variant: "destructive",
          });
          navigate('/productos');
          return;
        }

        // Procesar las notas de fragancia si existen
        let notes = {
          top: [],
          middle: [],
          base: []
        };

        // Obtener información adicional basada en el SKU
        const getProductExtraInfo = (sku) => {
          const productData = zacharProducts.find(p => p.code === sku);
          return {
            notes: productData?.notes || "Notas no disponibles",
            duration: productData?.duration || "6-8 horas",
            originalInspiration: productData?.originalInspiration || ""
          };
        };

        const extraInfo = getProductExtraInfo(productData.sku);

        if (extraInfo.notes && extraInfo.notes !== "Notas no disponibles") {
          // Las notas vienen como string separado por comas
          const notesArray = extraInfo.notes.split(', ');
          // Distribuir las notas en las tres categorías
          notes = {
            top: notesArray.slice(0, Math.ceil(notesArray.length / 3)),
            middle: notesArray.slice(Math.ceil(notesArray.length / 3), Math.ceil(2 * notesArray.length / 3)),
            base: notesArray.slice(Math.ceil(2 * notesArray.length / 3))
          };
        } else if (productData.notes) {
          // Las notas vienen como string separado por comas
          const notesArray = productData.notes.split(', ');
          // Distribuir las notas en las tres categorías
          notes = {
            top: notesArray.slice(0, Math.ceil(notesArray.length / 3)),
            middle: notesArray.slice(Math.ceil(notesArray.length / 3), Math.ceil(2 * notesArray.length / 3)),
            base: notesArray.slice(Math.ceil(2 * notesArray.length / 3))
          };
        } else if (productData.fragrance_notes) {
          try {
            notes = JSON.parse(productData.fragrance_notes);
          } catch (e) {
            // Si no se puede parsear, usar valores por defecto
            notes = {
              top: productData.fragrance_notes?.top || [],
              middle: productData.fragrance_notes?.middle || [],
              base: productData.fragrance_notes?.base || []
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
          rating: productData.rating || 4.5,
          reviews: productData.reviews || Math.floor(Math.random() * 50) + 15,
          sku: productData.sku || `SKU-${productData.id}`,
          size: productData.size || "100ml",
          concentration: productData.concentration || "Eau de Parfum",
          longDescription: productData.description || "Descripción detallada no disponible.",
          duration: extraInfo.duration,
          originalInspiration: extraInfo.originalInspiration,
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
                    className={`aspect-square overflow-hidden rounded-lg transition-all ${
                      selectedImage === index
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
            {/* Brand and Rating */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-lg">{product.brand}</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="text-foreground font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground/80">({product.reviews} reseñas)</span>
              </div>
            </div>

            <h1 className="text-4xl font-display font-bold text-foreground mb-2">
              {product.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              {product.brand || 'Zachary Perfumes'}
            </p>
            {product.originalInspiration && (
              <p className="text-sm text-muted-foreground/80 mb-4 italic">
                Inspirado en {product.originalInspiration}
              </p>
            )}
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {product.description || 'Una fragancia exclusiva de alta calidad que combina las mejores notas para crear una experiencia olfativa única.'}
            </p>

            {/* Price */}
            <div className="text-3xl font-bold text-primary mb-4">
              ${product.price?.toLocaleString('es-CL') || '0'} CLP
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.longDescription}
            </p>

            {/* Fragrance Notes */}
            <Card className="glass-effect border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-foreground font-semibold mb-4">Notas de Fragancia</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-muted-foreground text-sm">Notas de Salida:</span>
                    <p className="text-foreground">{product.notes.top.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Notas de Corazón:</span>
                    <p className="text-foreground">{product.notes.middle.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Notas de Base:</span>
                    <p className="text-foreground">{product.notes.base.join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-foreground font-medium">Cantidad:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="glass-effect border-primary/30 text-foreground hover:bg-accent/15"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-foreground font-semibold text-lg w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity}
                    className="glass-effect border-primary/30 text-foreground hover:bg-accent/15"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-muted-foreground text-sm">
                  ({product.stock_quantity} disponibles)
                </span>
              </div>

              <div className="flex space-x-4">
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
                  className={`glass-effect p-3 transition-all duration-200 ${
                    isInFavorites(product.id)
                      ? 'bg-destructive/80 border-destructive text-white hover:bg-destructive/90'
                      : 'border-primary/30 text-foreground hover:bg-accent/15'
                  }`}
                  onClick={() => toggleFavorite(product)}
                >
                  <Heart className={`h-5 w-5 transition-colors ${
                    isInFavorites(product.id) ? 'fill-current' : ''
                  }`} />
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Card className="glass-effect border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-foreground font-semibold mb-4">Detalles del Producto</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground text-sm">SKU:</span>
                    <p className="text-foreground">{product.sku}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Categoría:</span>
                    <p className="text-foreground capitalize">{product.category === 'women' ? 'Femenino' : product.category === 'men' ? 'Masculino' : 'Unisex'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Tamaño:</span>
                    <p className="text-foreground">{product.size}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Concentración:</span>
                    <p className="text-foreground">{product.concentration}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Duración:</span>
                    <p className="text-foreground">{product.duration}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Stock:</span>
                    <p className="text-foreground">{product.stock_quantity} unidades</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;