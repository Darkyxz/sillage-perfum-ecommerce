
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Search, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { getFavoritesCount } = useFavorites();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="relative bg-white dark:bg-amber-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-amber-700 shadow-sm overflow-hidden"
    >
      {/* Video de fondo para el header */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-15 dark:opacity-8"
        style={{ pointerEvents: 'none', zIndex: -1 }}
      >
        <source src="/logo.webm" type="video/webm" />
      </video>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-2xl font-display font-bold text-amber-800 dark:text-amber-200">
              Sillage Perfum
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-amber-600 dark:text-amber-200 dark:hover:text-amber-300 transition-colors font-medium text-sm uppercase tracking-wide"
            >
              Home
            </Link>
            <Link
              to="/productos"
              className="text-gray-700 hover:text-amber-600 dark:text-amber-200 dark:hover:text-amber-300 transition-colors font-medium text-sm uppercase tracking-wide"
            >
              Perfumes
            </Link>
            <Link
              to="/sobre-nosotros"
              className="text-gray-700 hover:text-amber-600 dark:text-amber-200 dark:hover:text-amber-300 transition-colors font-medium text-sm uppercase tracking-wide"
            >
              About
            </Link>
            <Link
              to="/contacto"
              className="text-gray-700 hover:text-amber-600 dark:text-amber-200 dark:hover:text-amber-300 transition-colors font-medium text-sm uppercase tracking-wide"
            >
              Contact
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-amber-600 dark:text-amber-200 dark:hover:text-amber-300 transition-colors font-medium text-sm uppercase tracking-wide"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:text-amber-200 dark:hover:bg-amber-800/20 transition-colors"
              onClick={() => {
                toast({
                  title: "Búsqueda",
                  description: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
                });
              }}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Wishlist */}
            <Link to="/favoritos">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:text-amber-200 dark:hover:bg-amber-800/20 transition-colors relative"
              >
                <Heart className="h-5 w-5" />
                {getFavoritesCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getFavoritesCount()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/carrito">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:text-amber-200 dark:hover:bg-amber-800/20 transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/perfil">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-amber-300"
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAuthAction}
                    className="text-gray-600 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:text-amber-200 dark:hover:bg-amber-800/20 transition-colors text-sm"
                  >
                    Salir
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAuthAction}
                  className="text-gray-600 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:text-amber-200 dark:hover:bg-amber-800/20 transition-colors"
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:text-amber-200 dark:hover:bg-amber-800/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-amber-700"
          >
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-amber-600 dark:text-amber-200 dark:hover:text-amber-300 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/productos"
                className="text-gray-700 hover:text-amber-600 dark:text-amber-200 dark:hover:text-amber-300 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                to="/favoritos"
                className="text-gray-700 hover:text-amber-600 dark:text-amber-200 dark:hover:text-amber-300 transition-colors font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
                {getFavoritesCount() > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getFavoritesCount()}
                  </span>
                )}
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-amber-600 dark:text-amber-200 dark:hover:text-amber-300 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
