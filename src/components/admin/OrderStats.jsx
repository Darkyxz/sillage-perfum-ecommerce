import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Calendar,
  Users,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { orderAutomationService } from '@/lib/orderAutomationService';

const OrderStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [automationRunning, setAutomationRunning] = useState(false);
  const [expiringOrders, setExpiringOrders] = useState([]);

  useEffect(() => {
    loadStats();
    loadExpiringOrders();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await orderAutomationService.getOrderStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        title: "Error al cargar estadísticas",
        description: "No se pudieron cargar las estadísticas de pedidos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadExpiringOrders = async () => {
    try {
      const data = await orderAutomationService.getExpiringOrders();
      setExpiringOrders(data);
    } catch (error) {
      console.error('Error loading expiring orders:', error);
    }
  };

  const runAutomation = async () => {
    try {
      setAutomationRunning(true);
      const result = await orderAutomationService.autoCompleteOrders();
      
      toast({
        title: "Automatización completada",
        description: `${result.completedCount} pedidos marcados como entregados automáticamente`,
      });
      
      // Recargar estadísticas
      await loadStats();
    } catch (error) {
      console.error('Error running automation:', error);
      toast({
        title: "Error en automatización",
        description: "No se pudo ejecutar la automatización de pedidos",
        variant: "destructive"
      });
    } finally {
      setAutomationRunning(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'shipped': return 'text-blue-400';
      case 'delivered': return 'text-purple-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <DollarSign className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'shipped': return <Package className="h-4 w-4" />;
      case 'delivered': return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="glass-effect border-white/10 animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-8 bg-white/20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 mb-8">
      {/* Tarjetas principales de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Pedidos</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Ingresos Total</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.revenue.total)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Esta Semana</p>
                <p className="text-2xl font-bold text-white">{stats.recent.week}</p>
                <p className="text-xs text-white/60">{formatCurrency(stats.revenue.week)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Pedidos Hoy</p>
                <p className="text-2xl font-bold text-white">{stats.recent.today}</p>
                <p className="text-xs text-white/60">{formatCurrency(stats.revenue.today)}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas por estado y automatización */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estados de pedidos */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5" />
              Pedidos por Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={getStatusColor(status)}>
                      {getStatusIcon(status)}
                    </span>
                    <span className="text-white capitalize">{status}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{count}</p>
                    <p className="text-xs text-white/60">
                      {formatCurrency(stats.revenueByStatus[status] || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Panel de automatización */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Automatización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Auto-completar pedidos</p>
                  <p className="text-xs text-white/60">
                    Marca como entregados los pedidos enviados hace más de 7 días
                  </p>
                </div>
                <Button
                  onClick={runAutomation}
                  disabled={automationRunning}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {automationRunning ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {expiringOrders.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white font-medium mb-2">Pedidos pendientes</p>
                  <div className="space-y-2">
                    {expiringOrders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex items-center justify-between text-sm">
                        <span className="text-white/80">#{order.id}</span>
                        <span className="text-orange-400">{order.daysSinceCreated} días</span>
                      </div>
                    ))}
                    {expiringOrders.length > 3 && (
                      <p className="text-xs text-white/60">
                        +{expiringOrders.length - 3} más...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderStats;
