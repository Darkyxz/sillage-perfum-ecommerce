
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Search, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { getFavoritesCount } = useFavorites();
  const navigate = useNavigate();

  // Solo verificar el avatar si existe
  useEffect(() => {
    if (user?.avatar_url) {
      // Verificar si la URL del avatar es accesible
      fetch(user.avatar_url, { method: 'HEAD' })
        .catch(err => console.warn('Avatar no accesible:', err));
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
      className="relative bg-black backdrop-blur-md sticky top-0 z-50 border-b border-border shadow-sm overflow-hidden"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            
            <span className="text-2xl font-display font-bold text-sillage-gold">
              Sillage Perfum
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium text-sm uppercase tracking-wide px-3 py-2 rounded-md"
            >
              Home
            </Link>
            <Link
              to="/productos"
              className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium text-sm uppercase tracking-wide px-3 py-2 rounded-md"
            >
              Perfumes
            </Link>
            <button
              onClick={() => {
                const aboutSection = document.getElementById('about-section');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  // Si no estamos en home, navegar a home
                  window.location.href = '/#about';
                }
              }}
              className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium text-sm uppercase tracking-wide px-3 py-2 rounded-md"
            >
              About
            </button>
            <Link
              to="/contacto"
              className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium text-sm uppercase tracking-wide px-3 py-2 rounded-md"
            >
              Contact
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium text-sm uppercase tracking-wide px-3 py-2 rounded-md"
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
              className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors"
              onClick={() => {
                toast({
                  title: "Búsqueda",
                  description: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
                });
              }}
            >
              <Search className="h-5 w-5" />
            </Button>


            {/* Wishlist */}
            <Link to="/favoritos">
              <Button
                variant="ghost"
                size="icon"
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors relative"
              >
                <Heart className="h-5 w-5" />
                {getFavoritesCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-background shadow-lg">
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
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-background shadow-lg">
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
                    <Link to="/perfil" className="block w-9 h-9 rounded-full overflow-hidden border-2 border-primary">
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        {user.email ? (
                          <span className="font-medium text-primary text-lg font-bold">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </Link>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAuthAction}
                    className="text-sillage-gold-dark hover:text-destructive hover:bg-sillage-gold/10 transition-colors text-sm px-3 py-2 rounded-md"
                  >
                    Salir
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAuthAction}
                  className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors"
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors"
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
            className="md:hidden mt-4 pt-4 border-t border-border"
          >
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/productos"
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                to="/favoritos"
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium flex items-center px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
                {getFavoritesCount() > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-background shadow-lg">
                    {getFavoritesCount()}
                  </span>
                )}
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium px-3 py-2 rounded-md"
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

