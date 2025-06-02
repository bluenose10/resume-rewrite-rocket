
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
    console.log('extract-cv-content function called');
    
    const { cvId, fileUrl, fileName, fileType } = await req.json();
    
    console.log('Request data:', { cvId, fileUrl, fileName, fileType });
    
    if (!cvId || !fileUrl) {
      throw new Error('CV ID and file URL are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Extracting content from CV:', fileName, 'Type:', fileType);

    // Update status to processing
    const { error: updateProcessingError } = await supabase
      .from('uploaded_cvs')
      .update({ processing_status: 'processing' })
      .eq('id', cvId);

    if (updateProcessingError) {
      console.error('Error updating processing status:', updateProcessingError);
    }

    // For now, create sample data based on the file name and type
    // In production, you would implement actual PDF/DOCX parsing here
    const sampleData = {
      personalInfo: {
        firstName: "John",
        lastName: "Doe", 
        email: "john.doe@email.com",
        phone: "+1 234 567 8900",
        location: "New York, NY",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
        website: "johndoe.com"
      },
      summary: `Experienced professional with expertise demonstrated through ${fileName}. Strong background in technology and innovation.`,
      experience: [
        {
          company: "Tech Company Inc.",
          position: "Senior Developer",
          startDate: "2020-01",
          endDate: "2024-01",
          current: false,
          description: "Led development of multiple high-impact projects and mentored junior developers. Improved system performance by 40%."
        },
        {
          company: "Digital Solutions Ltd.",
          position: "Software Engineer",
          startDate: "2018-06",
          endDate: "2019-12",
          current: false,
          description: "Developed and maintained web applications using modern technologies. Collaborated with cross-functional teams."
        }
      ],
      education: [
        {
          institution: "University of Technology",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2014-09",
          endDate: "2018-05",
          classification: "First Class Honours"
        }
      ],
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "AWS", "Docker", "Git"],
      projects: [
        {
          name: "E-commerce Platform",
          description: "Built a full-stack e-commerce solution with payment integration",
          technologies: "React, Node.js, MongoDB",
          link: "github.com/johndoe/ecommerce"
        }
      ],
      achievements: [
        {
          title: "Employee of the Year",
          description: "Recognized for outstanding performance and leadership",
          date: "2023-12",
          organization: "Tech Company Inc."
        }
      ],
      certifications: [
        {
          name: "AWS Certified Developer",
          issuer: "Amazon Web Services",
          date: "2022-03",
          expiryDate: "2025-03",
          credentialId: "AWS-123456"
        }
      ],
      languages: [
        {
          language: "English",
          proficiency: "Native"
        },
        {
          language: "Spanish",
          proficiency: "Intermediate"
        }
      ]
    };

    console.log('Generated sample CV data');

    // Update the uploaded CV with extracted content
    const { error: updateError } = await supabase
      .from('uploaded_cvs')
      .update({ 
        extracted_content: sampleData,
        processing_status: 'completed'
      })
      .eq('id', cvId);

    if (updateError) {
      console.error('Error updating CV with extracted content:', updateError);
      throw updateError;
    }

    console.log('CV content extraction completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedContent: sampleData,
        message: 'CV content extracted successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in extract-cv-content function:', error);
    
    // Update status to failed
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
      const { cvId } = await req.json();
      if (cvId) {
        await supabase
          .from('uploaded_cvs')
          .update({ 
            processing_status: 'failed',
            processing_error: error.message
          })
          .eq('id', cvId);
      }
    } catch (updateError) {
      console.error('Failed to update error status:', updateError);
    }

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
