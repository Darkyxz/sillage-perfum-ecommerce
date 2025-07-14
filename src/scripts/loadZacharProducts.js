import { supabase } from '../lib/supabase.js';

// Productos reales de Zachary Perfumes con nombres correctos
const zacharProducts = [
  // MUJERES
  { code: "ZP1W", name: "Noche Vibrante – Eau de Parfum almizcle floral amaderado femenino", brand: "Zachary Perfumes", category: "women", price: 1299, description: "Fragancia moderna y energética para la mujer urbana contemporánea. Inspirada en 212 de Carolina Herrera.", notes: "Bergamota, Gardenia, Sándalo", duration: "6-8 horas", originalInspiration: "212 - Carolina Herrera" },
  { code: "ZP2W", name: "Seducción Nocturna – Eau de Parfum oriental floral femenino", brand: "Zachary Perfumes", category: "women", price: 1399, description: "Seducción pura en una botella, ideal para noches especiales. Inspirada en 212 Sexy de Carolina Herrera.", notes: "Bergamota, Vainilla, Sándalo", duration: "6-8 horas", originalInspiration: "212 Sexy - Carolina Herrera" },
  { code: "ZP3W", name: "Elegancia VIP – Eau de Parfum floral frutal femenino", brand: "Zachary Perfumes", category: "women", price: 1499, description: "La esencia de la elegancia y el lujo en una fragancia única. Inspirada en 212 VIP de Carolina Herrera.", notes: "Lima, Champagne, Gardenia", duration: "6-8 horas", originalInspiration: "212 VIP - Carolina Herrera" },
  { code: "ZP4W", name: "Rosa de Lujo – Eau de Parfum floral frutal femenino", brand: "Zachary Perfumes", category: "women", price: 1599, description: "Romance y sofisticación en una fragancia floral irresistible. Inspirada en 212 VIP Rosé de Carolina Herrera.", notes: "Champagne, Rosa, Almizcle", duration: "6-8 horas", originalInspiration: "212 VIP Rosé - Carolina Herrera" },
  { code: "ZP5W", name: "Brisa Marina – Eau de Parfum acuático floral femenino", brand: "Zachary Perfumes", category: "women", price: 1699, description: "Frescura marina con un toque de elegancia mediterránea. Inspirada en Acqua di Gio de Giorgio Armani.", notes: "Limón, Jazmín, Cedro", duration: "6-8 horas", originalInspiration: "Acqua di Gio - Giorgio Armani" },
  { code: "ZP7W", name: "Pasión Frutal – Eau de Parfum frutal floral femenino", brand: "Zachary Perfumes", category: "women", price: 1199, description: "Pasión y romance en una fragancia frutal y sensual. Inspirada en Amor Amor de Cacharel.", notes: "Naranja, Lila, Vainilla", duration: "5-7 horas", originalInspiration: "Amor Amor - Cacharel" },
  { code: "ZP13W", name: "Manzana Verde – Eau de Parfum frutal verde femenino", brand: "Zachary Perfumes", category: "women", price: 1349, description: "Frescura y vitalidad con notas jugosas de manzana verde. Inspirada en Be Delicious de DKNY.", notes: "Manzana, Pepino, Cedro", duration: "6-8 horas", originalInspiration: "Be Delicious - DKNY" },
  { code: "ZP16W", name: "Elegancia Clásica – Eau de Parfum floral oriental femenino", brand: "Zachary Perfumes", category: "women", price: 1449, description: "Elegancia atemporal con un toque de modernidad. Inspirada en CH de Carolina Herrera.", notes: "Jazmín, Tuberosa, Sándalo", duration: "6-8 horas", originalInspiration: "CH - Carolina Herrera" },
  { code: "ZP18W", name: "Glamour Juvenil – Eau de Parfum frutal floral femenino", brand: "Zachary Perfumes", category: "women", price: 1099, description: "Diversión y glamour en una fragancia juvenil y vibrante. Inspirada en Can Can de Paris Hilton.", notes: "Nectarina, Orquídea, Madera", duration: "5-7 horas", originalInspiration: "Can Can - Paris Hilton" },
  { code: "ZP26W", name: "Icono Eterno – Eau de Parfum floral aldehídico femenino", brand: "Zachary Perfumes", category: "women", price: 1899, description: "El icono de la perfumería femenina, elegancia absoluta. Inspirada en Chanel Nº5.", notes: "Neroli, Rosa, Vainilla", duration: "8-10 horas", originalInspiration: "Chanel Nº5 - Chanel" },
  { code: "ZP40W", name: "Flor Delicada – Eau de Parfum floral suave femenino", brand: "Zachary Perfumes", category: "women", price: 1549, description: "Delicadeza floral con un toque de sensualidad natural. Inspirada en Flower de Kenzo.", notes: "Amapola, Rosa, Almizcle blanco", duration: "6-8 horas", originalInspiration: "Flower - Kenzo" },
  { code: "ZP49W", name: "Adoración Floral – Eau de Parfum floral lujoso femenino", brand: "Zachary Perfumes", category: "women", price: 1799, description: "Feminidad absoluta en una fragancia floral lujosa. Inspirada en J'adore de Dior.", notes: "Ylang Ylang, Rosa, Jazmín", duration: "8-10 horas", originalInspiration: "J'adore - Dior" },
  { code: "ZP52W", name: "Luz Azul – Eau de Parfum cítrico acuático femenino", brand: "Zachary Perfumes", category: "women", price: 1649, description: "Mediterráneo en una botella, fresco y luminoso. Inspirada en Light Blue de Dolce & Gabbana.", notes: "Manzana, Bambú, Cedro", duration: "6-8 horas", originalInspiration: "Light Blue - Dolce & Gabbana" },
  { code: "ZP54W", name: "Millonaria – Eau de Parfum floral oriental femenino", brand: "Zachary Perfumes", category: "women", price: 1699, description: "Lujo y extravagancia para la mujer que lo quiere todo. Inspirada en Lady Million de Paco Rabanne.", notes: "Neroli, Miel, Pachulí", duration: "7-9 horas", originalInspiration: "Lady Million - Paco Rabanne" },
  { code: "ZP90W", name: "Buena Chica – Eau de Parfum gourmand floral femenino", brand: "Zachary Perfumes", category: "women", price: 1749, description: "Dulzura y rebeldía en perfecta armonía. Inspirada en Good Girl de Carolina Herrera.", notes: "Almendra, Tuberosa, Cacao", duration: "7-9 horas", originalInspiration: "Good Girl - Carolina Herrera" },

  // HOMBRES
  { code: "ZP1H", name: "Urbano Moderno – Eau de Parfum cítrico aromático masculino", brand: "Zachary Perfumes", category: "men", price: 1399, description: "Masculinidad urbana con un toque de elegancia moderna. Inspirado en 212 Men de Carolina Herrera.", notes: "Bergamota, Especias, Sándalo", duration: "6-8 horas", originalInspiration: "212 Men - Carolina Herrera" },
  { code: "ZP2H", name: "Seducción Masculina – Eau de Parfum oriental especiado masculino", brand: "Zachary Perfumes", category: "men", price: 1499, description: "Seducción masculina en su máxima expresión. Inspirado en 212 Sexy Men de Carolina Herrera.", notes: "Mandarina, Vainilla, Sándalo", duration: "6-8 horas", originalInspiration: "212 Sexy Men - Carolina Herrera" },
  { code: "ZP4H", name: "VIP Exclusivo – Eau de Parfum aromático amaderado masculino", brand: "Zachary Perfumes", category: "men", price: 1599, description: "El lujo y la exclusividad definen esta fragancia. Inspirado en 212 VIP Men de Carolina Herrera.", notes: "Lima, Gin, Madera", duration: "6-8 horas", originalInspiration: "212 VIP Men - Carolina Herrera" },
  { code: "ZP5H", name: "Agua de Vida – Eau de Parfum acuático aromático masculino", brand: "Zachary Perfumes", category: "men", price: 1799, description: "Frescura marina clásica, un bestseller atemporal. Inspirado en Acqua di Gio de Giorgio Armani.", notes: "Bergamota, Neroli, Pachulí", duration: "7-9 horas", originalInspiration: "Acqua di Gio - Giorgio Armani" },
  { code: "ZP17H", name: "Azul Elegante – Eau de Parfum amaderado aromático masculino", brand: "Zachary Perfumes", category: "men", price: 1999, description: "Elegancia y libertad en una fragancia extraordinaria. Inspirado en Bleu de Chanel.", notes: "Limón, Madera, Incienso", duration: "8-10 horas", originalInspiration: "Bleu de Chanel - Chanel" },
  { code: "ZP42H", name: "Invencible – Eau de Parfum acuático aromático masculino", brand: "Zachary Perfumes", category: "men", price: 1699, description: "Victoria y poder en una fragancia deportiva y fresca. Inspirado en Invictus de Paco Rabanne.", notes: "Pomelo, Laurel marino, Ámbar", duration: "7-9 horas", originalInspiration: "Invictus - Paco Rabanne" },
  { code: "ZP45H", name: "Macho Seductor – Eau de Parfum oriental fougère masculino", brand: "Zachary Perfumes", category: "men", price: 1599, description: "Masculinidad con un toque de dulzura irresistible. Inspirado en JPG Le Male de Jean Paul Gaultier.", notes: "Lavanda, Menta, Vainilla", duration: "6-8 horas", originalInspiration: "JPG Le Male - Jean Paul Gaultier" },
  { code: "ZP53H", name: "Un Millón – Eau de Parfum oriental especiado masculino", brand: "Zachary Perfumes", category: "men", price: 1749, description: "Lujo dorado y seducción en una fragancia única. Inspirado en One Million de Paco Rabanne.", notes: "Pomelo, Canela, Cuero", duration: "7-9 horas", originalInspiration: "One Million - Paco Rabanne" },
  { code: "ZP77H", name: "Salvaje – Eau de Parfum aromático fresco masculino", brand: "Zachary Perfumes", category: "men", price: 1899, description: "Libertad salvaje y masculinidad en estado puro. Inspirado en Sauvage de Dior.", notes: "Bergamota, Pimienta, Ambroxan", duration: "8-10 horas", originalInspiration: "Sauvage - Dior" },
  { code: "ZP97H", name: "Eros Pasional – Eau de Parfum oriental fougère masculino", brand: "Zachary Perfumes", category: "men", price: 1649, description: "Pasión y deseo en una fragancia intensa y seductora. Inspirado en Eros de Versace.", notes: "Menta, Manzana, Vainilla", duration: "7-9 horas", originalInspiration: "Eros - Versace" },
  { code: "ZP13H", name: "Jefe Embotellado – Eau de Parfum frutal especiado masculino", brand: "Zachary Perfumes", category: "men", price: 1549, description: "Éxito y determinación en una fragancia elegante. Inspirado en Boss Bottled de Hugo Boss.", notes: "Manzana, Canela, Sándalo", duration: "6-8 horas", originalInspiration: "Boss Bottled - Hugo Boss" },
  { code: "ZP34H", name: "Fahrenheit Ardiente – Eau de Parfum cuero floral masculino", brand: "Zachary Perfumes", category: "men", price: 1849, description: "Calor y fuerza en una fragancia revolucionaria. Inspirado en Fahrenheit de Dior.", notes: "Limón, Violeta, Cuero", duration: "8-10 horas", originalInspiration: "Fahrenheit - Dior" },
  { code: "ZP58H", name: "Polo Clásico – Eau de Parfum fougère verde masculino", brand: "Zachary Perfumes", category: "men", price: 1499, description: "Clasicismo americano en una fragancia atemporal. Inspirado en Polo de Ralph Lauren.", notes: "Pino, Menta, Cuero", duration: "6-8 horas", originalInspiration: "Polo - Ralph Lauren" },
  { code: "ZP60H", name: "Polo Azul – Eau de Parfum acuático aromático masculino", brand: "Zachary Perfumes", category: "men", price: 1599, description: "Frescura oceánica con elegancia deportiva. Inspirado en Polo Blue de Ralph Lauren.", notes: "Melón, Albahaca, Almizcle", duration: "6-8 horas", originalInspiration: "Polo Blue - Ralph Lauren" },
  { code: "ZP100H", name: "Más Fuerte Contigo – Eau de Parfum oriental amaderado masculino", brand: "Zachary Perfumes", category: "men", price: 1799, description: "Intensidad y carisma en una fragancia magnética. Inspirado en Stronger With You de Giorgio Armani.", notes: "Cardamomo, Salvia, Castañas", duration: "7-9 horas", originalInspiration: "Stronger With You - Giorgio Armani" },

  // UNISEX
  { code: "ZPU1", name: "Uno Universal – Eau de Parfum cítrico aromático unisex", brand: "Zachary Perfumes", category: "unisex", price: 1349, description: "Libertad y naturalidad en una fragancia revolucionaria. Inspirado en CK One de Calvin Klein.", notes: "Limón, Cardamomo, Almizcle", duration: "5-7 horas", originalInspiration: "CK One - Calvin Klein" },
  { code: "ZPU2", name: "Luz Azul Intensa – Eau de Parfum cítrico acuático unisex", brand: "Zachary Perfumes", category: "unisex", price: 1699, description: "Intensidad mediterránea para todos los géneros. Inspirado en Light Blue Intense de Dolce & Gabbana.", notes: "Limón, Enebro, Almizcle", duration: "7-9 horas", originalInspiration: "Light Blue Intense - Dolce & Gabbana" },
  { code: "ZPU3", name: "Libre Total – Eau de Parfum floral aromático unisex", brand: "Zachary Perfumes", category: "unisex", price: 1849, description: "Libertad sin límites en una fragancia audaz. Inspirado en Libre de Yves Saint Laurent.", notes: "Mandarina, Lavanda, Vainilla", duration: "7-9 horas", originalInspiration: "Libre - Yves Saint Laurent" }
];

