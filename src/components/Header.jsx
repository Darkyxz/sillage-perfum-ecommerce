
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Search, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [iconError, setIconError] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { getFavoritesCount } = useFavorites();
  const navigate = useNavigate();

  // Efecto para verificar datos del usuario
  useEffect(() => {
    // Depuración: Verificar datos del usuario
    console.log('Datos del usuario:', user);
    if (user) {
      console.log('Avatar URL:', user.avatar);
      // Verificar si la URL del avatar es accesible
      if (user.avatar) {
        fetch(user.avatar, { method: 'HEAD' })
          .then(res => console.log('Estado del avatar:', res.status, res.statusText))
          .catch(err => console.error('Error al cargar el avatar:', err));
      }
    }
  }, [user]);

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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center">
              {!iconError ? (
                <img 
                  src="/icon.png" 
                  alt="Sillage Perfum" 
                  className="w-8 h-8" 
                  onError={(e) => {
                    console.error('Error loading icon:', e);
                    setIconError(true);
                  }} 
                />
              ) : (
                <Sparkles className="w-8 h-8 text-amber-600" />
              )}
            </div>
            <span className="text-2xl font-display font-bold text-foreground">
              Sillage Perfum
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide"
            >
              Home
            </Link>
            <Link
              to="/productos"
              className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide"
            >
              Perfumes
            </Link>
            <Link
              to="/sobre-nosotros"
              className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide"
            >
              About
            </Link>
            <Link
              to="/contacto"
              className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide"
            >
              Contact
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide"
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
              className="text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors"
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
                className="text-[#c4965a] hover:text-[#f0c674] hover:bg-amber-50 dark:text-[#c4965a] dark:hover:text-[#f0c674] dark:hover:bg-amber-800/20 transition-colors relative"
              >
                <Heart className="h-5 w-5" />
                {getFavoritesCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#f0c674] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
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
                className="text-[#c4965a] hover:text-[#f0c674] hover:bg-amber-50 dark:text-[#c4965a] dark:hover:text-[#f0c674] dark:hover:bg-amber-800/20 transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#f0c674] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="relative" style={{ minWidth: '36px' }}>
                    <Link to="/perfil" className="block w-9 h-9 rounded-full overflow-hidden border-2 border-amber-300 dark:border-amber-600">
                      <div className="w-full h-full flex items-center justify-center bg-amber-100 dark:bg-amber-900">
                        {user.email ? (
                          <span className="font-medium text-primary text-lg font-bold">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </Link>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-amber-900"></div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAuthAction}
                    className="text-muted-foreground hover:text-destructive hover:bg-accent/50 transition-colors text-sm"
                  >
                    Salir
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAuthAction}
                  className="text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors"
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#c4965a] hover:text-[#f0c674] hover:bg-amber-50 dark:text-[#c4965a] dark:hover:text-[#f0c674] dark:hover:bg-amber-800/20"
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
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/productos"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                to="/favoritos"
                className="text-[#c4965a] hover:text-[#f0c674] dark:text-[#c4965a] dark:hover:text-[#f0c674] transition-colors font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
                {getFavoritesCount() > 0 && (
                  <span className="ml-2 bg-[#f0c674] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getFavoritesCount()}
                  </span>
                )}
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
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
