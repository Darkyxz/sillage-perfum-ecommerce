import React from 'react';
import { motion } from 'framer-motion';
import ContactButton from './contactButton';

const TerminosCondiciones = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-background"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-display font-bold text-foreground mb-6">TÉRMINOS Y CONDICIONES DE USO DEL SITIO WEB DE SILLAGE PERFUM SpA</h2>

        <div className="space-y-6 text-sillage-gold-dark">
          <p>
            Estos Términos y Condiciones regulan el acceso, uso, navegación y
            operación del sitio web de SILLAGE PERFUM SpA (en adelante, el
            "Sitio"). Al ingresar al Sitio, el usuario (en adelante, el
            "Usuario") declara haber leído, comprendido y aceptado plenamente
            estos Términos y Condiciones, junto con la Política de Privacidad y la
            Política de Cookies. Si el Usuario no está de acuerdo con alguno de los
            términos, deberá abstenerse de utilizar el Sitio.
          </p>

          <div>
            <h3 className="text-xl font-semibold text-foreground">1. Alcance y Modificaciones</h3>
            <p>
              Estos Términos y Condiciones aplican exclusivamente al uso del Sitio
              dentro del territorio de la República de Chile. SILLAGE PERFUM SpA se
              reserva el derecho de modificar, actualizar o eliminar estos Términos en
              cualquier momento, sin necesidad de aviso previo. Las modificaciones
              regirán desde su publicación en el Sitio, siendo responsabilidad del
              Usuario revisarlas periódicamente.
            </p>
            <p>
              Asimismo, SILLAGE PERFUM SpA podrá interrumpir total o parcialmente el
              funcionamiento del Sitio, actualizar sus contenidos o descontinuar
              productos sin notificación previa.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">2. Requisitos para el Acceso y Uso del Sitio</h3>
            <p>
              El Sitio está dirigido exclusivamente a personas naturales mayores de 18
              años, con capacidad legal para contratar. Al registrarse y/o realizar
              compras, el Usuario declara cumplir con este requisito y se compromete a
              entregar información veraz, completa y actualizada.
            </p>
            <p>
              Para realizar compras, el Usuario deberá completar el formulario
              correspondiente, incluyendo datos personales y de contacto, tales como
              nombre completo, RUT, dirección, teléfono y correo electrónico.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">3. Privacidad y Tratamiento de Datos Personales</h3>
            <p>
              SILLAGE PERFUM SpA recolecta y trata los datos personales de los
              Usuarios conforme a lo establecido en la Ley Nº 19.628 sobre Protección
              de la Vida Privada. Los datos podrán ser utilizados para:
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Procesamiento de compras, pagos y despacho de productos</li>
              <li>Emisión de boletas o facturas</li>
              <li>Comunicaciones informativas y/o promocionales (previo consentimiento)</li>
              <li>Atención al cliente y gestión de reclamos</li>
              <li>Análisis internos y mejora de la experiencia de usuario</li>
            </ul>
            <p className="mt-2">
              El Usuario podrá ejercer sus derechos de acceso, rectificación,
              cancelación u oposición mediante solicitud escrita dirigida al correo
              <a href="mailto:ventas@sillageperfum.cl" className="text-foreground hover:underline"> ventas@sillageperfum.cl</a> o mediante el formulario de contacto del Sitio.
            </p>
            <p>
              SILLAGE PERFUM SpA adopta medidas de seguridad razonables para
              resguardar la información personal.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">4. Usos Prohibidos</h3>
            <p>
              El Usuario se obliga a no utilizar el Sitio para fines ilícitos,
              contrarios a la moral o a estos Términos y Condiciones. En particular,
              se prohíbe:
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Ingresar información falsa o suplantar identidades</li>
              <li>Difundir contenido ofensivo, difamatorio o discriminatorio</li>
              <li>Infringir derechos de propiedad intelectual o industrial</li>
              <li>Intentar vulnerar la seguridad del Sitio (phishing, malware, etc.)</li>
              <li>Utilizar el Sitio con fines comerciales no autorizados</li>
            </ul>
            <p className="mt-2">
              SILLAGE PERFUM SpA podrá suspender o cancelar el acceso a Usuarios que
              infrinjan estas normas.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">5. Política de Cookies</h3>
            <p>
              El Sitio utiliza cookies propias y de terceros con fines funcionales,
              estadísticos y publicitarios. Las cookies permiten mejorar la
              experiencia del Usuario, recordar preferencias y analizar el uso del
              Sitio.
            </p>
            <p>
              Al ingresar al Sitio, el Usuario podrá aceptar, rechazar o configurar el
              uso de cookies mediante el banner emergente. Asimismo, puede modificar
              sus preferencias desde su navegador.
            </p>
            <p>
              El uso del Sitio implica el consentimiento informado respecto del uso de
              cookies. Para mayor información, revisar la "Política de Cookies".
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">6. Propiedad Intelectual</h3>
            <p>
              Todos los contenidos presentes en el Sitio, incluyendo textos, diseños,
              logos, gráficas, archivos digitales, bases de datos, código fuente y
              otros elementos, son propiedad exclusiva de SILLAGE PERFUM SpA o de sus
              proveedores y se encuentran protegidos por la Ley Nº 17.336 sobre
              Propiedad Intelectual.
            </p>
            <p>
              Queda estrictamente prohibida su reproducción, distribución,
              transformación o uso sin autorización expresa y por escrito de SILLAGE
              PERFUM SpA.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">7. Precios y Medios de Pago</h3>
            <p>
              Los precios publicados en el Sitio aplican exclusivamente para compras
              en línea y podrán variar sin previo aviso, salvo en pedidos ya
              confirmados. Los precios pueden diferir de los ofrecidos en tiendas
              físicas u otros canales.
            </p>
            <p>Los medios de pago aceptados son:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Tarjetas de crédito.</li>
              <li>Tarjetas de débito.</li>
              <li>Transferencias Bancarias</li>
            </ul>
            <p className="mt-2">
              SILLAGE PERFUM SpA podrá rechazar compras que no superen los filtros de
              seguridad establecidos.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">8. Envíos y Entregas</h3>
            <ul className="list-disc pl-5">
              <li>El despacho se realiza a través de empresas logísticas externas
                (Starken, Blue Express u otras).</li>
              <li>El plazo de procesamiento del pedido es de hasta 2 días hábiles desde
                la confirmación del pago.</li>
              <li>Los plazos de entrega dependerán de la región y se informan durante la
                compra.</li>
              <li>El Usuario debe proporcionar una dirección correcta y segura para la
                entrega. Si no es posible concretarla por error o ausencia, el reenvío
                será de su cargo.</li>
              <li>SILLAGE PERFUM SpA no se responsabiliza por retrasos atribuibles a la
                empresa transportista o causas de fuerza mayor.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">9. Derecho a Retracto, Cambios y Reembolsos</h3>

            <h4 className="text-lg font-semibold mt-3">9.1 Derecho a Retracto</h4>
            <p>
              El Usuario podrá ejercer su derecho a retracto dentro de 10 días
              corridos desde la recepción del producto, siempre que:
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>El producto no haya sido abierto, probado ni utilizado.</li>
              <li>Esté en perfectas condiciones, con embalaje original, sellos,
                etiquetas y accesorios.</li>
              <li>Se presente la boleta, factura o comprobante de compra.</li>
            </ul>
            <p className="mt-2">
              Para ejercer este derecho, el Usuario deberá comunicarlo por escrito al
              correo <a href="mailto:ventas@sillageperfum.cl" className="text-foreground hover:underline">ventas@sillageperfum.cl</a> dentro del plazo indicado. Podrá
              requerirse evidencia visual del estado del producto.
            </p>
            <p>
              Los costos de devolución serán asumidos por el Usuario, salvo que se
              trate de un error atribuible a SILLAGE PERFUM SpA.
            </p>

            <h4 className="text-lg font-semibold mt-4">9.2 Cambios y devoluciones voluntarias</h4>
            <p>
              SILLAGE PERFUM SpA aceptará cambios o devoluciones dentro de 30 días
              corridos desde la compra, en los siguientes casos:
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>El producto se encuentra sin uso y en su empaque original sellado.</li>
              <li>El Usuario presenta el comprobante de compra.</li>
            </ul>
            <p className="mt-2">No se aceptarán devoluciones de:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Productos usados, abiertos o manipulados</li>
              <li>Perfumes probados</li>
              <li>Productos adquiridos en liquidación o promociones especiales</li>
              <li>Tarjetas de regalo</li>
            </ul>
            <p className="mt-2">
              Los cambios podrán realizarse por productos de igual o mayor valor,
              pagando la diferencia, siempre que exista stock disponible.
            </p>

            <h4 className="text-lg font-semibold mt-4">9.3 Productos con fallas o defectos</h4>
            <p>
              Si un producto presenta una falla dentro de los 30 días siguientes a su
              recepción, el Usuario podrá optar por:
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Reposición del producto</li>
            </ul>
            <p className="mt-2">
              Para iniciar el procedimiento, el Usuario deberá escribir a
              <a href="mailto:ventas@sillageperfum.cl" className="text-foreground hover:underline"> ventas@sillageperfum.cl</a> describiendo la falla e incluyendo fotografías
              y el comprobante de compra. El producto podrá ser evaluado técnicamente.
            </p>

            <h4 className="text-lg font-semibold mt-4">9.4 Reembolsos</h4>
            <p>
              Los reembolsos se realizarán mediante el mismo medio de pago utilizado
              por el Usuario, dentro de un plazo máximo de 10 días hábiles desde su
              aprobación por parte de SILLAGE PERFUM SpA.
            </p>
            <p>
              En caso de compras con tarjeta de crédito o débito, el tiempo de
              devolución efectiva dependerá de la institución financiera emisora. En
              compras con tarjetas de regalo, el reembolso se realizará como crédito a
              favor del Usuario para futuras compras.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">10. Seguimiento de Pedidos</h3>
            <p>
              Una vez confirmado el despacho, el Usuario recibirá un código de
              seguimiento para rastrear su pedido a través de la plataforma de la
              empresa transportista. Cualquier demora deberá ser gestionada
              directamente con dicha empresa.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">11. Legislación y Jurisdicción</h3>
            <p>
              Estos Términos y Condiciones se rigen por las leyes vigentes de la
              República de Chile. Toda controversia o conflicto será sometido a los
              tribunales ordinarios de justicia con asiento en la ciudad de Santiago.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">12. Disposiciones Finales</h3>

            <h4 className="text-lg font-semibold mt-3">12.1 Divisibilidad:</h4>
            <p>
              Si alguna cláusula de estos Términos fuese
              declarada nula o inaplicable, las demás disposiciones continuarán
              vigentes.
            </p>

            <h4 className="text-lg font-semibold mt-3">12.2 Acuerdo completo:</h4>
            <p>
              Estos Términos reemplazan cualquier acuerdo
              previo, verbal o escrito, entre las partes.
            </p>

            <h4 className="text-lg font-semibold mt-3">12.3 Vigencia:</h4>
            <p>
              La presente versión fue actualizada por última vez el
              7 de agosto de 2025.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">13. Contacto</h3>
            <p>
              Para cualquier consulta relacionada con estos Términos y Condiciones,
              los datos personales o el uso del Sitio, el Usuario podrá contactarse a
              través de:
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Correo electrónico: <a href="mailto:ventas@sillageperfum.cl" className="text-foreground hover:underline">ventas@sillageperfum.cl</a></li>
              <li>
                <span className="block mb-2">Formulario de contacto:</span>
                <ContactButton />
              </li>
              <li>Dirección comercial: Miguel Claro 070, local 60, Providencia,
                Santiago, Chile.</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TerminosCondiciones;