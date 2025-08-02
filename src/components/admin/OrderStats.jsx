import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, Users, TrendingUp, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

const OrderStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas básicas
      const [ordersResponse, usersResponse] = await Promise.all([
        apiClient.get('/orders/admin/all').catch(() => ({ success: false, data: [] })),
        apiClient.get('/users/admin/all').catch(() => ({ success: false, data: [] }))
      ]);

      const orders = ordersResponse.success ? ordersResponse.data : [];
      const users = usersResponse.success ? usersResponse.data : [];

      // Calcular estadísticas
      const totalRevenue = orders
        .filter(order => order.status === 'paid' || order.status === 'delivered')
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);

      const pendingOrders = orders.filter(order =>
        order.status === 'pending' || order.status === 'confirmed'
      ).length;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalUsers: users.length,
        pendingOrders
      });

    } catch (error) {
      console.error('Error loading stats:', error);
      // Mantener valores por defecto en caso de error
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const statsData = [
    {
      title: "Total Órdenes",
      value: loading ? "..." : stats.totalOrders.toString(),
      icon: Package,
      color: "text-blue-500"
    },
    {
      title: "Ingresos Totales",
      value: loading ? "..." : formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "text-green-500"
    },
    {
      title: "Total Usuarios",
      value: loading ? "..." : stats.totalUsers.toString(),
      icon: Users,
      color: "text-purple-500"
    },
    {
      title: "Órdenes Pendientes",
      value: loading ? "..." : stats.pendingOrders.toString(),
      icon: TrendingUp,
      color: "text-orange-500"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={stat.title} className="admin-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="admin-text-muted text-sm">{stat.title}</p>
                <p className="admin-value text-2xl font-bold">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderStats;