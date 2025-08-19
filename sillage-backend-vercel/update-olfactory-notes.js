const { query } = require('./config/database');

// --- PEGA AQUÍ TUS DATOS ---
const notesData = `
SP42H; notas marinas, pomelo, mandarina; hoja de laurel, jazmín; ámbar gris, madera de gaiac, musgo de roble, pachulí
SP5H; lima, limón, bergamota, jazmín, naranja, mandarina, nerolí; notas marinas, jazmín, calone, durazno, fresia, jacinto, romero, ciclamen, violeta, cilantro, nuez moscada, rosa, reseda; almizcle blanco, cedro, musgo de roble, pachulí, ámbar
SP4H; lima, limón, bergamota, jazmín, naranja, mandarina, nerolí; notas marinas, jazmín, calone, durazno, fresia, jacinto, romero, ciclamen, violeta, cilantro, nuez moscada, rosa, reseda; almizcle blanco, cedro, musgo de roble, pachulí, ámbar
SP53H; mandarina roja, pomelo, menta; canela, notas especiadas, rosa; ámbar, cuero, notas amaderadas, pachulí hindú
SP77H; bergamota de Calabria, pimienta; pimienta de Sichuan, lavanda, pimienta rosa, vetiver, pachulí, geranio, elemí; ambroxan, cedro, ládano
SP76H; notas marinas, bergamota; romero, salvia, geranio; incienso, pachulí
SP84H; flor de azahar del naranjo, pimienta negra; whiskey, laureles; ámbar, ámbar gris, sal
SP1H; notas verdes, toronja, especias, bergamota, lavanda, petit grain; jengibre, violeta, gardenia, salvia; almizcle, sándalo, incienso, madera de gaiac, vetiver, ládano
SP94H; canela, nuez moscada, cardamomo, toronja; lavanda; regaliz, sándalo, ámbar, pachulí, vetiver de Haití
SP73H; limón, salvia; praliné, canela, bálsamo de tolú, cardamomo negro; palo de rosa de Brasil, pachulí, ámbar negro
SP60H; pepino, melón, mandarina; albahaca, salvia, geranio; gamuza, notas amaderadas, almizcle
SP34H; bergamota, cítricos, pimienta; lavanda, pimienta rosa, vetiver, pachulí; ambroxan, cedro, ládano
SP62H; aldehídos, menta, lavanda, bergamota, mandarina, limón, abrótano, nerolí; hierba marina, jengibre, jazmín, geranio, palo de rosa de Brasil, violeta persa, rosa; almizcle, sándalo, cedro, madera de gaiac, ámbar
SP38H; manzana verde, menta, lavanda, pomelo, albahaca; salvia, geranio, clavel, jazmín; abeto, cedro, pachulí
SP93H; lavanda, cáscara de limón, limón de Amalfi; lavanda, humo, notas terrosas, manzana, pachulí; vainilla, lavanda, vetiver
SP45H; lavanda, menta, bergamota, abrótano, cardamomo; canela, flor de azahar de naranjo, alcaravea; vainilla, haba tonka, ámbar, sándalo, cedro
SP10H; limón, bergamota; anís estrellado, flor del olivo, madera de gaiac; cuero, haba tonka, tabaco
SP100H; castaña, azúcar; salvia, lavanda; vainilla, humo
SP59H; limón, naranja tangerina, ajenjo; mango, salvia; sándalo, pachulí, haba tonka
SP50H; pomelo, bergamota, mandarina siciliana, enebro de Virginia; pimienta, romero, palo de rosa de Brasil; almizcle, incienso, musgo de roble
SP17H; pomelo, limón, menta, pimienta rosa; jengibre, nuez moscada, jazmín, Iso E Super; incienso, vetiver, cedro, sándalo, pachulí, ládano, almizcle blanco
SP12H; lavanda, anís, limón, alcaravea, albahaca, bergamota, esclarea, iris; vetiver, sándalo, pachulí, cedro, bayas de enebro, cardamomo; musgo de roble, cuero, ámbar, almizcle, haba tonka
SP75H; limón de Amalfi, lavanda; cipriol (nagarmota), notas marinas; ámbar, pachulí
SP97H; menta, manzana verde, limón; haba tonka, ambroxan, geranio; vainilla de Madagascar, cedro, vetiver, musgo de roble
SP63H; arándano, pomelo, limón italiano; azafrán, salvia; ámbar
SP13H; manzana, ciruela, bergamota, limón, musgo de roble, geranio; canela, caoba, clavel; vainilla, sándalo, cedro, vetiver, olivo
SP99H; mandarina, esclarea; caramelo, haba tonka; vetiver
SP96H; pimienta blanca, bergamota, pimienta rosa; cedro, esclarea; haba tonka, cacao
SP2H; mandarina, bergamota, notas verdes; pimienta, flores, cardamomo; vainilla, madera de gaiac, sándalo, almizcle, ámbar
SP69H; menta, ámbar; vetiver, pimienta, notas especiadas; musgo de roble, vainilla
SP56H; romero, esclarea, palo de rosa de Brasil; lavanda, geranio, haba tonka; musgo de roble, miel, almizcle, ámbar
SP9H; menta, mandarina; limón, flor de jengibre; vetiver, notas acuáticas, ámbar
SP32H; lavanda, limón, bergamota, mandarina; salvia, bayas de enebro, albahaca, geranio, cilantro, jazmín, flor de azahar, azucena, lirio de los valles; sándalo, vetiver, almizcle, palo de rosa de Brasil, ámbar
SP98H; bergamota; coco; haba tonka
SP71H; cactus, naranja china, estragón; pimiento morrón, geranio africano, cedro; sándalo, cedro, almizcle blanco
SP7H; lavanda, menta, notas afrutadas y especias, cilantro, notas verdes, bergamota; caramelo, pachulí, miel, leche, cedro, jazmín, lirio de los valles; café, pachulí, vainilla, haba tonka, benjuí, ámbar, sándalo, almizcle
SP68H; menta, bergamota, pomelo, lavanda; manzana granny smith, arándano, rosa; flor del algodonero, cactus, ámbar
SP58H; bayas de enebro, abrótano, alcaravea, albahaca, cilantro, bergamota; agujas de pino, cuero, manzanilla, pimienta, clavel, geranio, jazmín, rosa; tabaco, musgo de rosa, pachulí, cedro, vetiver, almizcle, ámbar
`;
// ----------------------------------

