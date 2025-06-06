
import { ExportOptions } from "@/types/export";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Function to generate PDF using the external API
export async function generatePDF(
  elementId: string,
  fileName: string,
  options: ExportOptions
): Promise<string> {
  try {
    // Get the HTML content of the element
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Get the HTML content - ensure we capture all CSS
    const resumeContent = element.outerHTML;
    
    // Generate full HTML document with all styles
    const styleSheets = Array.from(document.styleSheets);
    let styles = "";
    
    styleSheets.forEach(sheet => {
      try {
        if (sheet.cssRules) {
          for (const rule of sheet.cssRules) {
            styles += rule.cssText;
          }
        }
      } catch (e) {
        console.warn('Could not access cssRules for stylesheet', e);
      }
    });
    
    // Prepare the HTML document with all necessary styles and content
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${fileName}</title>
          <style>
            ${styles}
            
            @page {
              size: ${options.paperSize} portrait;
              margin: 0;
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
            
            .page-break {
              page-break-after: always;
            }
            
            .resume-section {
              page-break-inside: avoid;
            }
            
            .resume-page {
              width: 100%;
              margin: 0;
              padding: 0;
              box-shadow: none;
              border: none;
            }

            /* Print-specific styles */
            @media print {
              .resume-container {
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              
              .resume-page {
                padding: ${getMarginSize(options.margins)}mm !important;
              }
            }
          </style>
        </head>
        <body>
          ${resumeContent}
        </body>
      </html>
    `;

    console.log('Sending resume content to PDF generation service...');
    
    // Call our edge function to generate the PDF
    const { data, error } = await supabase.functions.invoke('generate-pdf', {
      body: {
        htmlContent: fullHtml,
        options: options,
        fileName: fileName
      }
    });

    if (error) {
      console.error('PDF generation error from edge function:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }

    if (!data?.success || !data?.pdfUrl) {
      console.error('PDF generation returned unsuccessful response:', data);
      throw new Error('Failed to generate PDF: No URL returned');
    }

    console.log('PDF generated successfully:', data);
    
    // For image formats, we don't have an implementation yet - would need to extend this
    if (options.format !== 'pdf') {
      throw new Error(`Format "${options.format}" is not supported yet`);
    }

    // Return the URL of the generated PDF
    return data.pdfUrl;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}

// Helper function to get margin size in mm
function getMarginSize(marginOption: string | undefined): number {
  switch (marginOption) {
    case 'none': return 0;
    case 'small': return 5;
    case 'medium': return 10;
    case 'large': return 15;
    default: return 10; // Medium as default
  }
}

// For compatibility with the old implementation
export const generateSimplePDF = generatePDF;
