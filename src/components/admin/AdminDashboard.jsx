import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, Database } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import OrderStats from './OrderStats';

const AdminDashboard = ({ stats, products, onProductAdded, onOpenAddForm }) => {
  const [loadingZacharProducts, setLoadingZacharProducts] = useState(false);
  
  // Debug: verificar que la función se recibe correctamente
  console.log('🔧 AdminDashboard received onOpenAddForm:', typeof onOpenAddForm, onOpenAddForm);

  const handleLoadZacharProducts = async () => {
    if (!window.confirm('¿Estás seguro? Esto eliminará todos los productos actuales y los reemplazará con los productos de Zachary Perfumes.')) {
      return;
    }

    try {
      setLoadingZacharProducts(true);
      
      // Importación dinámica para evitar errores de SSR
      const { loadZacharProducts } = await import('@/scripts/loadZacharProducts');
      const newProducts = await loadZacharProducts();
      
      toast({
        title: "¡Productos cargados exitosamente!",
        description: `Se han cargado ${newProducts?.length || 0} productos de Zachary Perfumes.`,
      });
      
      // Recargar la página para refrescar todos los datos
      window.location.reload();
    } catch (error) {
      console.error('Error loading Zachary products:', error);
      toast({
        title: "Error al cargar productos",
        description: "No se pudieron cargar los productos de Zachary. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoadingZacharProducts(false);
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
              {loadingZacharProducts ? 'Cargando...' : 'Cargar Productos Zachary'}
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