/**
 * Convierte un string de notas separadas por coma a un array de strings JSON.
 * @param {string} notesString - Ejemplo: "nota1, nota2, nota3"
 * @returns {string} - Ejemplo: '["nota1","nota2","nota3"]'
 */
const formatNotes = (notesString) => {
  if (!notesString || notesString.trim() === '') {
    return JSON.stringify([]);
  }
  // No dividir el string, guardarlo como un único elemento en el array.
  const notesArray = [notesString.trim()];
  return JSON.stringify(notesArray);
};

async function updateOlfactoryNotes() {
  const isLive = process.argv.includes('--live');
  
  if (isLive) {
    console.log('🔴 MODO REAL: Se aplicarán los cambios a la base de datos.\n');
  } else {
    console.log('🟡 MODO SIMULACIÓN (Dry Run): No se harán cambios en la base de datos.\n');
    console.log('Para aplicar los cambios, ejecuta: node sillage-backend-vercel/update-olfactory-notes.js --live\n');
  }

  const lines = notesData.trim().split('\n');
  let totalProductsToUpdate = 0;

  for (const line of lines) {
    const [baseSku, topNotes, middleNotes, baseNotes] = line.split(';').map(item => item.trim());

    if (!baseSku) continue;

    console.log('--------------------------------------------------');
    console.log(`🔄 Procesando SKU Base: ${baseSku}`);

    const formattedTop = formatNotes(topNotes);
    const formattedMiddle = formatNotes(middleNotes);
    const formattedBase = formatNotes(baseNotes);

    const findProductsSql = `SELECT sku FROM products WHERE sku LIKE ?`;
    const likePattern = `${baseSku}-%`;
    
    const productsToUpdate = await query(findProductsSql, [likePattern]);

    if (productsToUpdate.length === 0) {
      console.log(`  - ⚠️ No se encontraron variantes para ${baseSku} (patrón: ${likePattern})`);
      continue;
    }

    console.log(`  - ✅ Encontradas ${productsToUpdate.length} variantes: ${productsToUpdate.map(p => p.sku).join(', ')}`);
    totalProductsToUpdate += productsToUpdate.length;

    const updateSql = `
      UPDATE products 
      SET 
        fragrance_profile = ?,
        fragrance_notes_middle = ?,
        fragrance_notes_base = ?
      WHERE sku LIKE ?
    `;

    if (isLive) {
      try {
        const result = await query(updateSql, [formattedTop, formattedMiddle, formattedBase, likePattern]);
        console.log(`  - 💾 ${result.affectedRows} productos actualizados en la base de datos.`);
      } catch (error) {
        console.error(`  - ❌ Error actualizando ${baseSku}:`, error.message);
      }
    } else {
      console.log(`  - 📝 (Simulación) Se ejecutaría la siguiente consulta SQL:`);
      console.log(`     QUERY: ${updateSql.replace(/\s+/g, ' ').trim()}`);
      console.log(`     DATOS: [${formattedTop}, ${formattedMiddle}, ${formattedBase}, ${likePattern}]`);
    }
    console.log(`--------------------------------------------------\n`);
  }

  console.log('==================================================');
  if (isLive) {
    console.log(`🎉 Proceso completado. Se actualizaron un total de ${totalProductsToUpdate} productos.`);
  } else {
    console.log(`🏁 Simulación finalizada. Se habrían actualizado un total de ${totalProductsToUpdate} productos.`);
    console.log('Para aplicar los cambios, ejecuta: node sillage-backend-vercel/update-olfactory-notes.js --live');
  }
  console.log('==================================================');
  process.exit(0);
}

updateOlfactoryNotes().catch(error => {
  console.error('\n❌ Ocurrió un error fatal durante la ejecución del script:');
  console.error(error);
  process.exit(1);
});
