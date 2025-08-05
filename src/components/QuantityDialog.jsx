import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogPortal, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductSizeSelector from '@/components/ProductSizeSelector';
import { formatPrice } from '@/utils/formatPrice';
import { useNavigate } from 'react-router-dom';

// Precios fijos para todos los productos Zachary
const FIXED_PRICES = {
  '30ml': 9000,   // $9,000 CLP
  '50ml': 14000,  // $14,000 CLP  
  '100ml': 18000,  // $18,000 CLP
  '200ml': 7500   // $7,500 CLP
};

// Componente DialogContent optimizado fuera del render
const CustomDialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));

export const QuantityDialog = React.memo(({ open, onOpenChange, product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  // Detectar si es un producto Home Spray
  const isHomeSpray = product?.category === 'Hogar' ||
    product?.sku?.startsWith('ZHS-') ||
    product?.name?.toLowerCase().includes('home spray');

  // Inicializar producto seleccionado cuando se abre el dialog
  useEffect(() => {
    if (product && open) {
      if (isHomeSpray) {
        // Para Home Spray: forzar 200ml y precio $7.500
        setSelectedProduct({
          ...product,
          size: '200ml',
          price: 7500
        });
      } else {
        setSelectedProduct({
          ...product,
          size: product.size || '50ml',
          price: FIXED_PRICES[product.size || '50ml']
        });
      }
    }
  }, [product, open, isHomeSpray]);

  const handleAddToCart = useCallback(() => {
    if (selectedProduct) {
      onAddToCart(selectedProduct, quantity);
      onOpenChange(false);
      setQuantity(1); // Reset quantity after adding
    }
  }, [onAddToCart, selectedProduct, quantity, onOpenChange]);

  const handleSizeChange = useCallback((updatedProduct, newSize) => {
    const newSku = product.sku.includes('-')
      ? product.sku.replace(/-\d+ML$/i, `-${newSize.toUpperCase()}`)
      : `${product.sku}-${newSize.toUpperCase()}`;

    // Cerrar el dialog y navegar a la nueva URL
    onOpenChange(false);
    navigate(`/productos/${newSku}`);
  }, [product, onOpenChange, navigate]);

  const incrementQuantity = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  }, []);

  const decrementQuantity = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  }, []);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  if (!product || !selectedProduct) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogContent className="max-w-md mx-auto p-0 overflow-hidden border-2 border-sillage-gold/30 bg-background backdrop-blur-md">
        <div className="relative">
          {/* Fondo con degradado dorado sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-sillage-gold/10 via-transparent to-sillage-gold-dark/10 rounded-lg" />

          {/* Patrón decorativo sutil - sin animaciones */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-8 h-8 bg-sillage-gold rounded-full" />
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-sillage-gold-bright rounded-full" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-sillage-gold/5 rounded-full" />
          </div>

          {/* Botón cerrar */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-sillage-gold/20 hover:bg-sillage-gold/30 text-sillage-gold-dark hover:text-sillage-gold transition-colors duration-150"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Contenido */}
          <div className="relative z-10 p-8">
            <DialogHeader className="text-center mb-6">
              <DialogTitle className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-sillage-gold via-sillage-gold-bright to-sillage-gold-dark mb-3">
                {product.name}
              </DialogTitle>
              <DialogDescription className="text-sillage-gold-dark/80 text-base leading-relaxed">
                Selecciona el tamaño y cantidad que deseas agregar al carrito.
              </DialogDescription>
            </DialogHeader>

            {/* Selector de tamaño */}
            <div className="mb-6">
              {isHomeSpray ? (
                // Para Home Spray mostrar solo 200ml sin opción de cambiar
                <div className="bg-sillage-gold/10 rounded-lg p-4 border border-sillage-gold/30">
                  <p className="text-sm font-medium text-foreground mb-1">Tamaño único</p>
                  <p className="text-lg font-bold text-sillage-gold-dark">200ml</p>
                </div>
              ) : (
                <ProductSizeSelector
                  baseProduct={product}
                  allSizes={['30ml', '50ml', '100ml']}
                  selectedSize={selectedProduct.size}
                  onSizeChange={handleSizeChange}
                  variant="dropdown"
                  className="w-full"
                />
              )}
            </div>

            {/* Información del producto seleccionado */}
            <div className="bg-sillage-gold/5 rounded-lg p-4 border border-sillage-gold/20 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {selectedProduct.size} seleccionado
                  </p>
                  <p className="text-xs text-muted-foreground">
                    SKU: {selectedProduct.sku}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-sillage-gold-dark">
                    {formatPrice(selectedProduct.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* Selector de cantidad */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground block mb-2">Cantidad</label>
              <div className="flex items-center justify-center space-x-0 bg-gray-100 rounded-lg inline-flex">
                <button
                  type="button"
                  onClick={decrementQuantity}
                  className="w-10 h-10 flex items-center justify-center text-lg font-medium hover:bg-gray-200 transition-colors rounded-l-lg"
                >
                  -
                </button>
                <div className="w-14 h-10 flex items-center justify-center border-x border-gray-300">
                  <span className="text-lg font-medium">{quantity}</span>
                </div>
                <button
                  type="button"
                  onClick={incrementQuantity}
                  className="w-10 h-10 flex items-center justify-center text-lg font-medium hover:bg-gray-200 transition-colors rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Precio total */}
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">Total:</p>
              <p className="text-2xl font-bold text-sillage-gold-dark">
                {formatPrice(selectedProduct.price * quantity)}
              </p>
            </div>

            {/* Botones de acción */}
            <DialogFooter className="space-y-4">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Agregar al Carrito
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="w-full text-sillage-gold-dark hover:bg-sillage-gold/10 hover:text-sillage-gold font-medium py-3 transition-colors duration-150"
              >
                Cancelar
              </Button>
            </DialogFooter>
          </div>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
});
