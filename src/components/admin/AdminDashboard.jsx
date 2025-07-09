import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import OrderStats from './OrderStats';

const AdminDashboard = ({ stats, products }) => {
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
            <Card className="admin-panel border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="admin-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Productos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-white/60 text-sm">{product.brand}</p>
                  </div>
                  <span className="text-white font-bold">${product.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="admin-panel border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => toast({ title: "Agregar Producto", description: "Navega a la pestaña 'Productos' para agregar."})}
              className="w-full floating-button text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>
            
            <Button
              variant="outline"
              className="w-full glass-effect border-white/30 text-white hover:bg-white/10"
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