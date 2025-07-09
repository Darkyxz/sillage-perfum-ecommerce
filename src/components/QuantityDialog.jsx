import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

export const QuantityDialog = ({ open, onOpenChange, product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onOpenChange(false);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden border-0 bg-transparent">
        <div className="relative">
          {/* Fondo con degradado dorado */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 dark:from-amber-500 dark:via-yellow-600 dark:to-amber-700 opacity-95 rounded-lg" />
          
          {/* Patrón decorativo sutil */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full animate-pulse" />
            <div className="absolute bottom-4 right-4 w-8 h-8 bg-white rounded-full animate-pulse delay-700" />
          </div>
          
          {/* Contenido */}
          <div className="relative z-10 p-6">
            <DialogHeader className="text-center mb-6">
              <DialogTitle className="text-2xl font-display font-bold text-white mb-2">{product.name}</DialogTitle>
              <DialogDescription className="text-white/90 text-base">
                Selecciona la cantidad que deseas agregar al carrito.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6 flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-full w-12 h-12"
              >
                <Minus className="h-5 w-5" />
              </Button>
              
              <div className="bg-white/20 rounded-lg px-4 py-2 min-w-[80px]">
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center bg-transparent border-0 text-white text-2xl font-bold focus:outline-none focus:ring-0"
                />
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-full w-12 h-12"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            <DialogFooter className="space-y-3">
              <Button 
                onClick={handleAddToCart} 
                className="w-full bg-white text-amber-600 hover:bg-gray-100 font-bold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Agregar al Carrito
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)} 
                className="w-full text-white hover:bg-white/10 font-medium"
              >
                Cancelar
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 