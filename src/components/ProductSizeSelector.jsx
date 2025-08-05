import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Package, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/formatPrice';

// Precios fijos para todos los productos Zachary
const FIXED_PRICES = {
  '30ml': 9000,   // $9,000 CLP
  '50ml': 14000,  // $14,000 CLP  
  '100ml': 18000  // $18,000 CLP
};

// Configuración de tamaños con información adicional
const SIZE_CONFIG = {
  '30ml': {
    label: '30ml',
    price: FIXED_PRICES['30ml'],
    description: 'Perfecto para probar',
    popular: false,
    icon: '💧'
  },
  '50ml': {
    label: '50ml',
    price: FIXED_PRICES['50ml'],
    description: 'Tamaño estándar',
    popular: true,
    icon: '🌟'
  },
  '100ml': {
    label: '100ml',
    price: FIXED_PRICES['100ml'],
    description: 'Mayor duración',
    popular: false,
    icon: '💎'
  }
};

const ProductSizeSelector = ({
  baseProduct,
  allSizes = ['30ml', '50ml', '100ml'],
  selectedSize,
  onSizeChange,
  className,
  variant = 'default' // 'default', 'compact', 'dropdown'
}) => {
  // Para Home Spray, siempre usar 200ml
  const isHomeSpray = baseProduct?.category === 'Home Spray' || baseProduct?.category_name === 'Home Spray';
  const availableSizes = isHomeSpray ? ['200ml'] : allSizes;
  const defaultSize = isHomeSpray ? '200ml' : (selectedSize || '50ml');

  const [currentSize, setCurrentSize] = useState(defaultSize);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Actualizar cuando cambie el tamaño seleccionado externamente
  useEffect(() => {
    if (isHomeSpray) {
      setCurrentSize('200ml');
    } else if (selectedSize && selectedSize !== currentSize) {
      setCurrentSize(selectedSize);
    }
  }, [selectedSize, isHomeSpray]);

  // Calcular producto actual basado en tamaño seleccionado
  const getCurrentProduct = () => {
    if (!baseProduct) return null;

    return {
      ...baseProduct,
      size: currentSize,
      price: isHomeSpray ? 7500 : FIXED_PRICES[currentSize],
      // Generar SKU con tamaño si no existe
      sku: baseProduct.sku.includes('-')
        ? baseProduct.sku.replace(/-\d+ML$/i, `-${currentSize.toUpperCase()}`)
        : `${baseProduct.sku}-${currentSize.toUpperCase()}`
    };
  };

  // Manejar cambio de tamaño
  const handleSizeChange = (newSize) => {
    setCurrentSize(newSize);
    setIsDropdownOpen(false);

    if (onSizeChange) {
      const updatedProduct = {
        ...baseProduct,
        size: newSize,
        price: isHomeSpray ? 7500 : FIXED_PRICES[newSize],
        sku: baseProduct.sku.includes('-')
          ? baseProduct.sku.replace(/-\d+ML$/i, `-${newSize.toUpperCase()}`)
          : `${baseProduct.sku}-${newSize.toUpperCase()}`
      };
      onSizeChange(updatedProduct, newSize);
    }
  };

  const currentProduct = getCurrentProduct();
  const currentPrice = isHomeSpray ? 7500 : FIXED_PRICES[currentSize];

  if (!baseProduct) return null;

  // Variante compacta para listas de productos
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex bg-muted/30 rounded-lg p-1">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={cn(
                "px-2 py-1 rounded text-xs font-medium transition-all",
                currentSize === size
                  ? "bg-sillage-gold text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {size}
            </button>
          ))}
        </div>
        <div className="text-sm font-semibold text-sillage-gold-dark">
          {formatPrice(currentPrice)}
        </div>
      </div>
    );
  }

  // Variante dropdown para espacios reducidos
  if (variant === 'dropdown') {
    return (
      <div className={cn("relative", className)}>
        <Button
          variant="outline"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full justify-between glass-effect border-sillage-gold/30"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{SIZE_CONFIG[currentSize]?.icon}</span>
            <div>
              <div className="text-sm font-medium">{currentSize}</div>
              <div className="text-xs text-muted-foreground">
                {formatPrice(currentPrice)}
              </div>
            </div>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            isDropdownOpen && "rotate-180"
          )} />
        </Button>

        {isDropdownOpen && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 glass-effect border-sillage-gold/30">
            <CardContent className="p-2">
              {allSizes.map((size) => {
                const config = SIZE_CONFIG[size];
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded text-left transition-colors",
                      currentSize === size
                        ? "bg-sillage-gold/20 text-sillage-gold-dark"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{config.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{size}</div>
                        <div className="text-xs text-muted-foreground">
                          {config.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {formatPrice(config.price)}
                      </div>
                      {currentSize === size && (
                        <Check className="h-3 w-3 text-sillage-gold ml-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Variante por defecto - tarjetas completas
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">
          Selecciona el tamaño
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {allSizes.map((size) => {
            const config = SIZE_CONFIG[size];
            const isSelected = currentSize === size;

            return (
              <Card
                key={size}
                className={cn(
                  "cursor-pointer transition-all duration-200 border-2",
                  isSelected
                    ? "border-sillage-gold bg-sillage-gold/10 shadow-md"
                    : "border-border hover:border-sillage-gold/50 hover:shadow-sm"
                )}
                onClick={() => handleSizeChange(size)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-2xl">{config.icon}</div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        <span className="font-semibold text-sm">{size}</span>
                        {config.popular && (
                          <span className="bg-sillage-gold text-white text-xs px-1.5 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {config.description}
                      </div>

                      <div className="text-lg font-bold text-sillage-gold-dark">
                        {formatPrice(config.price)}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-1 text-sillage-gold text-xs font-medium">
                        <Check className="h-3 w-3" />
                        Seleccionado
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Resumen del producto seleccionado */}
      <Card className="glass-effect border-sillage-gold/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground text-sm">
                {baseProduct.name} - {currentSize}
              </h4>
              <p className="text-muted-foreground text-xs">
                SKU: {currentProduct?.sku}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-sillage-gold-dark">
                {formatPrice(currentPrice)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductSizeSelector;
