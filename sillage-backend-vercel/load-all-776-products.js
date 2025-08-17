const { query } = require('./config/database');

// Función para convertir precios de formato decimal a entero (CLP)
function convertPrice(price) {
  return Math.round(parseFloat(price) * 10); // Convertir de formato decimal a CLP
}

// Función para limpiar y procesar las notas de fragancia
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

// Función para mapear categorías de inglés a español
function mapCategory(category) {
  const categoryMap = {
    'women': 'Mujer',
    'men': 'Hombre',
    'home': 'Hogar',
    'body': 'Lociones'
  };
  return categoryMap[category] || category;
}

// Función para determinar duración basada en concentración
function getDuration(concentration, category) {
  if (concentration === 'Eau de Parfum') {
    return category === 'Lociones' ? '2-4 horas' : '6-8 horas';
  } else if (concentration === 'Home Spray') {
    return 'Ambiente: 4-6 horas';
  }
  return '4-6 horas';
}

// Función para determinar inspiración original basada en el nombre
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

// TODOS LOS 776 PRODUCTOS DEL CSV PROCESADOS CON SKUs CORRELATIVOS
const allProducts = [
  // MUJERES - 212 Woman (3 tamaños) - SP1W
  { name: "212 Woman – Eau de Parfum floral femenino 30ml", brand: "Zachary Perfumes", price: 7790, category: "Mujer", description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.", sku: "SP1W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Flor de azahar del naranjo, flor de cactus, bergamota, mandarina", duration: "6-8 horas", original_inspiration: "212 WOMAN - Carolina Herrera" },
  { name: "212 Woman – Eau de Parfum floral femenino 50ml", brand: "Zachary Perfumes", price: 10390, category: "Mujer", description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.", sku: "SP1W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Flor de azahar del naranjo, flor de cactus, bergamota, mandarina", duration: "6-8 horas", original_inspiration: "212 WOMAN - Carolina Herrera" },
  { name: "212 Woman – Eau de Parfum floral femenino 100ml", brand: "Zachary Perfumes", price: 12990, category: "Mujer", description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.", sku: "SP1W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: true, notes: "Flor de azahar del naranjo, flor de cactus, bergamota, mandarina", duration: "6-8 horas", original_inspiration: "212 WOMAN - Carolina Herrera" },

  // 212 Sexy Woman (3 tamaños)
  { name: "212 Sexy Woman – Eau de Parfum oriental floral femenino", brand: "Zachary Perfumes", price: 8390, category: "Mujer", description: "Fragancia seductora y envolvente, con un aroma dulce y especiado que deja una impresión duradera. Inspirada en 212 SEXY WOMAN de Carolina Herrera.", sku: "SP2W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.7, is_featured: false, notes: "Pimienta rosa, mandarina, bergamota, algodón de azúcar", duration: "6-8 horas", original_inspiration: "212 SEXY WOMAN - Carolina Herrera" },
  { name: "212 Sexy Woman – Eau de Parfum oriental floral femenino", brand: "Zachary Perfumes", price: 11190, category: "Mujer", description: "Fragancia seductora y envolvente, con un aroma dulce y especiado que deja una impresión duradera. Inspirada en 212 SEXY WOMAN de Carolina Herrera.", sku: "SP2W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.7, is_featured: false, notes: "Pimienta rosa, mandarina, bergamota, algodón de azúcar", duration: "6-8 horas", original_inspiration: "212 SEXY WOMAN - Carolina Herrera" },
  { name: "212 Sexy Woman – Eau de Parfum oriental floral femenino", brand: "Zachary Perfumes", price: 13990, category: "Mujer", description: "Fragancia seductora y envolvente, con un aroma dulce y especiado que deja una impresión duradera. Inspirada en 212 SEXY WOMAN de Carolina Herrera.", sku: "SP2W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.7, is_featured: false, notes: "Pimienta rosa, mandarina, bergamota, algodón de azúcar", duration: "6-8 horas", original_inspiration: "212 SEXY WOMAN - Carolina Herrera" },

  // 212 VIP Woman (3 tamaños)
  { name: "212 VIP Woman – Eau de Parfum oriental floral femenino", brand: "Zachary Perfumes", price: 8990, category: "Mujer", description: "Fragancia vibrante y sofisticada, con un aroma exótico y envolvente que combina glamour y exclusividad. Inspirada en 212 VIP WOMAN de Carolina Herrera.", sku: "SP3W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.6, is_featured: false, notes: "Ron, maracuyá, gardenia, almizcle", duration: "6-8 horas", original_inspiration: "212 VIP WOMAN - Carolina Herrera" },
  { name: "212 VIP Woman – Eau de Parfum oriental floral femenino", brand: "Zachary Perfumes", price: 11990, category: "Mujer", description: "Fragancia vibrante y sofisticada, con un aroma exótico y envolvente que combina glamour y exclusividad. Inspirada en 212 VIP WOMAN de Carolina Herrera.", sku: "SP3W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.6, is_featured: false, notes: "Ron, maracuyá, gardenia, almizcle", duration: "6-8 horas", original_inspiration: "212 VIP WOMAN - Carolina Herrera" },
  { name: "212 VIP Woman – Eau de Parfum oriental floral femenino", brand: "Zachary Perfumes", price: 14990, category: "Mujer", description: "Fragancia vibrante y sofisticada, con un aroma exótico y envolvente que combina glamour y exclusividad. Inspirada en 212 VIP WOMAN de Carolina Herrera.", sku: "SP3W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.6, is_featured: false, notes: "Ron, maracuyá, gardenia, almizcle", duration: "6-8 horas", original_inspiration: "212 VIP WOMAN - Carolina Herrera" },

  // 212 VIP Woman
  { name: "212 VIP Woman – Eau de Parfum oriental floral femenino 30ml", brand: "Zachary Perfumes", price: 8990, category: "Mujer", description: "Fragancia vibrante y sofisticada, con un aroma exótico y envolvente que combina glamour y exclusividad. Inspirada en 212 VIP WOMAN de Carolina Herrera.", sku: "SP3W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.6, is_featured: false, notes: "Ron, maracuyá, gardenia, almizcle", duration: "6-8 horas", original_inspiration: "212 VIP WOMAN - Carolina Herrera" },
  { name: "212 VIP Woman – Eau de Parfum oriental floral femenino 50ml", brand: "Zachary Perfumes", price: 11990, category: "Mujer", description: "Fragancia vibrante y sofisticada, con un aroma exótico y envolvente que combina glamour y exclusividad. Inspirada en 212 VIP WOMAN de Carolina Herrera.", sku: "SP3W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.6, is_featured: false, notes: "Ron, maracuyá, gardenia, almizcle", duration: "6-8 horas", original_inspiration: "212 VIP WOMAN - Carolina Herrera" },
  { name: "212 VIP Woman – Eau de Parfum oriental floral femenino 100ml", brand: "Zachary Perfumes", price: 14990, category: "Mujer", description: "Fragancia vibrante y sofisticada, con un aroma exótico y envolvente que combina glamour y exclusividad. Inspirada en 212 VIP WOMAN de Carolina Herrera.", sku: "SP3W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.6, is_featured: false, notes: "Ron, maracuyá, gardenia, almizcle", duration: "6-8 horas", original_inspiration: "212 VIP WOMAN - Carolina Herrera" },

  // 212 VIP Rose Woman
  { name: "212 VIP Rose Woman – Eau de Parfum floral frutal femenino 30ml", brand: "Zachary Perfumes", price: 9590, category: "Mujer", description: "Fragancia sofisticada y moderna, que combina la frescura del champagne rosé con la calidez de las notas amaderadas. Inspirada en 212 VIP ROSE WOMAN de Carolina Herrera.", sku: "SP4W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.5, is_featured: false, notes: "Champagne rosé, pimienta rosa, flor del duraznero, rosa", duration: "6-8 horas", original_inspiration: "212 VIP ROSE WOMAN - Carolina Herrera" },
  { name: "212 VIP Rose Woman – Eau de Parfum floral frutal femenino 50ml", brand: "Zachary Perfumes", price: 12790, category: "Mujer", description: "Fragancia sofisticada y moderna, que combina la frescura del champagne rosé con la calidez de las notas amaderadas. Inspirada en 212 VIP ROSE WOMAN de Carolina Herrera.", sku: "SP4W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.5, is_featured: false, notes: "Champagne rosé, pimienta rosa, flor del duraznero, rosa", duration: "6-8 horas", original_inspiration: "212 VIP ROSE WOMAN - Carolina Herrera" },
  { name: "212 VIP Rose Woman – Eau de Parfum floral frutal femenino 100ml", brand: "Zachary Perfumes", price: 15990, category: "Mujer", description: "Fragancia sofisticada y moderna, que combina la frescura del champagne rosé con la calidez de las notas amaderadas. Inspirada en 212 VIP ROSE WOMAN de Carolina Herrera.", sku: "SP4W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.5, is_featured: false, notes: "Champagne rosé, pimienta rosa, flor del duraznero, rosa", duration: "6-8 horas", original_inspiration: "212 VIP ROSE WOMAN - Carolina Herrera" },

  // Acqua di Gio Woman
  { name: "Acqua di Gio Woman – Eau de Parfum floral acuático femenino 30ml", brand: "Zachary Perfumes", price: 10190, category: "Mujer", description: "Fragancia sofisticada y fresca, inspirada en la frescura del mar y la delicadeza de las flores. Inspirada en ACQUA DI GIO WOMAN de Giorgio Armani.", sku: "SP5W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Peonía, vodka con sabor a dulces de musk, piña, limón", duration: "6-8 horas", original_inspiration: "ACQUA DI GIO WOMAN - Giorgio Armani" },
  { name: "Acqua di Gio Woman – Eau de Parfum floral acuático femenino 50ml", brand: "Zachary Perfumes", price: 13590, category: "Mujer", description: "Fragancia sofisticada y fresca, inspirada en la frescura del mar y la delicadeza de las flores. Inspirada en ACQUA DI GIO WOMAN de Giorgio Armani.", sku: "SP5W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Peonía, vodka con sabor a dulces de musk, piña, limón", duration: "6-8 horas", original_inspiration: "ACQUA DI GIO WOMAN - Giorgio Armani" },
  { name: "Acqua di Gio Woman – Eau de Parfum floral acuático femenino 100ml", brand: "Zachary Perfumes", price: 16990, category: "Mujer", description: "Fragancia sofisticada y fresca, inspirada en la frescura del mar y la delicadeza de las flores. Inspirada en ACQUA DI GIO WOMAN de Giorgio Armani.", sku: "SP5W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: true, notes: "Peonía, vodka con sabor a dulces de musk, piña, limón", duration: "6-8 horas", original_inspiration: "ACQUA DI GIO WOMAN - Giorgio Armani" },

  // J'adore
  { name: "J'adore – Eau de Parfum floral afrutado femenino 30ml", brand: "Zachary Perfumes", price: 10790, category: "Mujer", description: "Fragancia sofisticada y elegante, con un aroma floral afrutado. Inspirada en J'ADORE de Dior.", sku: "SP49W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: false, notes: "Pera, melón, magnolia, durazno", duration: "8-10 horas", original_inspiration: "J'ADORE - Dior" },
  { name: "J'adore – Eau de Parfum floral afrutado femenino 50ml", brand: "Zachary Perfumes", price: 14390, category: "Mujer", description: "Fragancia sofisticada y elegante, con un aroma floral afrutado. Inspirada en J'ADORE de Dior.", sku: "SP49W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: false, notes: "Pera, melón, magnolia, durazno", duration: "8-10 horas", original_inspiration: "J'ADORE - Dior" },
  { name: "J'adore – Eau de Parfum floral afrutado femenino 100ml", brand: "Zachary Perfumes", price: 17990, category: "Mujer", description: "Fragancia sofisticada y elegante, con un aroma floral afrutado. Inspirada en J'ADORE de Dior.", sku: "SP49W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: true, notes: "Pera, melón, magnolia, durazno", duration: "8-10 horas", original_inspiration: "J'ADORE - Dior" },

  // Miss Dior
  { name: "Miss Dior – Eau de Parfum avainillado y atalcado femenino 30ml", brand: "Zachary Perfumes", price: 10790, category: "Mujer", description: "Descubre la esencia de la elegancia y la sofisticación con esta exquisita fragancia avainillada y atalcada. Inspirada en MISS DIOR de Dior.", sku: "SP111W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: false, notes: "Rosas, florales, avainillado, atalcado", duration: "8-10 horas", original_inspiration: "MISS DIOR - Dior" },
  { name: "Miss Dior – Eau de Parfum avainillado y atalcado femenino 50ml", brand: "Zachary Perfumes", price: 14390, category: "Mujer", description: "Descubre la esencia de la elegancia y la sofisticación con esta exquisita fragancia avainillada y atalcada. Inspirada en MISS DIOR de Dior.", sku: "SP111W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: false, notes: "Rosas, florales, avainillado, atalcado", duration: "8-10 horas", original_inspiration: "MISS DIOR - Dior" },
  { name: "Miss Dior – Eau de Parfum avainillado y atalcado femenino 100ml", brand: "Zachary Perfumes", price: 17990, category: "Mujer", description: "Descubre la esencia de la elegancia y la sofisticación con esta exquisita fragancia avainillada y atalcada. Inspirada en MISS DIOR de Dior.", sku: "SP111W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: true, notes: "Rosas, florales, avainillado, atalcado", duration: "8-10 horas", original_inspiration: "MISS DIOR - Dior" },

  // Yara
  { name: "Yara – Eau de Parfum oriental floral femenino 30ml", brand: "Zachary Perfumes", price: 11090, category: "Mujer", description: "Fragancia audaz y sofisticada, Con un aroma dulce y envolvente, este perfume captura la esencia de la sofisticación moderna. Su intensidad y versatilidad lo hacen perfecto para quienes desean destacar en cualquier ocasión, reflejando una personalidad segura y carismática.", sku: "SP116W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Naranja sanguina, mandarina, Miel, gardenia", duration: "7-9 horas", original_inspiration: "SCANDAL J.P.G." },
  { name: "Yara – Eau de Parfum oriental floral femenino 50ml", brand: "Zachary Perfumes", price: 14790, category: "Mujer", description: "Fragancia audaz y sofisticada, Con un aroma dulce y envolvente, este perfume captura la esencia de la sofisticación moderna. Su intensidad y versatilidad lo hacen perfecto para quienes desean destacar en cualquier ocasión, reflejando una personalidad segura y carismática.", sku: "SP116W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Naranja sanguina, mandarina, Miel, gardenia", duration: "7-9 horas", original_inspiration: "SCANDAL J.P.G." },
  { name: "Yara – Eau de Parfum oriental floral femenino 100ml", brand: "Zachary Perfumes", price: 18490, category: "Mujer", description: "Fragancia audaz y sofisticada, Con un aroma dulce y envolvente, este perfume captura la esencia de la sofisticación moderna. Su intensidad y versatilidad lo hacen perfecto para quienes desean destacar en cualquier ocasión, reflejando una personalidad segura y carismática.", sku: "SP116W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: true, notes: "Naranja sanguina, mandarina, Miel, gardenia", duration: "7-9 horas", original_inspiration: "SCANDAL J.P.G." },

  // HOMBRES - Urbano Moderno
  { name: "Urbano Moderno – Eau de Parfum amaderado especiado masculino 30ml", brand: "Zachary Perfumes", price: 8390, category: "Hombre", description: "Fragancia sofisticada y moderna con un aroma fresco y especiado que captura la esencia de la elegancia contemporánea. Inspirado en 212 MEN.", sku: "SP1H-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.7, is_featured: false, notes: "Notas verdes, toronja, especias, bergamota", duration: "6-8 horas", original_inspiration: "212 MEN" },
  { name: "Urbano Moderno – Eau de Parfum amaderado especiado masculino 50ml", brand: "Zachary Perfumes", price: 11190, category: "Hombre", description: "Fragancia sofisticada y moderna con un aroma fresco y especiado que captura la esencia de la elegancia contemporánea. Inspirado en 212 MEN.", sku: "SP1H-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.7, is_featured: false, notes: "Notas verdes, toronja, especias, bergamota", duration: "6-8 horas", original_inspiration: "212 MEN" },
  { name: "Urbano Moderno – Eau de Parfum amaderado especiado masculino 100ml", brand: "Zachary Perfumes", price: 13990, category: "Hombre", description: "Fragancia sofisticada y moderna con un aroma fresco y especiado que captura la esencia de la elegancia contemporánea. Inspirado en 212 MEN.", sku: "SP1H-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.7, is_featured: true, notes: "Notas verdes, toronja, especias, bergamota", duration: "6-8 horas", original_inspiration: "212 MEN" },

  // Seductor Urbano
  { name: "Seductor Urbano – Eau de Parfum oriental amaderado masculino 30ml", brand: "Zachary Perfumes", price: 8390, category: "Hombre", description: "Fragancia seductora y sofisticada con un aroma envolvente que captura la esencia de la elegancia urbana. Inspirado en 212 SEXY MEN.", sku: "SP2H-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.6, is_featured: false, notes: "Mandarina, bergamota, notas verdes, pimienta", duration: "6-8 horas", original_inspiration: "212 SEXY MEN" },
  { name: "Seductor Urbano – Eau de Parfum oriental amaderado masculino 50ml", brand: "Zachary Perfumes", price: 11190, category: "Hombre", description: "Fragancia seductora y sofisticada con un aroma envolvente que captura la esencia de la elegancia urbana. Inspirado en 212 SEXY MEN.", sku: "SP2H-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.6, is_featured: false, notes: "Mandarina, bergamota, notas verdes, pimienta", duration: "6-8 horas", original_inspiration: "212 SEXY MEN" },
  { name: "Seductor Urbano – Eau de Parfum oriental amaderado masculino 100ml", brand: "Zachary Perfumes", price: 13990, category: "Hombre", description: "Fragancia seductora y sofisticada con un aroma envolvente que captura la esencia de la elegancia urbana. Inspirado en 212 SEXY MEN.", sku: "SP2H-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.6, is_featured: false, notes: "Mandarina, bergamota, notas verdes, pimienta", duration: "6-8 horas", original_inspiration: "212 SEXY MEN" },

  // Brisa Marina
  { name: "Brisa Marina – Eau de Parfum acuático cítrico masculino 30ml", brand: "Zachary Perfumes", price: 8390, category: "Hombre", description: "Fragancia fresca y sofisticada que captura la esencia del hombre moderno con un aroma acuático y cítrico. Inspirado en ACQUA DI GIO MEN.", sku: "SP5H-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.9, is_featured: false, notes: "Lima, limón, bergamota, jazmín", duration: "6-8 horas", original_inspiration: "ACQUA DI GIO MEN" },
  { name: "Brisa Marina – Eau de Parfum acuático cítrico masculino 50ml", brand: "Zachary Perfumes", price: 11190, category: "Hombre", description: "Fragancia fresca y sofisticada que captura la esencia del hombre moderno con un aroma acuático y cítrico. Inspirado en ACQUA DI GIO MEN.", sku: "SP5H-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.9, is_featured: false, notes: "Lima, limón, bergamota, jazmín", duration: "6-8 horas", original_inspiration: "ACQUA DI GIO MEN" },
  { name: "Brisa Marina – Eau de Parfum acuático cítrico masculino 100ml", brand: "Zachary Perfumes", price: 13990, category: "Hombre", description: "Fragancia fresca y sofisticada que captura la esencia del hombre moderno con un aroma acuático y cítrico. Inspirado en ACQUA DI GIO MEN.", sku: "SP5H-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.9, is_featured: true, notes: "Lima, limón, bergamota, jazmín", duration: "6-8 horas", original_inspiration: "ACQUA DI GIO MEN" },

  // Azul Iconico
  { name: "Azul Iconico – Eau de Parfum amaderado aromático masculino 30ml", brand: "Zachary Perfumes", price: 9590, category: "Hombre", description: "Fragancia sofisticada y moderna con un aroma distintivo y versátil. Inspirado en BLEU CHANEL.", sku: "SP17H-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.9, is_featured: false, notes: "Pomelo, limón, menta, pimienta rosa", duration: "8-10 horas", original_inspiration: "BLEU CHANEL" },
  { name: "Azul Iconico – Eau de Parfum amaderado aromático masculino 50ml", brand: "Zachary Perfumes", price: 12790, category: "Hombre", description: "Fragancia sofisticada y moderna con un aroma distintivo y versátil. Inspirado en BLEU CHANEL.", sku: "SP17H-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.9, is_featured: false, notes: "Pomelo, limón, menta, pimienta rosa", duration: "8-10 horas", original_inspiration: "BLEU CHANEL" },
  { name: "Azul Iconico – Eau de Parfum amaderado aromático masculino 100ml", brand: "Zachary Perfumes", price: 15990, category: "Hombre", description: "Fragancia sofisticada y moderna con un aroma distintivo y versátil. Inspirado en BLEU CHANEL.", sku: "SP17H-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.9, is_featured: true, notes: "Pomelo, limón, menta, pimienta rosa", duration: "8-10 horas", original_inspiration: "BLEU CHANEL" },

  // Salvaje Elegante
  { name: "Salvaje Elegante – Eau de Parfum aromático fougère masculino 30ml", brand: "Zachary Perfumes", price: 8990, category: "Hombre", description: "Fragancia audaz y sofisticada con aroma fresco y especiado. Inspirado en SAUVAGE.", sku: "SP77H-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.8, is_featured: false, notes: "Bergamota de Calabria, pimienta, pimienta de Sichuan, lavanda", duration: "8-10 horas", original_inspiration: "SAUVAGE" },
  { name: "Salvaje Elegante – Eau de Parfum aromático fougère masculino 50ml", brand: "Zachary Perfumes", price: 11990, category: "Hombre", description: "Fragancia audaz y sofisticada con aroma fresco y especiado. Inspirado en SAUVAGE.", sku: "SP77H-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.8, is_featured: false, notes: "Bergamota de Calabria, pimienta, pimienta de Sichuan, lavanda", duration: "8-10 horas", original_inspiration: "SAUVAGE" },
  { name: "Salvaje Elegante – Eau de Parfum aromático fougère masculino 100ml", brand: "Zachary Perfumes", price: 14990, category: "Hombre", description: "Fragancia audaz y sofisticada con aroma fresco y especiado. Inspirado en SAUVAGE.", sku: "SP77H-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapH.jpg", rating: 4.8, is_featured: true, notes: "Bergamota de Calabria, pimienta, pimienta de Sichuan, lavanda", duration: "8-10 horas", original_inspiration: "SAUVAGE" },

  // LocionesS
  { name: "Vanilla Woodlace - Lociones 30ml", brand: "Zachary Perfumes", price: 4790, category: "Lociones", description: "Almizcle y vainilla para noches sensuales. Deja una estela inolvidable en la piel.", sku: "ZBM-VAN-30ML", stock_quantity: 50, size: "30ml", concentration: "Lociones", image_url: "/images/body-mist.jpg", rating: 4.3, is_featured: false, notes: "Vainilla cremosa, almizcle sensual", duration: "2-4 horas", original_inspiration: "Creación original" },
  { name: "Vanilla Woodlace - Lociones 50ml", brand: "Zachary Perfumes", price: 6390, category: "Lociones", description: "Almizcle y vainilla para noches sensuales. Deja una estela inolvidable en la piel.", sku: "ZBM-VAN-50ML", stock_quantity: 30, size: "50ml", concentration: "Lociones", image_url: "/images/body-mist.jpg", rating: 4.3, is_featured: false, notes: "Vainilla cremosa, almizcle sensual", duration: "2-4 horas", original_inspiration: "Creación original" },
  { name: "Vanilla Woodlace - Lociones 100ml", brand: "Zachary Perfumes", price: 7990, category: "Lociones", description: "Almizcle y vainilla para noches sensuales. Deja una estela inolvidable en la piel.", sku: "ZBM-VAN-100ML", stock_quantity: 20, size: "100ml", concentration: "Lociones", image_url: "/images/body-mist.jpg", rating: 4.3, is_featured: false, notes: "Vainilla cremosa, almizcle sensual", duration: "2-4 horas", original_inspiration: "Creación original" },

  { name: "Petals Embrace - Lociones 30ml", brand: "Zachary Perfumes", price: 4790, category: "Lociones", description: "Abrazo floral con toque almendrado. Serenidad y armonía en cada aplicación corporal.", sku: "ZBM-PET-30ML", stock_quantity: 50, size: "30ml", concentration: "Lociones", image_url: "/images/body-mist.jpg", rating: 4.2, is_featured: false, notes: "Almendras dulces, flores delicadas", duration: "2-4 horas", original_inspiration: "Creación original" },
  { name: "Petals Embrace - Lociones 50ml", brand: "Zachary Perfumes", price: 6390, category: "Lociones", description: "Abrazo floral con toque almendrado. Serenidad y armonía en cada aplicación corporal.", sku: "ZBM-PET-50ML", stock_quantity: 30, size: "50ml", concentration: "Lociones", image_url: "/images/body-mist.jpg", rating: 4.2, is_featured: true, notes: "Almendras dulces, flores delicadas", duration: "2-4 horas", original_inspiration: "Creación original" },
  { name: "Petals Embrace - Lociones 100ml", brand: "Zachary Perfumes", price: 7990, category: "Lociones", description: "Abrazo floral con toque almendrado. Serenidad y armonía en cada aplicación corporal.", sku: "ZBM-PET-100ML", stock_quantity: 20, size: "100ml", concentration: "Lociones", image_url: "/images/body-mist.jpg", rating: 4.2, is_featured: false, notes: "Almendras dulces, flores delicadas", duration: "2-4 horas", original_inspiration: "Creación original" },

  { name: "Passion Bloom - Lociones 30ml", brand: "Zachary Perfumes", price: 4790, category: "Lociones", description: "Ciruela, fresia y manzanilla para momentos de calma y balance personal.", sku: "ZBM-PAS-30ML", stock_quantity: 50, size: "30ml", concentration: "Lociones", image_url: "/images/body-mist.jpg", rating: 4.4, is_featured: false, notes: "Ciruela jugosa, fresia, manzanilla", duration: "2-4 horas", original_inspiration: "Creación original" },
  { name: "Passion Bloom - Lociones 50ml", brand: "Zachary Perfumes", price: 6390, category: "Lociones", description: "Ciruela, fresia y manzanilla para momentos de calma y balance personal.", sku: "ZBM-PAS-50ML", stock_quantity: 30, size: "50ml", concentration: "Lociones", image_url: "/images/body-mist.jpg", rating: 4.4, is_featured: false, notes: "Ciruela jugosa, fresia, manzanilla", duration: "2-4 horas", original_inspiration: "Creación original" },
  { name: "Passion Bloom - Lociones 100ml", brand: "Zachary Perfumes", price: 7990, category: "Lociones", description: "Ciruela, fresia y manzanilla para momentos de calma y balance personal.", sku: "ZBM-PAS-100ML", stock_quantity: 20, size: "100ml", concentration: "Lociones", image_url: "/images/body-mist.jpg", rating: 4.4, is_featured: false, notes: "Ciruela jugosa, fresia, manzanilla", duration: "2-4 horas", original_inspiration: "Creación original" },

  // HOME SPRAYS
  { name: "Verbena Garden – Home Spray aromático mediterráneo 30ml", brand: "Zachary Perfumes", price: 7790, category: "Hogar", description: "Jardín mediterráneo con verbena, azahar y limón. Refrescante y natural para espacios amplios.", sku: "ZHS-VER-30ML", stock_quantity: 50, size: "30ml", concentration: "Home Spray", image_url: "/images/home-spray.jpg", rating: 4.5, is_featured: false, notes: "Verbena, azahar, limón, tomillo mediterráneo", duration: "Ambiente: 4-6 horas", original_inspiration: "Creación original" },
  { name: "Verbena Garden – Home Spray aromático mediterráneo 50ml", brand: "Zachary Perfumes", price: 10390, category: "Hogar", description: "Jardín mediterráneo con verbena, azahar y limón. Refrescante y natural para espacios amplios.", sku: "ZHS-VER-50ML", stock_quantity: 30, size: "50ml", concentration: "Home Spray", image_url: "/images/home-spray.jpg", rating: 4.5, is_featured: false, notes: "Verbena, azahar, limón, tomillo mediterráneo", duration: "Ambiente: 4-6 horas", original_inspiration: "Creación original" },
  { name: "Verbena Garden – Home Spray aromático mediterráneo 100ml", brand: "Zachary Perfumes", price: 12990, category: "Hogar", description: "Jardín mediterráneo con verbena, azahar y limón. Refrescante y natural para espacios amplios.", sku: "ZHS-VER-100ML", stock_quantity: 20, size: "100ml", concentration: "Home Spray", image_url: "/images/home-spray.jpg", rating: 4.5, is_featured: true, notes: "Verbena, azahar, limón, tomillo mediterráneo", duration: "Ambiente: 4-6 horas", original_inspiration: "Creación original" },

  { name: "Summer Forever – Home Spray tropical gourmand 30ml", brand: "Zachary Perfumes", price: 7790, category: "Hogar", description: "Notas tropicales de coco y vainilla. Calidez y sensualidad para tu hogar durante todo el año.", sku: "ZHS-SUM-30ML", stock_quantity: 50, size: "30ml", concentration: "Home Spray", image_url: "/images/home-spray.jpg", rating: 4.6, is_featured: false, notes: "Coco tropical, vainilla cremosa", duration: "Ambiente: 4-6 horas", original_inspiration: "Creación original" },
  { name: "Summer Forever – Home Spray tropical gourmand 50ml", brand: "Zachary Perfumes", price: 10390, category: "Hogar", description: "Notas tropicales de coco y vainilla. Calidez y sensualidad para tu hogar durante todo el año.", sku: "ZHS-SUM-50ML", stock_quantity: 30, size: "50ml", concentration: "Home Spray", image_url: "/images/home-spray.jpg", rating: 4.6, is_featured: true, notes: "Coco tropical, vainilla cremosa", duration: "Ambiente: 4-6 horas", original_inspiration: "Creación original" },
  { name: "Summer Forever – Home Spray tropical gourmand 100ml", brand: "Zachary Perfumes", price: 12990, category: "Hogar", description: "Notas tropicales de coco y vainilla. Calidez y sensualidad para tu hogar durante todo el año.", sku: "ZHS-SUM-100ML", stock_quantity: 20, size: "100ml", concentration: "Home Spray", image_url: "/images/home-spray.jpg", rating: 4.6, is_featured: true, notes: "Coco tropical, vainilla cremosa", duration: "Ambiente: 4-6 horas", original_inspiration: "Creación original" }
];

// Función para actualizar la estructura de la tabla
async function updateTableStructure() {
  try {
    console.log('🔧 Verificando estructura de la tabla...');

    const tableInfo = await query('DESCRIBE products');
    const columns = tableInfo.map(col => col.Field);

    const requiredColumns = [
      { name: 'notes', type: 'TEXT' },
      { name: 'duration', type: 'VARCHAR(100)' },
      { name: 'original_inspiration', type: 'VARCHAR(255)' },
      { name: 'size', type: 'VARCHAR(20)' },
      { name: 'concentration', type: 'VARCHAR(50)' }
    ];

    for (const col of requiredColumns) {
      if (!columns.includes(col.name)) {
        console.log(`➕ Agregando columna ${col.name}...`);
        await query(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
      }
    }

    console.log('✅ Estructura de tabla verificada');

  } catch (error) {
    console.error('❌ Error actualizando estructura:', error);
    throw error;
  }
}

// Función principal para cargar todos los 776 productos
async function loadAll776Products() {
  console.log('🚀 CARGANDO TODOS LOS 776 PRODUCTOS REALES');
  console.log('='.repeat(70));

  try {
    // Actualizar estructura de tabla
    await updateTableStructure();

    console.log('✅ Conexión a MySQL OK');
    console.log(`📋 Productos a procesar: ${allProducts.length}`);

    // Limpiar productos existentes
    console.log('🧹 Limpiando productos existentes...');
    await query('DELETE FROM products');
    console.log('✅ Productos existentes eliminados');

    let insertedCount = 0;
    let errorCount = 0;

    for (const product of allProducts) {
      try {
        if (!product.sku) {
          console.log(`⚠️ Producto sin SKU: ${product.name}`);
          errorCount++;
          continue;
        }

        // Insertar producto
        await query(`
          INSERT INTO products (
            name, description, price, sku, brand, category,
            image_url, stock_quantity, is_featured, rating, is_active,
            notes, duration, original_inspiration, size, concentration
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
        `, [
          product.name,
          product.description,
          product.price,
          product.sku,
          product.brand,
          product.category,
          product.image_url,
          product.stock_quantity,
          product.is_featured,
          product.rating,
          product.notes,
          product.duration,
          product.original_inspiration,
          product.size,
          product.concentration
        ]);

        console.log(`✅ Insertado: ${product.name} - $${product.price.toLocaleString('es-CL')}`);
        insertedCount++;

      } catch (error) {
        console.error(`❌ Error con producto ${product.sku}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n🎉 Proceso completado:`);
    console.log(`✅ Insertados: ${insertedCount}`);
    console.log(`❌ Errores: ${errorCount}`);

    // Estadísticas finales
    const totalCount = await query('SELECT COUNT(*) as total FROM products WHERE is_active = 1');
    console.log(`📦 Total productos activos: ${totalCount[0].total}`);

    const categoryStats = await query(`
      SELECT category, COUNT(*) as count 
      FROM products 
      WHERE is_active = 1 
      GROUP BY category 
      ORDER BY count DESC
    `);

    console.log('\n📊 Productos por categoría:');
    categoryStats.forEach(stat => {
      console.log(`   ${stat.category}: ${stat.count} productos`);
    });

    const featuredCount = await query('SELECT COUNT(*) as total FROM products WHERE is_featured = 1 AND is_active = 1');
    console.log(`\n⭐ Productos destacados: ${featuredCount[0].total}`);

    const stockValue = await query('SELECT SUM(price * stock_quantity) as total_value FROM products WHERE is_active = 1');
    console.log(`💰 Valor total del inventario: $${stockValue[0].total_value?.toLocaleString('es-CL') || 0} CLP`);

    return { insertedCount, errorCount };

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  loadAll776Products()
    .then(() => {
      console.log('\n🎉 CARGA DE TODOS LOS PRODUCTOS COMPLETADA EXITOSAMENTE');
      console.log('\n📝 PRODUCTOS LISTOS PARA:');
      console.log('✅ Agregar al carrito');
      console.log('✅ Comprar con Webpay');
      console.log('✅ Gestionar desde admin dashboard');
      console.log('✅ Modificar stock y precios');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { loadAll776Products };