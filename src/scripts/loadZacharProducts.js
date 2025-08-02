import { apiClient } from '@/lib/apiClient';

// Productos reales de Zachary Perfumes con nombres correctos
const zacharProducts = [
  {
    code: "ZP1H",
    name: "Urbano Moderno – Eau de Parfum amaderado especiado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia sofisticada y moderna con un aroma fresco y especiado que captura la esencia de la elegancia contemporánea. Inspirado en 212 MEN.",
    notes: "Notas verdes, toronja, especias, bergamota, lavanda, petit grain, jengibre, violeta, gardenia, salvia, almizcle, sándalo, incienso, madera de gaiac, vetiver, ládano",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP2H",
    name: "Seductor Urbano – Eau de Parfum oriental amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia seductora y sofisticada con un aroma envolvente que captura la esencia de la elegancia urbana. Inspirado en 212 SEXY MEN.",
    notes: "Mandarina, bergamota, notas verdes, pimienta, flores, cardamomo, vainilla, madera de gaiac, sándalo, almizcle, ámbar",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP4H",
    name: "Contraste Sofisticado – Eau de Parfum aromático amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia sofisticada y audaz que fusiona frescura vibrante con calidez envolvente. Inspirado en 212 Vip.",
    notes: "Lima, limón, bergamota, jazmín, naranja, mandarina, nerolí, notas marinas, jazmín, calone, durazno, fresia, jacinto, romero, ciclamen, violeta, cilantro, nuez moscada, rosa, reseda, almizcle blanco, cedro, musgo de roble, pachulí, ámbar",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP5H",
    name: "Brisa Marina – Eau de Parfum acuático cítrico masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia fresca y sofisticada que captura la esencia del hombre moderno con un aroma acuático y cítrico. Inspirado en ACQUA DI GIO MEN.",
    notes: "Lima, limón, bergamota, jazmín, naranja, mandarina, nerolí, notas marinas, jazmín, calone, durazno, fresia, jacinto, romero, ciclamen, violeta, cilantro, nuez moscada, rosa, reseda, almizcle blanco, cedro, musgo de roble, pachulí, ámbar",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP7H",
    name: "Ángel Rebelde – Eau de Parfum oriental amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia audaz y sofisticada que combina frescura de notas verdes con calidez de especias. Inspirado en ANGEL MEN.",
    notes: "Lavanda, menta, notas afrutadas y especias, cilantro, notas verdes, bergamota, caramelo, pachulí, miel, leche, cedro, jazmín, lirio de los valles, café, pachulí, vainilla, haba tonka, benjuí, ámbar, sándalo, almizcle",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP9H",
    name: "Dinámico Deportivo – Eau de Parfum aromático acuático masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia vibrante y enérgica que evoca la libertad y la aventura. Inspirado en ARMANI CODE SPORT.",
    notes: "Menta, mandarina, limón, flor de jengibre, vetiver, notas acuáticas, ámbar",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP10H",
    name: "Código de Elegancia – Eau de Parfum oriental amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia sofisticada y seductora que combina frescura y calidez. Inspirado en ARMANI CODE.",
    notes: "Limón, bergamota, anís estrellado, flor del olivo, madera de gaiac, cuero, haba tonka, tabaco",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP12H",
    name: "Esencia Audaz – Eau de Parfum aromático amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia sofisticada y audaz con un toque contemporáneo. Inspirado en AZZARO.",
    notes: "Lavanda, anís, limón, alcaravea, albahaca, bergamota, esclarea, iris, vetiver, sándalo, pachulí, cedro, bayas de enebro, cardamomo, musgo de roble, cuero, ámbar, almizcle, haba tonka",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP13H",
    name: "Elegancia Clásica – Eau de Parfum amaderado frutal masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia sofisticada y versátil que combina notas frutales y amaderadas. Inspirado en BOSS 6.",
    notes: "Manzana, ciruela, bergamota, limón, musgo de roble, geranio, canela, caoba, clavel, vainilla, sándalo, cedro, vetiver, olivo",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP17H",
    name: "Azul Iconico – Eau de Parfum amaderado aromático masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1599,
    description: "Fragancia sofisticada y moderna con un aroma distintivo y versátil. Inspirado en BLEU CHANEL.",
    notes: "Pomelo, limón, menta, pimienta rosa, jengibre, nuez moscada, jazmín, Iso E Super, incienso, vetiver, cedro, sándalo, pachulí, ládano, almizcle blanco",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP32H",
    name: "Eternidad Moderna – Eau de Parfum aromático fougère masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia sofisticada y atemporal con aroma fresco y envolvente. Inspirado en ETERNITY MEN.",
    notes: "Lavanda, limón, bergamota, mandarina, salvia, bayas de enebro, albahaca, geranio, cilantro, jazmín, flor de azahar, azucena, lirio de los valles, sándalo, vetiver, almizcle, palo de rosa de Brasil, ámbar",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP34H",
    name: "Fahrenheit Clásico – Eau de Parfum cítrico especiado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia sofisticada y profundamente masculina que mezcla notas frescas y especiadas. Inspirado en FAHRENHEIT.",
    notes: "Bergamota, cítricos, pimienta, lavanda, pimienta rosa, vetiver, pachulí, ambroxan, cedro, ládano",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP38H",
    name: "Jefe Elegante – Eau de Parfum aromático amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia sofisticada y moderna que combina frescura y calidez. Inspirado en HUGO BOSS.",
    notes: "Manzana verde, menta, lavanda, pomelo, albahaca, salvia, geranio, clavel, jazmín, abeto, cedro, pachulí",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP42H",
    name: "Invicto Poderoso – Eau de Parfum amaderado acuático masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia audaz y dinámica con intensidad que deja huella, inspirada en la victoria y la fuerza. Inspirado en INVICTUS.",
    notes: "Notas marinas, pomelo, mandarina, hoja de laurel, jazmín, ámbar gris, madera de gaiac, musgo de roble, pachulí",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP45H",
    name: "Hombre Sofisticado – Eau de Parfum aromático avainillado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia exquisita que combina aromas frescos y especiados con calidez envolvente. Inspirado en J.P.G Le Male.",
    notes: "Lavanda, menta, bergamota, abrótano, cardamomo, canela, flor de azahar de naranjo, alcaravea, vainilla, haba tonka, ámbar, sándalo, cedro",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP50H",
    name: "Brisa Mediterránea – Eau de Parfum cítrico amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia vibrante y refrescante que captura la esencia del verano mediterráneo. Inspirado en LIGHT BLUE.",
    notes: "Pomelo, bergamota, mandarina siciliana, enebro de Virginia, pimienta, romero, palo de rosa de Brasil, almizcle, incienso, musgo de roble",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP53H",
    name: "Millón Magnético – Eau de Parfum amaderado especiado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1599,
    description: "Fragancia audaz y carismática que combina frescura cítrica con calidez especiada. Inspirado en ONE MILLION.",
    notes: "Mandarina roja, pomelo, menta, canela, notas especiadas, rosa, ámbar, cuero, notas amaderadas, pachulí hindú",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP56H",
    name: "Rabanne Elegante – Eau de Parfum amaderado aromático masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia audaz y sofisticada que combina frescura y calidez. Inspirado en PACO RABANNE.",
    notes: "Romero, esclarea, palo de rosa de Brasil, lavanda, geranio, haba tonka, musgo de roble, miel, almizcle, ámbar",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP58H",
    name: "Polo Clásico – Eau de Parfum amaderado aromático masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia sofisticada y audaz con un aroma robusto y envolvente. Inspirado en POLO.",
    notes: "Bayas de enebro, abrótano, alcaravea, albahaca, cilantro, bergamota, agujas de pino, cuero, manzanilla, pimienta, clavel, geranio, jazmín, rosa, tabaco, musgo de rosa, pachulí, cedro, vetiver, almizcle, ámbar",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP59H",
    name: "Polo Negro – Eau de Parfum amaderado cítrico masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia sofisticada y moderna que combina frescura y profundidad. Inspirado en POLO BLACK.",
    notes: "Limón, naranja tangerina, ajenjo, mango, salvia, sándalo, pachulí, haba tonka",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP60H",
    name: "Polo Azul – Eau de Parfum aromático acuático masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia sofisticada y fresca que evoca la libertad del cielo azul y la frescura del océano. Inspirado en POLO BLUE.",
    notes: "Pepino, melón, mandarina, albahaca, salvia, geranio, gamuza, notas amaderadas, almizcle",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP62H",
    name: "Polo Deportivo – Eau de Parfum aromático acuático masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia vibrante y enérgica que captura la esencia del deporte y la aventura. Inspirado en POLO SPORT MEN.",
    notes: "Aldehídos, menta, lavanda, bergamota, mandarina, limón, abrótano, nerolí, hierba marina, jengibre, jazmín, geranio, palo de rosa de Brasil, violeta persa, rosa, almizcle, sándalo, cedro, madera de gaiac, ámbar",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP63H",
    name: "Polo Rojo – Eau de Parfum amaderado especiado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia audaz y dinámica con aroma vibrante inspirado en la energía y pasión. Inspirado en POLO RED.",
    notes: "Arándano, pomelo, limón italiano, azafrán, salvia, ámbar",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP68H",
    name: "Tommy Fresco – Eau de Parfum aromático fresco masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia vibrante y fresca que evoca la libertad y la aventura. Inspirado en TOMMY MEN.",
    notes: "Menta, bergamota, pomelo, lavanda, manzana granny smith, arándano, rosa, flor del algodonero, cactus, ámbar",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP69H",
    name: "Ultravioleta – Eau de Parfum amaderado especiado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1399,
    description: "Fragancia audaz y sofisticada con aroma fresco y especiado. Inspirado en ULTRAVIOLET MEN.",
    notes: "Menta, ámbar, vetiver, pimienta, notas especiadas, musgo de roble, vainilla",
    duration: "6-8 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP71H",
    name: "Xeryus Rojo – Eau de Parfum amaderado especiado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia audaz y seductora con mezcla intrigante de notas especiadas y amaderadas. Inspirado en XERYUS ROUGE.",
    notes: "Cactus, naranja china, estragón, pimiento morrón, geranio africano, cedro, sándalo, cedro, almizcle blanco",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP73H",
    name: "XS Black – Eau de Parfum oriental amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia audaz y seductora que combina frescura y calidez. Inspirado en XS BLACK MEN.",
    notes: "Limón, salvia, praliné, canela, bálsamo de tolú, cardamomo negro, palo de rosa de Brasil, pachulí, ámbar negro",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP75H",
    name: "XS Black L'Exces – Eau de Parfum amaderado aromático masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia audaz y sofisticada con aroma fresco y envolvente. Inspirado en XS BLACK L'EXCES.",
    notes: "Limón de Amalfi, lavanda, cipriol (nagarmota), notas marinas, ámbar, pachulí",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP76H",
    name: "Acqua Profumo – Eau de Parfum aromático acuático masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia sofisticada y atemporal que captura la esencia del hombre moderno con aroma fresco y acuático. Inspirado en ACQUA DI GIO PROFUMO.",
    notes: "Notas marinas, bergamota, romero, salvia, geranio, incienso, pachulí",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP77H",
    name: "Salvaje Elegante – Eau de Parfum aromático fougère masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia audaz y sofisticada con aroma fresco y especiado. Inspirado en SAUVAGE.",
    notes: "Bergamota de Calabria, pimienta, pimienta de Sichuan, lavanda, pimienta rosa, vetiver, pachulí, geranio, elemí, ambroxan, cedro, ládano",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP84H",
    name: "Invictus Intenso – Eau de Parfum amaderado oriental masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1599,
    description: "Fragancia audaz y magnética con intensidad robusta y aroma envolvente. Inspirado en INVICTUS INTENSE.",
    notes: "Flor de azahar del naranjo, pimienta negra, whiskey, laureles, ámbar, ámbar gris, sal",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP93H",
    name: "Fantasma Elegante – Eau de Parfum amaderado aromático masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia audaz y moderna con aroma distintivo y envolvente. Inspirado en PHANTOM.",
    notes: "Lavanda, cáscara de limón, limón de Amalfi, lavanda, humo, notas terrosas, manzana, pachulí, vainilla, lavanda, vetiver",
    duration: "8-10 horas",    
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP94H",
    name: "Elixir Salvaje – Eau de Parfum amaderado especiado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1599,
    description: "Fragancia audaz y sofisticada que combina frescura especiada con profundidad amaderada. Inspirado en SAUVAGE ELIXIR.",
    notes: "Canela, nuez moscada, cardamomo, toronja (pomelo), lavanda, regaliz, sándalo, ámbar, pachulí, vetiver de Haití",
    duration: "10-12 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP96H",
    name: "Chico Malo – Eau de Parfum oriental especiado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1599,
    description: "Fragancia audaz y magnética que combina frescura especiada con un toque de dulzura. Inspirado en BAD BOY.",
    notes: "Pimienta blanca, bergamota, pimienta rosa, cedro, esclarea, haba tonka, cacao",
    duration: "10-12 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP97H",
    name: "Eros Magnético – Eau de Parfum aromático fougère masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia masculina que combina frescura, intensidad y sofisticación. Inspirado en EROS VERSACE.",
    notes: "Menta, manzana verde, limón, haba tonka, ambroxan, geranio, vainilla de Madagascar, cedro, vetiver, musgo de roble",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP98H",
    name: "Le Beau Exótico – Eau de Parfum oriental amaderado masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1499,
    description: "Fragancia seductora y exótica que combina frescura vibrante con calidez irresistible. Inspirado en LE BEAU.",
    notes: "Bergamota, coco, haba tonka",
    duration: "8-10 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP99H",
    name: "Escándalo Dulce – Eau de Parfum oriental gourmand masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1599,
    description: "Fragancia audaz y seductora que combina frescura con calidez del caramelo. Inspirado en SCANDAL J.P.G.",
    notes: "Mandarina, esclarea, caramelo, haba tonka, vetiver",
    duration: "10-12 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  {
    code: "ZP100H",
    name: "Fuerte Contigo – Eau de Parfum avainillado dulce masculino",
    brand: "Zachary Perfumes",
    category: "men",
    price: 1599,
    description: "Fragancia audaz y envolvente con aroma cálido y especiado. Inspirado en STRONGER WITH YOU.",
    notes: "Castaña, azúcar, salvia, lavanda, vainilla, humo",
    duration: "10-12 horas",
    image: "lavanda-madera.jpg",
    stock: 50
  },
  // Perfumes para Tela
  {
    code: "ZPT-SUN",
    name: "Sunrise - Perfume para Tela",
    brand: "Zachary",
    category: "home",
    price: 899,
    size: "200 ml",
    description: "Aroma suave y reconfortante con notas florales limpias, inspirado en Rinso. Ideal para mañanas frescas.",
    notes: "Notas florales, frescura equilibrada",
    image: "sunrise.jpg",
    stock: 50
  },
  {
    code: "ZPT-MID",
    name: "Midnight - Perfume para Tela",
    brand: "Zachary",
    category: "home",
    price: 899,
    size: "200 ml",
    description: "Frescura clásica con notas herbales, inspirado en Drive. Perfecto para ambientes despejados.",
    notes: "Notas frescas, herbales",
    image: "midnight.jpg",
    stock: 50
  },
  {
    code: "ZPT-TWI",
    name: "Twilight - Perfume para Tela",
    brand: "Zachary",
    category: "home",
    price: 899,
    size: "200 ml",
    description: "Fragancia limpia e intensa con ylang-ylang, inspirado en Omo. Aroma familiar y reconfortante.",
    notes: "Notas florales, ylang-ylang, toque fresco",
    image: "twilight.jpg",
    stock: 50
  },
  {
    code: "ZPT-SPL",
    name: "Splendor - Perfume para Tela",
    brand: "Zachary",
    category: "home",
    price: 999,
    size: "200 ml",
    description: "Fragancia sofisticada con freesia, rosa y fondo amaderado. Deja una impresión poderosa.",
    notes: "Freesia, rosa, almizcle, cedro",
    image: "splendor.jpg",
    stock: 50
  },
  {
    code: "ZPT-ULT",
    name: "Ultrasoft - Perfume para Tela",
    brand: "Zachary",
    category: "home",
    price: 999,
    size: "200 ml",
    description: "Notas frutales y florales con ylang-ylang y maderas nobles. Suavidad y elegancia en cada rociada.",
    notes: "Piña, pera, rosa, violeta, cedro",
    image: "ultrasoft.jpg",
    stock: 50
  },

  // Perfumes Multi-espacios
  {
    code: "ZPM-FRU",
    name: "Frutilla & Madera - Perfume Multi-espacios",
    brand: "Zachary",
    category: "home",
    price: 949,
    size: "200 ml",
    description: "Dulzura de frutilla con elegancia de madera. Ideal para ambientes acogedores con personalidad.",
    notes: "Frutilla, maderas",
    image: "frutilla-madera.jpg",
    stock: 50
  },
  {
    code: "ZPM-MAN",
    name: "Manzana & Canela - Perfume Multi-espacios",
    brand: "Zachary",
    category: "home",
    price: 949,
    size: "200 ml",
    description: "Manzana jugosa con calidez especiada. Evoca recuerdos felices y sensación de bienestar.",
    notes: "Manzana roja, canela",
    image: "manzana-canela.jpg",
    stock: 50
  },
  {
    code: "ZPM-LAV",
    name: "Lavanda & Madera - Perfume Multi-espacios",
    brand: "Zachary",
    category: "home",
    price: 949,
    size: "200 ml",
    description: "Lavanda fresca con madera cálida. Transforma ambientes en refugios serenos.",
    notes: "Lavanda, maderas",
    image: "lavanda-madera.jpg",
    stock: 50
  },

  // Perfumes para Auto
  {
    code: "ZPA-CAP",
    name: "Cappuccino - Perfume para Auto",
    brand: "Zachary",
    category: "car",
    price: 1099,
    size: "200 ml",
    description: "Aroma de café tostado con crema dulce. Ritual para amantes del café sobre ruedas.",
    notes: "Café, crema",
    image: "cappuccino.jpg",
    stock: 50
  },
  {
    code: "ZPA-FRU",
    name: "Frutos Rojos & Madera - Perfume para Auto",
    brand: "Zachary",
    category: "car",
    price: 1099,
    size: "200 ml",
    description: "Frescura de frutos rojos con profundidad de madera. Para personalidades intensas.",
    notes: "Frutos rojos, maderas",
    image: "frutos-rojos.jpg",
    stock: 50
  },
  {
    code: "ZPA-CUE",
    name: "Cuero Vainilla - Perfume para Auto",
    brand: "Zachary",
    category: "car",
    price: 1099,
    size: "200 ml",
    description: "Calidez de cuero con dulzura de vainilla. Equilibrio entre intensidad y suavidad.",
    notes: "Cuero, vainilla",
    image: "cuero-vainilla.jpg",
    stock: 50
  },
  {
    code: "ZPA-NEW",
    name: "Cuero de Auto Nuevo - Perfume para Auto",
    brand: "Zachary",
    category: "car",
    price: 1199,
    size: "200 ml",
    description: "Recrea el aroma único de auto nuevo. Elegancia y profundidad para cada trayecto.",
    notes: "Cuero, motor limpio",
    image: "auto-nuevo.jpg",
    stock: 50
  },

  // Home Sprays
  {
    code: "ZHS-VER",
    name: "Verbena Garden - Home Spray",
    brand: "Zachary",
    category: "home",
    price: 1299,
    size: "500 ml",
    description: "Jardín mediterráneo con verbena, azahar y limón. Refrescante y natural.",
    notes: "Verbena, azahar, limón, tomillo",
    image: "verbena-garden.jpg",
    stock: 50
  },
  {
    code: "ZHS-SUM",
    name: "Summer Forever - Home Spray",
    brand: "Zachary",
    category: "home",
    price: 1299,
    size: "500 ml",
    description: "Notas tropicales de coco y vainilla. Calidez y sensualidad para tu hogar.",
    notes: "Coco, vainilla",
    image: "summer-forever.jpg",
    stock: 50
  },
  {
    code: "ZHS-SAN",
    name: "Santal 1123 - Home Spray",
    brand: "Zachary",
    category: "home",
    price: 1399,
    size: "500 ml",
    description: "Madera seca, cuero y cardamomo. Sofisticación urbana y libertad.",
    notes: "Sándalo, cuero, cardamomo",
    image: "santal-1123.jpg",
    stock: 50
  },
  {
    code: "ZHS-ROS",
    name: "Red Rose - Home Spray",
    brand: "Zachary",
    category: "home",
    price: 1299,
    size: "500 ml",
    description: "Bouquet floral de rosa y violeta. Romanticismo y calma para espacios íntimos.",
    notes: "Rosa, violeta, musgos",
    image: "red-rose.jpg",
    stock: 50
  },
  {
    code: "ZHS-GRA",
    name: "Granate Black - Home Spray",
    brand: "Zachary",
    category: "home",
    price: 1399,
    size: "500 ml",
    description: "Frutas jugosas con especias y maderas. Audaz y vibrante para espacios con carácter.",
    notes: "Cereza, frambuesa, especias",
    image: "granate-black.jpg",
    stock: 50
  },

  // Body Mists
  {
    code: "ZBM-VAN",
    name: "Vanilla Woodlace - Body Mist",
    brand: "Zachary",
    category: "body",
    price: 799,
    size: "250 ml",
    description: "Almizcle y vainilla para noches sensuales. Deja una estela inolvidable.",
    notes: "Vainilla, almizcle",
    image: "vanilla-woodlace.jpg",
    stock: 50
  },
  {
    code: "ZBM-PET",
    name: "Petals Embrace - Body Mist",
    brand: "Zachary",
    category: "body",
    price: 799,
    size: "250 ml",
    description: "Abrazo floral con toque almendrado. Serenidad y armonía en cada aplicación.",
    notes: "Almendras, flores",
    image: "petals-embrace.jpg",
    stock: 50
  },
  {
    code: "ZBM-PAS",
    name: "Passion Bloom - Body Mist",
    brand: "Zachary",
    category: "body",
    price: 799,
    size: "250 ml",
    description: "Ciruela, fresia y manzanilla para momentos de calma y balance.",
    notes: "Ciruela, fresia, manzanilla",
    image: "passion-bloom.jpg",
    stock: 50
  },
  {
    code: "ZBM-LUS",
    name: "Lush Berry - Body Mist",
    brand: "Zachary",
    category: "body",
    price: 799,
    size: "250 ml",
    description: "Frambuesa y fresa para alegrar tus días. Dulzura jugosa que levanta el ánimo.",
    notes: "Frambuesa, fresa",
    image: "lush-berry.jpg",
    stock: 50
  },
  {
    code: "ZBM-FRU",
    name: "Fruit Bloom - Body Mist",
    brand: "Zachary",
    category: "body",
    price: 799,
    size: "250 ml",
    description: "Mango e hibisco para energía vibrante. Revitaliza tus sentidos.",
    notes: "Mango, hibisco",
    image: "fruit-bloom.jpg",
    stock: 50
  },
  {
    code: "ZBM-EXP",
    name: "Explosive Blossom - Body Mist",
    brand: "Zachary",
    category: "body",
    price: 799,
    size: "250 ml",
    description: "Maracuyá morada y peonía para alegría explosiva. Frescura frutal y floral.",
    notes: "Maracuyá, peonía, orquídea",
    image: "explosive-blossom.jpg",
    stock: 50
  },
  {
    code: "ZBM-COC",
    name: "Coconut Dream - Body Mist",
    brand: "Zachary",
    category: "body",
    price: 799,
    size: "250 ml",
    description: "Coco y vainilla para un escape tropical. Vacaciones en cada rociada.",
    notes: "Coco, vainilla, sábila",
    image: "coconut-dream.jpg",
    stock: 50
  },
  {
    code: "ZBM-BEA",
    name: "Beach Coconut - Body Mist",
    brand: "Zachary",
    category: "body",
    price: 799,
    size: "250 ml",
    description: "Piña, manzana y coco para esencia veraniega. Brisa caribeña en cada uso.",
    notes: "Piña, manzana, coco, jazmín",
    image: "beach-coconut.jpg",
    stock: 50
  },

  // Otros
  {
    code: "ZED-CON",
    name: "Condorito Oficial - Eau de Toilette",
    brand: "Zachary",
    category: "kids",
    price: 999,
    size: "100 ml",
    description: "Fragancia divertida con lima, toronja y menta. Para espíritus jóvenes de 6 a 99 años.",
    notes: "Lima, toronja, menta, vodka",
    image: "condorito.jpg",
    stock: 50
  },
  {
    code: "ZED-YUY",
    name: "Yuyito - Eau de Toilette",
    brand: "Zachary",
    category: "kids",
    price: 999,
    size: "100 ml",
    description: "Fresco y dulce con cassis, freesia y vainilla. Para niñas y adultas jóvenes de corazón.",
    notes: "Cassis, freesia, vainilla, pachulí",
    image: "yuyito.jpg",
    stock: 50
  },
  {
    code: "ZEP-CHV",
    name: "Chile Varón - Eau de Parfum",
    brand: "Zachary",
    category: "men",
    price: 1499,
    size: "100 ml",
    description: "Amaderado especiado con bergamota y pimienta. Elegancia y aventura inspirada en paisajes chilenos.",
    notes: "Bergamota, pimienta negra, lavanda, ámbar",
    image: "chile-varon.jpg",
    stock: 50
  },
  {
    code: "ZEP-CHD",
    name: "Chile Dama - Eau de Parfum",
    brand: "Zachary",
    category: "women",
    price: 1499,
    size: "100 ml",
    description: "Floral afrutado con rosa chilena y jazmín. Sofisticación inspirada en la esencia de Chile.",
    notes: "Bergamota, frutas rojas, rosa chilena, cedro",
    image: "chile-dama.jpg",
    stock: 50
  }
];

