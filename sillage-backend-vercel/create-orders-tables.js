const { query } = require('./config/database');

async function createOrdersTables() {
  console.log('🔧 CREANDO TABLAS COMPLETAS DEL SISTEMA');
  console.log('='.repeat(50));
  
  try {
    // Verificar conexión
    const testQuery = await query('SELECT 1 as test');
    console.log('✅ Conexión a base de datos OK');
    
    // Crear tabla users si no existe
    console.log('👤 Creando tabla users...');
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        region VARCHAR(100),
        postal_code VARCHAR(10),
        role ENUM('user', 'admin') DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla users creada');
    
    // Crear usuario admin por defecto
    const adminExists = await query('SELECT id FROM users WHERE email = ?', ['admin@sillage.com']);
    if (adminExists.length === 0) {
      await query(`
        INSERT INTO users (email, password, full_name, role) 
        VALUES ('admin@sillage.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'admin')
      `);
      console.log('✅ Usuario admin creado (password: password)');
    }
    
    // Crear tabla favorites
    console.log('❤️ Creando tabla favorites...');
    await query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_favorite (user_id, product_id)
      )
    `);
    console.log('✅ Tabla favorites creada');
    
    // Crear tabla orders
    console.log('📦 Creando tabla orders...');
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT 1,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
        payment_method VARCHAR(50),
        payment_id VARCHAR(255),
        shipping_address TEXT,
        shipping_city VARCHAR(100),
        shipping_region VARCHAR(100),
        shipping_postal_code VARCHAR(10),
        tracking_number VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla orders creada');
    
    // Crear tabla order_items
    console.log('📦 Creando tabla order_items...');
    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_sku VARCHAR(100) NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla order_items creada');
    
    // Verificar que las tablas existan
    const tables = await query("SHOW TABLES LIKE 'order%'");
    console.log('\\n📊 Tablas de órdenes disponibles:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`✅ ${tableName}`);
    });
    
    console.log('\\n🎉 TABLAS DE ÓRDENES CREADAS EXITOSAMENTE');
    return true;
    
  } catch (error) {
    console.error('❌ Error creando tablas:', error.message);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  createOrdersTables()
    .then((success) => {
      if (success) {
        console.log('\\n✅ TABLAS DE ÓRDENES LISTAS');
        console.log('🛍️ Ahora puedes procesar pedidos');
      } else {
        console.log('\\n❌ HUBO PROBLEMAS AL CREAR LAS TABLAS');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { createOrdersTables };