const { query } = require('./config/database');

async function checkAndFixTables() {
  console.log('🔧 VERIFICANDO Y CORRIGIENDO ESTRUCTURA DE TABLAS');
  console.log('='.repeat(60));
  
  try {
    // Verificar conexión
    const testQuery = await query('SELECT 1 as test');
    console.log('✅ Conexión a base de datos OK');
    
    // Verificar estructura de tabla users
    console.log('\n👤 Verificando tabla users...');
    try {
      const userColumns = await query('DESCRIBE users');
      const columnNames = userColumns.map(col => col.Field);
      console.log('📋 Columnas actuales en users:', columnNames.join(', '));
      
      // Agregar columnas faltantes
      const requiredColumns = [
        { name: 'password', type: 'VARCHAR(255)' },
        { name: 'full_name', type: 'VARCHAR(255)' },
        { name: 'phone', type: 'VARCHAR(20)' },
        { name: 'address', type: 'TEXT' },
        { name: 'city', type: 'VARCHAR(100)' },
        { name: 'region', type: 'VARCHAR(100)' },
        { name: 'postal_code', type: 'VARCHAR(10)' },
        { name: 'role', type: 'ENUM("user", "admin") DEFAULT "user"' },
        { name: 'is_active', type: 'BOOLEAN DEFAULT TRUE' }
      ];
      
      for (const col of requiredColumns) {
        if (!columnNames.includes(col.name)) {
          console.log(`➕ Agregando columna ${col.name}...`);
          await query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
        }
      }
      
    } catch (error) {
      console.log('📦 Tabla users no existe, creándola...');
      await query(`
        CREATE TABLE users (
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
    }
    
    // Crear usuario admin por defecto
    const adminExists = await query('SELECT id FROM users WHERE email = ?', ['admin@sillage.com']);
    if (adminExists.length === 0) {
      await query(`
        INSERT INTO users (email, password, full_name, role) 
        VALUES ('admin@sillage.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'admin')
      `);
      console.log('✅ Usuario admin creado (email: admin@sillage.com, password: password)');
    }
    
    // Verificar/crear tabla orders
    console.log('\n📦 Verificando tabla orders...');
    try {
      await query('DESCRIBE orders');
      console.log('✅ Tabla orders existe');
    } catch (error) {
      console.log('📦 Creando tabla orders...');
      await query(`
        CREATE TABLE orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
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
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      console.log('✅ Tabla orders creada');
    }
    
    // Verificar/crear tabla order_items
    console.log('\n📦 Verificando tabla order_items...');
    try {
      await query('DESCRIBE order_items');
      console.log('✅ Tabla order_items existe');
    } catch (error) {
      console.log('📦 Creando tabla order_items...');
      await query(`
        CREATE TABLE order_items (
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
    }
    
    // Verificar/crear tabla favorites
    console.log('\n❤️ Verificando tabla favorites...');
    try {
      await query('DESCRIBE favorites');
      console.log('✅ Tabla favorites existe');
    } catch (error) {
      console.log('📦 Creando tabla favorites...');
      await query(`
        CREATE TABLE favorites (
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
    }
    
    // Verificar todas las tablas
    const tables = await query("SHOW TABLES");
    console.log('\n📊 TABLAS DISPONIBLES:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`✅ ${tableName}`);
    });
    
    console.log('\n🎉 TODAS LAS TABLAS ESTÁN LISTAS');
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  checkAndFixTables()
    .then((success) => {
      if (success) {
        console.log('\n✅ ESTRUCTURA DE BASE DE DATOS CORREGIDA');
        console.log('🚀 El servidor puede iniciarse ahora');
      } else {
        console.log('\n❌ HUBO PROBLEMAS AL CORREGIR LA ESTRUCTURA');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { checkAndFixTables };