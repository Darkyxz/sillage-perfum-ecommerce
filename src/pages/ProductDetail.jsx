
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

const ProductDetail = () => {
  const { id } = useParams();
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
        const productData = await productService.getProductById(id);
        
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

        if (productData.fragrance_notes) {
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
          reviews: productData.reviews || 0,
          sku: productData.sku || `SKU-${productData.id}`,
          size: productData.size || "100ml",
          concentration: productData.concentration || "Eau de Parfum",
          longDescription: productData.description || "Descripción detallada no disponible.",
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

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

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
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400 mx-auto mb-4" />
          <div className="text-yellow-100 text-xl">Cargando producto...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-50 text-xl mb-4">Producto no encontrado</div>
          <Link to="/productos">
            <Button className="floating-button text-black">
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
            className="inline-flex items-center text-yellow-100/80 hover:text-yellow-50 transition-colors"
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
                        ? 'ring-2 ring-white/50'
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
              <span className="text-yellow-100/70 text-lg">{product.brand}</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-50 font-medium">{product.rating}</span>
                </div>
                <span className="text-yellow-100/60">({product.reviews} reseñas)</span>
              </div>
            </div>

            <h1 className="text-4xl font-display font-bold text-yellow-50 mb-2">
              {product.name}
            </h1>
            <p className="text-xl text-yellow-100/80 mb-4">
              {product.brand || 'Marca Premium'}
            </p>
            <p className="text-yellow-100/80 text-lg leading-relaxed mb-6">
              {product.description || 'Una fragancia exclusiva de alta calidad que combina las mejores notas para crear una experiencia olfativa única.'}
            </p>

            {/* Price */}
            <div className="text-3xl font-bold text-yellow-400 mb-4">
              ${product.price?.toLocaleString('es-CL') || '0'} CLP
            </div>

            {/* Description */}
            <p className="text-yellow-100/80 text-lg leading-relaxed">
              {product.longDescription}
            </p>

            {/* Fragrance Notes */}
            <Card className="glass-effect border-yellow-400/20">
              <CardContent className="p-6">
                <h3 className="text-yellow-50 font-semibold mb-4">Notas de Fragancia</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-yellow-100/70 text-sm">Notas de Salida:</span>
                    <p className="text-yellow-50">{product.notes.top.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-yellow-100/70 text-sm">Notas de Corazón:</span>
                    <p className="text-yellow-50">{product.notes.middle.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-yellow-100/70 text-sm">Notas de Base:</span>
                    <p className="text-yellow-50">{product.notes.base.join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-yellow-50 font-medium">Cantidad:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="glass-effect border-yellow-400/30 text-yellow-50 hover:bg-yellow-400/15"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-yellow-50 font-semibold text-lg w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity}
                    className="glass-effect border-yellow-400/30 text-yellow-50 hover:bg-yellow-400/15"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-yellow-100/70 text-sm">
                  ({product.stock_quantity} disponibles)
                </span>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className="flex-1 floating-button text-black font-semibold py-3 disabled:opacity-50"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Agregar al Carrito
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className={`glass-effect p-3 transition-all duration-200 ${
                    isInFavorites(product.id)
                      ? 'bg-red-500/80 border-red-400 text-white hover:bg-red-600/80'
                      : 'border-yellow-400/30 text-yellow-50 hover:bg-yellow-400/15'
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
            <Card className="glass-effect border-yellow-400/20">
              <CardContent className="p-6">
                <h3 className="text-yellow-50 font-semibold mb-4">Detalles del Producto</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-yellow-100/70">SKU:</span>
                    <p className="text-yellow-50">{product.sku}</p>
                  </div>
                  <div>
                    <span className="text-yellow-100/70">Categoría:</span>
                    <p className="text-yellow-50 capitalize">{product.category}</p>
                  </div>
                  <div>
                    <span className="text-yellow-100/70">Tamaño:</span>
                    <p className="text-yellow-50">{product.size}</p>
                  </div>
                  <div>
                    <span className="text-yellow-100/70">Concentración:</span>
                    <p className="text-yellow-50">{product.concentration}</p>
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
