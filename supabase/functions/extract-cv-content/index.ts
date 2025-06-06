
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFExtract } from "https://esm.sh/pdf.js-extract@0.2.1";
import { Mammoth } from "https://esm.sh/mammoth@1.6.0";
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
    const { cvId, fileUrl, fileName, fileType } = await req.json();
    
    console.log('Processing CV extraction for:', { cvId, fileName, fileType });
    
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
    
    console.log('Fetching CV file from URL...');
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch the CV file: ${fileResponse.status} ${fileResponse.statusText}`);
    }
    
    // Extract text content based on file type
    let textContent = '';
    
    if (fileType === 'application/pdf') {
      console.log('Processing PDF file...');
      const pdfBuffer = await fileResponse.arrayBuffer();
      const pdfExtract = new PDFExtract();
      const data = await pdfExtract.extractBuffer(new Uint8Array(pdfBuffer));
      textContent = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
    } 
    else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('Processing DOCX file...');
      const docxBuffer = await fileResponse.arrayBuffer();
      const result = await Mammoth.extractRawText({ arrayBuffer: docxBuffer });
      textContent = result.value;
    } 
    else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
    
    console.log(`Text extracted from CV, length: ${textContent.length} characters`);
    
    // Use OpenAI to parse and structure the CV content
    console.log('Using AI to structure CV content...');
    const structurePrompt = `
      You are a CV parsing expert. Extract structured information from this CV text into these categories:
      - Personal Information (name, email, phone, location, etc)
      - Professional Summary/Profile
      - Work Experience (company, role, dates, description for each role)
      - Education (institution, degree, dates, etc)
      - Skills (both technical and soft skills)
      - Languages (if any)
      - Certifications (if any)
      - Additional sections like Publications, References, Volunteer Work, etc.
      
      Format your response as a clean, structured JSON object with the categories as keys. If information for a category is not available, include an empty array or appropriate placeholder. For work experience and education, include arrays of objects with proper structure.
      
      Here is the CV text:
      ${textContent}
    `;
    
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: structurePrompt }],
    });
    
    const structuredContent = JSON.parse(aiResponse.choices[0].message.content || "{}");
    console.log('AI structured the CV content successfully');
    
    // Map the structured data to our database schema
    const extractedContent = {
      personalInfo: {
        firstName: structuredContent.personalInformation?.name?.split(' ')?.[0] || '',
        lastName: structuredContent.personalInformation?.name?.split(' ')?.[1] || '',
        email: structuredContent.personalInformation?.email || '',
        phone: structuredContent.personalInformation?.phone || '',
        location: structuredContent.personalInformation?.location || '',
        linkedin: structuredContent.personalInformation?.linkedin || '',
        github: structuredContent.personalInformation?.github || '',
        website: structuredContent.personalInformation?.website || ''
      },
      summary: structuredContent.professionalSummary || '',
      experience: Array.isArray(structuredContent.workExperience) 
        ? structuredContent.workExperience.map((exp: any) => ({
            id: crypto.randomUUID(),
            company: exp.company || '',
            position: exp.role || exp.position || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: exp.endDate?.toLowerCase() === 'present' || exp.current || false,
            description: exp.description || ''
          }))
        : [],
      education: Array.isArray(structuredContent.education)
        ? structuredContent.education.map((edu: any) => ({
            id: crypto.randomUUID(),
            institution: edu.institution || '',
            degree: edu.degree || '',
            field: edu.field || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            classification: edu.classification || ''
          }))
        : [],
      skills: Array.isArray(structuredContent.skills) 
        ? structuredContent.skills 
        : typeof structuredContent.skills === 'string'
          ? structuredContent.skills.split(',').map((s: string) => s.trim())
          : [],
      languages: Array.isArray(structuredContent.languages)
        ? structuredContent.languages.map((lang: any) => ({
            id: crypto.randomUUID(),
            language: typeof lang === 'object' ? lang.language : lang,
            proficiency: typeof lang === 'object' ? lang.proficiency : 'Intermediate'
          }))
        : [],
      certifications: Array.isArray(structuredContent.certifications)
        ? structuredContent.certifications.map((cert: any) => ({
            id: crypto.randomUUID(),
            name: typeof cert === 'object' ? cert.name : cert,
            issuer: typeof cert === 'object' ? cert.issuer : '',
            date: typeof cert === 'object' ? cert.date : '',
            expiryDate: '',
            credentialId: typeof cert === 'object' ? cert.id : ''
          }))
        : [],
      originalTextContent: textContent,
      extracted_at: new Date().toISOString(),
      extraction_method: 'ai-enhanced'
    };

    // Update the CV record with extracted content
    const { error: updateError } = await supabase
      .from('uploaded_cvs')
      .update({
        extracted_content: extractedContent,
        processing_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', cvId);

    if (updateError) {
      console.error('Error updating CV record:', updateError);
      throw updateError;
    }

    console.log('CV extraction completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedContent,
        message: 'CV content extracted successfully'
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in extract-cv-content function:", error);
    
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
