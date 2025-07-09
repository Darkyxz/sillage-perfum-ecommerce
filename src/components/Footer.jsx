import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        {/* Sección principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Información de la empresa */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">Sillage Perfum</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Descubre la esencia de tu personalidad con nuestra exclusiva colección de perfumes premium. 
                Cada fragancia cuenta una historia única.
              </p>
            </div>
            
            {/* Redes sociales */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors group">
                <Instagram className="w-4 h-4 text-gray-600 group-hover:text-amber-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors group">
                <Facebook className="w-4 h-4 text-gray-600 group-hover:text-amber-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors group">
                <Twitter className="w-4 h-4 text-gray-600 group-hover:text-amber-600" />
              </a>
            </div>
          </div>
          
          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">Inicio</Link></li>
              <li><Link to="/productos" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">Catálogo</Link></li>
              <li><Link to="/sobre-nosotros" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">Sobre Nosotros</Link></li>
              <li><Link to="/contacto" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">Contacto</Link></li>
              <li><Link to="/perfil" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">Mi Cuenta</Link></li>
            </ul>
          </div>
          
          {/* Información */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">Políticas de Privacidad</a></li>
              <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">Términos y Condiciones</a></li>
              <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">Envíos y Devoluciones</a></li>
              <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">Preguntas Frecuentes</a></li>
              <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">Guía de Tallas</a></li>
            </ul>
          </div>
          
          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-600 text-sm">Av. Providencia 123</p>
                  <p className="text-gray-600 text-sm">Santiago, Chile</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-gray-600 text-sm">+56 9 1234 5678</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-gray-600 text-sm">info@sillageperfum.cl</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-600 text-sm">Lun - Vie: 9:00 - 18:00</p>
                  <p className="text-gray-600 text-sm">Sáb: 10:00 - 14:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="text-center max-w-md mx-auto">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Mantente Informado</h4>
            <p className="text-gray-600 text-sm mb-4">Recibe las últimas novedades y ofertas exclusivas</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              />
              <button className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2024 Sillage Perfum. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-amber-600 transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-amber-600 transition-colors">Términos de Uso</a>
              <a href="#" className="hover:text-amber-600 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  