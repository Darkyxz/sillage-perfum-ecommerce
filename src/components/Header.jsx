
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
      className="glass-effect sticky top-0 z-50 border-b border-yellow-400/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-display font-bold text-yellow-900 dark:text-yellow-400">
              Sillage-Perfum
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-yellow-800 hover:text-yellow-900 dark:text-yellow-100/80 dark:hover:text-yellow-50 transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className="text-yellow-800 hover:text-yellow-900 dark:text-yellow-100/80 dark:hover:text-yellow-50 transition-colors font-medium"
            >
              Productos
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-yellow-800 hover:text-yellow-900 dark:text-yellow-100/80 dark:hover:text-yellow-50 transition-colors font-medium"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="text-yellow-800 hover:text-yellow-900 hover:bg-yellow-400/20 dark:text-yellow-100/80 dark:hover:text-yellow-50 dark:hover:bg-yellow-400/15"
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
                className="text-yellow-800 hover:text-yellow-900 hover:bg-yellow-400/20 dark:text-yellow-100/80 dark:hover:text-yellow-50 dark:hover:bg-yellow-400/15 relative"
              >
                <Heart className="h-5 w-5" />
                {getFavoritesCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
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
                className="text-yellow-800 hover:text-yellow-900 hover:bg-yellow-400/20 dark:text-yellow-100/80 dark:hover:text-yellow-50 dark:hover:bg-yellow-400/15 relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
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
                      className="w-8 h-8 rounded-full border-2 border-yellow-400/40"
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAuthAction}
                    className="text-yellow-800 hover:text-yellow-900 hover:bg-yellow-400/20 dark:text-yellow-100/80 dark:hover:text-yellow-50 dark:hover:bg-yellow-400/15"
                  >
                    Salir
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAuthAction}
                  className="text-yellow-800 hover:text-yellow-900 hover:bg-yellow-400/20 dark:text-yellow-100/80 dark:hover:text-yellow-50 dark:hover:bg-yellow-400/15"
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-yellow-800 hover:text-yellow-900 hover:bg-yellow-400/20 dark:text-yellow-100/80 dark:hover:text-yellow-50 dark:hover:bg-yellow-400/15"
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
            className="md:hidden mt-4 pt-4 border-t border-yellow-400/20"
          >
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-yellow-800 hover:text-yellow-900 dark:text-yellow-100/80 dark:hover:text-yellow-50 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/productos"
                className="text-yellow-800 hover:text-yellow-900 dark:text-yellow-100/80 dark:hover:text-yellow-50 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                to="/favoritos"
                className="text-yellow-800 hover:text-yellow-900 dark:text-yellow-100/80 dark:hover:text-yellow-50 transition-colors font-medium flex items-center"
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
                  className="text-yellow-800 hover:text-yellow-900 dark:text-yellow-100/80 dark:hover:text-yellow-50 transition-colors font-medium"
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
