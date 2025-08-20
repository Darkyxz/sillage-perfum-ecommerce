import React from 'react';
import { motion } from 'framer-motion';
import ContactButton from './contactButton';

const PoliticaReembolsos = () => {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="py-12 bg-background min-h-screen"
        >
            <div className="container mx-auto px-4 max-w-4xl">
                <h2 className="text-3xl font-display font-bold text-foreground mb-6">Política de Reembolsos</h2>

                <div className="space-y-6 text-foreground-dark">
                    <p><strong>Última actualización:</strong> Agosto 2025</p>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground">1. Derecho a Retracto</h3>
                        <p>
                            Tienes 10 días corridos desde la recepción del producto para ejercer tu derecho a retracto, siempre que:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>El producto esté sin uso y en su empaque original</li>
                            <li>Incluyas todos los sellos, etiquetas y accesorios</li>
                            <li>Presentes la boleta o comprobante de compra</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground">2. Cambios y Devoluciones</h3>
                        <p>Aceptamos cambios o devoluciones dentro de 30 días corridos desde la compra:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Productos sin uso y en empaque original sellado</li>
                            <li>Con comprobante de compra</li>
                            <li>Cambios por productos de igual o mayor valor (sujeto a stock)</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground">3. No Aceptamos Devoluciones de:</h3>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Productos usados, abiertos o manipulados</li>
                            <li>Perfumes probados</li>
                            <li>Productos en liquidación o promociones especiales</li>
                            <li>Tarjetas de regalo</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground">4. Productos con Fallas</h3>
                        <p>
                            Si recibes un producto con fallas dentro de los 30 días posteriores a la recepción,
                            ofrecemos reposición del producto. Contactanos con fotos y comprobante de compra.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground">5. Proceso de Reembolso</h3>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Reembolsamos mediante el mismo método de pago original</li>
                            <li>Plazo máximo: 10 días hábiles desde la aprobación</li>
                            <li>Compras con tarjeta: el tiempo depende de tu entidad financiera</li>
                            <li>Tarjetas de regalo: reembolso como crédito para futuras compras</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground">6. Costos de Devolución</h3>
                        <p>
                            Los costos de envío para devoluciones son por cuenta del cliente, excepto en casos de error nuestro.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-foreground">7. Contacto</h3>
                        <p>Para solicitudes de reembolso o consultas:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li>
                                <strong>Email:</strong>{' '}
                                <a href="mailto:ventas@sillageperfum.cl" className="text-foreground hover:underline">
                                    ventas@sillageperfum.cl
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <strong>Formulario:</strong>
                                <ContactButton />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default PoliticaReembolsos;