import { apiClient } from '@/lib/apiClient';

// Productos reales de Sillage Perfums con nombres correctos
const zacharProducts = [

  {
    "name": "Inspirado en 212 MEN - 30ml",
    "description": "Fragancia sofisticada y moderna. Con un aroma fresco y especiado, este perfume captura la esencia de la elegancia contemporánea. Su intensidad moderada lo hace versátil para cualquier ocasión, mientras que su inspiración en 212 MEN le confiere una personalidad magnética y carismática.",
    "price": 9000,
    "sku": "ZP1H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Notas verdes, toronja, especias, bergamota, lavanda, petit grain, jengibre, violeta, gardenia, salvia, almizcle, sándalo, incienso, madera de gaiac, vetiver, ládano",
    "duration": "6-8 horas",
    "original_inspiration": "212 MEN",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en 212 MEN - 50ml",
    "description": "Fragancia sofisticada y moderna. Con un aroma fresco y especiado, este perfume captura la esencia de la elegancia contemporánea. Su intensidad moderada lo hace versátil para cualquier ocasión, mientras que su inspiración en 212 MEN le confiere una personalidad magnética y carismática.",
    "price": 14000,
    "sku": "ZP1H-50ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "50ml",
    "concentration": "Eau de Parfum",
    "notes": "Notas verdes, toronja, especias, bergamota, lavanda, petit grain, jengibre, violeta, gardenia, salvia, almizcle, sándalo, incienso, madera de gaiac, vetiver, ládano",
    "duration": "6-8 horas",
    "original_inspiration": "212 MEN",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en 212 MEN - 100ml",
    "description": "Fragancia sofisticada y moderna. Con un aroma fresco y especiado, este perfume captura la esencia de la elegancia contemporánea. Su intensidad moderada lo hace versátil para cualquier ocasión, mientras que su inspiración en 212 MEN le confiere una personalidad magnética y carismática.",
    "price": 18000,
    "sku": "ZP1H-100ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "100ml",
    "concentration": "Eau de Parfum",
    "notes": "Notas verdes, toronja, especias, bergamota, lavanda, petit grain, jengibre, violeta, gardenia, salvia, almizcle, sándalo, incienso, madera de gaiac, vetiver, ládano",
    "duration": "6-8 horas",
    "original_inspiration": "212 MEN",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en 212 SEXY MEN - 30ml",
    "description": "Fragancia seductora y sofisticada. Con un aroma envolvente y una intensidad equilibrada, este perfume captura la esencia de la elegancia urbana. Inspirado en la sensualidad de 212 SEXY MEN, es versátil y se adapta a cualquier ocasión, reflejando una personalidad magnética y segura.",
    "price": 9000,
    "sku": "ZP2H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Mandarina, bergamota, notas verdes, pimienta, flores, cardamomo, vainilla, madera de gaiac, sándalo, almizcle, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "212 SEXY MEN",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en 212 SEXY MEN - 50ml",
    "description": "Fragancia seductora y sofisticada. Con un aroma envolvente y una intensidad equilibrada, este perfume captura la esencia de la elegancia urbana. Inspirado en la sensualidad de 212 SEXY MEN, es versátil y se adapta a cualquier ocasión, reflejando una personalidad magnética y segura.",
    "price": 14000,
    "sku": "ZP2H-50ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "50ml",
    "concentration": "Eau de Parfum",
    "notes": "Mandarina, bergamota, notas verdes, pimienta, flores, cardamomo, vainilla, madera de gaiac, sándalo, almizcle, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "212 SEXY MEN",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en 212 SEXY MEN - 100ml",
    "description": "Fragancia seductora y sofisticada. Con un aroma envolvente y una intensidad equilibrada, este perfume captura la esencia de la elegancia urbana. Inspirado en la sensualidad de 212 SEXY MEN, es versátil y se adapta a cualquier ocasión, reflejando una personalidad magnética y segura.",
    "price": 18000,
    "sku": "ZP2H-100ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "100ml",
    "concentration": "Eau de Parfum",
    "notes": "Mandarina, bergamota, notas verdes, pimienta, flores, cardamomo, vainilla, madera de gaiac, sándalo, almizcle, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "212 SEXY MEN",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en 212 VIP MEN - 30ml",
    "description": "Una fragancia sofisticada y audaz. Este aroma Aromático Amaderado fusiona la frescura vibrante de la lima y el jengibre con la calidez envolvente del ámbar y el cuero, creando un contraste irresistible. Ideal para hombres que buscan un aroma distintivo y duradero que refleje su personalidad única y sofisticada.",
    "price": 9000,
    "sku": "ZP4H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Lima, limón, bergamota, jazmín, naranja, mandarina, nerolí, notas marinas, jazmín, calone, durazno, fresia, jacinto, romero, ciclamen, violeta, cilantro, nuez moscada, rosa, reseda, almizcle blanco, cedro, musgo de roble, pachulí, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "212 VIP MEN",
    "in_stock": true,
    "is_active": true
  },


  {
    "name": "Inspirado en 212 VIP MEN - 50ml",
    "description": "Una fragancia sofisticada y audaz. Este aroma Aromático Amaderado fusiona la frescura vibrante de la lima y el jengibre con la calidez envolvente del ámbar y el cuero, creando un contraste irresistible. Ideal para hombres que buscan un aroma distintivo y duradero que refleje su personalidad única y sofisticada.",
    "price": 14000,
    "sku": "ZP4H-50ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "50ml",
    "concentration": "Eau de Parfum",
    "notes": "Lima, limón, bergamota, jazmín, naranja, mandarina, nerolí, notas marinas, jazmín, calone, durazno, fresia, jacinto, romero, ciclamen, violeta, cilantro, nuez moscada, rosa, reseda, almizcle blanco, cedro, musgo de roble, pachulí, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "212 VIP MEN",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en 212 VIP MEN - 100ml",
    "description": "Una fragancia sofisticada y audaz. Este aroma Aromático Amaderado fusiona la frescura vibrante de la lima y el jengibre con la calidez envolvente del ámbar y el cuero, creando un contraste irresistible. Ideal para hombres que buscan un aroma distintivo y duradero que refleje su personalidad única y sofisticada.",
    "price": 18000,
    "sku": "ZP4H-100ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "100ml",
    "concentration": "Eau de Parfum",
    "notes": "Lima, limón, bergamota, jazmín, naranja, mandarina, nerolí, notas marinas, jazmín, calone, durazno, fresia, jacinto, romero, ciclamen, violeta, cilantro, nuez moscada, rosa, reseda, almizcle blanco, cedro, musgo de roble, pachulí, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "212 VIP MEN",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en ACQUA DI GIO - 30ml",
    "description": "Fragancia fresca y sofisticada que captura la esencia del hombre moderno. Con un aroma acuático y cítrico, este perfume ofrece una intensidad equilibrada que evoca libertad y elegancia. Inspirado en la brisa marina y la frescura de los cítricos, ideal para el hombre seguro de sí mismo que busca un toque de distinción en su día a día.",
    "price": 9000,
    "sku": "ZP5H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Lima, limón, bergamota, jazmín, naranja, mandarina, nerolí, notas marinas, jazmín, calone, durazno, fresia, jacinto, romero, ciclamen, violeta, cilantro, nuez moscada, rosa, reseda, almizcle blanco, cedro, musgo de roble, pachulí, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "ACQUA DI GIO",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en ACQUA DI GIO - 50ml",
    "description": "Fragancia fresca y sofisticada que captura la esencia del hombre moderno. Con un aroma acuático y cítrico, este perfume ofrece una intensidad equilibrada que evoca libertad y elegancia. Inspirado en la brisa marina y la frescura de los cítricos, ideal para el hombre seguro de sí mismo que busca un toque de distinción en su día a día.",
    "price": 14000,
    "sku": "ZP5H-50ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "50ml",
    "concentration": "Eau de Parfum",
    "notes": "Lima, limón, bergamota, jazmín, naranja, mandarina, nerolí, notas marinas, jazmín, calone, durazno, fresia, jacinto, romero, ciclamen, violeta, cilantro, nuez moscada, rosa, reseda, almizcle blanco, cedro, musgo de roble, pachulí, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "ACQUA DI GIO",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en ACQUA DI GIO - 100ml",
    "description": "Fragancia fresca y sofisticada que captura la esencia del hombre moderno. Con un aroma acuático y cítrico, este perfume ofrece una intensidad equilibrada que evoca libertad y elegancia. Inspirado en la brisa marina y la frescura de los cítricos, ideal para el hombre seguro de sí mismo que busca un toque de distinción en su día a día.",
    "price": 18000,
    "sku": "ZP5H-100ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "100ml",
    "concentration": "Eau de Parfum",
    "notes": "Lima, limón, bergamota, jazmín, naranja, mandarina, nerolí, notas marinas, jazmín, calone, durazno, fresia, jacinto, romero, ciclamen, violeta, cilantro, nuez moscada, rosa, reseda, almizcle blanco, cedro, musgo de roble, pachulí, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "ACQUA DI GIO",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en ANGEL - 30ml",
    "description": "Fragancia audaz y sofisticada. Con un aroma que combina la frescura de las notas verdes y afrutadas con la calidez de las especias, este perfume ofrece una intensidad envolvente y una versatilidad que lo hace perfecto para cualquier ocasión. Inspirado en la esencia de ANGEL MEN, es ideal para aquellos que desean expresar su personalidad única y carismática.",
    "price": 9000,
    "sku": "ZP7H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Lavanda, menta, notas afrutadas y especias, cilantro, notas verdes, bergamota, caramelo, pachulí, miel, leche, cedro, jazmín, lirio de los valles, café, pachulí, vainilla, haba tonka, benjuí, ámbar, sándalo, almizcle",
    "duration": "6-8 horas",
    "original_inspiration": "ANGEL",
    "in_stock": true,
    "is_active": true
  },

  {
    "name": "Inspirado en ANGEL - 50ml",
    "description": "Fragancia audaz y sofisticada. Con un aroma que combina la frescura de las notas verdes y afrutadas con la calidez de las especias, este perfume ofrece una intensidad envolvente y una versatilidad que lo hace perfecto para cualquier ocasión. Inspirado en la esencia de ANGEL MEN, es ideal para aquellos que desean expresar su personalidad única y carismática.",
    "price": 14000,
    "sku": "ZP7H-50ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "50ml",
    "concentration": "Eau de Parfum",
    "notes": "Lavanda, menta, notas afrutadas y especias, cilantro, notas verdes, bergamota, caramelo, pachulí, miel, leche, cedro, jazmín, lirio de los valles, café, pachulí, vainilla, haba tonka, benjuí, ámbar, sándalo, almizcle",
    "duration": "6-8 horas",
    "original_inspiration": "ANGEL",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en ANGEL - 100ml",
    "description": "Fragancia audaz y sofisticada. Con un aroma que combina la frescura de las notas verdes y afrutadas con la calidez de las especias, este perfume ofrece una intensidad envolvente y una versatilidad que lo hace perfecto para cualquier ocasión. Inspirado en la esencia de ANGEL MEN, es ideal para aquellos que desean expresar su personalidad única y carismática.",
    "price": 18000,
    "sku": "ZP7H-100ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "100ml",
    "concentration": "Eau de Parfum",
    "notes": "Lavanda, menta, notas afrutadas y especias, cilantro, notas verdes, bergamota, caramelo, pachulí, miel, leche, cedro, jazmín, lirio de los valles, café, pachulí, vainilla, haba tonka, benjuí, ámbar, sándalo, almizcle",
    "duration": "6-8 horas",
    "original_inspiration": "ANGEL",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en ARMANI CODE SPORT - 30ml",
    "description": "Fragancia vibrante y enérgica. Con un aroma que evoca la libertad y la aventura, este perfume ofrece una intensidad moderada. Inspirado en la esencia deportiva de Armani Code Sport, es versátil y refleja una personalidad dinámica y segura.",
    "price": 9000,
    "sku": "ZP9H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Menta, mandarina, limón, flor de jengibre, vetiver, notas acuáticas, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "ARMANI CODE SPORT",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en ARMANI CODE SPORT - 50ml",
    "description": "Fragancia vibrante y enérgica. Con un aroma que evoca la libertad y la aventura, este perfume ofrece una intensidad moderada. Inspirado en la esencia deportiva de Armani Code Sport, es versátil y refleja una personalidad dinámica y segura.",
    "price": 14000,
    "sku": "ZP9H-50ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "50ml",
    "concentration": "Eau de Parfum",
    "notes": "Menta, mandarina, limón, flor de jengibre, vetiver, notas acuáticas, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "ARMANI CODE SPORT",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en ARMANI CODE SPORT - 100ml",
    "description": "Fragancia vibrante y enérgica. Con un aroma que evoca la libertad y la aventura, este perfume ofrece una intensidad moderada. Inspirado en la esencia deportiva de Armani Code Sport, es versátil y refleja una personalidad dinámica y segura.",
    "price": 18000,
    "sku": "ZP9H-100ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "100ml",
    "concentration": "Eau de Parfum",
    "notes": "Menta, mandarina, limón, flor de jengibre, vetiver, notas acuáticas, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "ARMANI CODE SPORT",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en BOSS 6 - 30ml",
    "description": "Fragancia sofisticada y versátil, ideal para el hombre moderno que busca un equilibrio entre elegancia y frescura. Con una intensidad moderada, este perfume se inspira en la esencia clásica de BOSS 6, ofreciendo un aroma que combina notas frutales y amaderadas, perfecto para cualquier ocasión. Su personalidad es decidida y carismática.",
    "price": 9000,
    "sku": "ZP13H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Manzana, ciruela, bergamota, limón, musgo de roble, geranio, canela, caoba, clavel, vainilla, sándalo, cedro, vetiver, olivo",
    "duration": "6-8 horas",
    "original_inspiration": "BOSS 6",
    "in_stock": true,
    "is_active": true
  },

  {
    "name": "Inspirado en BOSS 6 - 50ml",
    "description": "Fragancia sofisticada y versátil, ideal para el hombre moderno que busca un equilibrio entre elegancia y frescura. Con una intensidad moderada, este perfume se inspira en la esencia clásica de BOSS 6, ofreciendo un aroma que combina notas frutales y amaderadas, perfecto para cualquier ocasión. Su personalidad es decidida y carismática.",
    "price": 14000,
    "sku": "ZP13H-50ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "50ml",
    "concentration": "Eau de Parfum",
    "notes": "Manzana, ciruela, bergamota, limón, musgo de roble, geranio, canela, caoba, clavel, vainilla, sándalo, cedro, vetiver, olivo",
    "duration": "6-8 horas",
    "original_inspiration": "BOSS 6",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en BOSS 6 - 100ml",
    "description": "Fragancia sofisticada y versátil, ideal para el hombre moderno que busca un equilibrio entre elegancia y frescura. Con una intensidad moderada, este perfume se inspira en la esencia clásica de BOSS 6, ofreciendo un aroma que combina notas frutales y amaderadas, perfecto para cualquier ocasión. Su personalidad es decidida y carismática.",
    "price": 18000,
    "sku": "ZP13H-100ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "100ml",
    "concentration": "Eau de Parfum",
    "notes": "Manzana, ciruela, bergamota, limón, musgo de roble, geranio, canela, caoba, clavel, vainilla, sándalo, cedro, vetiver, olivo",
    "duration": "6-8 horas",
    "original_inspiration": "BOSS 6",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en BLEU CHANEL - 30ml",
    "description": "Fragancia sofisticada y moderna, con un aroma distintivo y versátil. Con una intensidad equilibrada, este perfume captura la esencia de la elegancia contemporánea. Inspirado en la icónica BLEU CHANEL, adaptándose a la perfección a la personalidad de un hombre dinámico y refinado.",
    "price": 9000,
    "sku": "ZP17H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Pomelo, limón, menta, pimienta rosa, jengibre, nuez moscada, jazmín, Iso E Super, incienso, vetiver, cedro, sándalo, pachulí, ládano, almizcle blanco",
    "duration": "6-8 horas",
    "original_inspiration": "BLEU CHANEL",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en BLEU CHANEL - 50ml",
    "description": "Fragancia sofisticada y moderna, con un aroma distintivo y versátil. Con una intensidad equilibrada, este perfume captura la esencia de la elegancia contemporánea. Inspirado en la icónica BLEU CHANEL, adaptándose a la perfección a la personalidad de un hombre dinámico y refinado.",
    "price": 14000,
    "sku": "ZP17H-50ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "50ml",
    "concentration": "Eau de Parfum",
    "notes": "Pomelo, limón, menta, pimienta rosa, jengibre, nuez moscada, jazmín, Iso E Super, incienso, vetiver, cedro, sándalo, pachulí, ládano, almizcle blanco",
    "duration": "6-8 horas",
    "original_inspiration": "BLEU CHANEL",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en BLEU CHANEL - 100ml",
    "description": "Fragancia sofisticada y moderna, con un aroma distintivo y versátil. Con una intensidad equilibrada, este perfume captura la esencia de la elegancia contemporánea. Inspirado en la icónica BLEU CHANEL, adaptándose a la perfección a la personalidad de un hombre dinámico y refinado.",
    "price": 18000,
    "sku": "ZP17H-100ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "100ml",
    "concentration": "Eau de Parfum",
    "notes": "Pomelo, limón, menta, pimienta rosa, jengibre, nuez moscada, jazmín, Iso E Super, incienso, vetiver, cedro, sándalo, pachulí, ládano, almizcle blanco",
    "duration": "6-8 horas",
    "original_inspiration": "BLEU CHANEL",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en ETERNITY - 30ml",
    "description": "Fragancia sofisticada y atemporal. Con un aroma fresco y envolvente, este perfume ofrece una intensidad equilibrada que lo hace perfecto para cualquier ocasión. Inspirado en la eternidad de los momentos inolvidables, es versátil y refleja una personalidad segura y carismática.",
    "price": 9000,
    "sku": "ZP32H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Lavanda, limón, bergamota, mandarina, salvia, bayas de enebro, albahaca, geranio, cilantro, jazmín, flor de azahar, azucena, lirio de los valles, sándalo, vetiver, almizcle, palo de rosa de Brasil, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "ETERNITY",
    "in_stock": true,
    "is_active": true
  },

  {
    "name": "Inspirado en ETERNITY - 50ml",
    "description": "Fragancia sofisticada y atemporal. Con un aroma fresco y envolvente, este perfume ofrece una intensidad equilibrada que lo hace perfecto para cualquier ocasión. Inspirado en la eternidad de los momentos inolvidables, es versátil y refleja una personalidad segura y carismática.",
    "price": 14000,
    "sku": "ZP32H-50ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "50ml",
    "concentration": "Eau de Parfum",
    "notes": "Lavanda, limón, bergamota, mandarina, salvia, bayas de enebro, albahaca, geranio, cilantro, jazmín, flor de azahar, azucena, lirio de los valles, sándalo, vetiver, almizcle, palo de rosa de Brasil, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "ETERNITY",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en ETERNITY - 100ml",
    "description": "Fragancia sofisticada y atemporal. Con un aroma fresco y envolvente, este perfume ofrece una intensidad equilibrada que lo hace perfecto para cualquier ocasión. Inspirado en la eternidad de los momentos inolvidables, es versátil y refleja una personalidad segura y carismática.",
    "price": 18000,
    "sku": "ZP32H-100ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "100ml",
    "concentration": "Eau de Parfum",
    "notes": "Lavanda, limón, bergamota, mandarina, salvia, bayas de enebro, albahaca, geranio, cilantro, jazmín, flor de azahar, azucena, lirio de los valles, sándalo, vetiver, almizcle, palo de rosa de Brasil, ámbar",
    "duration": "6-8 horas",
    "original_inspiration": "ETERNITY",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en HUGO BOSS - 30ml",
    "description": "Fragancia sofisticada y moderna, que busca un aroma distintivo y versátil. Con una intensidad equilibrada, este perfume se inspira en la elegancia atemporal de HUGO BOSS, ofreciendo una experiencia olfativa que combina frescura y calidez.",
    "price": 9000,
    "sku": "ZP38H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Manzana verde, menta, lavanda, pomelo, albahaca, salvia, geranio, clavel, jazmín, abeto, cedro, pachulí",
    "duration": "6-8 horas",
    "original_inspiration": "HUGO BOSS",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en HUGO BOSS - 50ml",
    "description": "Fragancia sofisticada y moderna, que busca un aroma distintivo y versátil. Con una intensidad equilibrada, este perfume se inspira en la elegancia atemporal de HUGO BOSS, ofreciendo una experiencia olfativa que combina frescura y calidez.",
    "price": 14000,
    "sku": "ZP38H-50ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "50ml",
    "concentration": "Eau de Parfum",
    "notes": "Manzana verde, menta, lavanda, pomelo, albahaca, salvia, geranio, clavel, jazmín, abeto, cedro, pachulí",
    "duration": "6-8 horas",
    "original_inspiration": "HUGO BOSS",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en HUGO BOSS - 100ml",
    "description": "Fragancia sofisticada y moderna, que busca un aroma distintivo y versátil. Con una intensidad equilibrada, este perfume se inspira en la elegancia atemporal de HUGO BOSS, ofreciendo una experiencia olfativa que combina frescura y calidez.",
    "price": 18000,
    "sku": "ZP38H-100ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "100ml",
    "concentration": "Eau de Parfum",
    "notes": "Manzana verde, menta, lavanda, pomelo, albahaca, salvia, geranio, clavel, jazmín, abeto, cedro, pachulí",
    "duration": "6-8 horas",
    "original_inspiration": "HUGO BOSS",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en INVICTUS - 30ml",
    "description": "Fragancia audaz y dinámica. Con una intensidad que deja huella, este perfume se inspira en la victoria y la fuerza. Su aroma es una declaración de confianza y energía, ideal para quienes desean destacar con una personalidad vibrante y segura.",
    "price": 9000,
    "sku": "ZP42H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Notas marinas, pomelo, mandarina, hoja de laurel, jazmín, ámbar gris, madera de gaiac, musgo de roble, pachulí",
    "duration": "6-8 horas",
    "original_inspiration": "INVICTUS",
    "in_stock": true,
    "is_active": true
  },

  {
    "name": "Inspirado en INVICTUS - 50ml",
    "description": "Fragancia audaz y dinámica. Con una intensidad que deja huella, este perfume se inspira en la victoria y la fuerza. Su aroma es una declaración de confianza y energía, ideal para quienes desean destacar con una personalidad vibrante y segura.",
    "price": 14000,
    "sku": "ZP42H-50ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "50ml",
    "concentration": "Eau de Parfum",
    "notes": "Notas marinas, pomelo, mandarina, hoja de laurel, jazmín, ámbar gris, madera de gaiac, musgo de roble, pachulí",
    "duration": "6-8 horas",
    "original_inspiration": "INVICTUS",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en INVICTUS - 100ml",
    "description": "Fragancia audaz y dinámica. Con una intensidad que deja huella, este perfume se inspira en la victoria y la fuerza. Su aroma es una declaración de confianza y energía, ideal para quienes desean destacar con una personalidad vibrante y segura.",
    "price": 18000,
    "sku": "ZP42H-100ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "100ml",
    "concentration": "Eau de Parfum",
    "notes": "Notas marinas, pomelo, mandarina, hoja de laurel, jazmín, ámbar gris, madera de gaiac, musgo de roble, pachulí",
    "duration": "6-8 horas",
    "original_inspiration": "INVICTUS",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en J.P.G Le Male - 30ml",
    "description": "Una fragancia exquisita y sofisticada que combina a la perfección aromas aromáticos, frescos y especiados. Las notas de salida de abrótano, lavanda y menta aportan una frescura inigualable, mientras que el corazón de alcaravea y flor de azahar añade una calidez envolvente que realza su carácter.",
    "price": 9000,
    "sku": "ZP45H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Lavanda, menta, bergamota, abrótano, cardamomo, canela, flor de azahar de naranjo, alcaravea, vainilla, haba tonka, ámbar, sándalo, cedro",
    "duration": "6-8 horas",
    "original_inspiration": "J.P.G Le Male",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en J.P.G Le Male - 50ml",
    "description": "Una fragancia exquisita y sofisticada que combina a la perfección aromas aromáticos, frescos y especiados. Las notas de salida de abrótano, lavanda y menta aportan una frescura inigualable, mientras que el corazón de alcaravea y flor de azahar añade una calidez envolvente que realza su carácter.",
    "price": 14000,
    "sku": "ZP45H-50ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "50ml",
    "concentration": "Eau de Parfum",
    "notes": "Lavanda, menta, bergamota, abrótano, cardamomo, canela, flor de azahar de naranjo, alcaravea, vainilla, haba tonka, ámbar, sándalo, cedro",
    "duration": "6-8 horas",
    "original_inspiration": "J.P.G Le Male",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en J.P.G Le Male - 100ml",
    "description": "Una fragancia exquisita y sofisticada que combina a la perfección aromas aromáticos, frescos y especiados. Las notas de salida de abrótano, lavanda y menta aportan una frescura inigualable, mientras que el corazón de alcaravea y flor de azahar añade una calidez envolvente que realza su carácter.",
    "price": 18000,
    "sku": "ZP45H-100ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "100ml",
    "concentration": "Eau de Parfum",
    "notes": "Lavanda, menta, bergamota, abrótano, cardamomo, canela, flor de azahar de naranjo, alcaravea, vainilla, haba tonka, ámbar, sándalo, cedro",
    "duration": "6-8 horas",
    "original_inspiration": "J.P.G Le Male",
    "in_stock": true,
    "is_active": true
  },
  {
    "name": "Inspirado en LIGHT BLUE - 30ml",
    "description": "Fragancia vibrante y refrescante que captura la esencia del verano mediterráneo. Este perfume ofrece un aroma cítrico y amaderado que combina intensidad y frescura. Inspirado en la libertad y la aventura, reflejando una personalidad dinámica y enérgica.",
    "price": 9000,
    "sku": "ZP50H-30ML",
    "brand": "Sillage Perfums",
    "category": "Hombre",
    "image_url": "/images/sillapH.jpg",
    "stock_quantity": 50,
    "is_featured": false,
    "rating": 4.5,
    "size": "30ml",
    "concentration": "Eau de Parfum",
    "notes": "Pomelo, bergamota, mandarina siciliana, enebro de Virginia, pimienta, romero, palo de rosa de Brasil, almizcle, incienso, musgo de roble",
    "duration": "6-8 horas",
    "original_inspiration": "LIGHT BLUE",
    "in_stock": true,
    "is_active": true
  }

  ,
  // Perfumes para Tela
  {
    code: "ZPT-SUN",
    name: "Sunrise - Perfume para Tela",
    brand: "Zachary",
    category: "home",
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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
    price: 7500,
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