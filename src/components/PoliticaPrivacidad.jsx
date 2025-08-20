import React from 'react';
import { motion } from 'framer-motion';
import ContactButton from './contactButton';

const PoliticaPrivacidad = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-background min-h-screen"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-display font-bold text-foreground mb-6">Política de Privacidad de SILLAGE PERFUM SpA</h2>

        <div className="space-y-6 text-sillage-gold-dark">
          <p>
            En SILLAGE PERFUM SpA, nos comprometemos a proteger la privacidad y seguridad de los datos personales
            de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos
            tu información personal de acuerdo con la Ley Nº 19.628 sobre Protección de la Vida Privada de Chile.
          </p>

          <div>
            <h3 className="text-xl font-semibold text-foreground">1. Información que Recopilamos</h3>
            <p>Recopilamos la siguiente información personal cuando interactúas con nuestro sitio:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Datos de identificación:</strong> Nombre completo, RUT, dirección de correo electrónico</li>
              <li><strong>Datos de contacto:</strong> Dirección física, número de teléfono</li>
              <li><strong>Datos de transacciones:</strong> Historial de compras, métodos de pago, información de envío</li>
              <li><strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, dispositivo, cookies</li>
              <li><strong>Preferencias:</strong> Preferencias de marketing, consentimientos</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">2. Finalidades del Tratamiento de Datos</h3>
            <p>Utilizamos tu información personal para las siguientes finalidades:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Gestionar y procesar tus pedidos y compras</li>
              <li>Procesar pagos y emitir boletas o facturas electrónicas</li>
              <li>Gestionar el despacho y entrega de productos</li>
              <li>Brindar soporte al cliente y gestionar reclamos</li>
              <li>Enviar comunicaciones informativas y promocionales (con tu consentimiento)</li>
              <li>Mejorar nuestros productos, servicios y experiencia de usuario</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">3. Base Legal del Tratamiento</h3>
            <p>El tratamiento de tus datos personales se basa en:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Ejecución del contrato:</strong> Para procesar tus compras y entregar los productos</li>
              <li><strong>Consentimiento:</strong> Para marketing y comunicaciones promocionales</li>
              <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir fraudes</li>
              <li><strong>Cumplimiento legal:</strong> Para obligaciones tributarias y contables</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">4. Protección y Seguridad de Datos</h3>
            <p>
              Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos personales
              contra accesos no autorizados, pérdida, destrucción o daño. Estas medidas incluyen:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Encriptación de datos sensibles</li>
              <li>Control de acceso restringido</li>
              <li>Monitoreo continuo de seguridad</li>
              <li>Protocolos de respuesta ante incidentes</li>
              <li>Copias de seguridad regulares</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">5. Compartir Datos con Terceros</h3>
            <p>Podemos compartir tu información con:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Proveedores de servicios:</strong> Empresas de transporte (Starken, Blue Express) para entregas</li>
              <li><strong>Proveedores de pago:</strong> Procesadores de tarjetas de crédito/débito</li>
              <li><strong>Autoridades:</strong> Cuando sea requerido por ley o regulación aplicable</li>
              <li><strong>Proveedores tecnológicos:</strong> Servicios de hosting, analytics y soporte técnico</li>
            </ul>
            <p className="mt-2">
              <strong>No vendemos ni alquilamos tu información personal a terceros con fines comerciales.</strong>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">6. Conservación de Datos</h3>
            <p>
              Conservaremos tus datos personales durante el tiempo necesario para cumplir con las finalidades
              para las que fueron recopilados, incluyendo el cumplimiento de obligaciones legales, contables
              o de reporting. Los períodos específicos de conservación son:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Datos de transacciones:</strong> 6 años (obligación legal tributaria)</li>
              <li><strong>Datos de clientes activos:</strong> Mientras mantengas una relación comercial con nosotros</li>
              <li><strong>Datos de marketing:</strong> Hasta que revoques tu consentimiento</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">7. Tus Derechos</h3>
            <p>De acuerdo con la ley chilena, tienes derecho a:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Acceso:</strong> Solicitar información sobre tus datos que tratamos</li>
              <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos</li>
              <li><strong>Cancelación:</strong> Solicitar la eliminación de tus datos personales</li>
              <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
              <li><strong>Revocación:</strong> Retirar tu consentimiento en cualquier momento</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">8. Transferencias Internacionales</h3>
            <p>
              Tus datos personales se procesan y almacenan principalmente en Chile. En caso de que utilicemos
              servicios de proveedores internacionales, nos aseguraremos de que existan garantías adecuadas
              para la protección de tus datos, como cláusulas contractuales estándar o certificaciones de privacidad.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">9. Cambios en esta Política</h3>
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras
              prácticas o por requisitos legales. Te notificaremos sobre cambios significativos mediante un
              aviso visible en nuestro sitio web o por correo electrónico.
            </p>
            <p className="mt-2"><strong>Última actualización:</strong> Agosto 2025</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">10. Contacto</h3>
            <p>
              Si tienes preguntas sobre esta Política de Privacidad, deseas ejercer tus derechos o tienes
              inquietudes sobre el tratamiento de tus datos personales, puedes contactarnos a través de:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong>Correo electrónico:</strong>{' '}
                <a
                  href="mailto:ventas@sillageperfum.cl"
                  className="text-foreground hover:underline"
                >
                  ventas@sillageperfum.cl
                </a>
              </li>
              <li className="flex items-center gap-2">
                <strong>Formulario de contacto:</strong>
                <ContactButton />
              </li>
              <li>
                <strong>Dirección comercial:</strong> Miguel Claro 070, local 60, Providencia, Santiago, Chile
              </li>
              <li>
                <strong>Horario de atención:</strong> Lunes a Viernes de 9:00 a 18:00 horas
              </li>
            </ul>
            <p className="mt-2">
              Nos comprometemos a responder todas las solicitudes legítimas en un plazo máximo de
              10 días hábiles, de acuerdo con la legislación chilena aplicable.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default PoliticaPrivacidad;