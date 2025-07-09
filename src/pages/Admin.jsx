import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Package, BarChart3, Users, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ProductManagement from '@/components/admin/ProductManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import { productService } from '@/lib/productService';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState([
    {
      title: "Total Productos",
      value: "0",
      icon: Package,
      color: "text-yellow-400"
    },
    {
      title: "Ventas del Mes",
      value: "$0",
      icon: DollarSign,
      color: "text-yellow-400"
    },
    {
      title: "Usuarios Activos",
      value: "0",
      icon: Users,
      color: "text-yellow-400"
    },
    {
      title: "Pedidos Pendientes",
      value: "0",
      icon: BarChart3,
      color: "text-yellow-400"
    }
  ]);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-yellow-50 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-yellow-100/80">
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
            <AdminDashboard stats={stats} products={products} onProductAdded={handleProductAdded} />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;