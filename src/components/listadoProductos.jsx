import React from 'react';
import { useNavigate } from 'react-router-dom';

const Inspiraciones = () => {
    const navigate = useNavigate();
    // Datos para las inspiraciones de mujer
    const inspiracionesMujer = [
        { codigo: 'SP1W', inspiradoEn: '212' },
        { codigo: 'SP2W', inspiradoEn: '212 SEXY' },
        { codigo: 'SP3W', inspiradoEn: '212 VIP' },
        { codigo: 'SP4W', inspiradoEn: '212 VIP ROSE' },
        { codigo: 'SP5W', inspiradoEn: 'ACQUA DI GIO' },
        { codigo: 'SP7W', inspiradoEn: 'AMOR AMOR' },
        { codigo: 'SP13W', inspiradoEn: 'BE DELICIOUS' },
        { codigo: 'SP18W', inspiradoEn: 'CAN-CAN' },
        { codigo: 'SP20W', inspiradoEn: 'CAROLINA HERRERA' },
        { codigo: 'SP30W', inspiradoEn: 'DKNY' },
        { codigo: 'SP32W', inspiradoEn: 'DUENDE' },
        { codigo: 'SP38W', inspiradoEn: 'FANTASY MIDNIGHT' },
        { codigo: 'SP39W', inspiradoEn: 'FANTASY' },
        { codigo: 'SP40W', inspiradoEn: 'FLOWER' },
        { codigo: 'SP43W', inspiradoEn: 'HALLOWEEN' },
        { codigo: 'SP46W', inspiradoEn: 'HUGO WOMAN' },
        { codigo: 'SP51W', inspiradoEn: 'LIGHT BLUE' },
        { codigo: 'SP52W', inspiradoEn: 'LIGHT BLUE (mejorado)' },
        { codigo: 'SP55W', inspiradoEn: 'LA VIDA ES BELLA' },
        { codigo: 'SP59W', inspiradoEn: 'NINA MANZANA' },
        { codigo: 'SP63W', inspiradoEn: 'ONE' },
        { codigo: 'SP73W', inspiradoEn: 'RALPH' },
        { codigo: 'SP82W', inspiradoEn: 'TOMMY GIRL' },
        { codigo: 'SP87W', inspiradoEn: 'XS BLACK' },
        { codigo: 'SP89W', inspiradoEn: 'SÍ ARMANI' },
        { codigo: 'SP90W', inspiradoEn: 'GOOD GIRL' },
        { codigo: 'SP91W', inspiradoEn: 'OLYMPEA' },
        { codigo: 'SP111W', inspiradoEn: 'MISS DIOR' },
        { codigo: 'SP112W', inspiradoEn: 'IDÓLE' },
        { codigo: 'SP114W', inspiradoEn: 'CLOUD ARIANA G.' },
        { codigo: 'SP116W', inspiradoEn: 'SCANDAL JPG' },
    ];

    // Datos para las inspiraciones de hombre
    const inspiracionesHombre = [
        { codigo: 'SP1H', inspiradoEn: '212' },
        { codigo: 'SP2H', inspiradoEn: '212 SEXY' },
        { codigo: 'SP4H', inspiradoEn: '212 VIP MEN' },
        { codigo: 'SP5H', inspiradoEn: 'ACQUA DI GIO' },
        { codigo: 'SP7H', inspiradoEn: 'ANGEL' },
        { codigo: 'SP9H', inspiradoEn: 'ARMANI CODE SPORT' },
        { codigo: 'SP13H', inspiradoEn: 'BOSS 6' },
        { codigo: 'SP17H', inspiradoEn: 'BLEU CHANEL' },
        { codigo: 'SP32H', inspiradoEn: 'ETERNITY' },
        { codigo: 'SP34H', inspiradoEn: 'FAHRENHEIT' },
        { codigo: 'SP38H', inspiradoEn: 'HUGO BOSS' },
        { codigo: 'SP42H', inspiradoEn: 'INVICTUS' },
        { codigo: 'SP45H', inspiradoEn: 'J.P.G' },
        { codigo: 'SP50H', inspiradoEn: 'LIGHT BLUE' },
        { codigo: 'SP53H', inspiradoEn: 'ONE MILLION' },
        { codigo: 'SP60H', inspiradoEn: 'POLO BLUE' },
        { codigo: 'SP62H', inspiradoEn: 'POLO SPORT' },
        { codigo: 'SP63H', inspiradoEn: 'POLO RED' },
        { codigo: 'SP68H', inspiradoEn: 'TOMMY' },
        { codigo: 'SP73H', inspiradoEn: 'XS BLACK' },
        { codigo: 'SP75H', inspiradoEn: 'XS BLACK L´EXCES' },
        { codigo: 'SP77H', inspiradoEn: 'SAUVAGE' },
        { codigo: 'SP84H', inspiradoEn: 'INVICTUS INTENSE' },
        { codigo: 'SP93H', inspiradoEn: 'PHANTOM' },
        { codigo: 'SP94H', inspiradoEn: 'SAUVAGE ELIXIR' },
        { codigo: 'SP96H', inspiradoEn: 'BAD BOY' },
        { codigo: 'SP97H', inspiradoEn: 'EROS DE VERSACE' },
        { codigo: 'SP98H', inspiradoEn: 'LE BEAU' },
        { codigo: 'SP99H', inspiradoEn: 'SCANDAL J.P.G.' },
    ];

    // Datos para las lociones
    const lociones = {
        "locionMujer": [
            { "codigo": "SP52W", inspiradoEn: 'Locion.' },
            { "codigo": "SP55W", inspiradoEn: 'Locion.' },
            { "codigo": "SP89W", inspiradoEn: 'Locion.' },
            { "codigo": "SP90W", inspiradoEn: 'Locion.' },
        ],
        "locionHombre": [
            { "codigo": "SP4H", inspiradoEn: 'Locion.' },
            { "codigo": "SP5H", inspiradoEn: 'Locion.' },
            { "codigo": "SP42h", inspiradoEn: 'Locion.' },
            { "codigo": "SP53H", inspiradoEn: 'Locion.' },
        ]
    };

    // Función para manejar el clic en un código de inspiración
    const handleCodigoClick = (codigo) => {
        navigate(`/productos/${codigo}-50ML`);
    };

    // Función para manejar el clic en un código de loción
    const handleLocionClick = (codigo) => {
        navigate(`/productos/${codigo}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-sillage-dark mb-4">Catalogo Sillage Perfum</h1>
                <p className="text-lg text-sillage-dark-light max-w-3xl mx-auto">
                    Explora el catalogo completo de nuestras fragancias convencionales y exclusivas creacion By Sillage. <span className="font-semibold text-sillage-gold-500">Haz click en el código.</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tabla para mujeres */}
                <div className="bg-sillage-cream rounded-lg shadow-lg overflow-hidden border border-sillage-gold-200">
                    <div className="bg-sillage-gold-500 px-6 py-3">
                        <h2 className="text-xl font-bold text-sillage-dark">Sillage Inspiraciones Mujer</h2>
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
                        <h2 className="text-xl font-bold text-sillage-dark">Sillage Inspiraciones Hombre</h2>
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

            {/* Tabla para Lociones */}
            <div className="mt-12 flex justify-center">
                <div className="w-full lg:w-1/2 bg-sillage-cream rounded-lg shadow-lg overflow-hidden border border-sillage-gold-200">
                    <div className="bg-sillage-gold-500 px-6 py-3">
                        <h2 className="text-xl font-bold text-sillage-dark">Lociones</h2>
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
                                <tr className="bg-sillage-gold-50">
                                    <td colSpan="2" className="px-6 py-2 text-sm font-semibold text-sillage-dark">Mujer</td>
                                </tr>
                                {lociones.locionMujer.map((item, index) => (
                                    <tr key={`locion-mujer-${index}`} className="hover:bg-sillage-gold-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleLocionClick(item.codigo)}
                                                className="text-sillage-gold-600 hover:text-sillage-gold-800 font-medium underline hover:no-underline transition-colors"
                                            >
                                                {item.codigo}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-sillage-dark">
                                            {item.inspiradoEn || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-sillage-gold-50">
                                    <td colSpan="2" className="px-6 py-2 text-sm font-semibold text-sillage-dark">Hombre</td>
                                </tr>
                                {lociones.locionHombre.map((item, index) => (
                                    <tr key={`locion-hombre-${index}`} className="hover:bg-sillage-gold-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleLocionClick(item.codigo)}
                                                className="text-sillage-gold-600 hover:text-sillage-gold-800 font-medium underline hover:no-underline transition-colors"
                                            >
                                                {item.codigo}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-sillage-dark">
                                            {item.inspiradoEn || 'N/A'}
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