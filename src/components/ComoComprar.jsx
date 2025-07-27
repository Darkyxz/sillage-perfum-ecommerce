import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard,
  Banknote,
  Smartphone,
  QrCode
} from 'lucide-react';

// Importar logos de bancos (necesitarás tener estos archivos en tu proyecto)
import BancoEstadoLogo from '/images/bancoestado.jpg';
import BciLogo from '/images/bci.png';
import MachLogo from '/images/mach.png';
import BancoChileLogo from '/images/banco-chile.png';

const ComoComprar = () => {
  return (
    <section id="como-comprar" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Cómo Comprar
          </h2>
          <p className="text-lg text-sillage-gold-dark max-w-2xl mx-auto">
            Selecciona tu método de pago preferido y sigue las instrucciones
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <button className="flex flex-col items-center justify-center p-4 border border-sillage-gold rounded-lg hover:bg-card transition-all">
            <CreditCard className="h-8 w-8 text-sillage-gold-dark mb-2" />
            <span className="font-medium">Tarjeta de Crédito</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-sillage-gold rounded-lg hover:bg-card transition-all">
            <Banknote className="h-8 w-8 text-sillage-gold-dark mb-2" />
            <span className="font-medium">Transfere	ncia Bancaria</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-sillage-gold rounded-lg hover:bg-card transition-all">
            <Smartphone className="h-8 w-8 text-sillage-gold-dark mb-2" />
            <span className="font-medium">Pago Móvil</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-sillage-gold rounded-lg hover:bg-card transition-all">
            <QrCode className="h-8 w-8 text-sillage-gold-dark mb-2" />
            <span className="font-medium">Webpay</span>
          </button>
        </div>

        {/* Sección de Transferencias Bancarias */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-lg p-6 shadow-lg"
        >
          <h3 className="text-xl font-display font-semibold text-sillage-gold-dark mb-6">
            Transferencias Bancarias
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Banco 1 */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center mb-4">
                <img src={BancoEstadoLogo} alt="Banco Estado" className="h-8 mr-3" />
                <h4 className="font-medium">Banco Estado</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nombre:</span> SILLAGE PERFUM SPA</p>
                <p><span className="font-medium">RUT:</span> 77.762.884-4</p>
                <p><span className="font-medium">Tipo de Cuenta:</span> Cuenta Vista</p>
                <p><span className="font-medium">N° Cuenta:</span> 90271739264</p>
                <p><span className="font-medium">Email:</span> ventas@sillageperfum.cl</p>
              </div>
            </div>

            {/* Banco 2 */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center mb-4">
                <img src={BciLogo} alt="Banco BCI" className="h-8 mr-3" />
                <h4 className="font-medium">Banco BCI</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nombre:</span> SILLAGE PERFUM SPA</p>
                <p><span className="font-medium">RUT:</span> 77.762.884-4</p>
                <p><span className="font-medium">Tipo de Cuenta:</span> Cuenta Corriente</p>
                <p><span className="font-medium">N° Cuenta:</span> 86120921</p>
                <p><span className="font-medium">Email:</span> ventas@sillageperfum.cl</p>
              </div>
            </div>

            {/* Banco 3 */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center mb-4">
                <img src={MachLogo} alt="Banco Mach" className="h-8 mr-3" />
                <h4 className="font-medium">Mach</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nombre:</span> CRISTIAN MEDINA LORCA</p>
                <p><span className="font-medium">RUT:</span> 12.080.021-3</p>
                <p><span className="font-medium">Tipo de Cuenta:</span> Cuenta Vista</p>
                <p><span className="font-medium">N° Cuenta:</span> 777012080021</p>
                <p><span className="font-medium">Email:</span> ventas@sillageperfum.cl</p>
              </div>
            </div>

            {/* Banco 4 */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center mb-4">
                <img src={BancoChileLogo} alt="Banco de Chile" className="h-8 mr-3" />
                <h4 className="font-medium">Banco de Chile</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nombre:</span> SILLAGE PERFUM SPA</p>
                <p><span className="font-medium">RUT:</span> 77.762.884-4</p>
                <p><span className="font-medium">Tipo de Cuenta:</span> Cuenta Corriente</p>
                <p><span className="font-medium">N° Cuenta:</span> 123456789</p>
                <p><span className="font-medium">Email:</span> ventas@sillageperfum.cl</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sección de otros métodos de pago */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="border border-border rounded-lg p-6">
            <h4 className="font-display font-semibold text-sillage-gold-dark mb-4">Pago con Aplicaciones</h4>
            <p className="text-sm mb-4">Puedes realizar pagos mediante:</p>
            <ul className="space-y-2 text-sm">
              <li>- Mercado Pago</li>
              <li>- Tenpo</li>
              <li>- Mach</li>
            </ul>
          </div>

          <div className="border border-border rounded-lg p-6">
            <h4 className="font-display font-semibold text-sillage-gold-dark mb-4">Webpay</h4>
            <p className="text-sm">Pago seguro con tarjetas de crédito, débito y transferencias bancarias a través de Webpay Plus.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComoComprar;