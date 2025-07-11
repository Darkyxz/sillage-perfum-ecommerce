import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, BarChart3 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import OrderStats from './OrderStats';
import ProductForm from './ProductForm';
import { productService } from '@/lib/productService';

const AdminDashboard = ({ stats, products, onProductAdded }) => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const handleAddProduct = async (newProductData) => {
    try {
      const product = await productService.createProduct({
        ...newProductData,
        price: parseFloat(newProductData.price),
        stock_quantity: parseInt(newProductData.stock_quantity) || 0,
        in_stock: (parseInt(newProductData.stock_quantity) || 0) > 0
      });
      
      setIsAddFormOpen(false);
      toast({
        title: "¡Producto agregado!",
        description: `${product.name} ha sido agregado al catálogo`,
      });
      
      // Notificar al componente padre para actualizar la lista
      if (onProductAdded) {
        onProductAdded(product);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error al agregar producto",
        description: "No se pudo agregar el producto. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Componente de estadísticas avanzadas de pedidos */}
      <OrderStats />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="admin-stat-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="admin-text-muted text-sm">{stat.title}</p>
                    <p className="admin-value text-2xl">{stat.value}</p>
                  </div>
                  <stat.icon className={`admin-icon h-8 w-8`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="admin-panel">
          <CardHeader>
            <CardTitle className="admin-text font-semibold">Productos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="admin-text font-medium">{product.name}</p>
                    <p className="admin-text-muted text-sm">{product.brand}</p>
                  </div>
                  <span className="admin-price">${product.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="admin-panel">
          <CardHeader>
            <CardTitle className="admin-text font-semibold">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setIsAddFormOpen(true)}
              className="w-full admin-button"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>
            
            <Button
              variant="outline"
              className="w-full admin-button-outline"
              onClick={() => {
                toast({
                  title: "Reportes",
                  description: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀",
                });
              }}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Ver Reportes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo para agregar producto */}
      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="admin-dialog max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="admin-text font-semibold text-lg">Agregar Nuevo Producto</DialogTitle>
            <DialogDescription className="admin-text-muted">
              Completa los detalles del producto. Haz clic en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            onSubmit={handleAddProduct}
            initialData={null}
            onCancel={() => setIsAddFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard;
