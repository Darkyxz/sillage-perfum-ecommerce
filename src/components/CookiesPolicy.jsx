import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ContactButton from './contactButton';

const CookiesPolicy = () => {
  const [cookiesEnabled, setCookiesEnabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkCookies = () => {
      try {
        // Test if cookies can be set/read
        document.cookie = 'cookie_test=1; SameSite=Lax; path=/';
        const cookiesWorking = document.cookie.includes('cookie_test');
        document.cookie = 'cookie_test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        setCookiesEnabled(cookiesWorking);
      } catch (e) {
        setCookiesEnabled(false);
      }
    };

    checkCookies();
  }, []);

  // Mostrar advertencia si las cookies están deshabilitadas, pero no bloquear
  const cookieWarning = !cookiesEnabled && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center space-x-2">
        <span className="text-amber-600">⚠️</span>
        <div>
          <h3 className="font-semibold text-amber-800">Cookies Deshabilitadas</h3>
          <p className="text-sm text-amber-700">
            Las cookies están deshabilitadas en tu navegador. Algunas funciones pueden tener limitaciones.
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-background min-h-screen"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-display font-bold text-foreground mb-6">Política de Cookies de SILLAGE PERFUM SpA</h2>

        {cookieWarning}

        <div className="space-y-6 text-sillage-gold-dark">
          <div>
            <h3 className="text-xl font-semibold text-foreground">1. ¿Qué son las cookies?</h3>
            <p>
              Las cookies son pequeños archivos de texto que su navegador guarda en su
              disco duro o el dispositivo a través del cual se acceda al sitio web.
              Estas permiten almacenar información sobre su interacción con el sitio,
              como preferencias de navegación, inicio de sesión, idioma, entre otros,
              con el fin de mejorar la experiencia del usuario.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">2. Tipos de cookies que utilizamos</h3>
            <p>
              Nuestro sitio web utiliza cookies propias y de terceros para diversas
              finalidades. A continuación, te explicamos los tipos de cookies que
              podrías encontrar al navegar en nuestro sitio:
            </p>

            <h4 className="text-lg text-foreground font-semibold mt-4">a) Cookies estrictamente necesarias</h4>
            <p>
              Son esenciales para el funcionamiento del sitio web y no requieren
              consentimiento. Permiten funciones básicas como la navegación segura, el
              acceso a áreas protegidas del sitio o el correcto funcionamiento del
              carrito de compras.
            </p>

            <h4 className="text-lg text-foreground font-semibold mt-4">b) Cookies de rendimiento o análisis</h4>
            <p>
              Nos permiten recopilar información sobre el comportamiento de los
              usuarios dentro del sitio (por ejemplo, páginas visitadas, tiempo de
              permanencia), con el objetivo de mejorar el rendimiento y la usabilidad
              del sitio.
            </p>

            <h4 className="text-lg text-foreground font-semibold mt-4">c) Cookies de funcionalidad</h4>
            <p>
              Estas cookies permiten recordar elecciones hechas por el usuario (como
              el idioma o región) y proporcionan características mejoradas y
              personalizadas.
            </p>

            <h4 className="text-lg text-foreground font-semibold mt-4">d) Cookies de publicidad o marketing</h4>
            <p>
              Se utilizan para mostrar anuncios relevantes para el usuario, tanto
              dentro como fuera de nuestro sitio.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">3. Cookies de terceros</h3>
            <p>
              Este sitio puede utilizar servicios de terceros que instalan cookies
              para cumplir sus funciones.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">4. ¿Cómo puedo gestionar las cookies?</h3>
            <p>
              Al ingresar a nuestro sitio por primera vez, verás un aviso o banner de
              cookies donde puedes aceptar, rechazar o configurar tus preferencias.
              Además, puedes modificar o revocar tu consentimiento en cualquier
              momento.
            </p>
            <p>
              También puedes gestionar las cookies directamente desde la configuración
              de tu navegador.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">5. Actualizaciones de esta política</h3>
            <p>
              Podremos modificar esta Política de Cookies en cualquier momento para
              adaptarla a cambios legales, técnicos o comerciales. Se recomienda
              revisar esta sección periódicamente.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">6. Contacto</h3>
            <p>
              Si tienes dudas sobre nuestra Política de Cookies, puedes escribirnos a:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong>Correo:</strong>{' '}
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
                <strong>Domicilio:</strong> Miguel Claro 070, local 60, Comuna de Providencia, Ciudad
                de Santiago, Chile.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CookiesPolicy;