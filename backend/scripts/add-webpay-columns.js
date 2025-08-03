const { query } = require('../config/database');

async function addWebpayColumns() {
  try {
    await query(`
      ALTER TABLE orders 
      ADD COLUMN webpay_token VARCHAR(255) AFTER payment_method,
      ADD COLUMN payment_date TIMESTAMP NULL DEFAULT NULL AFTER webpay_token;
    `);
    console.log('Columns webpay_token and payment_date added successfully.');
  } catch (error) {
    console.error('Error adding columns:', error);
  } finally {
    process.exit();
  }
}

addWebpayColumns();