// Función para cargar SOLO productos nuevos (incremental)
export async function loadNewZacharProducts() {
  try {
    console.log('🔍 Verificando productos existentes...');

    // Obtener todos los SKUs existentes
    const { data: existingProducts, error: selectError } = await supabase
      .from('products')
      .select('sku');

    if (selectError) {
      console.error('❌ Error verificando productos existentes:', selectError);
      throw new Error(`Error de consulta: ${selectError.message}`);
    }

    const existingSKUs = new Set();
    existingProducts.forEach(product => {
      // Extraer el código base del SKU (sin el tamaño)
      const baseCode = product.sku.split('-').slice(0, -1).join('-');
      existingSKUs.add(baseCode);
    });

    console.log(`📊 Productos existentes encontrados: ${existingSKUs.size} códigos base`);

    // Filtrar solo productos nuevos
    const newProducts = zacharProducts.filter(product => {
      return !existingSKUs.has(product.code);
    });

    console.log(`🆕 Productos nuevos a cargar: ${newProducts.length}`);

    if (newProducts.length === 0) {
      console.log('✅ No hay productos nuevos para cargar');
      return [];
    }

    // Definir los tamaños y sus multiplicadores de precio
    const sizeVariants = [
      { size: '30ml', priceMultiplier: 0.6, stock: 50 },
      { size: '50ml', priceMultiplier: 0.8, stock: 30 },
      { size: '100ml', priceMultiplier: 1.0, stock: 20 }
    ];

    // Insertar solo productos nuevos con sus 3 variantes
    const results = [];
    let totalVariants = 0;

    for (let i = 0; i < newProducts.length; i++) {
      const product = newProducts[i];

      // Determinar la imagen según la categoría
      let imageFile;
      switch (product.category) {
        case 'men':
          imageFile = 'sillapH.jpg';
          break;
        case 'women':
          imageFile = 'sillapM.jpg';
          break;
        case 'home':
          imageFile = 'home-spray.jpg'; // Nueva imagen para productos del hogar
          break;
        case 'body':
          imageFile = 'body-mist.jpg'; // Nueva imagen para body mists
          break;
        default:
          imageFile = 'default-product.jpg';
      }

      // Convertir notas a array para fragrance_profile
      const fragranceNotes = product.notes ?
        product.notes.split(',').map(note => note.trim()).slice(0, 4) :
        ['aromático', 'elegante'];

      // Crear las 3 variantes para cada producto nuevo
      for (let j = 0; j < sizeVariants.length; j++) {
        const variant = sizeVariants[j];
        totalVariants++;

        const productToInsert = {
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: Math.round(product.price * variant.priceMultiplier),
          description: product.description,
          sku: `${product.code}-${variant.size.toUpperCase()}`,
          size: variant.size,
          concentration: product.category === 'body' ? 'Body Mist' :
            product.category === 'home' ? 'Home Spray' : 'Eau de Parfum',
          in_stock: true,
          stock_quantity: variant.stock,
          is_featured: Math.random() > 0.85, // Pocos productos destacados
          image_url: `/images/${imageFile}`,
          fragrance_profile: fragranceNotes,
          fragrance_notes: product.notes
        };

        console.log(`📦 Insertando variante ${totalVariants}: ${product.name} (${variant.size})`);

        const { data, error: insertError } = await supabase
          .from('products')
          .insert([productToInsert])
          .select();

        if (insertError) {
          console.error(`❌ Error insertando variante ${product.name} ${variant.size}:`, insertError);
          throw new Error(`Error en variante ${product.name} ${variant.size}: ${insertError.message}`);
        }

        if (data && data.length > 0) {
          results.push(data[0]);
          console.log(`✅ Variante ${totalVariants} insertada: ${variant.size} - $${productToInsert.price}`);
        }
      }

      console.log(`🎯 Producto nuevo ${i + 1}/${newProducts.length} completado: ${product.name} (3 variantes)`);
    }

    console.log(`✅ ${results.length} nuevas variantes cargadas exitosamente`);
    console.log(`🎯 ${newProducts.length} productos únicos nuevos con 3 tamaños cada uno`);
    console.log('🎉 Base de datos actualizada con nuevos productos Zachary');

    // Mostrar estadísticas de productos nuevos
    const newStats = {
      productosNuevos: newProducts.length,
      totalVariantesNuevas: results.length,
      home: newProducts.filter(p => p.category === 'home').length * 3,
      body: newProducts.filter(p => p.category === 'body').length * 3,
      men: newProducts.filter(p => p.category === 'men').length * 3,
      women: newProducts.filter(p => p.category === 'women').length * 3
    };

    console.log('📊 Estadísticas de productos nuevos:', newStats);

    return results;
  } catch (error) {
    console.error('❌ Error en el proceso de carga incremental:', error);
    throw error;
  }
}

