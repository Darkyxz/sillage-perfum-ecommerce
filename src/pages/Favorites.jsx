import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Favorites = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleRemoveFromFavorites = (productId) => {
    removeFromFavorites(productId);
  };

  const handleClearFavorites = () => {
    clearFavorites();
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Tu lista de favoritos está vacía
              </h1>
              <p className="text-muted-foreground text-lg">
                Agrega productos a tus favoritos para verlos aquí
              </p>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/productos">
                <Button className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold px-8 py-3 transition-all duration-300">
                  Explorar productos
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="glass-effect border-border text-foreground hover:bg-accent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">
                Mis Favoritos
              </h1>
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                {favorites.length}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClearFavorites}
                className="glass-effect border-destructive text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar favoritos
              </Button>
              <Link to="/productos">
                <Button variant="outline" className="glass-effect border-border text-foreground hover:bg-accent">
                  Continuar comprando
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="perfume-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 glass-effect text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      onClick={() => handleRemoveFromFavorites(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold text-foreground mb-2">
                    {product.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mb-2">
                    {product.brand}
                  </p>
                  <p className="text-muted-foreground/80 text-sm line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${product.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {product.size}
                    </span>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold transition-all duration-300"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Agregar al carrito
                  </Button>
                  <Link to={`/productos/${product.id}`}>
                    <Button variant="outline" className="glass-effect border-border text-foreground hover:bg-accent">
                      Ver detalles
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
