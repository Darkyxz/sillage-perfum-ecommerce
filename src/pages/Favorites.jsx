import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import FavoriteButton from '@/components/ui/FavoriteButton';

const Favorites = () => {
  const { favorites, loading, error, loadFavorites, favoritesCount } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Mis Favoritos
            </h1>
            <p className="text-gray-600 mb-8">
              Inicia sesión para ver y gestionar tus productos favoritos
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <span className="ml-3 text-gray-600">Cargando favoritos...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center text-gray-600 hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a productos
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Heart className="w-8 h-8 text-red-500 mr-3 fill-current" />
                Mis Favoritos
              </h1>
              <p className="text-gray-600 mt-2">
                {favoritesCount > 0
                  ? `${favoritesCount} producto${favoritesCount !== 1 ? 's' : ''} favorito${favoritesCount !== 1 ? 's' : ''}`
                  : 'No tienes productos favoritos'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && favorites.length === 0 && (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No tienes favoritos aún
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explora nuestros productos y agrega tus perfumes favoritos para encontrarlos fácilmente más tarde.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Explorar Productos
            </Link>
          </div>
        )}

        {/* Products grid */}
        {favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image_url || '/placeholder-perfume.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder-perfume.jpg';
                      }}
                    />
                  </Link>

                  {/* Favorite button */}
                  <div className="absolute top-3 right-3">
                    <FavoriteButton
                      product={product}
                      size="md"
                      variant="default"
                    />
                  </div>

                  {/* Stock status */}
                  {!product.in_stock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Agotado</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {product.brand}
                    </Link>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="hover:text-gray-700 transition-colors"
                    >
                      {product.name}
                    </Link>
                  </h3>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.rating})
                      </span>
                    </div>
                  )}

                  {/* Size and concentration */}
                  {(product.size || product.concentration) && (
                    <p className="text-sm text-gray-600 mb-2">
                      {product.size && `${product.size}ml`}
                      {product.size && product.concentration && ' • '}
                      {product.concentration}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.in_stock}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.in_stock ? 'Agregar' : 'Agotado'}
                    </button>

                    <Link
                      to={`/product/${product.id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue shopping */}
        {favorites.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;