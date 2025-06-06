
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get PDFShift API key
    const pdfshiftApiKey = Deno.env.get('PDFSHIFT_API_KEY');
    if (!pdfshiftApiKey) {
      throw new Error('PDFShift API key is not configured');
    }

    // Parse request body
    const { htmlContent, options = {}, fileName = 'resume.pdf' } = await req.json();
    if (!htmlContent) {
      throw new Error('HTML content is required');
    }

    console.log('Generating PDF with options:', JSON.stringify(options));

    // Prepare PDFShift API request
    const pdfshiftOptions = {
      source: htmlContent,
      landscape: false,
      format: options.paperSize || 'A4',
      margin: {
        top: getMarginSize(options.margins),
        right: getMarginSize(options.margins),
        bottom: getMarginSize(options.margins),
        left: getMarginSize(options.margins)
      },
      css: `
        @page {
          size: ${options.paperSize || 'A4'} portrait;
          margin: ${getMarginSize(options.margins)}mm;
        }
        .page-break {
          page-break-after: always;
        }
        @media print {
          .resume-section {
            page-break-inside: avoid;
          }
          .page-break-before {
            page-break-before: always;
          }
        }
      `,
      pdf_options: {
        preferCSSPageSize: true,
      },
      sandbox: false,
      use_print: true
    };

    // Call PDFShift API to generate PDF
    console.log('Sending request to PDFShift API...');
    const pdfshiftResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`api:${pdfshiftApiKey}`)}`,
      },
      body: JSON.stringify(pdfshiftOptions),
    });

    if (!pdfshiftResponse.ok) {
      const errorText = await pdfshiftResponse.text();
      console.error('PDFShift API error:', errorText);
      throw new Error(`PDFShift API error: ${pdfshiftResponse.status} ${errorText}`);
    }

    // Get PDF binary data
    const pdfBuffer = await pdfshiftResponse.arrayBuffer();

    // Store the PDF in Supabase Storage
    const timestamp = new Date().getTime();
    const storageFileName = `${fileName.replace(/\.[^/.]+$/, '')}_${timestamp}.pdf`;
    const storagePath = `generated_pdfs/${storageFileName}`;

    console.log('Storing PDF in Supabase Storage:', storagePath);

    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('resume_exports')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    if (storageError) {
      console.error('Storage error:', storageError);
      throw new Error(`Failed to store PDF: ${storageError.message}`);
    }

    // Get public URL for the stored PDF
    const { data: { publicUrl } } = supabase.storage
      .from('resume_exports')
      .getPublicUrl(storagePath);

    return new Response(
      JSON.stringify({
        success: true,
        pdfUrl: publicUrl,
        fileName: storageFileName,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating PDF:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to generate PDF",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// Helper function to convert margin option to size in mm
function getMarginSize(marginOption: string | undefined): number {
  switch (marginOption) {
    case 'none': return 0;
    case 'small': return 5;
    case 'medium': return 10;
    case 'large': return 15;
    default: return 10; // Medium as default
  }
}

serve(handler);
