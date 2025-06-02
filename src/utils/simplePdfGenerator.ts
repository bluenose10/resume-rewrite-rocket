
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
    // Find the resume page
    const resumePage = element.querySelector('.resume-page') as HTMLElement;
    
    if (!resumePage) {
      throw new Error('No resume page found');
    }

    console.log('Processing resume for export');

    // Paper dimensions in mm
    const paperSizes = {
      a4: { width: 210, height: 297 },
      letter: { width: 216, height: 279 },
      legal: { width: 216, height: 356 }
    };
    
    const paper = paperSizes[options.paperSize];
    
    // Calculate margins
    const marginMap = {
      none: 0,
      small: 5,
      medium: 10,
      large: 15
    };
    
    const margin = marginMap[options.margins];
    const imgWidth = paper.width - (margin * 2);

    // Create canvas with higher resolution
    const canvas = await html2canvas(resumePage, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels
      logging: false,
      onclone: (clonedDoc) => {
        // Apply print styles to the cloned document
        const style = clonedDoc.createElement('style');
        style.textContent = `
          .resume-page {
            width: 794px !important;
            padding: 40px !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .resume-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    if (options.format === 'png' || options.format === 'jpeg') {
      // For image export
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL(`image/${options.format}`, 0.9);
      link.click();
    } else {
      // For PDF export
      const pdf = new jsPDF('p', 'mm', [paper.width, paper.height]);
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if content fits on one page, if not, handle multi-page
      if (imgHeight > paper.height - (margin * 2)) {
        // Content is longer than one page - split it
        const pageHeight = paper.height - (margin * 2);
        const totalPages = Math.ceil(imgHeight / pageHeight);
        
        for (let i = 0; i < totalPages; i++) {
          if (i > 0) {
            pdf.addPage([paper.width, paper.height]);
          }
          
          const yOffset = i * pageHeight;
          const sourceY = (yOffset * canvas.height) / imgHeight;
          const sourceHeight = Math.min((pageHeight * canvas.height) / imgHeight, canvas.height - sourceY);
          
          // Create a canvas for this page section
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;
          const pageCtx = pageCanvas.getContext('2d');
          
          if (pageCtx) {
            pageCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
            const pageImgData = pageCanvas.toDataURL('image/png');
            pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, pageHeight);
          }
        }
      } else {
        // Content fits on one page
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      }
      
      console.log('Saving PDF');
      pdf.save(fileName);
    }
    
    console.log('Export completed successfully');
  } catch (error) {
    console.error('Export generation error:', error);
    throw new Error('Failed to generate export');
  }
};
