
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { templateId, imageUrl } = await req.json()

    if (!templateId || !imageUrl) {
      throw new Error('Template ID and image URL are required')
    }

    // Call OpenAI Vision API to analyze the template design
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this resume template design and extract key design patterns. Return a JSON object with the following structure:
                {
                  "layout": {
                    "structure": "single-column|two-column|multi-column",
                    "header_style": "centered|left-aligned|right-aligned|full-width",
                    "section_spacing": "tight|medium|loose",
                    "margins": "narrow|medium|wide"
                  },
                  "typography": {
                    "header_font": "serif|sans-serif|display",
                    "body_font": "serif|sans-serif|monospace",
                    "font_hierarchy": "minimal|moderate|strong",
                    "text_alignment": "left|center|justified"
                  },
                  "visual_elements": {
                    "color_scheme": "monochrome|blue|professional|creative",
                    "use_icons": true|false,
                    "dividers": "none|lines|shapes|colors",
                    "emphasis_style": "bold|color|size|background"
                  },
                  "content_organization": {
                    "section_order": ["header", "summary", "experience", "education", "skills"],
                    "bullet_style": "standard|custom|none",
                    "date_format": "full|abbreviated|year-only"
                  }
                }`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1500
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const analysisResult = openaiData.choices[0]?.message?.content

    if (!analysisResult) {
      throw new Error('No analysis result from OpenAI')
    }

    // Parse the JSON response
    let designPatterns
    try {
      designPatterns = JSON.parse(analysisResult)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', analysisResult)
      throw new Error('Invalid JSON response from OpenAI')
    }

    // Store design patterns in the database
    const patterns = [
      {
        template_id: templateId,
        pattern_type: 'layout',
        pattern_data: designPatterns.layout,
        confidence_score: 0.85
      },
      {
        template_id: templateId,
        pattern_type: 'typography',
        pattern_data: designPatterns.typography,
        confidence_score: 0.85
      },
      {
        template_id: templateId,
        pattern_type: 'visual_elements',
        pattern_data: designPatterns.visual_elements,
        confidence_score: 0.85
      },
      {
        template_id: templateId,
        pattern_type: 'content_organization',
        pattern_data: designPatterns.content_organization,
        confidence_score: 0.85
      }
    ]

    const { data: insertedPatterns, error: insertError } = await supabaseClient
      .from('design_patterns')
      .insert(patterns)
      .select()

    if (insertError) {
      throw insertError
    }

    // Store training data
    const { error: trainingError } = await supabaseClient
      .from('template_training_data')
      .insert({
        template_id: templateId,
        training_prompt: 'Design pattern analysis',
        ai_response: designPatterns
      })

    if (trainingError) {
      console.error('Training data storage error:', trainingError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        patterns: insertedPatterns,
        analysis: designPatterns 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Template analysis error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to analyze template design' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
