
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

    const { cvId, fileUrl } = await req.json()

    if (!cvId || !fileUrl) {
      throw new Error('CV ID and file URL are required')
    }

    // Update status to processing
    await supabaseClient
      .from('uploaded_cvs')
      .update({ processing_status: 'processing' })
      .eq('id', cvId)

    // Use OpenAI to extract and structure CV content
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
            role: 'system',
            content: `You are a CV/Resume parsing expert. Extract information from the uploaded CV and return it in this exact JSON structure:
            {
              "personalInfo": {
                "firstName": "",
                "lastName": "",
                "email": "",
                "phone": "",
                "location": "",
                "linkedin": "",
                "github": "",
                "website": ""
              },
              "summary": "",
              "experience": [
                {
                  "company": "",
                  "position": "",
                  "startDate": "",
                  "endDate": "",
                  "current": false,
                  "description": ""
                }
              ],
              "education": [
                {
                  "institution": "",
                  "degree": "",
                  "field": "",
                  "startDate": "",
                  "endDate": "",
                  "classification": ""
                }
              ],
              "skills": [],
              "projects": [
                {
                  "name": "",
                  "description": "",
                  "technologies": "",
                  "link": ""
                }
              ]
            }
            Extract all information accurately and format dates as YYYY-MM-DD. If information is missing, use empty strings or empty arrays.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please extract and structure the information from this CV/Resume:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: fileUrl
                }
              }
            ]
          }
        ],
        max_tokens: 2000
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const extractedContent = openaiData.choices[0]?.message?.content

    if (!extractedContent) {
      throw new Error('No content extracted from CV')
    }

    // Parse the JSON response
    let structuredData
    try {
      structuredData = JSON.parse(extractedContent)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', extractedContent)
      throw new Error('Invalid JSON response from OpenAI')
    }

    // Update the CV record with extracted content
    const { error: updateError } = await supabaseClient
      .from('uploaded_cvs')
      .update({ 
        processing_status: 'completed',
        extracted_content: structuredData
      })
      .eq('id', cvId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedContent: structuredData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('CV processing error:', error)
    
    // Update status to failed
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { cvId } = await req.json().catch(() => ({}))
    if (cvId) {
      await supabaseClient
        .from('uploaded_cvs')
        .update({ 
          processing_status: 'failed',
          processing_error: error.message 
        })
        .eq('id', cvId)
    }

    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process CV' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
