const { query } = require('../config/database');

async function addPaymentColumns() {
  try {
    await query(`
      ALTER TABLE orders 
      ADD COLUMN payment_status ENUM('pending', 'processing', 'paid', 'failed', 'refunded') AFTER status,
      ADD COLUMN payment_method VARCHAR(255) AFTER payment_status;
    `);
    console.log('Columns payment_status and payment_method added successfully.');
  } catch (error) {
    console.error('Error adding columns:', error);
  } finally {
    process.exit();
  }
}

addPaymentColumns();
