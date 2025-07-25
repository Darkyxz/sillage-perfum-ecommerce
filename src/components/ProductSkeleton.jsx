import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ProductSkeleton = () => {
  return (
    <Card className="glass-effect border-sillage-gold/20 h-full flex flex-col animate-pulse">
      {/* Imagen skeleton */}
      <div className="aspect-square bg-sillage-gold/10 rounded-t-lg"></div>
      
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex-grow space-y-3">
          {/* Título skeleton */}
          <div className="h-5 bg-sillage-gold/20 rounded-md"></div>
          
          {/* Marca skeleton */}
          <div className="h-4 bg-sillage-gold/15 rounded-md w-2/3"></div>
          
          {/* Descripción skeleton */}
          <div className="space-y-2">
            <div className="h-3 bg-sillage-gold/10 rounded-md"></div>
            <div className="h-3 bg-sillage-gold/10 rounded-md w-4/5"></div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-sillage-gold/20 space-y-3">
          {/* Precio skeleton */}
          <div className="h-6 bg-sillage-gold/20 rounded-md w-1/2"></div>
          
          {/* Botones skeleton */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-10 bg-sillage-gold/15 rounded-lg"></div>
            <div className="w-10 h-10 bg-sillage-gold/15 rounded-lg"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para mostrar múltiples skeletons
export const ProductSkeletonGrid = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductSkeleton;