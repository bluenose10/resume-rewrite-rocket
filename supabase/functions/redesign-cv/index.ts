
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
    const { cvId, templateId } = await req.json();
    
    if (!cvId || !templateId) {
      throw new Error('CV ID and Template ID are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting CV redesign process for CV:', cvId, 'with template:', templateId);

    // Get the uploaded CV data
    const { data: cvData, error: cvError } = await supabase
      .from('uploaded_cvs')
      .select('*')
      .eq('id', cvId)
      .single();

    if (cvError || !cvData) {
      throw new Error('CV not found or not accessible');
    }

    // Get the template and its design patterns
    const { data: templateData, error: templateError } = await supabase
      .from('premium_templates')
      .select(`
        *,
        design_patterns (
          pattern_data,
          confidence_score
        )
      `)
      .eq('id', templateId)
      .single();

    if (templateError || !templateData) {
      throw new Error('Template not found');
    }

    // Get design patterns for this template
    const designPatterns = templateData.design_patterns?.[0]?.pattern_data || {
      colors: { primary: "#2563eb", secondary: "#64748b", accent: "#06b6d4", text: "#1e293b", background: "#ffffff" },
      typography: { headingFont: "Arial", bodyFont: "Arial", headingSize: "16px", bodySize: "12px" },
      layout: { columns: 1, spacing: "normal", alignment: "left", sectionSpacing: "normal" },
      style: { overall: "professional", borders: "none", shadows: "none", corners: "sharp" },
      sections: { headerStyle: "left", contactLayout: "horizontal", sectionHeaders: "bold" }
    };

    console.log('Design patterns found:', designPatterns);

    // Use OpenAI to redesign the CV content based on the template style
    const redesignPrompt = `
    You are a professional CV redesign expert. Transform the following CV content to match the style and structure of a ${templateData.category || 'professional'} template for the ${templateData.industry || 'general'} industry.

    Original CV Content:
    ${JSON.stringify(cvData.extracted_content, null, 2)}

    Template Style Guidelines:
    - Overall Style: ${designPatterns.style?.overall || 'professional'}
    - Category: ${templateData.category || 'professional'}
    - Industry Focus: ${templateData.industry || 'general'}
    
    Design Patterns to Follow:
    ${JSON.stringify(designPatterns, null, 2)}

    Please redesign the CV content to:
    1. Optimize content for the target industry and template style
    2. Improve language and phrasing to be more impactful
    3. Restructure information to match the template's best practices
    4. Ensure ATS-friendly formatting
    5. Maintain all original information while enhancing presentation

    Return a JSON object with the redesigned resume data in this exact structure:
    {
      "personalInfo": {
        "fullName": "string",
        "email": "string",
        "phone": "string", 
        "location": "string",
        "linkedin": "string",
        "website": "string"
      },
      "personalStatement": "enhanced professional summary",
      "experience": [
        {
          "company": "string",
          "position": "string", 
          "startDate": "string",
          "endDate": "string",
          "location": "string",
          "responsibilities": ["enhanced bullet point 1", "enhanced bullet point 2"]
        }
      ],
      "education": [
        {
          "institution": "string",
          "degree": "string",
          "field": "string",
          "graduationDate": "string",
          "gpa": "string"
        }
      ],
      "skills": ["skill1", "skill2"],
      "designPatterns": ${JSON.stringify(designPatterns)}
    }
    `;

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
            content: 'You are a professional CV redesign expert. Always return valid JSON in the exact format requested.'
          },
          {
            role: 'user',
            content: redesignPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const aiResponse = await response.json();
    const redesignedContent = aiResponse.choices[0].message.content;
    
    console.log('AI Redesign Result:', redesignedContent);

    // Parse the JSON response from AI
    let redesignedData;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = redesignedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        redesignedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('Failed to parse redesigned content');
    }

    // Store the redesign session
    const { data: sessionData, error: sessionError } = await supabase
      .from('cv_redesign_sessions')
      .insert({
        uploaded_cv_id: cvId,
        selected_template_id: templateId,
        redesigned_data: redesignedData
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error storing redesign session:', sessionError);
      throw sessionError;
    }

    console.log('CV redesign completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionId: sessionData.id,
        redesignedData: redesignedData,
        message: 'CV redesigned successfully using AI and template patterns'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in redesign-cv function:', error);
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
