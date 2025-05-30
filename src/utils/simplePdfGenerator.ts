
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExportOptions } from '@/types/export';

export const generateSimplePDF = async (
  elementId: string, 
  fileName: string, 
  options: ExportOptions
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  // Configure canvas options based on quality
  const scale = options.quality === 'ultra' ? 3 : options.quality === 'high' ? 2 : 1;
  
  try {
    // Find all page elements within the resume content
    const pageElements = element.querySelectorAll('[style*="794px"]');
    
    if (pageElements.length === 0) {
      throw new Error('No resume pages found');
    }

    // Paper dimensions in mm
    const paperSizes = {
      a4: { width: 210, height: 297 },
      letter: { width: 216, height: 279 },
      legal: { width: 216, height: 356 }
    };
    
    const paper = paperSizes[options.paperSize];
    const pdf = new jsPDF('p', 'mm', [paper.width, paper.height]);
    
    // Calculate margins
    const marginMap = {
      none: 0,
      small: 5,
      medium: 10,
      large: 15
    };
    
    const margin = marginMap[options.margins];
    const imgWidth = paper.width - (margin * 2);

    // Process each page
    for (let i = 0; i < pageElements.length; i++) {
      const pageElement = pageElements[i] as HTMLElement;
      
      const canvas = await html2canvas(pageElement, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // Fixed A4 width
        height: 1123 // Fixed A4 height
      });

      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add new page for subsequent pages
      if (i > 0) {
        pdf.addPage([paper.width, paper.height]);
      }
      
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    }

    if (options.format === 'png' || options.format === 'jpeg') {
      // For image export, only export the first page
      const firstPageElement = pageElements[0] as HTMLElement;
      const canvas = await html2canvas(firstPageElement, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL(`image/${options.format}`, 0.9);
      link.click();
    } else {
      pdf.save(fileName);
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};
