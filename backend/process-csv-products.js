const fs = require('fs');
const path = require('path');

// Función para leer y procesar el CSV
function processCSVFile(csvFilePath) {
  try {
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvContent.split('\n');
    const products = [];
    
    // Saltar la primera línea (headers)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parsear CSV (manejo básico de comillas)
      const fields = parseCSVLine(line);
      
      if (fields.length >= 19) {
        const product = {
          id: parseInt(fields[0]),
          name: fields[1],
          brand: fields[2],
          price: parseFloat(fields[3]),
          category: fields[4],
          description: fields[5].replace(/"/g, ''),
          sku: fields[6],
          stock_quantity: parseInt(fields[7]),
          size: fields[8],
          concentration: fields[9],
          image_url: fields[10],
          rating: parseFloat(fields[11]),
          reviews_count: parseInt(fields[12]),
          in_stock: fields[13] === 'true',
          created_at: fields[14],
          updated_at: fields[15],
          is_featured: fields[16] === 'true',
          fragrance_profile: fields[17],
          fragrance_notes: fields[18]
        };
        
        products.push(product);
      }
    }
    
    return products;
  } catch (error) {
    console.error('Error procesando CSV:', error);
    return [];
  }
}

// Función simple para parsear líneas CSV
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  fields.push(current);
  return fields;
}

// Función para convertir precios
function convertPrice(price) {
  return Math.round(parseFloat(price) * 10);
}

// Función para mapear categorías
function mapCategory(category) {
  const categoryMap = {
    'women': 'Mujer',
    'men': 'Hombre',
    'home': 'Hogar',
    'body': 'Body Mist'
  };
  return categoryMap[category] || category;
}

