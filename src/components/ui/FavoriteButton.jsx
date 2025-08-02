import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';

const FavoriteButton = ({
    product,
    size = 'md',
    showText = false,
    className = '',
    variant = 'default'
}) => {
    const { toggleFavorite, isFavorite, loading, error } = useFavorites();
    const { isAuthenticated } = useAuth();
    const [isToggling, setIsToggling] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const isProductFavorite = isFavorite(product.id);

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            // Mostrar mensaje de login requerido
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000);
            return;
        }

        setIsToggling(true);

        try {
            const result = await toggleFavorite(product);

            if (result.success) {
                // Opcional: mostrar mensaje de éxito
                console.log(result.message);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsToggling(false);
        }
    };

    // Configuración de tamaños
    const sizeConfig = {
        sm: {
            button: 'w-8 h-8',
            icon: 'w-4 h-4',
            text: 'text-xs'
        },
        md: {
            button: 'w-10 h-10',
            icon: 'w-5 h-5',
            text: 'text-sm'
        },
        lg: {
            button: 'w-12 h-12',
            icon: 'w-6 h-6',
            text: 'text-base'
        }
    };

    // Configuración de variantes
    const variantConfig = {
        default: {
            base: 'bg-white/90 hover:bg-white border border-gray-200 hover:border-gray-300',
            active: 'text-red-500 bg-red-50 border-red-200',
            inactive: 'text-gray-600 hover:text-red-500'
        },
        minimal: {
            base: 'bg-transparent hover:bg-white/10',
            active: 'text-red-500',
            inactive: 'text-white hover:text-red-300'
        },
        solid: {
            base: 'border-0',
            active: 'bg-red-500 text-white hover:bg-red-600',
            inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-500'
        }
    };

    const currentSize = sizeConfig[size];
    const currentVariant = variantConfig[variant];

    const buttonClasses = `
    ${currentSize.button}
    ${currentVariant.base}
    ${isProductFavorite ? currentVariant.active : currentVariant.inactive}
    ${className}
    relative inline-flex items-center justify-center
    rounded-full transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    group
  `.trim();

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                disabled={isToggling || loading}
                className={buttonClasses}
                title={isAuthenticated
                    ? (isProductFavorite ? 'Remover de favoritos' : 'Agregar a favoritos')
                    : 'Inicia sesión para agregar favoritos'
                }
            >
                {/* Icono del corazón */}
                <Heart
                    className={`
            ${currentSize.icon}
            transition-all duration-200
            ${isProductFavorite ? 'fill-current' : 'fill-none'}
            ${isToggling ? 'animate-pulse' : ''}
            group-hover:scale-110
          `}
                />

                {/* Indicador de carga */}
                {isToggling && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
                    </div>
                )}

                {/* Texto opcional */}
                {showText && (
                    <span className={`ml-2 ${currentSize.text} font-medium`}>
                        {isProductFavorite ? 'Favorito' : 'Agregar'}
                    </span>
                )}
            </button>

            {/* Tooltip para usuarios no autenticados */}
            {showTooltip && !isAuthenticated && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50">
                    Inicia sesión para agregar favoritos
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                </div>
            )}

            {/* Mensaje de error */}
            {error && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs rounded-lg whitespace-nowrap z-50">
                    {error}
                </div>
            )}
        </div>
    );
};

export default FavoriteButton;