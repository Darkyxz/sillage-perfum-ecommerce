const { query } = require('../config/database');

async function updateOrderStatusEnum() {
  try {
    await query(`
      ALTER TABLE orders 
      MODIFY COLUMN status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending';
    `);
    console.log('Order status enum updated successfully.');
  } catch (error) {
    console.error('Error updating status enum:', error);
  } finally {
    process.exit();
  }
}

updateOrderStatusEnum();
