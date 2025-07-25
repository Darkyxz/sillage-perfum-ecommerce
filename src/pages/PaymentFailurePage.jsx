import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { XCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const PaymentFailurePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <Helmet>
        <title>Pago Fallido - Sillage-Perfum</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 max-w-md"
      >
        <Card className="glass-effect border-red-500/50 text-center">
          <CardHeader>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 mb-4">
              <XCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-display font-bold text-white">
              Pago Rechazado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-white/80 text-lg">
              No pudimos procesar tu pago. Por favor, verifica tus datos o intenta con otro medio de pago.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/productos">
                <Button className="w-full sm:w-auto floating-button-secondary text-white font-semibold">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Ver Productos
                </Button>
              </Link>
              <Link to="/carrito">
                <Button variant="outline" className="w-full sm:w-auto glass-effect border-white/30 text-white hover:bg-white/10">
                  Volver al Carrito
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentFailurePage;