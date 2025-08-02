const { query } = require('./config/database');

// Productos reales de Zachary Perfumes para MySQL
const zacharyProducts = [
    {
        code: "ZP1W",
        name: "212 Woman – Eau de Parfum floral femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1299,
        description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.",
        notes: "Flor de azahar del naranjo, flor de cactus, bergamota, mandarina, azucena, fresia, gardenia, jazmín, camelia blanca, lirio de los valles, rosa, peonía, almizcle, sándalo",
        duration: "6-8 horas",
        originalInspiration: "212 WOMAN - Carolina Herrera"
    },
    {
        code: "ZP2W",
        name: "212 Sexy Woman – Eau de Parfum oriental floral femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1399,
        description: "Fragancia seductora y envolvente, con un aroma dulce y especiado que deja una impresión duradera. Inspirada en 212 SEXY WOMAN de Carolina Herrera.",
        notes: "Pimienta rosa, mandarina, bergamota, algodón de azúcar, gardenia, flores, pelargonio, rosa, vainilla, almizcle, sándalo, caramelo, pachulí, violeta",
        duration: "6-8 horas",
        originalInspiration: "212 SEXY WOMAN - Carolina Herrera"
    },
    {
        code: "ZP3W",
        name: "212 VIP Woman – Eau de Parfum oriental floral femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1499,
        description: "Fragancia vibrante y sofisticada, con un aroma exótico y envolvente que combina glamour y exclusividad. Inspirada en 212 VIP WOMAN de Carolina Herrera.",
        notes: "Ron, maracuyá, gardenia, almizcle, vainilla, haba tonka",
        duration: "6-8 horas",
        originalInspiration: "212 VIP WOMAN - Carolina Herrera"
    },
    {
        code: "ZP4W",
        name: "212 VIP Rose Woman – Eau de Parfum floral frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1599,
        description: "Fragancia sofisticada y moderna, que combina la frescura del champagne rosé con la calidez de las notas amaderadas. Inspirada en 212 VIP ROSE WOMAN de Carolina Herrera.",
        notes: "Champagne rosé, pimienta rosa, flor del duraznero, rosa, almizcle blanco, notas amaderadas",
        duration: "6-8 horas",
        originalInspiration: "212 VIP ROSE WOMAN - Carolina Herrera"
    },
    {
        code: "ZP5W",
        name: "Acqua di Gio Woman – Eau de Parfum floral acuático femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1699,
        description: "Fragancia sofisticada y fresca, inspirada en la frescura del mar y la delicadeza de las flores. Inspirada en ACQUA DI GIO WOMAN de Giorgio Armani.",
        notes: "Peonía, vodka con sabor a dulces de musk, piña, limón, durazno, hoja de plátano, lirio de los valles, azucena, jacinto, jazmín, fresia, calone, ylang ylang, rosa, almizcle, cedro, sándalo, ámbar, styrax",
        duration: "6-8 horas",
        originalInspiration: "ACQUA DI GIO WOMAN - Giorgio Armani"
    },
    {
        code: "ZP7W",
        name: "Amor Amor Woman – Eau de Parfum floral afrutado femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1199,
        description: "Fragancia vibrante y seductora, que captura la esencia del amor joven con notas florales y afrutadas. Inspirada en AMOR AMOR WOMAN de Cacharel.",
        notes: "Grosellas negras, naranja, mandarina, pomelo, casia, bergamota, rosa, chabacano, jazmín, azucena, lirio de los valles, vainilla, haba tonka, almizcle, ámbar, cedro de Virginia",
        duration: "5-7 horas",
        originalInspiration: "AMOR AMOR WOMAN - Cacharel"
    },
    {
        code: "ZP13W",
        name: "Be Delicious Woman – Eau de Parfum floral frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1349,
        description: "Fragancia vibrante y fresca, que combina la frescura de las frutas y la elegancia de las flores. Inspirada en BE DELICIOUS WOMAN de DKNY.",
        notes: "Pepino, pomelo, magnolia, manzana verde, lirio de los valles, nardos, violeta, rosa, notas amaderadas, sándalo, ámbar",
        duration: "6-8 horas",
        originalInspiration: "BE DELICIOUS WOMAN - DKNY"
    },
    {
        code: "ZP16W",
        name: "CH Woman – Eau de Parfum floral oriental femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1449,
        description: "Fragancia sofisticada y femenina, que busca un equilibrio entre elegancia y audacia. Inspirada en CH WOMAN de Carolina Herrera.",
        notes: "Pomelo, bergamota, limón, rosa, flor de azahar del naranjo, jazmín, cuero, praliné, pachulí, sándalo, cedro, almizcle",
        duration: "6-8 horas",
        originalInspiration: "CH WOMAN - Carolina Herrera"
    },
    {
        code: "ZP18W",
        name: "Can Can – Eau de Parfum floral frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1099,
        description: "Fragancia seductora y vibrante, con un aroma que refleja espíritu audaz y sofisticado. Inspirada en CAN CAN de Paris Hilton.",
        notes: "Nectarina, grosellas negras, clementina, orquídea silvestre, flor de azahar del naranjo, ámbar, almizcle, notas amaderadas",
        duration: "5-7 horas",
        originalInspiration: "CAN CAN - Paris Hilton"
    },
    {
        code: "ZP20W",
        name: "Carolina Herrera Woman – Eau de Parfum floral amaderado femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1549,
        description: "Fragancia sofisticada y elegante, con un aroma floral y amaderado. Inspirada en CAROLINA HERRERA WOMAN.",
        notes: "Damazco, flor de azahar del naranjo, notas verdes, palo de rosa de Brasil, bergamota, nardo de la India, jazmín, jazmín español, ylang ylang, madreselva, narciso, jacinto, lirio de los valles, civeta, almizcle, musgo de roble, ámbar, sándalo, vetiver, cedro",
        duration: "6-8 horas",
        originalInspiration: "CAROLINA HERRERA WOMAN - Carolina Herrera"
    },
    {
        code: "ZP26W",
        name: "Chanel Nº5 – Eau de Parfum floral amaderado femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1899,
        description: "Fragancia atemporal y sofisticada, que aprecia la elegancia clásica con un toque moderno. Inspirada en CHANEL Nº5.",
        notes: "Aldehídos, amaderado, ylang ylang, nerolí, bergamota, durazno, iris, jazmín, rosa, lirio de los valles, sándalo, vainilla, musgo de roble, vetiver, pachulí",
        duration: "8-10 horas",
        originalInspiration: "CHANEL Nº5 - Chanel"
    },
    {
        code: "ZP30W",
        name: "DKNY Woman – Eau de Parfum floral cítrico femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1349,
        description: "Fragancia vibrante y moderna, con un aroma fresco y sofisticado que captura la esencia de la ciudad. Inspirada en DKNY WOMAN.",
        notes: "Hojas de tomatera, naranja, mandarina, damasco, casia, lirio de agua, nenúfar amarillo, narciso amarillo, jazmín, heliotropo, ylang ylang, orquídea, rosa, abedul, gamuza, sándalo, pachulí, ámbar",
        duration: "6-8 horas",
        originalInspiration: "DKNY WOMAN - Donna Karan"
    },
    {
        code: "ZP32W",
        name: "Duende – Eau de Parfum floral amaderado femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1399,
        description: "Fragancia etérea y cautivadora, que evoca misterio y elegancia. Inspirada en DUENDE.",
        notes: "Flor del tilo, melón, bergamota, mandarina, mimosa, jazmín, ylang ylang, absenta, tomillo, cedro, sándalo",
        duration: "6-8 horas",
        originalInspiration: "DUENDE - Agatha Ruiz de la Prada"
    },
    {
        code: "ZP33W",
        name: "Eden – Eau de Parfum floral frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1449,
        description: "Fragancia sofisticada y envolvente, que evoca la esencia de un jardín paradisíaco. Inspirada en EDEN de Cacharel.",
        notes: "Durazno, bergamota, mandarina, limón, lirio de agua, mimosa, nardos, melón, flor de loto, piña, jazmín, lirio de los valles, pachulí, acacia negra, sándalo, cedro, haba tonka",
        duration: "6-8 horas",
        originalInspiration: "EDEN - Cacharel"
    },
    {
        code: "ZP38W",
        name: "Fantasy Midnight – Eau de Parfum floral frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1299,
        description: "Fragancia seductora y envolvente, con toque de misterio y sofisticación. Inspirada en FANTASY MIDNIGHT de Britney Spears.",
        notes: "Ciruela, guinda, frambuesa, orquídea, iris, fresia, vainilla, ámbar, almizcle",
        duration: "6-8 horas",
        originalInspiration: "FANTASY MIDNIGHT - Britney Spears"
    },
    {
        code: "ZP39W",
        name: "Fantasy – Eau de Parfum floral frutal gourmand femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1249,
        description: "Fragancia divertida y seductora, que combina dulzura, frutas jugosas y un toque floral. Inspirada en FANTASY de Britney Spears.",
        notes: "Kiwi, lichi rojo, membrillo, chocolate blanco, quequito, orquídea, jazmín, almizcle, raíz de lirio, notas amaderadas",
        duration: "5-7 horas",
        originalInspiration: "FANTASY - Britney Spears"
    },
    {
        code: "ZP42W",
        name: "Gucci Rush – Eau de Parfum chipre floral femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1649,
        description: "Fragancia audaz y seductora, que irradia pasión y dinamismo. Inspirada en GUCCI RUSH.",
        notes: "Durazno, gardenia de California, pétalos de fresia africana, cilantro, rosa de Damasco, jazmín, pachulí, vainilla natural, vetiver",
        duration: "7-9 horas",
        originalInspiration: "GUCCI RUSH - Gucci"
    },
    {
        code: "ZP43W",
        name: "Halloween Woman – Eau de Parfum floral oriental femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1399,
        description: "Fragancia con un aroma distintivo y cautivador, inspirada en la magia de Halloween. Inspirada en HALLOWEEN WOMAN de Jesús del Pozo.",
        notes: "Violeta, notas marinas, hoja de plátano, petit grain, violeta, magnolia, lirio de los valles, nardos, pimienta, incienso, sándalo, vainilla de Madagascar, mirra",
        duration: "6-8 horas",
        originalInspiration: "HALLOWEEN WOMAN - Jesús del Pozo"
    },
    {
        code: "ZP46W",
        name: "Hugo Woman – Eau de Parfum floral frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1449,
        description: "Fragancia sofisticada y moderna, que combina frescura y calidez. Inspirada en HUGO WOMAN de Hugo Boss.",
        notes: "Manzana granny smith, melón, durazno, violeta persa, casis, musgo de roble, papaya, jacinto de agua, azucena, jazmín, río de lirio, cedro de Virginia, sándalo, orquídea, vainilla, resina, ámbar",
        duration: "6-8 horas",
        originalInspiration: "HUGO WOMAN - Hugo Boss"
    },
    {
        code: "ZP49W",
        name: "J'adore – Eau de Parfum floral afrutado femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1799,
        description: "Fragancia sofisticada y elegante, con un aroma floral afrutado. Inspirada en J'ADORE de Dior.",
        notes: "Pera, melón, magnolia, durazno, mandarina, bergamota, jazmín, lirio de los valles, nardos, fresia, rosa, orquídea, ciruela, violeta, almizcle, vainilla, zarzamora, cedro",
        duration: "8-10 horas",
        originalInspiration: "J'ADORE - Dior"
    },
    {
        code: "ZP51W",
        name: "Light Blue (Mejorado) – Eau de Parfum floral frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1649,
        description: "Fragancia floral frutal que combina notas cítricas y amaderadas con la suavidad del jazmín. Inspirada en LIGHT BLUE de Dolce & Gabbana.",
        notes: "Limón siciliano, manzana, cedro, campanilla, bambú, jazmín, rosa blanca, cedro, almizcle, ámbar",
        duration: "6-8 horas",
        originalInspiration: "LIGHT BLUE - Dolce & Gabbana"
    },
    {
        code: "ZP52W",
        name: "Light Blue Woman – Eau de Parfum floral frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1649,
        description: "Fragancia fresca y vibrante, inspirada en la esencia del Mediterráneo. Inspirada en LIGHT BLUE WOMAN de Dolce & Gabbana.",
        notes: "Limón siciliano, manzana, cedro, campanilla, bambú, jazmín, rosa blanca, cedro, almizcle, ámbar",
        duration: "6-8 horas",
        originalInspiration: "LIGHT BLUE WOMAN - Dolce & Gabbana"
    },
    {
        code: "ZP53W",
        name: "Lolita Lempicka – Eau de Parfum oriental floral femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1499,
        description: "Fragancia encantadora y enigmática con un toque de fantasía. Inspirada en LOLITA LEMPICKA.",
        notes: "Anís estrellado, violeta, hiedra, regaliz, cereza, iris, raíz de lirio, amarilis, vainilla, praliné, haba tonka, almizcle blanco, vetiver",
        duration: "6-8 horas",
        originalInspiration: "LOLITA LEMPICKA - Lolita Lempicka"
    },
    {
        code: "ZP54W",
        name: "Lady Million – Eau de Parfum floral oriental femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1699,
        description: "Fragancia audaz y sofisticada, que irradia confianza y elegancia. Inspirada en LADY MILLION de Paco Rabanne.",
        notes: "Frambuesa, nerolí, limón de Amalfi, jazmín, flor de naranjo africano, gardenia, miel blanca, pachulí, ámbar",
        duration: "7-9 horas",
        originalInspiration: "LADY MILLION - Paco Rabanne"
    },
    {
        code: "ZP55W",
        name: "La Vida es Bella – Eau de Parfum floral gourmand femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1599,
        description: "Fragancia sofisticada y encantadora, que celebra la belleza de la vida con un aroma dulce y floral. Inspirada en LA VIDA ES BELLA de Lancôme.",
        notes: "Grosellas negras, pera, iris, jazmín, flor de azahar del naranjo, praliné, vainilla, pachulí, haba tonka",
        duration: "7-9 horas",
        originalInspiration: "LA VIDA ES BELLA - Lancôme"
    },
    {
        code: "ZP56W",
        name: "Miracle – Eau de Parfum floral afrutado femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1499,
        description: "Fragancia sofisticada y encantadora, que busca un equilibrio entre lo clásico y lo contemporáneo. Inspirada en MIRACLE de Lancôme.",
        notes: "Lichi, fresia, magnolia, pimienta, jengibre, mandarina, jazmín, almizcle, ámbar",
        duration: "6-8 horas",
        originalInspiration: "MIRACLE - Lancôme"
    },
    {
        code: "ZP59W",
        name: "Nina Manzana – Eau de Parfum floral frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1399,
        description: "Fragancia encantadora y juvenil que captura la esencia de la frescura y la sofisticación. Inspirada en NINA MANZANA de Nina Ricci.",
        notes: "Limón de Amalfi, lima, manzana Granny Smith, praliné, peonía, datura, árbol de manzano, almizcle, cedro de Virginia",
        duration: "6-8 horas",
        originalInspiration: "NINA MANZANA - Nina Ricci"
    },
    {
        code: "ZP63W",
        name: "One – Eau de Parfum aromático femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1299,
        description: "Fragancia sofisticada y versátil, que busca un equilibrio entre frescura y elegancia. Inspirada en ONE de Calvin Klein.",
        notes: "Limón, notas verdes, bergamota, piña, mandarina, cardamomo, papaya, lirio de los valles, jazmín, violeta, nuez moscada, rosa, raíz de lirio, fresia, acordes verdes, almizcle, cedro, sándalo, musgo de roble, té verde, ámbar",
        duration: "6-8 horas",
        originalInspiration: "ONE - Calvin Klein"
    },
    {
        code: "ZP66W",
        name: "Paloma Picasso – Eau de Parfum chipre floral femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1749,
        description: "Fragancia audaz y sofisticada, con un aroma rico y complejo que evoca elegancia y misterio. Inspirada en PALOMA PICASSO.",
        notes: "Notas florales y especiadas con base terrosa y amaderada",
        duration: "7-9 horas",
        originalInspiration: "PALOMA PICASSO - Paloma Picasso"
    },
    {
        code: "ZP68W",
        name: "Paris Hilton – Eau de Parfum floral frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1099,
        description: "Fragancia floral frutal que combina frescura y elegancia, ideal para el día a día. Inspirada en PARIS HILTON.",
        notes: "Manzano en flor, camelia, mandarina, grosellas negras, lión, madreselva, rosa, pomelo, azucena, menta, violeta, magnolia, jazmín, cedro, sándalo, cuero",
        duration: "5-7 horas",
        originalInspiration: "PARIS HILTON - Paris Hilton"
    },
    {
        code: "ZP73W",
        name: "Ralph – Eau de Parfum floral frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1399,
        description: "Fragancia vibrante y sofisticada que busca un equilibrio entre frescura y elegancia. Inspirada en RALPH de Ralph Lauren.",
        notes: "Hojas del manzano, mandarina italiana, osmanto japonés, fresia amarilla, magnolia, boronia parda, almizcle, iris blanco",
        duration: "6-8 horas",
        originalInspiration: "RALPH - Ralph Lauren"
    },
    {
        code: "ZP82W",
        name: "Tommy Girl – Eau de Parfum floral frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1249,
        description: "Fragancia vibrante y juvenil que captura la esencia de la frescura y la libertad. Inspirada en TOMMY GIRL de Tommy Hilfiger.",
        notes: "Manzano en flor, camelia, mandarina, grosellas negras, lión, madreselva, rosa, pomelo, azucena, menta, violeta, magnolia, jazmín, cedro, sándalo, cuero",
        duration: "5-7 horas",
        originalInspiration: "TOMMY GIRL - Tommy Hilfiger"
    },
    {
        code: "ZP83W",
        name: "Trésor – Eau de Parfum floral afrutado femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1599,
        description: "Fragancia sofisticada y envolvente, que aprecia la elegancia y el romanticismo. Inspirada en TRESOR de Lancôme.",
        notes: "Durazno, rosa, flor del alboriqueo, lila, piña, lirio de los valles, bergamota, rosa, iris, heliotropo, jazmín, durazno, damasco, vainilla, sándalo, ámbar, almizcle",
        duration: "7-9 horas",
        originalInspiration: "TRESOR - Lancôme"
    },
    {
        code: "ZP87W",
        name: "XS Black Woman – Eau de Parfum oriental floral femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1499,
        description: "Fragancia audaz y seductora, que irradia confianza y misterio. Inspirada en XS BLACK WOMAN de Paco Rabanne.",
        notes: "Arándano, pimienta rosa, tamarindo, cacao, rosa, violeta negra, vainilla, pachulí, madera de massoia",
        duration: "6-8 horas",
        originalInspiration: "XS BLACK WOMAN - Paco Rabanne"
    },
    {
        code: "ZP89W",
        name: "Si Armani – Eau de Parfum floral afrutado femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1699,
        description: "Fragancia sofisticada y elegante, con un aroma floral afrutado. Inspirada en SI ARMANI de Giorgio Armani.",
        notes: "Casis (grosellero negro), rosa de mayo, fresia, vainilla, pachulí, notas amaderadas, ambroxan",
        duration: "7-9 horas",
        originalInspiration: "SI ARMANI - Giorgio Armani"
    },
    {
        code: "ZP90W",
        name: "Good Girl – Eau de Parfum oriental floral femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1749,
        description: "Fragancia audaz y seductora, que abraza su dualidad de fuerza y feminidad. Inspirada en GOOD GIRL de Carolina Herrera.",
        notes: "Almendra, café, bergamota, limón, nardos, jazmín sambac, flor de azahar del naranjo, raíz de lirio, haba tonka, cacao, vainilla, praliné, sándalo, almicle, ámbar, madera de cachemira, canela, pachulí, cedro",
        duration: "7-9 horas",
        originalInspiration: "GOOD GIRL - Carolina Herrera"
    },
    {
        code: "ZP91W",
        name: "Olympea – Eau de Parfum oriental floral femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1699,
        description: "Fragancia audaz y sofisticada, que busca un equilibrio entre elegancia clásica y sensualidad contemporánea. Inspirada en OLYMPEA de Paco Rabanne.",
        notes: "Jazmín de agua, mandarina verde, flor de jengibre, vainilla, sal, ámbar gris, madera de cachemira, sándalo",
        duration: "7-9 horas",
        originalInspiration: "OLYMPEA - Paco Rabanne"
    },
    {
        code: "ZP107W",
        name: "My Way – Eau de Parfum floral amaderado femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1599,
        description: "Fragancia sofisticada y elegante con un aroma floral y amaderado. Inspirada en MY WAY de Giorgio Armani.",
        notes: "Flor de azahar del naranjo, bergamota, nardos, jazmín de la India, vainilla de Madagascar, almizcle blanco, cedro de Virginia",
        duration: "7-9 horas",
        originalInspiration: "MY WAY - Giorgio Armani"
    },
    {
        code: "ZP108W",
        name: "Soleil Cristal – Eau de Parfum floral afrutado femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1649,
        description: "Fragancia radiante y sofisticada, que irradia confianza y elegancia. Inspirada en SOLEIL CRISTAL de Roberto Cavalli.",
        notes: "Mandarina, pimienta rosa, bergamota, ylang ylang, iris, flor de azahar del naranjo, jazmín, coco, vainilla, pachulí",
        duration: "7-9 horas",
        originalInspiration: "SOLEIL CRISTAL - Roberto Cavalli"
    },
    {
        code: "ZP110W",
        name: "Fame – Eau de Parfum oriental frutal femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1499,
        description: "Fragancia sofisticada y audaz, con un aroma exótico y envolvente. Inspirada en FAME de Lady Gaga.",
        notes: "Mango, bergamota, jazmín, incienso de olíbano, vainilla, sándalo",
        duration: "6-8 horas",
        originalInspiration: "FAME - Lady Gaga"
    },
    {
        code: "ZP111W",
        name: "Miss Dior – Eau de Parfum avainillado y atalcado femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1799,
        description: "Descubre la esencia de la elegancia y la sofisticación con esta exquisita fragancia avainillada y atalcada. Inspirada en MISS DIOR de Dior.",
        notes: "Rosas, florales, avainillado, atalcado",
        duration: "8-10 horas",
        originalInspiration: "MISS DIOR - Dior"
    },
    {
        code: "ZP112W",
        name: "Idôle – Eau de Parfum floral femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1699,
        description: "Fragancia sofisticada y moderna, que busca dejar una impresión duradera. Inspirada en IDÔLE de Lancôme.",
        notes: "Pera, bergamota, pimienta rosa, rosa, jazmín, almizcle blanco, vainilla, pachulí, cedro",
        duration: "7-9 horas",
        originalInspiration: "IDÔLE - Lancôme"
    },
    {
        code: "ZP113W",
        name: "Libre YSL – Eau de Parfum floral oriental femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1849,
        description: "Fragancia audaz y sofisticada, diseñada para el espíritu libre y moderno. Inspirada en LIBRE de Yves Saint Laurent.",
        notes: "Lavanda, mandarina, grosellas negras, petit grain, lavanda, flor de azahar del naranjo, jazmín, vainilla de Madagascar, almizcle, cedro, ámbar gris",
        duration: "7-9 horas",
        originalInspiration: "LIBRE - Yves Saint Laurent"
    },
    {
        code: "ZP115W",
        name: "Yara – Eau de Parfum oriental floral femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1849,
        description: "Fragancia audaz y sofisticada, diseñada para el espíritu libre y moderno. Inspirada en LIBRE de Yves Saint Laurent.",
        notes: "Lavanda, mandarina, grosellas negras, petit grain, lavanda, flor de azahar del naranjo, jazmín, vainilla de Madagascar, almizcle, cedro, ámbar gris",
        duration: "7-9 horas",
        originalInspiration: "LIBRE - Yves Saint Laurent"
    },
    {
        code: "ZP116W",
        name: "Yara – Eau de Parfum oriental floral femenino",
        brand: "Zachary Perfumes",
        category: "women",
        price: 1849,
        description: "Fragancia audaz y sofisticada, Con un aroma dulce y envolvente, este perfume captura la esencia de la sofisticación moderna. Su intensidad y versatilidad lo hacen perfecto para quienes desean destacar en cualquier ocasión, reflejando una personalidad segura y carismática. ",
        notes: "Naranja sanguina, mandarina, Miel, gardenia, flor de azahar del naranjo, jazmín, durazno, Cera de abeja, caramelo, pachulí, regaliz",
        duration: "7-9 horas",
        originalInspiration: "SCANDAL J.P.G."
    },

    // HOMBRES
    {
        code: "ZP1H",
        name: "Urbano Moderno – Eau de Parfum amaderado especiado masculino",
        brand: "Zachary Perfumes",
        category: "men",
        price: 1399,
        description: "Fragancia sofisticada y moderna con un aroma fresco y especiado que captura la esencia de la elegancia contemporánea. Inspirado en 212 MEN.",
        notes: "Notas verdes, toronja, especias, bergamota, lavanda, petit grain, jengibre, violeta, gardenia, salvia, almizcle, sándalo, incienso, madera de gaiac, vetiver, ládano",
        duration: "6-8 horas",
        originalInspiration: "212 MEN"
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
        originalInspiration: "212 SEXY MEN"
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
        originalInspiration: "212 Vip"
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
        originalInspiration: "ACQUA DI GIO MEN"
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
        originalInspiration: "ANGEL MEN"
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
        originalInspiration: "ARMANI CODE SPORT"
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
        originalInspiration: "ARMANI CODE"
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
        originalInspiration: "AZZARO"
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
        originalInspiration: "BOSS 6"
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
        originalInspiration: "BLEU CHANEL"
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
        originalInspiration: "ETERNITY MEN"
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
        originalInspiration: "FAHRENHEIT"
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
        originalInspiration: "HUGO BOSS"
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
        originalInspiration: "INVICTUS"
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
        originalInspiration: "J.P.G Le Male"
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
        originalInspiration: "LIGHT BLUE"
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
        originalInspiration: "ONE MILLION"
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
        originalInspiration: "PACO RABANNE"
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
        originalInspiration: "POLO"
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
        originalInspiration: "POLO BLACK"
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
        originalInspiration: "POLO BLUE"
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
        originalInspiration: "POLO SPORT MEN"
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
        originalInspiration: "POLO RED"
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
        originalInspiration: "TOMMY MEN"
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
        originalInspiration: "ULTRAVIOLET MEN"
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
        originalInspiration: "XERYUS ROUGE"
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
        originalInspiration: "XS BLACK MEN"
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
        originalInspiration: "XS BLACK L'EXCES"
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
        originalInspiration: "ACQUA DI GIO PROFUMO"
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
        originalInspiration: "SAUVAGE"
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
        originalInspiration: "INVICTUS INTENSE"
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
        originalInspiration: "PHANTOM"
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
        originalInspiration: "SAUVAGE ELIXIR"
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
        originalInspiration: "BAD BOY"
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
        originalInspiration: "EROS VERSACE"
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
        originalInspiration: "LE BEAU"
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
        originalInspiration: "SCANDAL J.P.G."
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
        originalInspiration: "STRONGER WITH YOU"
    },

    // UNISEX
    // NUEVOS PRODUCTOS - CATEGORÍAS AJUSTADAS PARA CONSISTENCIA
    // Perfumes para Tela - CATEGORÍA: 'home'
    {
        code: "ZPT-SUN",
        name: "Sunrise – Perfume para Tela aromático limpio",
        brand: "Zachary Perfumes",
        category: "home", // Ajustado para consistencia
        price: 899,
        description: "Aroma suave y reconfortante con notas florales limpias, inspirado en Rinso. Ideal para mañanas frescas y textiles delicados.",
        notes: "Notas florales, frescura equilibrada, limpieza",
        duration: "4-6 horas en tela",
        originalInspiration: "Rinso - Fragancia textil"
    },
    {
        code: "ZPT-MID",
        name: "Midnight – Perfume para Tela aromático herbal",
        brand: "Zachary Perfumes",
        category: "home",
        price: 899,
        description: "Frescura clásica con notas herbales, inspirado en Drive. Perfecto para ambientes despejados y textiles frescos.",
        notes: "Notas frescas, herbales, limpieza profunda",
        duration: "4-6 horas en tela",
        originalInspiration: "Drive - Fragancia textil"
    },
    {
        code: "ZPT-TWI",
        name: "Twilight – Perfume para Tela floral ylang-ylang",
        brand: "Zachary Perfumes",
        category: "home",
        price: 899,
        description: "Fragancia limpia e intensa con ylang-ylang, inspirado en Omo. Aroma familiar y reconfortante para toda la familia.",
        notes: "Notas florales, ylang-ylang, toque fresco",
        duration: "4-6 horas en tela",
        originalInspiration: "Omo - Fragancia textil"
    },
    {
        code: "ZPT-SPL",
        name: "Splendor – Perfume para Tela floral amaderado",
        brand: "Zachary Perfumes",
        category: "home",
        price: 999,
        description: "Fragancia sofisticada con freesia, rosa y fondo amaderado. Deja una impresión poderosa en textiles premium.",
        notes: "Freesia, rosa, almizcle, cedro",
        duration: "6-8 horas en tela",
        originalInspiration: "Premium textile fragrance"
    },
    {
        code: "ZPT-ULT",
        name: "Ultrasoft – Perfume para Tela floral frutal",
        brand: "Zachary Perfumes",
        category: "home",
        price: 999,
        description: "Notas frutales y florales con ylang-ylang y maderas nobles. Suavidad y elegancia en cada rociada textil.",
        notes: "Piña, pera, rosa, violeta, cedro",
        duration: "6-8 horas en tela",
        originalInspiration: "Luxury textile fragrance"
    },

    // Perfumes Multi-espacios - CATEGORÍA: 'home'
    {
        code: "ZPM-FRU",
        name: "Frutilla & Madera – Perfume Multi-espacios frutal amaderado",
        brand: "Zachary Perfumes",
        category: "home",
        price: 949,
        description: "Dulzura de frutilla con elegancia de madera. Ideal para ambientes acogedores con personalidad única.",
        notes: "Frutilla, maderas nobles, dulzura natural",
        duration: "6-8 horas",
        originalInspiration: "Ambient fragrance"
    },
    {
        code: "ZPM-MAN",
        name: "Manzana & Canela – Perfume Multi-espacios frutal especiado",
        brand: "Zachary Perfumes",
        category: "home",
        price: 949,
        description: "Manzana jugosa con calidez especiada. Evoca recuerdos felices y sensación de bienestar en el hogar.",
        notes: "Manzana roja, canela, especias cálidas",
        duration: "6-8 horas",
        originalInspiration: "Ambient fragrance"
    },
    {
        code: "ZPM-LAV",
        name: "Lavanda & Madera – Perfume Multi-espacios aromático amaderado",
        brand: "Zachary Perfumes",
        category: "home",
        price: 949,
        description: "Lavanda fresca con madera cálida. Transforma ambientes en refugios serenos y relajantes.",
        notes: "Lavanda, maderas nobles, relajación",
        duration: "6-8 horas",
        originalInspiration: "Ambient fragrance"
    },

    // Perfumes para Auto - CATEGORÍA: 'home' (ajustado para consistencia)
    {
        code: "ZPA-CAP",
        name: "Cappuccino – Perfume para Auto gourmand",
        brand: "Zachary Perfumes",
        category: "home",
        price: 1099,
        description: "Aroma de café tostado con crema dulce. Ritual para amantes del café sobre ruedas.",
        notes: "Café tostado, crema dulce, calidez",
        duration: "4-6 horas",
        originalInspiration: "Coffee shop ambiance"
    },
    {
        code: "ZPA-FRU",
        name: "Frutos Rojos & Madera – Perfume para Auto frutal amaderado",
        brand: "Zachary Perfumes",
        category: "home",
        price: 1099,
        description: "Frescura de frutos rojos con profundidad de madera. Para personalidades intensas y espacios dinámicos.",
        notes: "Frutos rojos, maderas nobles, intensidad",
        duration: "4-6 horas",
        originalInspiration: "Dynamic spaces"
    },
    {
        code: "ZPA-CUE",
        name: "Cuero Vainilla – Perfume para Auto amaderado gourmand",
        brand: "Zachary Perfumes",
        category: "home",
        price: 1099,
        description: "Calidez de cuero con dulzura de vainilla. Equilibrio entre intensidad y suavidad para espacios sofisticados.",
        notes: "Cuero refinado, vainilla cremosa, equilibrio",
        duration: "4-6 horas",
        originalInspiration: "Sophisticated spaces"
    },
    {
        code: "ZPA-NEW",
        name: "Cuero de Auto Nuevo – Perfume para Auto amaderado cuero",
        brand: "Zachary Perfumes",
        category: "home",
        price: 1199,
        description: "Recrea el aroma único de auto nuevo. Elegancia y profundidad para cada trayecto y espacios modernos.",
        notes: "Cuero nuevo, notas limpias, modernidad",
        duration: "6-8 horas",
        originalInspiration: "New car experience"
    },

    // Home Sprays - CATEGORÍA: 'home'
    {
        code: "ZHS-VER",
        name: "Verbena Garden – Home Spray aromático mediterráneo",
        brand: "Zachary Perfumes",
        category: "home",
        price: 1299,
        description: "Jardín mediterráneo con verbena, azahar y limón. Refrescante y natural para espacios amplios.",
        notes: "Verbena, azahar, limón, tomillo mediterráneo",
        duration: "4-6 horas",
        originalInspiration: "Mediterranean garden"
    },
    {
        code: "ZHS-SUM",
        name: "Summer Forever – Home Spray tropical gourmand",
        brand: "Zachary Perfumes",
        category: "home",
        price: 1299,
        description: "Notas tropicales de coco y vainilla. Calidez y sensualidad para tu hogar durante todo el año.",
        notes: "Coco tropical, vainilla cremosa",
        duration: "4-6 horas",
        originalInspiration: "Tropical paradise"
    },
    {
        code: "ZHS-SAN",
        name: "Santal 1123 – Home Spray amaderado oriental",
        brand: "Zachary Perfumes",
        category: "home",
        price: 1399,
        description: "Madera seca, cuero y cardamomo. Sofisticación urbana y libertad para espacios modernos.",
        notes: "Sándalo, cuero refinado, cardamomo",
        duration: "6-8 horas",
        originalInspiration: "Urban sophistication"
    },
    {
        code: "ZHS-ROS",
        name: "Red Rose – Home Spray floral romántico",
        brand: "Zachary Perfumes",
        category: "home",
        price: 1299,
        description: "Bouquet floral de rosa y violeta. Romanticismo y calma para espacios íntimos y acogedores.",
        notes: "Rosa damascena, violeta, musgos naturales",
        duration: "4-6 horas",
        originalInspiration: "Romantic garden"
    },
    {
        code: "ZHS-GRA",
        name: "Granate Black – Home Spray frutal especiado",
        brand: "Zachary Perfumes",
        category: "home",
        price: 1399,
        description: "Frutas jugosas con especias y maderas. Audaz y vibrante para espacios con carácter distintivo.",
        notes: "Cereza negra, frambuesa, especias orientales",
        duration: "6-8 horas",
        originalInspiration: "Bold sophistication"
    },

    // Body Mists - CATEGORÍA: 'body' (nueva categoría)
    {
        code: "ZBM-VAN",
        name: "Vanilla Woodlace – Body Mist gourmand amaderado",
        brand: "Zachary Perfumes",
        category: "body",
        price: 799,
        description: "Almizcle y vainilla para noches sensuales. Deja una estela inolvidable en la piel.",
        notes: "Vainilla cremosa, almizcle sensual",
        duration: "3-4 horas",
        originalInspiration: "Sensual evening"
    },
    {
        code: "ZBM-PET",
        name: "Petals Embrace – Body Mist floral gourmand",
        brand: "Zachary Perfumes",
        category: "body",
        price: 799,
        description: "Abrazo floral con toque almendrado. Serenidad y armonía en cada aplicación corporal.",
        notes: "Almendras dulces, flores delicadas",
        duration: "3-4 horas",
        originalInspiration: "Gentle embrace"
    },
    {
        code: "ZBM-PAS",
        name: "Passion Bloom – Body Mist floral frutal",
        brand: "Zachary Perfumes",
        category: "body",
        price: 799,
        description: "Ciruela, fresia y manzanilla para momentos de calma y balance personal.",
        notes: "Ciruela jugosa, fresia, manzanilla",
        duration: "3-4 horas",
        originalInspiration: "Peaceful passion"
    },
    {
        code: "ZBM-LUS",
        name: "Lush Berry – Body Mist frutal dulce",
        brand: "Zachary Perfumes",
        category: "body",
        price: 799,
        description: "Frambuesa y fresa para alegrar tus días. Dulzura jugosa que levanta el ánimo.",
        notes: "Frambuesa roja, fresa silvestre",
        duration: "3-4 horas",
        originalInspiration: "Joyful berries"
    },
    {
        code: "ZBM-FRU",
        name: "Fruit Bloom – Body Mist tropical energizante",
        brand: "Zachary Perfumes",
        category: "body",
        price: 799,
        description: "Mango e hibisco para energía vibrante. Revitaliza tus sentidos con frescura tropical.",
        notes: "Mango tropical, hibisco vibrante",
        duration: "3-4 horas",
        originalInspiration: "Tropical energy"
    },
    {
        code: "ZBM-EXP",
        name: "Explosive Blossom – Body Mist floral exótico",
        brand: "Zachary Perfumes",
        category: "body",
        price: 799,
        description: "Maracuyá morada y peonía para alegría explosiva. Frescura frutal y floral única.",
        notes: "Maracuyá morada, peonía, orquídea exótica",
        duration: "3-4 horas",
        originalInspiration: "Exotic explosion"
    },
    {
        code: "ZBM-COC",
        name: "Coconut Dream – Body Mist tropical relajante",
        brand: "Zachary Perfumes",
        category: "body",
        price: 799,
        description: "Coco y vainilla para un escape tropical. Vacaciones en cada rociada corporal.",
        notes: "Coco cremoso, vainilla, sábila refrescante",
        duration: "3-4 horas",
        originalInspiration: "Tropical escape"
    },
    {
        code: "ZBM-BEA",
        name: "Beach Coconut – Body Mist acuático tropical",
        brand: "Zachary Perfumes",
        category: "body",
        price: 799,
        description: "Piña, manzana y coco para esencia veraniega. Brisa caribeña en cada uso.",
        notes: "Piña dorada, manzana verde, coco, jazmín marino",
        duration: "3-4 horas",
        originalInspiration: "Caribbean breeze"
    }



];

