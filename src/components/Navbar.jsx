
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, ShieldCheck, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const { toast } = useToast();

  const handleFeatureNotImplemented = () => {
    toast({
      title: "🚧 ¡Función en camino!",
      description: "Esta característica aún no está implementada, ¡pero no te preocupes! Puedes solicitarla en tu próximo mensaje. 🚀",
      variant: "default",
    });
  };

  return (
    <nav className="bg-sillage-dark-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sillage-gold-bright via-sillage-gold to-sillage-gold-dark hover:opacity-80 transition-opacity">
          PerfumeParadise
        </Link>
        <div className="space-x-2 md:space-x-4 flex items-center">
          <Link to="/" className="text-sillage-gray-light hover:text-sillage-gold-bright transition-colors p-2 rounded-md hover:bg-sillage-dark/50">
            <Home size={22} />
            <span className="sr-only">Inicio</span>
          </Link>
          <Link to="/products" className="text-sillage-gray-light hover:text-sillage-gold-bright transition-colors p-2 rounded-md hover:bg-sillage-dark/50">
            Perfumes
          </Link>
          <Button variant="ghost" onClick={handleFeatureNotImplemented} className="text-sillage-gray-light hover:text-sillage-gold-bright hover:bg-sillage-dark/50 relative">
            Ofertas
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full px-1 animate-pulse font-bold border-2 border-background shadow-lg">
              40%
            </span>
          </Button>
          <Link to="/cart" className="text-sillage-gold-dark hover:text-sillage-gold-bright transition-colors p-2 rounded-md hover:bg-sillage-dark/50 relative">
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-background shadow-lg">
              2
            </span>
            <span className="sr-only">Carrito</span>
          </Link>
          <Link to="/profile" className="text-sillage-gray-light hover:text-sillage-gold-bright transition-colors p-2 rounded-md hover:bg-sillage-dark/50">
            <User size={22} />
            <span className="sr-only">Perfil</span>
          </Link>
          <Link to="/admin" className="text-sillage-gray-light hover:text-sillage-gold-bright transition-colors p-2 rounded-md hover:bg-sillage-dark/50">
            <ShieldCheck size={22} />
            <span className="sr-only">Admin</span>
          </Link>
          <Link to="/login">
            <Button className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white font-semibold">
              Ingresar
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
  