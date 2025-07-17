import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Package, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { productService } from '@/lib/productService';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recent-searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.warn('Error parsing recent searches:', e);
        }
      }
    }
  }, []);

  // Enfocar el input cuando se abre el modal
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Función de búsqueda con debounce
  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      if (searchTerm.length < 2) {
        return;
      }

      setIsLoading(true);
      try {
        const products = await productService.getAllProducts();
        const filtered = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.fragrance_profile?.some(profile => 
            profile.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setSearchResults(filtered.slice(0, 8)); // Limitar a 8 resultados
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Guardar búsqueda reciente
  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    
    const newRecentSearches = [
      term,
      ...recentSearches.filter(search => search !== term)
    ].slice(0, 5); // Mantener solo las últimas 5

    setRecentSearches(newRecentSearches);
    localStorage.setItem('recent-searches', JSON.stringify(newRecentSearches));
  };

  // Manejar selección de producto
  const handleProductSelect = (product) => {
    saveRecentSearch(searchTerm);
    onClose();
  };

  // Manejar búsqueda reciente
  const handleRecentSearch = (term) => {
    setSearchTerm(term);
  };

  // Limpiar búsquedas recientes
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 gap-0 bg-background border-border shadow-2xl">
        <div className="flex items-center border-b border-border px-4 py-4 pr-16 bg-background/95 backdrop-blur-sm relative">
          <Search className="h-5 w-5 text-sillage-gold mr-3 flex-shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Buscar perfumes, marcas, notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 focus-visible:ring-0 text-base bg-transparent placeholder:text-muted-foreground/70 flex-1 pr-2"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onClose();
              }
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="ml-2 p-1 hover:bg-muted rounded-md transition-colors flex-shrink-0"
              title="Limpiar búsqueda"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {/* Resultados de búsqueda */}
          {searchTerm.trim() && (
            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sillage-gold"></div>
                  <span className="ml-3 text-muted-foreground font-medium">Buscando perfumes...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">
                      Resultados de búsqueda
                    </h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {searchResults.length} encontrados
                    </span>
                  </div>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/productos/${product.sku}`}
                      onClick={() => handleProductSelect(product)}
                      className="flex items-center space-x-4 p-3 rounded-xl hover:bg-sillage-gold/5 hover:border-sillage-gold/20 border border-transparent transition-all duration-200 group"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted/50 flex-shrink-0 border border-border/50">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-7 w-7 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground group-hover:text-sillage-gold transition-colors truncate text-base">
                          {product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          <span className="font-medium">{product.brand}</span> • {product.size} • {product.concentration}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-sillage-gold">
                            ${product.price?.toLocaleString('es-CL')}
                          </span>
                          {product.fragrance_profile && product.fragrance_profile.length > 0 && (
                            <span className="text-xs text-muted-foreground bg-muted/70 px-2 py-1 rounded-full">
                              {product.fragrance_profile[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium mb-1">
                    No encontramos perfumes para "{searchTerm}"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Intenta buscar por marca, nombre o notas olfativas
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Búsquedas recientes */}
          {!searchTerm.trim() && recentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Búsquedas recientes
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-sillage-gold transition-colors font-medium"
                >
                  Limpiar todo
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(search)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sillage-gold/5 hover:border-sillage-gold/20 border border-transparent transition-all duration-200 w-full text-left group"
                  >
                    <div className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center flex-shrink-0">
                      <Search className="h-4 w-4 text-muted-foreground group-hover:text-sillage-gold transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-sillage-gold transition-colors">
                      {search}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Estado inicial */}
          {!searchTerm.trim() && recentSearches.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-sillage-gold/10 flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-sillage-gold" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Descubre tu fragancia perfecta
              </h3>
              <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                Busca entre nuestra exclusiva colección de perfumes premium
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <span className="bg-muted/50 px-3 py-1 rounded-full">Nombre</span>
                <span className="bg-muted/50 px-3 py-1 rounded-full">Marca</span>
                <span className="bg-muted/50 px-3 py-1 rounded-full">Notas olfativas</span>
                <span className="bg-muted/50 px-3 py-1 rounded-full">Categoría</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Usa <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl+K</kbd> para abrir la búsqueda rápidamente
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;