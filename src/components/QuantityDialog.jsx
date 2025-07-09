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
      <DialogContent className="glass-effect-dark border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">{product.name}</DialogTitle>
          <DialogDescription className="text-white/60">
            Selecciona la cantidad que deseas agregar al carrito.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              className="glass-effect border-white/30 text-white hover:bg-white/10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center glass-effect border-white/30 text-white text-lg font-bold"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              className="glass-effect border-white/30 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="glass-effect border-white/30 text-white hover:bg-white/10">Cancelar</Button>
          <Button onClick={handleAddToCart} className="floating-button text-white">Agregar al Carrito</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 