async function loadZacharyProductsMySQL() {
    console.log('🚀 CARGANDO PRODUCTOS ZACHARY PERFUMES EN MYSQL');
    console.log('='.repeat(60));

    try {
        // Verificar conexión
        const testQuery = await query('SELECT 1 as test');
        console.log('✅ Conexión a MySQL OK');

        // Verificar si ya hay productos
        const existingProducts = await query('SELECT COUNT(*) as total FROM products WHERE is_active = 1');
        const totalExisting = existingProducts[0].total;

        console.log(`📊 Productos existentes: ${totalExisting}`);
        console.log(`\n📦 Insertando ${zacharyProducts.length} productos de Zachary Perfumes...`);

        let insertedCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        for (const product of zacharyProducts) {
            try {
                // Valores por defecto
                const defaults = {
                    image_url: null,
                    stock_quantity: 10,
                    is_featured: 0,
                    rating: 0,
                    notes: product.notes || '',
                    duration: product.duration || '',
                    original_inspiration: product.originalInspiration || '',
                    sku: product.code // Mapeamos code a sku
                };
    
                const completeProduct = { ...defaults, ...product };
    
                // Verificar por sku en lugar de code
                const existing = await query('SELECT id FROM products WHERE sku = ?', [completeProduct.sku]);

                if (existing.length > 0) {
                    // Actualizar producto existente
                    await query(
                        `UPDATE products SET 
                            name = ?, description = ?, price = ?, brand = ?, category = ?,
                            image_url = ?, stock_quantity = ?, is_featured = ?, rating = ?, 
                            notes = ?, duration = ?, original_inspiration = ?, is_active = 1
                        WHERE code = ?`,
                        [
                            completeProduct.name,
                            completeProduct.description,
                            completeProduct.price,
                            completeProduct.brand,
                            completeProduct.category,
                            completeProduct.image_url,
                            completeProduct.stock_quantity,
                            completeProduct.is_featured,
                            completeProduct.rating,
                            completeProduct.notes,
                            completeProduct.duration,
                            completeProduct.originalInspiration,
                            completeProduct.code
                        ]
                    );
                    updatedCount++;
                    console.log(`🔄 Actualizado: ${completeProduct.name}`);
                } else {
                    // Insertar nuevo producto
                    await query(
                        `INSERT INTO products (
                            name, description, price, code, brand, category, 
                            image_url, stock_quantity, is_featured, rating, 
                            notes, duration, original_inspiration, is_active
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
                        [
                            completeProduct.name,
                            completeProduct.description,
                            completeProduct.price,
                            completeProduct.code,
                            completeProduct.brand,
                            completeProduct.category,
                            completeProduct.image_url,
                            completeProduct.stock_quantity,
                            completeProduct.is_featured,
                            completeProduct.rating,
                            completeProduct.notes,
                            completeProduct.duration,
                            completeProduct.originalInspiration
                        ]
                    );
                    insertedCount++;
                    console.log(`✅ Insertado: ${completeProduct.name} - $${completeProduct.price.toLocaleString()}`);
                }
            } catch (error) {
                skippedCount++;
                console.error(`❌ Error con ${product.name}:`, error.message);
            }
        }

        // Generar reporte final
        console.log('\n🎉 CARGA COMPLETADA');
        console.log(`✅ Productos insertados: ${insertedCount}`);
        console.log(`🔄 Productos actualizados: ${updatedCount}`);
        console.log(`❌ Productos con error: ${skippedCount}`);

        const featuredResult = await query('SELECT COUNT(*) as total FROM products WHERE is_featured = 1 AND is_active = 1');
        console.log(`⭐ Productos destacados: ${featuredResult[0].total}`);

        const categories = await query(`
            SELECT category, COUNT(*) as count 
            FROM products 
            WHERE is_active = 1
            GROUP BY category 
            ORDER BY count DESC
        `);

        console.log('\n📊 Productos por categoría:');
        categories.forEach(cat => {
            console.log(`   ${cat.category}: ${cat.count} productos`);
        });

        const sampleProducts = await query('SELECT name, price, code FROM products WHERE is_active = 1 LIMIT 5');
        console.log('\n🛍️ Muestra de productos cargados:');
        sampleProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - $${product.price.toLocaleString()} (${product.code})`);
        });

        return {
            inserted: insertedCount,
            updated: updatedCount,
            skipped: skippedCount,
            total: insertedCount + updatedCount
        };

    } catch (error) {
        console.error('❌ Error general cargando productos:', error.message);
        throw error;
    }
}

async function clearAndLoadZacharyProducts() {
    console.log('🗑️ LIMPIANDO Y CARGANDO PRODUCTOS ZACHARY');
    console.log('='.repeat(60));

    try {
        const clearResult = await query('UPDATE products SET is_active = 0 WHERE is_active = 1');
        console.log(`🗑️ ${clearResult.affectedRows} productos existentes marcados como inactivos`);

        const loadResult = await loadZacharyProductsMySQL();

        console.log('\n🎉 PROCESO COMPLETO TERMINADO');
        console.log(`🗑️ Productos limpiados: ${clearResult.affectedRows}`);
        console.log(`✅ Productos nuevos cargados: ${loadResult.total}`);

        return loadResult;

    } catch (error) {
        console.error('❌ Error en proceso completo:', error.message);
        throw error;
    }
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    try {
        if (command === 'load') {
            await loadZacharyProductsMySQL();
        } else if (command === 'clear-and-load') {
            await clearAndLoadZacharyProducts();
        } else {
            console.log('🚀 SCRIPT DE CARGA DE PRODUCTOS ZACHARY MYSQL');
            console.log('='.repeat(60));
            console.log('\nUso:');
            console.log('  node load-zachary-mysql.js load              - Cargar productos (actualiza existentes)');
            console.log('  node load-zachary-mysql.js clear-and-load    - Limpiar y cargar productos frescos');
            console.log('\nEjemplos:');
            console.log('  node load-zachary-mysql.js load');
            console.log('  node load-zachary-mysql.js clear-and-load');
        }
    } catch (error) {
        console.error('❌ Error en ejecución:', error.message);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    loadZacharyProductsMySQL,
    clearAndLoadZacharyProducts,
    zacharyProducts
};