// Función para verificar consistencia de categorías
export async function verifyProductCategories() {
  try {
    console.log('🔍 Verificando consistencia de categorías...');

    const { data: products, error } = await supabase
      .from('products')
      .select('category')
      .order('category');

    if (error) {
      console.error('❌ Error verificando categorías:', error);
      return;
    }

    // Contar productos por categoría
    const categoryCount = {};
    products.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    console.log('📊 CATEGORÍAS EN BASE DE DATOS:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} productos`);
    });

    // Verificar que las categorías sean consistentes
    const validCategories = ['men', 'women', 'home', 'body'];
    const invalidCategories = Object.keys(categoryCount).filter(cat => !validCategories.includes(cat));

    if (invalidCategories.length > 0) {
      console.log('⚠️ CATEGORÍAS INCONSISTENTES ENCONTRADAS:', invalidCategories);
    } else {
      console.log('✅ Todas las categorías son consistentes');
    }

    return categoryCount;
  } catch (error) {
    console.error('❌ Error verificando categorías:', error);
    throw error;
  }
}

// Función original mantenida para referencia (renombrada)
export async function loadAllZacharProductsFromScratch() {
  // ... código original para carga completa
  console.log('⚠️ Esta función eliminará TODOS los productos existentes');
  console.log('💡 Usa loadNewZacharProducts() para carga incremental');
}

// Exportar funciones principales
export { loadNewZacharProducts as default };