// Función para limpiar y cargar productos
export async function loadZacharProducts() {
  try {
    console.log('🧹 Limpiando productos existentes...');
    
    // Primero verificar la estructura de la tabla
    const { data: existingProducts, error: selectError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (selectError) {
      console.error('❌ Error verificando tabla products:', selectError);
      throw new Error(`Error de tabla: ${selectError.message}`);
    }

    console.log('📋 Estructura de tabla verificada');
    
    // Eliminar todos los productos existentes
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Elimina todo excepto id=0 (que no existe)

    if (deleteError) {
      console.error('❌ Error eliminando productos:', deleteError);
      throw new Error(`Error eliminando: ${deleteError.message}`);
    }

    console.log('✅ Productos existentes eliminados');
    console.log('📦 Cargando nuevos productos...');

    // Insertar nuevos productos uno por uno para mejor control
    const results = [];
    
    for (let i = 0; i < zacharProducts.length; i++) {
      const product = zacharProducts[i];
      
      const productToInsert = {
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        description: product.description,
        sku: product.code,
        in_stock: true,
        stock_quantity: Math.floor(Math.random() * 50) + 10,
        is_featured: Math.random() > 0.7,
        image_url: `https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400&h=400&fit=crop&crop=center`
      };

      console.log(`📦 Insertando producto ${i + 1}/${zacharProducts.length}: ${product.name}`);
      
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([productToInsert])
        .select();

      if (insertError) {
        console.error(`❌ Error insertando producto ${product.name}:`, insertError);
        throw new Error(`Error en producto ${product.name}: ${insertError.message}`);
      }

      if (data && data.length > 0) {
        results.push(data[0]);
        console.log(`✅ Producto ${i + 1} insertado exitosamente`);
      }
    }

    console.log(`✅ ${results.length} productos cargados exitosamente`);
    console.log('🎉 Base de datos actualizada con productos de Zachary Perfumes');
    
    return results;
  } catch (error) {
    console.error('❌ Error en el proceso:', error);
    throw error;
  }
}

// Exportar función para uso en navegador
// Este script está diseñado para ejecutarse desde el panel de admin
