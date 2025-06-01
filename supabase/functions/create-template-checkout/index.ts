
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { templateName, userEmail } = await req.json();

    if (!templateName || !userEmail) {
      return new Response(
        JSON.stringify({ error: 'Template name and user email are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured');
    }

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': `Premium Resume Template: ${templateName}`,
        'line_items[0][price_data][product_data][description]': 'Professional Word document template for download',
        'line_items[0][price_data][unit_amount]': '200', // $2.00 in cents
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${req.headers.get('origin')}/template-success?session_id={CHECKOUT_SESSION_ID}&template=${encodeURIComponent(templateName)}`,
        'cancel_url': `${req.headers.get('origin')}/?canceled=true`,
        'customer_email': userEmail,
        'metadata[template_name]': templateName,
        'metadata[user_email]': userEmail,
      }),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe API error:', errorText);
      throw new Error('Failed to create checkout session');
    }

    const session = await stripeResponse.json();

    // Store pending purchase in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: dbError } = await supabase
      .from('template_purchases')
      .insert({
        user_email: userEmail,
        template_name: templateName,
        stripe_session_id: session.id,
        amount: 200,
        status: 'pending'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway - we can handle orphaned records later
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
