const mysql = require('mysql2/promise');
const path = require('path');

// Cargar variables de entorno desde el archivo .env en la carpeta backend
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'srv1918.hstgr.io',
  user: process.env.DB_USER || 'u172702780_AdminSillage',
  password: process.env.DB_PASS || 'M0nkey12345!',
  database: process.env.DB_NAME || 'u172702780_Sillagep',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  charset: 'utf8mb4',
  ssl: false
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    console.log(`📊 Base de datos: ${dbConfig.database}`);
    console.log(`🏠 Host: ${dbConfig.host}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
    return false;
  }
}

// Función para ejecutar queries
async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('❌ Error ejecutando query:', error.message);
    throw error;
  }
}

// Función para transacciones
async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Función para cerrar el pool
async function closePool() {
  try {
    await pool.end();
    console.log('🔒 Pool de conexiones MySQL cerrado');
  } catch (error) {
    console.error('❌ Error cerrando pool:', error.message);
  }
}

module.exports = {
  pool,
  query,
  transaction,
  testConnection,
  closePool
};