import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const body = await req.json()
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle different webhook types
    if (body.type === 'payment') {
      const paymentId = body.data.id
      
      // Get payment details from MercadoPago
      const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      
      if (!paymentResponse.ok) {
        throw new Error(`Failed to get payment details: ${paymentResponse.status}`)
      }
      
      const payment = await paymentResponse.json()
      
      // Update order status based on payment status
      const orderId = payment.external_reference
      let orderStatus = 'pending'
      
      switch (payment.status) {
        case 'approved':
          orderStatus = 'paid'
          break
        case 'rejected':
          orderStatus = 'failed'
          break
        case 'pending':
          orderStatus = 'pending'
          break
        case 'in_process':
          orderStatus = 'pending'
          break
        default:
          orderStatus = 'failed'
      }
      
      // Update order in database
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: orderStatus,
          payment_id: paymentId.toString()
        })
        .eq('id', orderId)
      
      if (updateError) {
        console.error('Error updating order:', updateError)
        throw updateError
      }
      
      console.log(`Order ${orderId} updated to status: ${orderStatus}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 