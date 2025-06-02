
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvId, templateId } = await req.json();
    
    console.log('Processing CV redesign for:', { cvId, templateId });
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the uploaded CV
    const { data: cvData, error: cvError } = await supabase
      .from('uploaded_cvs')
      .select('*')
      .eq('id', cvId)
      .single();

    if (cvError || !cvData) {
      throw new Error('CV not found');
    }

    // Get the template
    const { data: templateData, error: templateError } = await supabase
      .from('premium_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !templateData) {
      throw new Error('Template not found');
    }

    // Create redesign session
    const { data: sessionData, error: sessionError } = await supabase
      .from('cv_redesign_sessions')
      .insert({
        uploaded_cv_id: cvId,
        selected_template_id: templateId,
        redesigned_data: {
          originalContent: cvData.extracted_content,
          templateApplied: templateData.name,
          redesignedAt: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating redesign session:', sessionError);
      throw sessionError;
    }

    console.log('CV redesign session created successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionId: sessionData.id,
        message: 'CV redesigned successfully'
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in redesign-cv function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
