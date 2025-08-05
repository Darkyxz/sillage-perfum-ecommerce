const express = require('express');
const router = express.Router();

// Crear orden de invitado
router.post('/create-order', async (req, res) => {
    const { items, total_amount, guest_info, shipping_info } = req.body;
    // Aquí podrías agregar lógica para guardar la orden en la base de datos

    // Por ahora solo respondemos con éxito y lo recibido
    res.json({
        success: true,
        message: 'Orden de invitado creada correctamente',
        data: { items, total_amount, guest_info, shipping_info }
    });
});

// Procesar pago de invitado (simulado)
router.post('/process-payment', async (req, res) => {
    const { order_id, guest_email, amount, return_url, failure_url } = req.body;
    // Aquí podrías agregar lógica real de integración con Webpay

    // Por ahora solo respondemos con éxito y un link de Webpay simulado
    res.json({
        success: true,
        message: 'Pago de invitado procesado correctamente',
        data: {
            order_id,
            guest_email,
            amount,
            return_url,
            failure_url,
            url: `https://www.webpay.cl/backpub/external/form-pay?idFormulario=299617&order_id=${order_id}`
        }
    });
});

module.exports = router;