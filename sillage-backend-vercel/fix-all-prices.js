const fs = require('fs');
const path = require('path');

// Leer el archivo actual
const filePath = path.join(__dirname, 'reload-women-products.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Corrigiendo todos los precios en reload-women-products.js...');

// Reemplazar todos los precios incorrectos con los correctos
// Para 30ml: price: 9000
content = content.replace(/price: \d+, category: "Mujer".*?size: "30ml"/g, (match) => {
    return match.replace(/price: \d+/, 'price: 9000');
});

// Para 50ml: price: 14000
content = content.replace(/price: \d+, category: "Mujer".*?size: "50ml"/g, (match) => {
    return match.replace(/price: \d+/, 'price: 14000');
});

// Para 100ml: price: 18000
content = content.replace(/price: \d+, category: "Mujer".*?size: "100ml"/g, (match) => {
    return match.replace(/price: \d+/, 'price: 18000');
});

// Escribir el archivo corregido
fs.writeFileSync(filePath, content);

console.log('✅ Todos los precios han sido corregidos:');
console.log('   - 30ml: $9,000 CLP');
console.log('   - 50ml: $14,000 CLP');
console.log('   - 100ml: $18,000 CLP');
console.log('\n🎯 Archivo reload-women-products.js actualizado correctamente');