import { ExportOptions } from '@/types/export';
import { QUALITY_SETTINGS } from './pdf/pdfConfig';
import { addPageBreakStyles, removePageBreakStyles } from './pdf/pageBreakUtils';
import { createAllPagesCanvas, generatePageCanvas } from './pdf/canvasUtils';
import { createPDFDocument, addImageToPDF, addPDFMetadata } from './pdf/pdfUtils';

export type { ExportOptions } from '@/types/export';
export { optimizeResumeForPrint } from './pdf/pageBreakUtils';

export const generateEnhancedPDF = async (
  elementId: string, 
  filename: string = 'resume.pdf',
  options: ExportOptions = {
    format: 'pdf',
    quality: 'high',
    paperSize: 'a4',
    margins: 'medium'
  }
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Resume element not found');
    }

    const qualitySettings = QUALITY_SETTINGS[options.quality];

    // Add page break styles for better formatting
    const pageBreakStyle = addPageBreakStyles();

    // Find all page cards in the multi-page preview
    const pageCards = element.querySelectorAll('.space-y-8 > .shadow-lg');
    
    if (pageCards.length === 0) {
      throw new Error('No pages found in resume preview');
    }

    console.log(`Found ${pageCards.length} pages to export`);

    // Handle non-PDF formats
    if (options.format === 'png' || options.format === 'jpeg') {
      const allPagesCanvas = await createAllPagesCanvas(pageCards, qualitySettings);
      const link = document.createElement('a');
      link.download = filename.replace('.pdf', `.${options.format}`);
      link.href = allPagesCanvas.toDataURL(`image/${options.format}`, qualitySettings.compression);
      link.click();
      
      // Remove page break styles
      removePageBreakStyles(pageBreakStyle);
      return;
    }

    // Create PDF
    const pdf = createPDFDocument(options);

    // Process each page
    for (let pageIndex = 0; pageIndex < pageCards.length; pageIndex++) {
      const pageCard = pageCards[pageIndex] as HTMLElement;
      
      if (pageIndex > 0) {
        pdf.addPage();
      }

      // Get the actual content div inside the card
      const pageContent = pageCard.querySelector('[style*="width: 794px"]') as HTMLElement;
      if (!pageContent) {
        console.warn(`Page ${pageIndex + 1} content not found, skipping`);
        continue;
      }

      // Optimize page content for PDF generation
      const originalStyle = pageContent.style.cssText;
      pageContent.style.width = '794px';
      pageContent.style.maxWidth = '794px';
      pageContent.style.backgroundColor = '#ffffff';
      pageContent.style.minHeight = '1123px';

      // Generate canvas for this page
      const canvas = await generatePageCanvas(pageContent, qualitySettings);

      // Restore original styles
      pageContent.style.cssText = originalStyle;

      // Add to PDF
      const imgData = canvas.toDataURL('image/png', qualitySettings.compression);
      addImageToPDF(pdf, imgData, options, qualitySettings, canvas);

      console.log(`Added page ${pageIndex + 1} to PDF`);
    }

    // Remove page break styles
    removePageBreakStyles(pageBreakStyle);

    // Add metadata
    addPDFMetadata(pdf, filename);

    pdf.save(filename);
    
    console.log(`Successfully generated ${pageCards.length}-page PDF: ${filename}`);
  } catch (error) {
    console.error('Enhanced PDF generation error:', error);
    throw new Error('Failed to generate professional PDF. Please try again.');
  }
};
