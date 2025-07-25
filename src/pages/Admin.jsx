import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Package, BarChart3, Users, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ProductManagement from '@/components/admin/ProductManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import ProductForm from '@/components/admin/ProductForm';
import { productService } from '@/lib/productService';
import { toast } from '@/components/ui/use-toast';

const Admin = () => {
  const { user, isAdmin, isAuthLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const hasRestoredFormState = useRef(false);
  
  // Estado persistente que se mantiene al cambiar pestañas del navegador
  const [isAddFormOpen, setIsAddFormOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('admin-form-open') === 'true';
      console.log('🔄 Admin component initializing, form should be open:', savedState);
      return savedState;
    }
    return false;
  });

  // Función personalizada para cambiar el estado del formulario
  const setFormOpen = (open) => {
    console.log('🎯 setFormOpen called with:', open, 'previous state:', isAddFormOpen);
    console.log('💾 Saving to localStorage immediately:', open);
    localStorage.setItem('admin-form-open', open.toString());
    setIsAddFormOpen(open);
    
    // Verificar que se guardó correctamente
    const saved = localStorage.getItem('admin-form-open');
    console.log('✅ Verified localStorage value:', saved);
  };
  const [stats, setStats] = useState([
    {
      title: "Total Productos",
      value: "0",
      icon: Package,
      color: "text-sillage-gold"
    },
    {
      title: "Ventas del Mes",
      value: "$0",
      icon: DollarSign,
      color: "text-sillage-gold"
    },
    {
      title: "Usuarios Activos",
      value: "0",
      icon: Users,
      color: "text-sillage-gold"
    },
    {
      title: "Pedidos Pendientes",
      value: "0",
      icon: BarChart3,
      color: "text-sillage-gold"
    }
  ]);

  // Efecto para cargar datos admin solo cuando sea necesario
  useEffect(() => {
    if (isAdmin && !isAuthLoading) {
      loadAdminData();
    }
  }, [isAdmin, isAuthLoading]);

  // Efecto para restaurar el formulario cuando el componente se monta o se restaura
  useEffect(() => {
    if (isAdmin && !isAuthLoading) {
      const shouldKeepFormOpen = localStorage.getItem('admin-form-open') === 'true';
      console.log('🔍 Checking form state - localStorage:', shouldKeepFormOpen, 'current state:', isAddFormOpen);
      
      if (shouldKeepFormOpen && !isAddFormOpen && !hasRestoredFormState.current) {
        console.log('🔄 Restoring form state to OPEN');
        setIsAddFormOpen(true);
        hasRestoredFormState.current = true;
      } else if (!shouldKeepFormOpen && isAddFormOpen) {
        console.log('🔄 Restoring form state to CLOSED');
        setIsAddFormOpen(false);
      }
    }
  }, [isAdmin, isAuthLoading]);

  // Efecto para detectar cambios de visibilidad y mantener el estado
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Cuando la página vuelve a ser visible, verificar el estado
        const shouldKeepFormOpen = localStorage.getItem('admin-form-open') === 'true';
        console.log('👁️ Page became visible - localStorage:', shouldKeepFormOpen, 'current state:', isAddFormOpen);
        
        if (shouldKeepFormOpen && !isAddFormOpen) {
          console.log('🔄 Restoring form after visibility change');
          setIsAddFormOpen(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAddFormOpen]);

  const loadAdminData = async () => {
    try {
      // Cargar productos para estadísticas
      const productsData = await productService.getAllProducts();
      setProducts(productsData);
      
      // Actualizar estadísticas
      setStats(prev => prev.map(stat => {
        if (stat.title === "Total Productos") {
          return { ...stat, value: productsData.length.toString() };
        }
        return stat;
      }));
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    // Actualizar estadísticas
    setStats(prev => prev.map(stat => {
      if (stat.title === "Total Productos") {
        return { ...stat, value: (products.length + 1).toString() };
      }
      return stat;
    }));
  };

  const handleAddProduct = async (newProductData) => {
    try {
      const product = await productService.createProduct({
        ...newProductData,
        price: parseFloat(newProductData.price),
        stock_quantity: parseInt(newProductData.stock_quantity) || 0,
        in_stock: (parseInt(newProductData.stock_quantity) || 0) > 0
      });
      
      setFormOpen(false);
      
      // Importar toast dinámicamente
      const { toast } = await import('@/components/ui/use-toast');
      toast({
        title: "¡Producto agregado!",
        description: `${product.name} ha sido agregado al catálogo`,
      });
      
      // Notificar que se agregó el producto
      handleProductAdded(product);
    } catch (error) {
      console.error('Error adding product:', error);
      const { toast } = await import('@/components/ui/use-toast');
      toast({
        title: "Error al agregar producto",
        description: "No se pudo agregar el producto. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isAuthLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sillage-gold mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-muted-foreground">
              Verificando permisos...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // Solo mostrar acceso denegado después de que la autenticación esté completamente cargada
  if (!isAdmin) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-destructive mb-4">
              Acceso Denegado
            </h1>
            <p className="text-muted-foreground">
              No tienes permisos para acceder al panel de administración.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page min-h-screen py-8">
      <Helmet>
        <title>Panel de Administración - Sillage-Perfum</title>
        <meta name="description" content="Gestiona productos, pedidos y configuraciones de la tienda." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="admin-title text-4xl font-display font-bold">
            Panel de Administración
          </h1>
          <p className="admin-subtitle">
            Bienvenido, {user?.email}. Gestiona tu tienda desde aquí.
          </p>
        </motion.div>

        <Tabs defaultValue="dashboard" className="admin-tabs space-y-8">
          <TabsList className="tabs-list">
            <TabsTrigger value="dashboard" className="tabs-trigger">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="tabs-trigger">
              Productos
            </TabsTrigger>
            <TabsTrigger value="orders" className="tabs-trigger">
              Pedidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard 
              stats={stats} 
              products={products} 
              onProductAdded={handleProductAdded}
              onOpenAddForm={() => {
                console.log('🚀 Button clicked - Opening form');
                setFormOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
        </Tabs>

        {/* Diálogo para agregar producto - Persiste entre pestañas y no se cierra automáticamente */}
        <Dialog 
          open={isAddFormOpen} 
          onOpenChange={() => {
            // Completamente deshabilitado - solo se puede cerrar con los botones del formulario
            // No hacer nada aquí para prevenir cualquier cierre automático
          }}
        >
          <DialogContent 
            className="admin-dialog max-w-4xl max-h-[90vh] overflow-y-auto"
            onPointerDownOutside={(e) => {
              // Prevenir cierre al hacer clic fuera del diálogo
              e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              // Prevenir cierre con tecla Escape
              e.preventDefault();
            }}
            onInteractOutside={(e) => {
              // Prevenir cierre por interacciones externas
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle className="admin-text font-semibold text-lg">Agregar Nuevo Producto</DialogTitle>
              <DialogDescription className="admin-text-muted">
                Completa los detalles del producto. Usa los botones Guardar o Cancelar para cerrar el formulario.
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
              onSubmit={handleAddProduct}
              initialData={null}
              onCancel={() => setFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;