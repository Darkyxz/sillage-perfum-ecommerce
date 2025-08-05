import React from 'react';
import { useNavigate } from 'react-router-dom';

const Inspiraciones = () => {
    const navigate = useNavigate();
    // Datos para las inspiraciones de mujer
    const inspiracionesMujer = [
        { codigo: 'ZP1W', inspiradoEn: '212' },
        { codigo: 'ZP2W', inspiradoEn: '212 SEXY' },
        { codigo: 'ZP3W', inspiradoEn: '212 VIP' },
        { codigo: 'ZP4W', inspiradoEn: '212 VIP ROSE' },
        { codigo: 'ZP5W', inspiradoEn: 'ACQUA DI GIO' },
        { codigo: 'ZP7W', inspiradoEn: 'AMOR AMOR' },
        { codigo: 'ZP13W', inspiradoEn: 'BE DELICIOUS' },
        { codigo: 'ZP18W', inspiradoEn: 'CAN-CAN' },
        { codigo: 'ZP20W', inspiradoEn: 'CAROLINA HERRERA' },
        { codigo: 'ZP30W', inspiradoEn: 'DKNY' },
        { codigo: 'ZP32W', inspiradoEn: 'DUENDE' },
        { codigo: 'ZP38W', inspiradoEn: 'FANTASY MIDNIGHT' },
        { codigo: 'ZP39W', inspiradoEn: 'FANTASY' },
        { codigo: 'ZP40W', inspiradoEn: 'FLOWER' },
        { codigo: 'ZP43W', inspiradoEn: 'HALLOWEEN' },
        { codigo: 'ZP46W', inspiradoEn: 'HUGO WOMAN' },
        { codigo: 'ZP51W', inspiradoEn: 'LIGHT BLUE' },
        { codigo: 'ZP52W', inspiradoEn: 'LIGHT BLUE (mejorado)' },
        { codigo: 'ZP55W', inspiradoEn: 'LA VIDA ES BELLA' },
        { codigo: 'ZP59W', inspiradoEn: 'NINA MANZANA' },
        { codigo: 'ZP63W', inspiradoEn: 'ONE' },
        { codigo: 'ZP73W', inspiradoEn: 'RALPH' },
        { codigo: 'ZP82W', inspiradoEn: 'TOMMY GIRL' },
        { codigo: 'ZP87W', inspiradoEn: 'XS BLACK' },
        { codigo: 'ZP89W', inspiradoEn: 'SÍ ARMANI' },
        { codigo: 'ZP90W', inspiradoEn: 'GOOD GIRL' },
        { codigo: 'ZP91W', inspiradoEn: 'OLYMPEA' },
        { codigo: 'ZP111W', inspiradoEn: 'MISS DIOR' },
        { codigo: 'ZP112W', inspiradoEn: 'IDÓLE' },
        { codigo: 'ZP114W', inspiradoEn: 'CLOUD ARIANA G.' },
        { codigo: 'ZP115W', inspiradoEn: 'YARA' }
    ];

    // Datos para las inspiraciones de hombre
    const inspiracionesHombre = [
        { codigo: 'ZP1H', inspiradoEn: '212' },
        { codigo: 'ZP2H', inspiradoEn: '212 SEXY' },
        { codigo: 'ZP4H', inspiradoEn: '212 VIP MEN' },
        { codigo: 'ZP5H', inspiradoEn: 'ACQUA DI GIO' },
        { codigo: 'ZP7H', inspiradoEn: 'ANGEL' },
        { codigo: 'ZP9H', inspiradoEn: 'ARMANI CODE SPORT' },
        { codigo: 'ZP13H', inspiradoEn: 'BOSS 6' },
        { codigo: 'ZP17H', inspiradoEn: 'BLEU CHANEL' },
        { codigo: 'ZP32H', inspiradoEn: 'ETERNITY' },
        { codigo: 'ZP38H', inspiradoEn: 'HUGO BOSS' },
        { codigo: 'ZP42H', inspiradoEn: 'INVICTUS' },
        { codigo: 'ZP45H', inspiradoEn: 'J.P.G' },
        { codigo: 'ZP50H', inspiradoEn: 'LIGHT BLUE' },
        { codigo: 'ZP52H', inspiradoEn: 'ONE' },
        { codigo: 'ZP53H', inspiradoEn: 'ONE MILLION' },
        { codigo: 'ZP60H', inspiradoEn: 'POLO BLUE' },
        { codigo: 'ZP62H', inspiradoEn: 'POLO SPORT' },
        { codigo: 'ZP63H', inspiradoEn: 'POLO RED' },
        { codigo: 'ZP68H', inspiradoEn: 'TOMMY' },
        { codigo: 'ZP69H', inspiradoEn: 'ULTRAVIOLET' },
        { codigo: 'ZP73H', inspiradoEn: 'XS BLACK' },
        { codigo: 'ZP75H', inspiradoEn: 'XS BLACK L´EXCES' },
        { codigo: 'ZP77H', inspiradoEn: 'SAUVAGE' },
        { codigo: 'ZP84H', inspiradoEn: 'INVICTUS INTENSE' },
        { codigo: 'ZP93H', inspiradoEn: 'PHANTOM' },
        { codigo: 'ZP94H', inspiradoEn: 'SAUVAGE ELIXIR' },
        { codigo: 'ZP96H', inspiradoEn: 'BAD BOY' },
        { codigo: 'ZP97H', inspiradoEn: 'EROS DE VERSACE' },
        { codigo: 'ZP98H', inspiradoEn: 'LE BEAU' },
        { codigo: 'ZP99H', inspiradoEn: 'SCANDAL J.P.G.' },
        { codigo: 'ZP100H', inspiradoEn: 'STRONGER WITH YOU' }
    ];

    // Función para manejar el clic en un código
    const handleCodigoClick = (codigo) => {
        navigate(`/productos/${codigo}-50ML`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-sillage-dark mb-4">Listado completo de inspiraciones</h1>
                <p className="text-lg text-sillage-dark-light max-w-3xl mx-auto">
                    Explora el listado completo de nuestras fragancias inspiradas en perfumes icónicos.
                    Encuentra fácilmente tu aroma favorito, organizado por género. <span className="font-semibold text-sillage-gold-500">Haz click en el código.</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tabla para mujeres */}
                <div className="bg-sillage-cream rounded-lg shadow-lg overflow-hidden border border-sillage-gold-200">
                    <div className="bg-sillage-gold-500 px-6 py-3">
                        <h2 className="text-xl font-bold text-sillage-dark">Inspiraciones Mujer</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-sillage-gold-200">
                            <thead className="bg-sillage-gold-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sillage-dark uppercase tracking-wider">
                                        Código
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sillage-dark uppercase tracking-wider">
                                        Inspirado en
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-sillage-cream divide-y divide-sillage-gold-200">
                                {inspiracionesMujer.map((item, index) => (
                                    <tr key={`mujer-${index}`} className="hover:bg-sillage-gold-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleCodigoClick(item.codigo)}
                                                className="text-sillage-gold-600 hover:text-sillage-gold-800 font-medium underline hover:no-underline transition-colors"
                                            >
                                                {item.codigo}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-sillage-dark">
                                            {item.inspiradoEn}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tabla para hombres */}
                <div className="bg-sillage-cream rounded-lg shadow-lg overflow-hidden border border-sillage-gold-200">
                    <div className="bg-sillage-gold-500 px-6 py-3">
                        <h2 className="text-xl font-bold text-sillage-dark">Inspiraciones Hombre</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-sillage-gold-200">
                            <thead className="bg-sillage-gold-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sillage-dark uppercase tracking-wider">
                                        Código
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sillage-dark uppercase tracking-wider">
                                        Inspirado en
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-sillage-cream divide-y divide-sillage-gold-200">
                                {inspiracionesHombre.map((item, index) => (
                                    <tr key={`hombre-${index}`} className="hover:bg-sillage-gold-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleCodigoClick(item.codigo)}
                                                className="text-sillage-gold-600 hover:text-sillage-gold-800 font-medium underline hover:no-underline transition-colors"
                                            >
                                                {item.codigo}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-sillage-dark">
                                            {item.inspiradoEn}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inspiraciones;