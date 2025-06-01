
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
    const { sessionId, templateName } = await req.json();

    if (!sessionId || !templateName) {
      return new Response(
        JSON.stringify({ error: 'Session ID and template name are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the Stripe session was paid
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured');
    }

    const stripeResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
      },
    });

    if (!stripeResponse.ok) {
      throw new Error('Failed to verify payment with Stripe');
    }

    const session = await stripeResponse.json();

    if (session.payment_status !== 'paid') {
      return new Response(
        JSON.stringify({ error: 'Payment not completed' }),
        { 
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Update purchase record to completed
    const { data: purchase, error: updateError } = await supabase
      .from('template_purchases')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_session_id', sessionId)
      .eq('template_name', templateName)
      .select()
      .single();

    if (updateError || !purchase) {
      console.error('Failed to update purchase record:', updateError);
      return new Response(
        JSON.stringify({ error: 'Purchase verification failed' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check download limit
    if (purchase.download_count >= purchase.max_downloads) {
      return new Response(
        JSON.stringify({ error: 'Download limit exceeded' }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate download URL (template file should be in public/templates/)
    const templateFileName = `${templateName}.docx`;
    const downloadUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/templates/${templateFileName}`;

    // Increment download count
    await supabase
      .from('template_purchases')
      .update({ 
        download_count: purchase.download_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', purchase.id);

    return new Response(
      JSON.stringify({ 
        downloadUrl,
        remainingDownloads: purchase.max_downloads - purchase.download_count - 1,
        templateName
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error verifying purchase:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to verify purchase' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
