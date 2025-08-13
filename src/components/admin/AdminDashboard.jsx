import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, Database, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import OrderStats from './OrderStats';
import { productService } from '@/lib/productService';

const AdminDashboard = ({ stats, products, onProductAdded, onOpenAddForm }) => {
  const [loadingZacharProducts, setLoadingZacharProducts] = useState(false);

  // Debug: verificar que la función se recibe correctamente
  console.log('🔧 AdminDashboard received onOpenAddForm:', typeof onOpenAddForm, onOpenAddForm);

  const handleLoadZacharProducts = async () => {
    if (!window.confirm('¿Estás seguro? Esto agregará SOLO los productos nuevos de Sillage Perfumes sin eliminar los existentes.')) {
      return;
    }

    try {
      setLoadingZacharProducts(true);

      // Importación dinámica para evitar errores de SSR
      const { loadNewZacharProducts } = await import('@/scripts/loadZacharProductsMySQL');
      const newProducts = await loadNewZacharProducts();

      toast({
        title: "¡Productos nuevos agregados exitosamente!",
        description: `Se han agregado ${newProducts?.length || 0} nuevas variantes de productos Sillage Perfumes.`,
      });

      // Recargar la página para refrescar todos los datos
      window.location.reload();
    } catch (error) {
      console.error('Error loading Sillage products:', error);
      toast({
        title: "Error al agregar productos nuevos",
        description: "No se pudieron agregar los productos nuevos de Sillage. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoadingZacharProducts(false);
    }
  };

  const handleClearProducts = async () => {
    const confirmed = window.confirm(
      '⚠️ ¿Estás seguro de que quieres ELIMINAR TODOS los productos?\n\n' +
      'Esta acción:\n' +
      '• Eliminará todos los productos de la base de datos\n' +
      '• No se puede deshacer\n' +
      '• Los productos desaparecerán de la tienda\n\n' +
      'Escribe "ELIMINAR" para confirmar'
    );

    if (!confirmed) return;

    const confirmation = prompt('Escribe "ELIMINAR" para confirmar:');
    if (confirmation !== 'ELIMINAR') {
      toast({
        title: "Operación cancelada",
        description: "No se eliminaron los productos",
      });
      return;
    }

    try {
      const result = await productService.clearAllProducts();

      toast({
        title: "¡Productos eliminados!",
        description: `Se eliminaron ${result.deletedCount} productos exitosamente`,
      });

      // Recargar la página para refrescar todos los datos
      window.location.reload();
    } catch (error) {
      console.error('Error clearing products:', error);
      toast({
        title: "Error al eliminar productos",
        description: "No se pudieron eliminar los productos. Intenta de nuevo.",
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
              onClick={() => {
                console.log('🔥 BUTTON CLICKED in AdminDashboard!');
                console.log('🔥 onOpenAddForm type:', typeof onOpenAddForm);
                console.log('🔥 onOpenAddForm function:', onOpenAddForm);
                if (onOpenAddForm) {
                  console.log('🔥 Calling onOpenAddForm...');
                  onOpenAddForm();
                  console.log('🔥 onOpenAddForm called successfully');
                } else {
                  console.error('❌ onOpenAddForm is not defined!');
                }
              }}
              className="w-full admin-button"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>

            <Button
              onClick={handleLoadZacharProducts}
              disabled={loadingZacharProducts}
              className="w-full admin-button"
              variant="secondary"
            >
              <Database className="mr-2 h-4 w-4" />
              {loadingZacharProducts ? 'Agregando...' : 'Agregar Productos Nuevos Sillage'}
            </Button>

            <Button
              onClick={handleClearProducts}
              className="w-full admin-button"
              variant="destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar Todos los Productos
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


    </>
  );
};

export default AdminDashboard;
