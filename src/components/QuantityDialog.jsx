import React, { useState } from 'react';
import { Dialog, DialogOverlay, DialogPortal, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const QuantityDialog = ({ open, onOpenChange, product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onOpenChange(false);
    setQuantity(1); // Reset quantity after adding
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Componente DialogContent personalizado sin X automática
  const CustomDialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  ));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogContent className="max-w-md mx-auto p-0 overflow-hidden border-2 border-sillage-gold/30 bg-background backdrop-blur-md">
        <div className="relative">
          {/* Fondo con degradado dorado sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-sillage-gold/10 via-transparent to-sillage-gold-dark/10 rounded-lg" />
          
          {/* Patrón decorativo sutil */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-8 h-8 bg-sillage-gold rounded-full animate-pulse" />
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-sillage-gold-bright rounded-full animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-sillage-gold/5 rounded-full" />
          </div>
          
          {/* Botón cerrar */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-sillage-gold/20 hover:bg-sillage-gold/30 text-sillage-gold-dark hover:text-sillage-gold transition-all duration-300"
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
            <div className="py-8 flex items-center justify-center space-x-6">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                className="bg-sillage-gold/10 border-sillage-gold/30 text-sillage-gold-dark hover:bg-sillage-gold/20 hover:border-sillage-gold/50 transition-all duration-300 rounded-full w-14 h-14 shadow-lg hover:shadow-xl"
              >
                <Minus className="h-6 w-6" />
              </Button>
              
              <div className="bg-sillage-gold/10 border-2 border-sillage-gold/30 rounded-xl px-6 py-4 min-w-[100px] shadow-inner">
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center bg-transparent border-0 text-sillage-gold-dark text-3xl font-bold focus:outline-none focus:ring-0 placeholder:text-sillage-gold-dark/50"
                  min="1"
                />
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                className="bg-sillage-gold/10 border-sillage-gold/30 text-sillage-gold-dark hover:bg-sillage-gold/20 hover:border-sillage-gold/50 transition-all duration-300 rounded-full w-14 h-14 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-6 w-6" />
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
                onClick={() => onOpenChange(false)} 
                className="w-full text-sillage-gold-dark hover:bg-sillage-gold/10 hover:text-sillage-gold font-medium py-3 transition-all duration-300"
              >
                Cancelar
              </Button>
            </DialogFooter>
          </div>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
}; 