
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Search, Heart, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import SearchModal from '@/components/SearchModal';
import CatalogDropdown from '@/components/CatalogDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  // Atajo de teclado para abrir búsqueda (Ctrl+K o Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      className="relative bg-black backdrop-blur-md sticky top-0 z-50 border-b border-border shadow-sm w-full min-w-full"
      style={{ margin: 0, padding: 0, width: '100vw', maxWidth: '100vw' }}
    >
      <div className="w-full px-3 sm:px-4 py-3 sm:py-4" style={{ margin: 0, boxSizing: 'border-box' }}>
        <div className="flex items-center justify-between w-full" style={{ margin: 0, padding: 0 }}>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <img
              src="/images/Logos.svg"
              alt="Logo de la marca"
              className="h-8 sm:h-10" // Ajusta la altura según necesites
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium text-sm uppercase tracking-wide px-3 py-2 rounded-md"
            >
              Inicio
            </Link>
            <CatalogDropdown />
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
              Quienes Somos?
            </button>
            <Link
              to="/#"
              className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium text-sm uppercase tracking-wide px-3 py-2 rounded-md"
            >
              Como Comprar
            </Link>
            <Link
              to="/seguimiento"
              className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium text-sm uppercase tracking-wide px-3 py-2 rounded-md"
            >
              Seguimiento
            </Link>
            <Link
              to="/contacto"
              className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium text-sm uppercase tracking-wide px-3 py-2 rounded-md"
            >
              Contactenos
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
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* Search - Hidden on very small screens */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Wishlist - Hidden on very small screens */}
            <Link to="/favoritos" className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors relative"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                {getFavoritesCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold border-2 border-background shadow-lg text-[10px] sm:text-xs">
                    {getFavoritesCount()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart - Always visible */}
            <Link to="/carrito">
              <Button
                variant="ghost"
                size="icon"
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors relative"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold border-2 border-background shadow-lg text-[10px] sm:text-xs">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu - Simplified for mobile */}
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="relative">
                    <Link to="/perfil" className="block w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-primary">
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        {user.email ? (
                          <span className="font-medium text-primary text-sm sm:text-lg font-bold">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        )}
                      </div>
                    </Link>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAuthAction}
                    className="hidden sm:flex text-sillage-gold-dark hover:text-destructive hover:bg-sillage-gold/10 transition-colors text-sm px-2 sm:px-3 py-2 rounded-md"
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
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors ml-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-border w-full"
          >
            <nav className="flex flex-col space-y-3 w-full">
              <Link
                to="/"
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium px-3 py-2 rounded-md w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              {/* Catálogo en móvil - expandible */}
              <div className="w-full">
                <details className="group">
                  <summary className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium px-3 py-2 rounded-md w-full text-left cursor-pointer list-none flex items-center justify-between">
                    <span>Catálogo</span>
                    <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="mt-2 ml-4 space-y-2">
                    <Link
                      to="/categoria/perfume-dama"
                      className="block text-sillage-gold-dark/80 hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors text-sm px-3 py-2 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Perfume Diseñador Dama
                    </Link>
                    <Link
                      to="/categoria/perfume-varon"
                      className="block text-sillage-gold-dark/80 hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors text-sm px-3 py-2 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Perfume Diseñador Varón
                    </Link>
                    <Link
                      to="/categoria/inspirado-nicho"
                      className="block text-sillage-gold-dark/80 hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors text-sm px-3 py-2 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Inspirado Nicho
                    </Link>
                    <Link
                      to="/categoria/body-mist"
                      className="block text-sillage-gold-dark/80 hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors text-sm px-3 py-2 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Body Mist
                    </Link>
                    <Link
                      to="/categoria/by-zachary"
                      className="block text-sillage-gold-dark/80 hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors text-sm px-3 py-2 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      By Zachary
                    </Link>
                    <Link
                      to="/categoria/home-spray"
                      className="block text-sillage-gold-dark/80 hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors text-sm px-3 py-2 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home Spray
                    </Link>
                    <Link
                      to="/productos"
                      className="block text-sillage-gold hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors text-sm px-3 py-2 rounded-md font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Ver Todos
                    </Link>
                  </div>
                </details>
              </div>
              <button
                onClick={() => {
                  const aboutSection = document.getElementById('about-section');
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.location.href = '/#about';
                  }
                  setIsMenuOpen(false);
                }}
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium px-3 py-2 rounded-md w-full text-left"
              >
                Quienes Somos
              </button>
              <Link
                to="/contacto"
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium px-3 py-2 rounded-md w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Contactenos
              </Link>
              <Link
                to="/#"
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium px-3 py-2 rounded-md w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Como Comprar
              </Link>
              <Link
                to="/#"
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium px-3 py-2 rounded-md w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Seguimiento
              </Link>
              <Link
                to="/favoritos"
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium flex items-center justify-between px-3 py-2 rounded-md w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoritos
                </div>
                {getFavoritesCount() > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-background shadow-lg">
                    {getFavoritesCount()}
                  </span>
                )}
              </Link>
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMenuOpen(false);
                }}
                className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium flex items-center px-3 py-2 rounded-md w-full text-left sm:hidden"
              >
                <Search className="h-4 w-4 mr-2" />
                Búsqueda
              </button>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium px-3 py-2 rounded-md w-full text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user && (
                <button
                  onClick={() => {
                    handleAuthAction();
                    setIsMenuOpen(false);
                  }}
                  className="text-sillage-gold-dark hover:text-destructive hover:bg-sillage-gold/10 transition-colors font-medium px-3 py-2 rounded-md w-full text-left sm:hidden"
                >
                  Cerrar Sesión
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </motion.header>
  );
};

export default Header;

