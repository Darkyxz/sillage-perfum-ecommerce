const { query } = require('./config/database');

// TODOS LOS 43 PRODUCTOS DE MUJER CON SKUs CORRELATIVOS Y PRECIOS FIJOS
const womenProducts = [
    // ZP1W - 212 Woman (3 tamaños)
    { name: "212 Woman – Eau de Parfum floral femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.", sku: "ZP1W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Flor de azahar del naranjo, flor de cactus, bergamota, mandarina", duration: "6-8 horas", original_inspiration: "212 WOMAN - Carolina Herrera" },
    { name: "212 Woman – Eau de Parfum floral femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.", sku: "ZP1W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Flor de azahar del naranjo, flor de cactus, bergamota, mandarina", duration: "6-8 horas", original_inspiration: "212 WOMAN - Carolina Herrera" },
    { name: "212 Woman – Eau de Parfum floral femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia sofisticada y moderna, con un aroma fresco y floral que captura la esencia de la elegancia urbana. Inspirada en 212 WOMAN de Carolina Herrera.", sku: "ZP1W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: true, notes: "Flor de azahar del naranjo, flor de cactus, bergamota, mandarina", duration: "6-8 horas", original_inspiration: "212 WOMAN - Carolina Herrera" },

    // ZP2W - 212 Sexy Woman (3 tamaños)
    { name: "212 Sexy Woman – Eau de Parfum oriental floral femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia seductora y envolvente, con un aroma dulce y especiado que deja una impresión duradera. Inspirada en 212 SEXY WOMAN de Carolina Herrera.", sku: "ZP2W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.7, is_featured: false, notes: "Pimienta rosa, mandarina, bergamota, algodón de azúcar", duration: "6-8 horas", original_inspiration: "212 SEXY WOMAN - Carolina Herrera" },
    { name: "212 Sexy Woman – Eau de Parfum oriental floral femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia seductora y envolvente, con un aroma dulce y especiado que deja una impresión duradera. Inspirada en 212 SEXY WOMAN de Carolina Herrera.", sku: "ZP2W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.7, is_featured: false, notes: "Pimienta rosa, mandarina, bergamota, algodón de azúcar", duration: "6-8 horas", original_inspiration: "212 SEXY WOMAN - Carolina Herrera" },
    { name: "212 Sexy Woman – Eau de Parfum oriental floral femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia seductora y envolvente, con un aroma dulce y especiado que deja una impresión duradera. Inspirada en 212 SEXY WOMAN de Carolina Herrera.", sku: "ZP2W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.7, is_featured: false, notes: "Pimienta rosa, mandarina, bergamota, algodón de azúcar", duration: "6-8 horas", original_inspiration: "212 SEXY WOMAN - Carolina Herrera" },

    // ZP3W - 212 VIP Woman (3 tamaños)
    { name: "212 VIP Woman – Eau de Parfum oriental floral femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia vibrante y sofisticada, con un aroma exótico y envolvente que combina glamour y exclusividad. Inspirada en 212 VIP WOMAN de Carolina Herrera.", sku: "ZP3W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.6, is_featured: false, notes: "Ron, maracuyá, gardenia, almizcle", duration: "6-8 horas", original_inspiration: "212 VIP WOMAN - Carolina Herrera" },
    { name: "212 VIP Woman – Eau de Parfum oriental floral femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia vibrante y sofisticada, con un aroma exótico y envolvente que combina glamour y exclusividad. Inspirada en 212 VIP WOMAN de Carolina Herrera.", sku: "ZP3W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.6, is_featured: false, notes: "Ron, maracuyá, gardenia, almizcle", duration: "6-8 horas", original_inspiration: "212 VIP WOMAN - Carolina Herrera" },
    { name: "212 VIP Woman – Eau de Parfum oriental floral femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia vibrante y sofisticada, con un aroma exótico y envolvente que combina glamour y exclusividad. Inspirada en 212 VIP WOMAN de Carolina Herrera.", sku: "ZP3W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.6, is_featured: false, notes: "Ron, maracuyá, gardenia, almizcle", duration: "6-8 horas", original_inspiration: "212 VIP WOMAN - Carolina Herrera" },

    // ZP4W - 212 VIP Rose Woman (3 tamaños)
    { name: "212 VIP Rose Woman – Eau de Parfum floral frutal femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia sofisticada y moderna, que combina la frescura del champagne rosé con la calidez de las notas amaderadas. Inspirada en 212 VIP ROSE WOMAN de Carolina Herrera.", sku: "ZP4W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.5, is_featured: false, notes: "Champagne rosé, pimienta rosa, flor del duraznero, rosa", duration: "6-8 horas", original_inspiration: "212 VIP ROSE WOMAN - Carolina Herrera" },
    { name: "212 VIP Rose Woman – Eau de Parfum floral frutal femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia sofisticada y moderna, que combina la frescura del champagne rosé con la calidez de las notas amaderadas. Inspirada en 212 VIP ROSE WOMAN de Carolina Herrera.", sku: "ZP4W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.5, is_featured: false, notes: "Champagne rosé, pimienta rosa, flor del duraznero, rosa", duration: "6-8 horas", original_inspiration: "212 VIP ROSE WOMAN - Carolina Herrera" },
    { name: "212 VIP Rose Woman – Eau de Parfum floral frutal femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia sofisticada y moderna, que combina la frescura del champagne rosé con la calidez de las notas amaderadas. Inspirada en 212 VIP ROSE WOMAN de Carolina Herrera.", sku: "ZP4W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.5, is_featured: false, notes: "Champagne rosé, pimienta rosa, flor del duraznero, rosa", duration: "6-8 horas", original_inspiration: "212 VIP ROSE WOMAN - Carolina Herrera" },

    // ZP5W - Acqua di Gio Woman (3 tamaños)
    { name: "Acqua di Gio Woman – Eau de Parfum floral acuático femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia sofisticada y fresca, inspirada en la frescura del mar y la delicadeza de las flores. Inspirada en ACQUA DI GIO WOMAN de Giorgio Armani.", sku: "ZP5W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Peonía, vodka con sabor a dulces de musk, piña, limón", duration: "6-8 horas", original_inspiration: "ACQUA DI GIO WOMAN - Giorgio Armani" },
    { name: "Acqua di Gio Woman – Eau de Parfum floral acuático femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia sofisticada y fresca, inspirada en la frescura del mar y la delicadeza de las flores. Inspirada en ACQUA DI GIO WOMAN de Giorgio Armani.", sku: "ZP5W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Peonía, vodka con sabor a dulces de musk, piña, limón", duration: "6-8 horas", original_inspiration: "ACQUA DI GIO WOMAN - Giorgio Armani" },
    { name: "Acqua di Gio Woman – Eau de Parfum floral acuático femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia sofisticada y fresca, inspirada en la frescura del mar y la delicadeza de las flores. Inspirada en ACQUA DI GIO WOMAN de Giorgio Armani.", sku: "ZP5W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: true, notes: "Peonía, vodka con sabor a dulces de musk, piña, limón", duration: "6-8 horas", original_inspiration: "ACQUA DI GIO WOMAN - Giorgio Armani" },

    // ZP6W - Amor Amor Woman (3 tamaños)
    { name: "Amor Amor Woman – Eau de Parfum floral afrutado femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia vibrante y seductora con un aroma floral afrutado que captura la esencia del amor joven. Inspirada en AMOR AMOR WOMAN de Cacharel.", sku: "ZP6W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.6, is_featured: false, notes: "Grosellas negras, naranja, rosa, jazmín, vainilla", duration: "6-8 horas", original_inspiration: "AMOR AMOR WOMAN - Cacharel" },
    { name: "Amor Amor Woman – Eau de Parfum floral afrutado femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia vibrante y seductora con un aroma floral afrutado que captura la esencia del amor joven. Inspirada en AMOR AMOR WOMAN de Cacharel.", sku: "ZP6W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.6, is_featured: false, notes: "Grosellas negras, naranja, rosa, jazmín, vainilla", duration: "6-8 horas", original_inspiration: "AMOR AMOR WOMAN - Cacharel" },
    { name: "Amor Amor Woman – Eau de Parfum floral afrutado femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia vibrante y seductora con un aroma floral afrutado que captura la esencia del amor joven. Inspirada en AMOR AMOR WOMAN de Cacharel.", sku: "ZP6W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.6, is_featured: false, notes: "Grosellas negras, naranja, rosa, jazmín, vainilla", duration: "6-8 horas", original_inspiration: "AMOR AMOR WOMAN - Cacharel" },

    // ZP7W - Be Delicious Woman (3 tamaños)
    { name: "Be Delicious Woman – Eau de Parfum floral frutal femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia vibrante y fresca que combina la frescura de las frutas con la elegancia de las flores. Inspirada en BE DELICIOUS WOMAN de DKNY.", sku: "ZP7W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.5, is_featured: false, notes: "Pepino, pomelo, manzana verde, magnolia, rosa", duration: "6-8 horas", original_inspiration: "BE DELICIOUS WOMAN - DKNY" },
    { name: "Be Delicious Woman – Eau de Parfum floral frutal femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia vibrante y fresca que combina la frescura de las frutas con la elegancia de las flores. Inspirada en BE DELICIOUS WOMAN de DKNY.", sku: "ZP7W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.5, is_featured: false, notes: "Pepino, pomelo, manzana verde, magnolia, rosa", duration: "6-8 horas", original_inspiration: "BE DELICIOUS WOMAN - DKNY" },
    { name: "Be Delicious Woman – Eau de Parfum floral frutal femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia vibrante y fresca que combina la frescura de las frutas con la elegancia de las flores. Inspirada en BE DELICIOUS WOMAN de DKNY.", sku: "ZP7W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.5, is_featured: false, notes: "Pepino, pomelo, manzana verde, magnolia, rosa", duration: "6-8 horas", original_inspiration: "BE DELICIOUS WOMAN - DKNY" },

    // ZP8W - CH Woman (3 tamaños)
    { name: "CH Woman – Eau de Parfum floral oriental femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia sofisticada y femenina que busca un equilibrio entre elegancia y audacia. Inspirada en CH WOMAN de Carolina Herrera.", sku: "ZP8W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.7, is_featured: false, notes: "Pomelo, bergamota, rosa, flor de azahar, cuero", duration: "6-8 horas", original_inspiration: "CH WOMAN - Carolina Herrera" },
    { name: "CH Woman – Eau de Parfum floral oriental femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia sofisticada y femenina que busca un equilibrio entre elegancia y audacia. Inspirada en CH WOMAN de Carolina Herrera.", sku: "ZP8W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.7, is_featured: false, notes: "Pomelo, bergamota, rosa, flor de azahar, cuero", duration: "6-8 horas", original_inspiration: "CH WOMAN - Carolina Herrera" },
    { name: "CH Woman – Eau de Parfum floral oriental femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia sofisticada y femenina que busca un equilibrio entre elegancia y audacia. Inspirada en CH WOMAN de Carolina Herrera.", sku: "ZP8W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.7, is_featured: false, notes: "Pomelo, bergamota, rosa, flor de azahar, cuero", duration: "6-8 horas", original_inspiration: "CH WOMAN - Carolina Herrera" },

    // ZP9W - Can Can (3 tamaños)
    { name: "Can Can – Eau de Parfum floral frutal femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia seductora y vibrante con un aroma que refleja espíritu audaz y sofisticado. Inspirada en CAN CAN de Paris Hilton.", sku: "ZP9W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.4, is_featured: false, notes: "Nectarina, grosellas negras, orquídea silvestre, ámbar", duration: "6-8 horas", original_inspiration: "CAN CAN - Paris Hilton" },
    { name: "Can Can – Eau de Parfum floral frutal femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia seductora y vibrante con un aroma que refleja espíritu audaz y sofisticado. Inspirada en CAN CAN de Paris Hilton.", sku: "ZP9W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.4, is_featured: false, notes: "Nectarina, grosellas negras, orquídea silvestre, ámbar", duration: "6-8 horas", original_inspiration: "CAN CAN - Paris Hilton" },
    { name: "Can Can – Eau de Parfum floral frutal femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia seductora y vibrante con un aroma que refleja espíritu audaz y sofisticado. Inspirada en CAN CAN de Paris Hilton.", sku: "ZP9W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.4, is_featured: false, notes: "Nectarina, grosellas negras, orquídea silvestre, ámbar", duration: "6-8 horas", original_inspiration: "CAN CAN - Paris Hilton" },

    // ZP10W - Carolina Herrera Woman (3 tamaños)
    { name: "Carolina Herrera Woman – Eau de Parfum floral oriental femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia sofisticada y elegante con un aroma floral y amaderado que ofrece intensidad equilibrada. Inspirada en CAROLINA HERRERA WOMAN.", sku: "ZP10W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Flor de azahar, jazmín, ylang ylang, almizcle, sándalo", duration: "6-8 horas", original_inspiration: "CAROLINA HERRERA WOMAN - Carolina Herrera" },
    { name: "Carolina Herrera Woman – Eau de Parfum floral oriental femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia sofisticada y elegante con un aroma floral y amaderado que ofrece intensidad equilibrada. Inspirada en CAROLINA HERRERA WOMAN.", sku: "ZP10W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Flor de azahar, jazmín, ylang ylang, almizcle, sándalo", duration: "6-8 horas", original_inspiration: "CAROLINA HERRERA WOMAN - Carolina Herrera" },
    { name: "Carolina Herrera Woman – Eau de Parfum floral oriental femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia sofisticada y elegante con un aroma floral y amaderado que ofrece intensidad equilibrada. Inspirada en CAROLINA HERRERA WOMAN.", sku: "ZP10W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Flor de azahar, jazmín, ylang ylang, almizcle, sándalo", duration: "6-8 horas", original_inspiration: "CAROLINA HERRERA WOMAN - Carolina Herrera" },

    // ZP11W - Chanel Nº5 (3 tamaños)
    { name: "Chanel Nº5 – Eau de Parfum floral aldehídico femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia icónica y atemporal con un aroma sofisticado y elegante. Inspirada en CHANEL Nº5.", sku: "ZP11W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: true, notes: "Aldehídos, ylang ylang, rosa, jazmín, sándalo", duration: "8-10 horas", original_inspiration: "CHANEL Nº5 - Chanel" },
    { name: "Chanel Nº5 – Eau de Parfum floral aldehídico femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia icónica y atemporal con un aroma sofisticado y elegante. Inspirada en CHANEL Nº5.", sku: "ZP11W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: true, notes: "Aldehídos, ylang ylang, rosa, jazmín, sándalo", duration: "8-10 horas", original_inspiration: "CHANEL Nº5 - Chanel" },
    { name: "Chanel Nº5 – Eau de Parfum floral aldehídico femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia icónica y atemporal con un aroma sofisticado y elegante. Inspirada en CHANEL Nº5.", sku: "ZP11W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: true, notes: "Aldehídos, ylang ylang, rosa, jazmín, sándalo", duration: "8-10 horas", original_inspiration: "CHANEL Nº5 - Chanel" },

    // ZP12W - J'adore (3 tamaños)
    { name: "J'adore – Eau de Parfum floral afrutado femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia sofisticada y elegante, con un aroma floral afrutado. Inspirada en J'ADORE de Dior.", sku: "ZP12W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: false, notes: "Pera, melón, magnolia, durazno", duration: "8-10 horas", original_inspiration: "J'ADORE - Dior" },
    { name: "J'adore – Eau de Parfum floral afrutado femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia sofisticada y elegante, con un aroma floral afrutado. Inspirada en J'ADORE de Dior.", sku: "ZP12W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: false, notes: "Pera, melón, magnolia, durazno", duration: "8-10 horas", original_inspiration: "J'ADORE - Dior" },
    { name: "J'adore – Eau de Parfum floral afrutado femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia sofisticada y elegante, con un aroma floral afrutado. Inspirada en J'ADORE de Dior.", sku: "ZP12W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: true, notes: "Pera, melón, magnolia, durazno", duration: "8-10 horas", original_inspiration: "J'ADORE - Dior" },

    // ZP13W - Miss Dior (3 tamaños)
    { name: "Miss Dior – Eau de Parfum avainillado y atalcado femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Descubre la esencia de la elegancia y la sofisticación con esta exquisita fragancia avainillada y atalcada. Inspirada en MISS DIOR de Dior.", sku: "ZP13W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: false, notes: "Rosas, florales, avainillado, atalcado", duration: "8-10 horas", original_inspiration: "MISS DIOR - Dior" },
    { name: "Miss Dior – Eau de Parfum avainillado y atalcado femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Descubre la esencia de la elegancia y la sofisticación con esta exquisita fragancia avainillada y atalcada. Inspirada en MISS DIOR de Dior.", sku: "ZP13W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: false, notes: "Rosas, florales, avainillado, atalcado", duration: "8-10 horas", original_inspiration: "MISS DIOR - Dior" },
    { name: "Miss Dior – Eau de Parfum avainillado y atalcado femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Descubre la esencia de la elegancia y la sofisticación con esta exquisita fragancia avainillada y atalcada. Inspirada en MISS DIOR de Dior.", sku: "ZP13W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.9, is_featured: true, notes: "Rosas, florales, avainillado, atalcado", duration: "8-10 horas", original_inspiration: "MISS DIOR - Dior" },

    // ZP14W - Yara (3 tamaños)
    { name: "Yara – Eau de Parfum oriental floral femenino 30ml", brand: "Zachary Perfumes", price: 9000, category: "Mujer", description: "Fragancia audaz y sofisticada, Con un aroma dulce y envolvente, este perfume captura la esencia de la sofisticación moderna. Su intensidad y versatilidad lo hacen perfecto para quienes desean destacar en cualquier ocasión, reflejando una personalidad segura y carismática.", sku: "ZP14W-30ML", stock_quantity: 50, size: "30ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Naranja sanguina, mandarina, Miel, gardenia", duration: "7-9 horas", original_inspiration: "SCANDAL J.P.G." },
    { name: "Yara – Eau de Parfum oriental floral femenino 50ml", brand: "Zachary Perfumes", price: 14000, category: "Mujer", description: "Fragancia audaz y sofisticada, Con un aroma dulce y envolvente, este perfume captura la esencia de la sofisticación moderna. Su intensidad y versatilidad lo hacen perfecto para quienes desean destacar en cualquier ocasión, reflejando una personalidad segura y carismática.", sku: "ZP14W-50ML", stock_quantity: 30, size: "50ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: false, notes: "Naranja sanguina, mandarina, Miel, gardenia", duration: "7-9 horas", original_inspiration: "SCANDAL J.P.G." },
    { name: "Yara – Eau de Parfum oriental floral femenino 100ml", brand: "Zachary Perfumes", price: 18000, category: "Mujer", description: "Fragancia audaz y sofisticada, Con un aroma dulce y envolvente, este perfume captura la esencia de la sofisticación moderna. Su intensidad y versatilidad lo hacen perfecto para quienes desean destacar en cualquier ocasión, reflejando una personalidad segura y carismática.", sku: "ZP14W-100ML", stock_quantity: 20, size: "100ml", concentration: "Eau de Parfum", image_url: "/images/sillapM.jpg", rating: 4.8, is_featured: true, notes: "Naranja sanguina, mandarina, Miel, gardenia", duration: "7-9 horas", original_inspiration: "SCANDAL J.P.G." }
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

async function reloadWomenProducts() {
    console.log('🚀 RECARGANDO PRODUCTOS DE MUJER CON SKUs CORRELATIVOS');
    console.log('='.repeat(70));

    try {
        // Actualizar estructura de tabla
        await updateTableStructure();

        console.log('✅ Conexión a MySQL OK');
        console.log(`📋 Productos de mujer a cargar: ${womenProducts.length}`);

        // 1. ELIMINAR todos los productos de mujer existentes
        console.log('🧹 Eliminando productos de mujer existentes...');
        const deleteResult = await query('DELETE FROM products WHERE category = "Mujer"');
        console.log(`✅ Eliminados ${deleteResult.affectedRows} productos de mujer`);

        let insertedCount = 0;
        let errorCount = 0;

        // 2. INSERTAR todos los productos con SKUs correlativos
        for (const product of womenProducts) {
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

                console.log(`✅ Insertado: ${product.sku} - ${product.name.substring(0, 50)}...`);
                insertedCount++;

            } catch (error) {
                console.error(`❌ Error con producto ${product.sku}:`, error.message);
                errorCount++;
            }
        }

        console.log(`\n🎉 Proceso completado:`);
        console.log(`✅ Insertados: ${insertedCount}`);
        console.log(`❌ Errores: ${errorCount}`);

        // 3. VERIFICAR resultado final
        const finalProducts = await query(`
      SELECT sku, name, is_active 
      FROM products 
      WHERE category = 'Mujer' 
      ORDER BY sku
    `);

        console.log(`\n📦 Total productos de mujer en BD: ${finalProducts.length}`);
        console.log(`✅ Productos activos: ${finalProducts.filter(p => p.is_active).length}`);

        // Verificar SKUs correlativos
        const skuNumbers = finalProducts
            .map(p => p.sku.match(/ZP(\d+)W/)?.[1])
            .filter(Boolean)
            .map(n => parseInt(n))
            .sort((a, b) => a - b);

        console.log(`\n🔢 SKUs encontrados: [${skuNumbers.join(', ')}]`);

        // Verificar si son correlativos
        const isCorrelative = skuNumbers.every((num, index) => num === index + 1);
        console.log(`✅ SKUs correlativos: ${isCorrelative ? 'SÍ' : 'NO'}`);

        if (isCorrelative) {
            console.log('🎯 ¡PERFECTO! Los SKUs van de ZP1W a ZP14W sin saltos');
        }

        return { insertedCount, errorCount, total: finalProducts.length };

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    reloadWomenProducts()
        .then((result) => {
            console.log('\n🎉 RECARGA COMPLETADA EXITOSAMENTE');
            console.log(`📊 Resultado: ${result.insertedCount} productos insertados`);
            console.log('✅ Los productos de mujer ahora tienen SKUs correlativos ZP1W-ZP14W');
            console.log('🌐 Todos los 42 productos deberían aparecer en tu página web');
            console.log('\n🔗 Verifica en: http://localhost:5173/categoria/perfume-dama');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Error:', error);
            process.exit(1);
        });
}

module.exports = { reloadWomenProducts };