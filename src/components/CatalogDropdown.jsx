import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, User, Heart, Droplets, Home, Package } from 'lucide-react';

const CatalogDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    {
      id: 'perfume-dama',
      name: 'Sillage Perfume Dama',
      description: 'Fragancias femeninas de diseñador',
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      count: 135
    },
    {
      id: 'perfume-varon',
      name: 'Sillage Perfume Varón',
      description: 'Fragancias masculinas de diseñador',
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      count: 114
    },
    {
      id: 'inspirado-nicho',
      name: 'Sillage Nicho Jardin Paraiso',
      description: 'Fragancias inspiradas en perfumes de nicho',
      icon: Sparkles,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      count: 0
    },
    {
      id: 'body-mist',
      name: 'Sillage Body Mist',
      description: 'Brumas corporales refrescantes',
      icon: Droplets,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 hover:bg-cyan-100',
      count: 0
    },
    {
      id: 'by-zachary',
      name: 'By Sillage',
      description: 'Colección exclusiva Sillage',
      icon: Package,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 hover:bg-amber-100',
      count: 0
    },
    {
      id: 'home-spray',
      name: 'Sillage Home Spray',
      description: 'Aromatizadores para el hogar',
      icon: Home,
      color: 'text-green-500',
      bgColor: 'bg-green-50 hover:bg-green-100',
      count: 0
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center space-x-1 text-sillage-gold-dark hover:text-sillage-gold hover:bg-sillage-gold/10 transition-colors font-medium text-sm uppercase tracking-wide px-3 py-2 rounded-md"
      >
        <span>Catálogo</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
            onMouseLeave={() => setIsOpen(false)}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-sillage-gold/10 to-sillage-gold-bright/10 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Explora nuestro catálogo</h3>
              <p className="text-xs text-gray-600 mt-1">Encuentra tu fragancia perfecta</p>
            </div>

            {/* Categories */}
            <div className="py-2">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.id}
                    to={`/categoria/${category.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 transition-colors duration-200 ${category.bgColor} group`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className={`h-5 w-5 ${category.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {category.name}
                        </h4>
                        {category.count > 0 && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium bg-sillage-gold/20 text-sillage-gold-dark rounded-full">
                            {category.count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                );
              })}

              {/* Separator */}
              <div className="border-t border-gray-100 my-2"></div>

              {/* Ver Todos */}
              <Link
                to="/productos"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 hover:bg-sillage-gold/10 transition-colors duration-200 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-sillage-gold to-sillage-gold-bright flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 text-sm">
                      Ver Todos los Productos
                    </h4>
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-sillage-gold text-white rounded-full">
                      249
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Explora toda nuestra colección
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatalogDropdown;