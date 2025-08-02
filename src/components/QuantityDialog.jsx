import React, { useState, useCallback } from 'react';
import { Dialog, DialogPortal, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const handleAddToCart = useCallback(() => {
    if (product) {
      onAddToCart(product, quantity);
      onOpenChange(false);
      setQuantity(1); // Reset quantity after adding
    }
  }, [onAddToCart, product, quantity, onOpenChange]);

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

  if (!product) return null;



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
            <DialogHeader className="text-center mb-8">
              <DialogTitle className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-sillage-gold via-sillage-gold-bright to-sillage-gold-dark mb-3">
                {product.name}
              </DialogTitle>
              <DialogDescription className="text-sillage-gold-dark/80 text-base leading-relaxed">
                Selecciona la cantidad que deseas agregar al carrito.
              </DialogDescription>
            </DialogHeader>

            {/* Selector de cantidad */}
            <div className="py-4 flex items-center justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                className="bg-sillage-gold/10 border-sillage-gold/30 text-sillage-gold-dark hover:bg-sillage-gold/20 hover:border-sillage-gold/50 transition-colors duration-150 rounded-full w-8 h-8 shadow-sm"
              >
                <Minus className="h-3 w-3" />
              </Button>

              <div className="bg-sillage-gold/10 border-2 border-sillage-gold/30 rounded-lg px-3 py-1 min-w-[60px] shadow-inner">
                <span className="text-center bg-transparent text-sillage-gold-dark text-lg font-bold block select-none">
                  {quantity}
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                className="bg-sillage-gold/10 border-sillage-gold/30 text-sillage-gold-dark hover:bg-sillage-gold/20 hover:border-sillage-gold/50 transition-colors duration-150 rounded-full w-8 h-8 shadow-sm"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Botones de acción */}
            <DialogFooter className="space-y-4 pt-4">
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