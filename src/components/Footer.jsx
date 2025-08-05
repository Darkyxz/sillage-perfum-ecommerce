import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { FaWhatsapp, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-12 md:pt-16 pb-6 md:pb-8 mt-16 md:mt-20 w-full" style={{ margin: 0, width: '100%', maxWidth: '100%' }}>
      <div className="w-full px-4" style={{ margin: 0, boxSizing: 'border-box' }}>
        {/* Sección principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">

          {/* Información de la empresa */}
          <div className="lg:col-span-1 text-center">
            <div className="mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2 md:mb-3">Sillage Perfum</h3>
              <p className="text-sillage-gold-dark text-sm leading-relaxed mb-3 md:mb-4">
                Despierta tus sentidos con una fragancia única,pensando para ti, y El aroma que te define. obteniendo Un toque de elegancia en cada
                ocasión, Descubre el perfume que cuenta tu historia.
              </p>
              <p className="text-sillage-gold-dark text-sm leading-relaxed mb-3 md:mb-4">Sumérgete en un mundo de aromas exquisitos. Y duraderos.</p>
            </div>

            {/* Redes sociales */}
            <div className="flex space-x-3 md:space-x-4 justify-center">
              <a
                href="#"
                className="w-8 h-8 md:w-12 md:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center relative overflow-hidden group transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                {/* Fondo de gradiente (solo visible en hover) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#833AB4] via-[#C13584] to-[#E1306C] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Icono */}
                <Instagram className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-white relative z-10 transition-colors duration-300" />
              </a>
              <a href="#" className="w-8 h-8 md:w-12 md:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-300 shadow-sm hover:shadow-md group">
                <Facebook className="w-4 h-4 md:w-5 md:h-5 text-[#1877F2] group-hover:text-white" />
              </a>
              <a href="#" className="w-8 h-8 md:w-12 md:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center relative overflow-hidden group transition-all duration-300 shadow-sm hover:shadow-lg"				>
                {/* Fondo gradiente (hover) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#25F4EE] via-[#000000] to-[#FE2C55] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Icono de TikTok */}
                <FaTiktok className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-white relative z-10 transition-colors duration-300" />
              </a>
              <a href="#" className="w-8 h-8 md:w-12 md:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center relative overflow-hidden group transition-all duration-300 shadow-sm hover:shadow-lg"				>
                <div className="absolute inset-0 bg-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FaWhatsapp className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-white relative z-10 transition-colors duration-300" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="text-center">
            <h4 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><Link to="/" className="text-sillage-gold-dark hover:text-sillage-gold-bright transition-colors text-sm">Inicio</Link></li>
              <li><Link to="/productos" className="text-sillage-gold-dark hover:text-sillage-gold-bright transition-colors text-sm">Catálogo</Link></li>
              <li><Link to="/contacto" className="text-sillage-gold-dark hover:text-sillage-gold-bright transition-colors text-sm">Contacto</Link></li>
              <li><Link to="/listado" className="text-sillage-gold-dark hover:text-sillage-gold-bright transition-colors text-sm">Listado</Link></li>
              <li>
                <button
                  onClick={() => {
                    const aboutSection = document.getElementById('about-section');
                    if (aboutSection) {
                      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      window.location.href = '/#about';
                    }
                  }}
                  className="text-sillage-gold-dark hover:text-sillage-gold-bright transition-colors text-sm"
                >
                  Sobre Nosotros
                </button>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div className="text-center">
            <h4 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Información</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><Link to="/rastrear-pedido" className="text-sillage-gold-dark hover:text-sillage-gold-bright transition-colors text-sm">Rastrear mi Pedido</Link></li>
              <li><a href="#" className="text-sillage-gold-dark hover:text-sillage-gold-bright transition-colors text-sm">Política de Reembolsos</a></li>
              <li><a href="#" className="text-sillage-gold-dark hover:text-sillage-gold-bright transition-colors text-sm">Políticas de Privacidad</a></li>
              <li><a href="#" className="text-sillage-gold-dark hover:text-sillage-gold-bright transition-colors text-sm">Términos y Condiciones</a></li>
              <li><a href="#" className="text-sillage-gold-dark hover:text-sillage-gold-bright transition-colors text-sm">Políticas de Envío</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="text-center">
            <h4 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Contacto</h4>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-start space-x-2 md:space-x-3 justify-center">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-sillage-gold-dark mt-0.5 flex-shrink-0" />
                <div className="text-center">
                  <p className="text-sillage-gold-dark text-sm">Av. Providencia 1100 Local 60</p>
                  <p className="text-sillage-gold-dark text-sm">Santiago, Chile</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 md:space-x-3 justify-center">
                <Phone className="w-3 h-3 md:w-4 md:h-4 text-sillage-gold-dark flex-shrink-0" />
                <p className="text-sillage-gold-dark text-sm">+56 9 9 73749375</p>
              </div>

              <div className="flex items-center space-x-2 md:space-x-3 justify-center">
                <Mail className="w-3 h-3 md:w-4 md:h-4 text-sillage-gold-dark flex-shrink-0" />
                <p className="text-sillage-gold-dark text-sm">ventas@sillageperfum.cl</p>
              </div>

              <div className="flex items-start space-x-2 md:space-x-3 justify-center">
                <Clock className="w-3 h-3 md:w-4 md:h-4 text-sillage-gold-dark mt-0.5 flex-shrink-0" />
                <div className="text-center">
                  <p className="text-sillage-gold-dark text-sm">Lun - Vie: 11:00 - 18:00</p>
                  <p className="text-sillage-gold-dark text-sm">Sáb: 11:00 - 14:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-secondary rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <div className="text-center max-w-md mx-auto">
            <h4 className="text-base md:text-lg font-semibold text-foreground mb-2">Suscribete</h4>
            <p className="text-sillage-gold-dark text-sm mb-3 md:mb-4">Suscribete a nuestro bolietin para saber de nuestras promociones.</p>
            <p className="text-sillage-gold-dark text-sm mb-3 md:mb-4">Introduce tu correo electronico.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-3 md:px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm placeholder:text-muted-foreground"
              />
              <button className="bg-gradient-to-r from-sillage-gold to-sillage-gold-dark hover:from-sillage-gold-bright hover:to-sillage-gold text-white px-4 md:px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Unirse
              </button>
            </div>
          </div><br></br>
          <div className="text-center max-w mx-auto">
            <p className="text-sillage-gold-dark text-sm mb-3 md:mb-4">*Al completar el formulario te registras para recibir nuestros correos electornicos y puedes darte de baja en cualquier momento.</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-3 md:space-y-0">
            <p className="text-sillage-gold-deep text-xs md:text-sm">
              © 2025 Sillage Perfum. Todos los derechos reservados. - Desarrollada por Circuit-Service.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6 text-xs md:text-sm text-sillage-gold-deep">
              <a href="/privacidad" className="hover:text-sillage-gold-bright transition-colors">Política de Privacidad</a>
              <a href="/terminos" className="hover:text-sillage-gold-bright transition-colors">Términos de Uso</a>
              <a href="/cookies" className="hover:text-sillage-gold-bright transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

