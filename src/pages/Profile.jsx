
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import OrdersSection from '@/components/profile/OrdersSection';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Inicia sesión para ver tu perfil
            </h1>
            <p className="text-muted-foreground">
              Necesitas estar logueado para acceder a esta página.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>Mi Perfil - Sillage-Perfum</title>
        <meta name="description" content="Gestiona tu perfil, pedidos y preferencias de cuenta." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Mi Perfil
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu cuenta y revisa tu historial de compras
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-sillage-gold/10 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-white text-sillage-gold-dark shadow-sm'
                  : 'text-gray-600 hover:text-sillage-gold-dark'
              }`}
            >
              Información Personal
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-white text-sillage-gold-dark shadow-sm'
                  : 'text-gray-600 hover:text-sillage-gold-dark'
              }`}
            >
              Mis Pedidos
            </button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card className="bg-background/80 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Mi Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-border/50 text-foreground hover:bg-accent/50 hover:text-foreground"
                    onClick={logout}
                  >
                    Cerrar sesión
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <OrdersSection />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
