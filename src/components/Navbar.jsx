
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
    <nav className="bg-slate-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:opacity-80 transition-opacity">
          PerfumeParadise
        </Link>
        <div className="space-x-2 md:space-x-4 flex items-center">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors p-2 rounded-md hover:bg-slate-700/50">
            <Home size={22} />
            <span className="sr-only">Inicio</span>
          </Link>
          <Link to="/products" className="text-gray-300 hover:text-white transition-colors p-2 rounded-md hover:bg-slate-700/50">
            Perfumes
          </Link>
          <Button variant="ghost" onClick={handleFeatureNotImplemented} className="text-gray-300 hover:text-white hover:bg-slate-700/50 relative">
            Ofertas
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 animate-pulse">
              40%
            </span>
          </Button>
          <Link to="/cart" className="text-[#c4965a] hover:text-[#f0c674] transition-colors p-2 rounded-md hover:bg-slate-700/50 relative">
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 bg-[#f0c674] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              2
            </span>
            <span className="sr-only">Carrito</span>
          </Link>
          <Link to="/profile" className="text-gray-300 hover:text-white transition-colors p-2 rounded-md hover:bg-slate-700/50">
            <User size={22} />
            <span className="sr-only">Perfil</span>
          </Link>
          <Link to="/admin" className="text-gray-300 hover:text-white transition-colors p-2 rounded-md hover:bg-slate-700/50">
            <ShieldCheck size={22} />
            <span className="sr-only">Admin</span>
          </Link>
          <Link to="/login">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold">
              Ingresar
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
  