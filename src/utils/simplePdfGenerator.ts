
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
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    if (options.format === 'png' || options.format === 'jpeg') {
      // Download as image
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL(`image/${options.format}`, 0.9);
      link.click();
    } else {
      // Generate PDF
      const imgData = canvas.toDataURL('image/png');
      
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
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      pdf.save(fileName);
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};
