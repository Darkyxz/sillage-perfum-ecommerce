const { query } = require('../config/database');

async function setDefaultPaymentStatus() {
  try {
    // Set default payment_status to 'pending' for all orders without a payment_status
    await query(`
      UPDATE orders 
      SET payment_status = 'pending' 
      WHERE payment_status IS NULL;
    `);
    
    // Set default payment_method to 'webpay' for all orders without a payment_method
    await query(`
      UPDATE orders 
      SET payment_method = 'webpay' 
      WHERE payment_method IS NULL;
    `);
    
    console.log('Default payment_status and payment_method set successfully.');
  } catch (error) {
    console.error('Error setting defaults:', error);
  } finally {
    process.exit();
  }
}

setDefaultPaymentStatus();
