
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, templateName, category } = await req.json();
    
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Analyzing template:', templateName, 'at URL:', imageUrl);

    // Use OpenAI Vision to analyze the template
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a CV/resume design analyzer. Analyze the uploaded template image and extract detailed design patterns. Return a JSON object with the following structure:
            {
              "colors": {
                "primary": "#hexcode",
                "secondary": "#hexcode", 
                "accent": "#hexcode",
                "text": "#hexcode",
                "background": "#hexcode"
              },
              "typography": {
                "headingFont": "font-family",
                "bodyFont": "font-family",
                "headingSize": "size in px",
                "bodySize": "size in px"
              },
              "layout": {
                "columns": number,
                "spacing": "tight|normal|loose",
                "alignment": "left|center|right",
                "sectionSpacing": "compact|normal|spacious"
              },
              "style": {
                "overall": "modern|classic|creative|minimal|professional",
                "borders": "none|thin|thick|decorative",
                "shadows": "none|subtle|prominent",
                "corners": "sharp|rounded|mixed"
              },
              "sections": {
                "headerStyle": "centered|left|right|split",
                "contactLayout": "horizontal|vertical|sidebar",
                "sectionHeaders": "bold|underlined|boxed|minimal"
              }
            }`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this CV/resume template and extract all design patterns. Focus on colors, typography, layout structure, spacing, and visual elements.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const aiResponse = await response.json();
    const analysisContent = aiResponse.choices[0].message.content;
    
    console.log('AI Analysis Result:', analysisContent);

    // Parse the JSON response from AI
    let designPatterns;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysisContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        designPatterns = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Create a fallback pattern
      designPatterns = {
        colors: { primary: "#2563eb", secondary: "#64748b", accent: "#06b6d4", text: "#1e293b", background: "#ffffff" },
        typography: { headingFont: "Arial", bodyFont: "Arial", headingSize: "16px", bodySize: "12px" },
        layout: { columns: 1, spacing: "normal", alignment: "left", sectionSpacing: "normal" },
        style: { overall: category || "professional", borders: "none", shadows: "none", corners: "sharp" },
        sections: { headerStyle: "left", contactLayout: "horizontal", sectionHeaders: "bold" }
      };
    }

    // Find the template ID to link the pattern
    const { data: templateData } = await supabase
      .from('premium_templates')
      .select('id')
      .eq('image_url', imageUrl)
      .single();

    // Store the design patterns
    const { error: patternError } = await supabase
      .from('design_patterns')
      .insert({
        template_id: templateData?.id,
        pattern_type: 'design_analysis',
        pattern_data: designPatterns,
        confidence_score: 0.8
      });

    if (patternError) {
      console.error('Error storing design patterns:', patternError);
    }

    // Store training data for future AI improvements
    const { error: trainingError } = await supabase
      .from('template_training_data')
      .insert({
        template_id: templateData?.id,
        training_prompt: `Analyze CV template: ${templateName} (${category})`,
        ai_response: designPatterns
      });

    if (trainingError) {
      console.error('Error storing training data:', trainingError);
    }

    console.log('Template analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        patterns: designPatterns,
        message: 'Template analyzed and patterns stored successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-template function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
