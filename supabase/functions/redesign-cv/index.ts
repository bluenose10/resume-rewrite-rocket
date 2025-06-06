
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { OpenAI } from "https://esm.sh/openai@4.28.0";

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

    // Initialize OpenAI client
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;
    if (!openaiApiKey) {
      throw new Error("OpenAI API Key is not configured");
    }
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Get the uploaded CV with extracted content
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

    const extractedContent = cvData.extracted_content;
    if (!extractedContent) {
      throw new Error('No extracted content found for this CV');
    }

    // Generate template characteristics prompt based on template properties
    const templateCharacteristics = `
      Template Name: ${templateData.name}
      Template Style: ${templateData.style || 'Professional'}
      Template Industry Focus: ${templateData.industry || 'General'}
      Template Description: ${templateData.description || 'Modern professional CV template'}
    `;

    // Create a resume data structure based on the extracted content
    const resumeData = {
      personalInfo: extractedContent.personalInfo || {},
      summary: extractedContent.summary || '',
      experience: extractedContent.experience || [],
      education: extractedContent.education || [],
      skills: extractedContent.skills || [],
      languages: extractedContent.languages || [],
      certifications: extractedContent.certifications || [],
    };

    // Use AI to optimize and rewrite the resume content based on the template style
    console.log('Using AI to optimize and format the CV content...');
    
    const optimizationPrompt = `
      You are a professional CV/resume writer specializing in creating impactful, concise resumes 
      that fit within a 2-page limit. I need you to rewrite and optimize this CV content for the
      following template:
      
      ${templateCharacteristics}
      
      Here is the CV content that needs optimization:
      ${JSON.stringify(resumeData, null, 2)}
      
      Please rewrite and reformat all content sections to:
      1. Match the style and tone of the template
      2. Use powerful action verbs and achievement-focused language
      3. Be concise enough to fit on a 2-page resume
      4. Highlight the most relevant skills and experiences
      5. Use modern, professional language that scans well with ATS systems
      
      Return the optimized CV content in the same JSON structure, ensuring all keys from the 
      original content are preserved, but with rewritten, optimized content.
    `;

    const optimizationResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: optimizationPrompt }],
    });
    
    const optimizedContent = JSON.parse(optimizationResponse.choices[0].message.content || "{}");
    console.log('AI optimized the CV content successfully');

    // Create redesign session with the optimized content
    const { data: sessionData, error: sessionError } = await supabase
      .from('cv_redesign_sessions')
      .insert({
        uploaded_cv_id: cvId,
        selected_template_id: templateId,
        redesigned_data: {
          originalContent: cvData.extracted_content,
          templateApplied: templateData.name,
          optimizedContent: optimizedContent,
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
        optimizedContent: optimizedContent,
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
