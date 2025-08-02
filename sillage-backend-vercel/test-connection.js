const mysql = require('mysql2/promise');
const path = require('path');

// Cargar variables de entorno desde el archivo .env en la carpeta backend
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testConnection() {
  console.log('🔍 Probando conexión a la base de datos...');
  console.log('Host:', process.env.DB_HOST);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  console.log('Port:', process.env.DB_PORT);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      connectTimeout: 10000,
      acquireTimeout: 10000,
      timeout: 10000,
    });

    console.log('✅ Conexión exitosa a MySQL');

    // Probar una consulta simple
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log('✅ Consulta de prueba exitosa. Usuarios en DB:', rows[0].count);

    // Probar tabla de productos
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log('✅ Productos en DB:', products[0].count);

    await connection.end();
    console.log('✅ Conexión cerrada correctamente');

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('Código de error:', error.code);
    console.error('Estado SQL:', error.sqlState);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Sugerencias:');
      console.log('- Verifica que el host sea correcto');
      console.log('- Verifica que el puerto 3306 esté abierto');
      console.log('- Verifica las credenciales de la base de datos');
    }
  }
}

testConnection();