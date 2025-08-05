/**
 * Formatea un precio sin decimales y con el símbolo $
 * @param {number|string} price - El precio a formatear
 * @returns {string} El precio formateado (ej: "$25.000")
 */
export const formatPrice = (price) => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return '$0';
  }

  // Redondear el precio al entero más cercano
  const roundedPrice = Math.round(numericPrice);

  // Formatear con separador de miles
  const formatted = roundedPrice.toLocaleString('es-CL');

  // Retornar con el símbolo $
  return `$${formatted}`;
};

// Exportar también como default para facilitar imports
export default formatPrice;