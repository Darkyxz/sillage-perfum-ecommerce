import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Hourglass, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const PaymentPendingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <Helmet>
        <title>Pago Pendiente - Sillage-Perfum</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 max-w-md"
      >
        <Card className="glass-effect border-primary/50 text-center">
          <CardHeader>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-primary to-sillage-gold mb-4">
              <Hourglass className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-display font-bold text-foreground">
              Pago Pendiente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-lg">
              Tu pago está siendo procesado y estamos a la espera de la confirmación.
            </p>
             <p className="text-muted-foreground/80 text-sm">
              No necesitas hacer nada más. Te notificaremos por email cuando el pago se acredite. El estado de tu pedido se actualizará automáticamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/productos">
                <Button className="w-full sm:w-auto floating-button-secondary text-foreground font-semibold">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Seguir Comprando
                </Button>
              </Link>
              <Link to="/perfil">
                <Button variant="outline" className="w-full sm:w-auto glass-effect border-border/30 text-foreground hover:bg-accent/10">
                  Ver Mis Pedidos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentPendingPage;