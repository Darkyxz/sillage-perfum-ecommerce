import { motion } from 'framer-motion';
import {
  Banknote,
  QrCode
} from 'lucide-react';
import { useState } from 'react';

// Importar logos de bancos (necesitarás tener estos archivos en tu proyecto)
import BancoItau from '/images/Itau.png';
import WpayLogo from '/images/webpay-logo.png';

const ComoComprar = () => {
  const [activeTab, setActiveTab] = useState('transferencia');

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

        <div className="flex justify-center gap-6 mb-12">
          <button
            onClick={() => setActiveTab('transferencia')}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-card transition-all w-48 ${activeTab === 'transferencia'
              ? 'border-sillage-gold bg-card'
              : 'border-border'
              }`}
          >
            <Banknote className="h-8 w-8 text-sillage-gold-dark mb-2" />
            <span className="font-medium">Transferencia Bancaria</span>
          </button>
          <button
            onClick={() => setActiveTab('webpay')}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-card transition-all w-48 ${activeTab === 'webpay'
              ? 'border-sillage-gold bg-card'
              : 'border-border'
              }`}
          >
            <QrCode className="h-8 w-8 text-sillage-gold-dark mb-2" />
            <span className="font-medium">Webpay</span>
          </button>
        </div>

        {/* Sección de contenido según pestaña seleccionada */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-lg p-6 shadow-lg"
        >
          {activeTab === 'transferencia' ? (
            <>
              <h3 className="text-xl font-display font-semibold text-sillage-gold-dark mb-6">
                Transferencias Bancarias
              </h3>
              <div className="border border-border rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center mb-4">
                  <img src={BancoItau} alt="Banco Itau" className="h-8 mr-3" />
                  <h4 className="font-medium">Banco Itau</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Nombre:</span> SILLAGE PERFUM SPA</p>
                  <p><span className="font-medium">RUT:</span> 78.194.472-6</p>
                  <p><span className="font-medium">Tipo de Cuenta:</span> Cuenta Corriente</p>
                  <p><span className="font-medium">N° Cuenta:</span> 230395749</p>
                  <p><span className="font-medium">Email:</span> ventas@sillageperfum.cl</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-display font-semibold text-sillage-gold-dark mb-6">
                Webpay
              </h3>
              <div className="border border-border rounded-lg p-4 max-w-md mx-auto">
                <div className="flex flex-col items-center">
                  <h4 className="font-medium mb-4">Pagar con Transkbank</h4>
                 <a href="https://www.webpay.cl/company/165159?utm_source=transbank&utm_medium=portal3.0&utm_campaign=link_portal"><img src={WpayLogo} alt="Webpay" className="h-8 mb-4" /></a>
                  <form
                    name='rec20108_btn1'
                    method='post'
                    action='https://www.webpay.cl/backpub/external/form-pay'
                  >
                    <input type='hidden' name='idFormulario' value='299617' />
                    <input type='hidden' name='monto' value='100' />
                    <input
                      type='image'
                      title='Imagen'
                      name='button1'
                      src='https://www.webpay.cl/assets/img/boton_webpaycl.svg'
                      value='Boton 1'
                      alt="Pagar con Webpay"
                      className="cursor-pointer"
                    />
                  </form>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ComoComprar;