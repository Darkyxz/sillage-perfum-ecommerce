// Edge Function para webhooks de MercadoPago en Supabase
// Desplegar con: supabase functions deploy mercadopago-webhook

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Solo permitir POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('🔔 Webhook MercadoPago recibido')
    
    // Obtener el body del webhook
    const webhookData = await req.json()
    console.log('Webhook data:', webhookData)

    // Validar que viene de MercadoPago
    const userAgent = req.headers.get('user-agent')
    if (!userAgent || !userAgent.includes('MercadoPago')) {
      console.warn('⚠️ Webhook no viene de MercadoPago')
      return new Response(
        JSON.stringify({ error: 'Invalid source' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Inicializar Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Procesar según el tipo de webhook
    const { type, data } = webhookData
    let result

    switch (type) {
      case 'payment':
        result = await processPaymentWebhook(data.id, supabase)
        break
      case 'merchant_order':
        result = await processMerchantOrderWebhook(data.id, supabase)
        break
      default:
        console.log(`ℹ️ Tipo de webhook no manejado: ${type}`)
        result = { status: 'ignored', type }
    }

    console.log('✅ Webhook procesado:', result)

    return new Response(
      JSON.stringify({ success: true, result }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Error procesando webhook:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Procesar webhook de pago
async function processPaymentWebhook(paymentId: string, supabase: any) {
  try {
    console.log(`💳 Procesando pago: ${paymentId}`)
    
    // Obtener información del pago desde MercadoPago
    const paymentInfo = await getPaymentInfo(paymentId)
    
    if (!paymentInfo) {
      throw new Error(`No se pudo obtener información del pago ${paymentId}`)
    }
    
    // Extraer el ID del pedido y convertir a integer
    const orderId = parseInt(paymentInfo.external_reference)
    
    if (!orderId || isNaN(orderId)) {
      console.warn('⚠️ Pago sin external_reference válido:', paymentId, paymentInfo.external_reference)
      return { status: 'warning', message: 'Pago sin referencia de pedido válida' }
    }
    
    // Determinar estados
    let orderStatus = 'pending'
    let paymentStatus = 'pending'
    
    switch (paymentInfo.status) {
      case 'approved':
        orderStatus = 'paid'
        paymentStatus = 'approved'
        break
      case 'rejected':
        orderStatus = 'failed'
        paymentStatus = 'rejected'
        break
      case 'cancelled':
        orderStatus = 'cancelled'
        paymentStatus = 'cancelled'
        break
      case 'refunded':
        orderStatus = 'refunded'
        paymentStatus = 'refunded'
        break
      case 'pending':
      case 'in_process':
        orderStatus = 'pending'
        paymentStatus = 'pending'
        break
      default:
        orderStatus = 'failed'
        paymentStatus = 'unknown'
    }
    
    // Actualizar pedido
    const { error: orderError } = await supabase
      .from('orders')
      .update({ 
        status: orderStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
    
    if (orderError) {
      console.error('Error actualizando pedido:', orderError)
      throw orderError
    }
    
    // Guardar información del pago
    const paymentData = {
      order_id: orderId,
      payment_id: paymentId,
      payment_method: paymentInfo.payment_method_id,
      payment_type: paymentInfo.payment_type_id,
      status: paymentStatus,
      amount: paymentInfo.transaction_amount,
      currency: paymentInfo.currency_id,
      installments: paymentInfo.installments,
      payer_email: paymentInfo.payer?.email,
      payer_identification: paymentInfo.payer?.identification,
      payment_data: paymentInfo,
      processed_at: new Date().toISOString()
    }
    
    const { error: paymentError } = await supabase
      .from('payments')
      .upsert(paymentData, { 
        onConflict: 'payment_id',
        ignoreDuplicates: false 
      })
    
    if (paymentError) {
      console.error('Error guardando pago:', paymentError)
      throw paymentError
    }
    
    console.log(`✅ Pedido ${orderId} actualizado a: ${orderStatus}`)
    
    return {
      status: 'processed',
      orderId,
      paymentId,
      orderStatus,
      paymentStatus
    }
    
  } catch (error) {
    console.error(`❌ Error procesando pago ${paymentId}:`, error)
    throw error
  }
}

// Procesar webhook de merchant order
async function processMerchantOrderWebhook(merchantOrderId: string, supabase: any) {
  try {
    console.log(`🏪 Procesando merchant order: ${merchantOrderId}`)
    
    const orderInfo = await getMerchantOrderInfo(merchantOrderId)
    
    if (!orderInfo) {
      throw new Error(`No se pudo obtener información de la orden ${merchantOrderId}`)
    }
    
    // Procesar cada pago en la orden
    const results = []
    for (const payment of orderInfo.payments || []) {
      const result = await processPaymentWebhook(payment.id, supabase)
      results.push(result)
    }
    
    return {
      status: 'processed',
      merchantOrderId,
      payments: results
    }
    
  } catch (error) {
    console.error(`❌ Error procesando merchant order ${merchantOrderId}:`, error)
    throw error
  }
}

// Obtener información del pago
async function getPaymentInfo(paymentId: string) {
  try {
    const accessToken = Deno.env.get('VITE_MERCADOPAGO_ACCESS_TOKEN')
    
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`MercadoPago API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error obteniendo info del pago:', error)
    throw error
  }
}

// Obtener información de merchant order
async function getMerchantOrderInfo(merchantOrderId: string) {
  try {
    const accessToken = Deno.env.get('VITE_MERCADOPAGO_ACCESS_TOKEN')
    
    const response = await fetch(`https://api.mercadopago.com/merchant_orders/${merchantOrderId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`MercadoPago API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error obteniendo info de merchant order:', error)
    throw error
  }
}