// Función para procesar notas de fragancia
function processFragranceNotes(fragrance_profile) {
  try {
    if (!fragrance_profile) return '';
    return fragrance_profile
      .replace(/[\[\]"]/g, '')
      .split(',')
      .map(note => note.trim())
      .join(', ');
  } catch (error) {
    return fragrance_profile || '';
  }
}

// Función para determinar duración
function getDuration(concentration, category) {
  if (concentration === 'Eau de Parfum') {
    return category === 'Body Mist' ? '2-4 horas' : '6-8 horas';
  } else if (concentration === 'Home Spray') {
    return 'Ambiente: 4-6 horas';
  }
  return '4-6 horas';
}

// Función para obtener inspiración original
function getOriginalInspiration(name) {
  const inspirations = {
    '212 Woman': '212 WOMAN - Carolina Herrera',
    '212 Sexy Woman': '212 SEXY WOMAN - Carolina Herrera',
    '212 VIP Woman': '212 VIP WOMAN - Carolina Herrera',
    '212 VIP Rose Woman': '212 VIP ROSE WOMAN - Carolina Herrera',
    'Acqua di Gio Woman': 'ACQUA DI GIO WOMAN - Giorgio Armani',
    'Amor Amor Woman': 'AMOR AMOR WOMAN - Cacharel',
    'Be Delicious Woman': 'BE DELICIOUS WOMAN - DKNY',
    'CH Woman': 'CH WOMAN - Carolina Herrera',
    'Can Can': 'CAN CAN - Paris Hilton',
    'Carolina Herrera Woman': 'CAROLINA HERRERA WOMAN - Carolina Herrera',
    'Chanel Nº5': 'CHANEL Nº5 - Chanel',
    'DKNY Woman': 'DKNY WOMAN - Donna Karan',
    'Duende': 'DUENDE - Agatha Ruiz de la Prada',
    'Eden': 'EDEN - Cacharel',
    'Fantasy Midnight': 'FANTASY MIDNIGHT - Britney Spears',
    'Fantasy': 'FANTASY - Britney Spears',
    'Gucci Rush': 'GUCCI RUSH - Gucci',
    'Halloween Woman': 'HALLOWEEN WOMAN - Jesús del Pozo',
    'Hugo Woman': 'HUGO WOMAN - Hugo Boss',
    'J\'adore': 'J\'ADORE - Dior',
    'Light Blue': 'LIGHT BLUE - Dolce & Gabbana',
    'Lolita Lempicka': 'LOLITA LEMPICKA - Lolita Lempicka',
    'Lady Million': 'LADY MILLION - Paco Rabanne',
    'La Vida es Bella': 'LA VIDA ES BELLA - Lancôme',
    'Miracle': 'MIRACLE - Lancôme',
    'Nina Manzana': 'NINA MANZANA - Nina Ricci',
    'One': 'ONE - Calvin Klein',
    'Paloma Picasso': 'PALOMA PICASSO - Paloma Picasso',
    'Paris Hilton': 'PARIS HILTON - Paris Hilton',
    'Ralph': 'RALPH - Ralph Lauren',
    'Tommy Girl': 'TOMMY GIRL - Tommy Hilfiger',
    'Trésor': 'TRESOR - Lancôme',
    'XS Black Woman': 'XS BLACK WOMAN - Paco Rabanne',
    'Si Armani': 'SI ARMANI - Giorgio Armani',
    'Good Girl': 'GOOD GIRL - Carolina Herrera',
    'Olympea': 'OLYMPEA - Paco Rabanne',
    'My Way': 'MY WAY - Giorgio Armani',
    'Soleil Cristal': 'SOLEIL CRISTAL - Roberto Cavalli',
    'Fame': 'FAME - Lady Gaga',
    'Miss Dior': 'MISS DIOR - Dior',
    'Idôle': 'IDÔLE - Lancôme',
    'Libre YSL': 'LIBRE - Yves Saint Laurent',
    'Yara': 'SCANDAL J.P.G.',
    
    // HOMBRES
    'Urbano Moderno': '212 MEN',
    'Seductor Urbano': '212 SEXY MEN',
    'Contraste Sofisticado': '212 VIP',
    'Brisa Marina': 'ACQUA DI GIO MEN',
    'Ángel Rebelde': 'ANGEL MEN',
    'Dinámico Deportivo': 'ARMANI CODE SPORT',
    'Código de Elegancia': 'ARMANI CODE',
    'Esencia Audaz': 'AZZARO',
    'Elegancia Clásica': 'BOSS 6',
    'Azul Iconico': 'BLEU CHANEL',
    'Eternidad Moderna': 'ETERNITY MEN',
    'Fahrenheit Clásico': 'FAHRENHEIT',
    'Jefe Elegante': 'HUGO BOSS',
    'Invicto Poderoso': 'INVICTUS',
    'Hombre Sofisticado': 'J.P.G Le Male',
    'Brisa Mediterránea': 'LIGHT BLUE',
    'Millón Magnético': 'ONE MILLION',
    'Rabanne Elegante': 'PACO RABANNE',
    'Polo Clásico': 'POLO',
    'Polo Negro': 'POLO BLACK',
    'Polo Azul': 'POLO BLUE',
    'Polo Deportivo': 'POLO SPORT MEN',
    'Polo Rojo': 'POLO RED',
    'Tommy Fresco': 'TOMMY MEN',
    'Ultravioleta': 'ULTRAVIOLET MEN',
    'Xeryus Rojo': 'XERYUS ROUGE',
    'XS Black': 'XS BLACK MEN',
    'XS Black L\'Exces': 'XS BLACK L\'EXCES',
    'Acqua Profumo': 'ACQUA DI GIO PROFUMO',
    'Salvaje Elegante': 'SAUVAGE',
    'Invictus Intenso': 'INVICTUS INTENSE',
    'Fantasma Elegante': 'PHANTOM',
    'Elixir Salvaje': 'SAUVAGE ELIXIR',
    'Chico Malo': 'BAD BOY',
    'Eros Magnético': 'EROS VERSACE',
    'Le Beau Exótico': 'LE BEAU',
    'Escándalo Dulce': 'SCANDAL J.P.G.',
    'Fuerte Contigo': 'STRONGER WITH YOU'
  };
  
  for (const [key, value] of Object.entries(inspirations)) {
    if (name.includes(key)) {
      return value;
    }
  }
  
  return 'Creación original';
}

// Función principal para procesar el CSV
function processCSVToProducts(csvFilePath) {
  console.log('📄 PROCESANDO ARCHIVO CSV...');
  
  const csvProducts = processCSVFile(csvFilePath);
  console.log(`📋 Productos encontrados en CSV: ${csvProducts.length}`);
  
  const processedProducts = csvProducts.map(csvProduct => {
    return {
      name: csvProduct.name + ` ${csvProduct.size}`,
      description: csvProduct.description,
      price: convertPrice(csvProduct.price),
      sku: csvProduct.sku,
      brand: csvProduct.brand,
      category: mapCategory(csvProduct.category),
      image_url: csvProduct.image_url,
      stock_quantity: csvProduct.stock_quantity,
      is_featured: csvProduct.is_featured || false,
      rating: parseFloat(csvProduct.rating) || 0,
      notes: processFragranceNotes(csvProduct.fragrance_profile),
      duration: getDuration(csvProduct.concentration, csvProduct.category),
      original_inspiration: getOriginalInspiration(csvProduct.name),
      size: csvProduct.size,
      concentration: csvProduct.concentration
    };
  });
  
  return processedProducts;
}

module.exports = {
  processCSVToProducts,
  convertPrice,
  mapCategory,
  processFragranceNotes,
  getDuration,
  getOriginalInspiration
};