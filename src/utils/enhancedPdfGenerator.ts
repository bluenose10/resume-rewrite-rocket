
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ExportOptions {
  format: 'pdf' | 'png' | 'jpeg';
  quality: 'standard' | 'high' | 'ultra';
  paperSize: 'a4' | 'letter' | 'legal';
  margins: 'none' | 'small' | 'medium' | 'large';
}

const PAPER_SIZES = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 }
};

const MARGIN_SIZES = {
  none: 0,
  small: 5,
  medium: 10,
  large: 15
};

const QUALITY_SETTINGS = {
  standard: { scale: 2, compression: 0.7 },
  high: { scale: 3, compression: 0.9 },
  ultra: { scale: 4, compression: 1.0 }
};

// Add CSS for better page break handling
const addPageBreakStyles = () => {
  const style = document.createElement('style');
  style.id = 'page-break-styles';
  style.textContent = `
    .resume-section {
      page-break-inside: avoid;
      break-inside: avoid;
      margin-bottom: 16px;
    }
    
    .resume-item {
      page-break-inside: avoid;
      break-inside: avoid;
      margin-bottom: 12px;
    }
    
    .page-break-before {
      page-break-before: always;
      break-before: page;
    }
    
    .no-page-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  `;
  
  // Remove existing style if present
  const existing = document.getElementById('page-break-styles');
  if (existing) {
    existing.remove();
  }
  
  document.head.appendChild(style);
  return style;
};

const removePageBreakStyles = (style: HTMLElement) => {
  if (style && style.parentNode) {
    style.parentNode.removeChild(style);
  }
};

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
    const paperSize = PAPER_SIZES[options.paperSize];
    const margin = MARGIN_SIZES[options.margins];

    // Add page break styles for better formatting
    const pageBreakStyle = addPageBreakStyles();

    // Apply resume-specific classes for better page breaks
    const sections = element.querySelectorAll('section, .space-y-3 > div, .space-y-2 > div');
    sections.forEach(section => {
      section.classList.add('resume-section');
    });

    // Optimize element for PDF generation with better spacing
    const originalStyle = element.style.cssText;
    element.style.width = '794px'; // A4 width in pixels at 96 DPI
    element.style.maxWidth = '794px';
    element.style.backgroundColor = '#ffffff';
    element.style.lineHeight = '1.5';
    element.style.padding = '20px';

    // Generate high-quality canvas with better spacing
    const canvas = await html2canvas(element, {
      scale: qualitySettings.scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      removeContainer: false,
      imageTimeout: 15000,
      logging: false
    });

    // Restore original styles and remove page break styles
    element.style.cssText = originalStyle;
    sections.forEach(section => {
      section.classList.remove('resume-section');
    });
    removePageBreakStyles(pageBreakStyle);

    if (options.format === 'png' || options.format === 'jpeg') {
      // Export as image
      const link = document.createElement('a');
      link.download = filename.replace('.pdf', `.${options.format}`);
      link.href = canvas.toDataURL(`image/${options.format}`, qualitySettings.compression);
      link.click();
      return;
    }

    // Create PDF with smarter multi-page support
    const imgData = canvas.toDataURL('image/png', qualitySettings.compression);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [paperSize.width, paperSize.height],
      compress: true
    });

    // Calculate dimensions with better spacing
    const pdfWidth = paperSize.width - (margin * 2);
    const pdfHeight = paperSize.height - (margin * 2);
    
    // Convert canvas pixels to mm (96 DPI standard)
    const pixelsToMm = 0.264583;
    const canvasWidthMm = canvas.width * pixelsToMm;
    const canvasHeightMm = canvas.height * pixelsToMm;
    
    // Scale to fit page width
    const scale = pdfWidth / canvasWidthMm;
    const scaledWidth = pdfWidth;
    const scaledHeight = canvasHeightMm * scale;
    
    // Calculate pages with better spacing - leave more room between pages
    const usablePageHeight = pdfHeight - 10; // Add 10mm buffer for better spacing
    const totalPages = Math.ceil(scaledHeight / usablePageHeight);
    
    console.log('Enhanced PDF Generation Info:', {
      canvasSize: { width: canvas.width, height: canvas.height },
      canvasMm: { width: canvasWidthMm, height: canvasHeightMm },
      scaledMm: { width: scaledWidth, height: scaledHeight },
      pageHeight: usablePageHeight,
      totalPages: totalPages,
      margins: margin
    });
    
    // Add each page with better content distribution
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      if (pageIndex > 0) {
        pdf.addPage();
      }
      
      // Calculate the Y offset for this page with better spacing
      const yOffsetMm = pageIndex * usablePageHeight;
      
      // Add the image slice for this page
      pdf.addImage(
        imgData, 
        'PNG', 
        margin,                    // x position
        margin - yOffsetMm,        // y position (negative offset to show correct slice)
        scaledWidth,               // width
        scaledHeight,              // full height (clipped by page bounds)
        undefined,                 // alias
        'FAST'                     // compression
      );
      
      // Add subtle page number for multi-page documents
      if (totalPages > 1) {
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);
        pdf.text(
          `${pageIndex + 1}`, 
          paperSize.width - margin - 5, 
          paperSize.height - 5, 
          { align: 'right' }
        );
      }
    }

    // Add metadata
    pdf.setProperties({
      title: filename.replace('.pdf', ''),
      author: 'AI Resume Builder',
      subject: 'Professional Resume',
      creator: 'Lovable AI Resume Builder',
      keywords: 'resume, cv, professional, career'
    });

    pdf.save(filename);
    
    console.log(`Successfully generated ${totalPages}-page PDF with enhanced formatting: ${filename}`);
  } catch (error) {
    console.error('Enhanced PDF generation error:', error);
    throw new Error('Failed to generate professional PDF. Please try again.');
  }
};

export const optimizeResumeForPrint = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Add enhanced print-specific styles
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      #${elementId} {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 20mm !important;
        width: 100% !important;
        max-width: none !important;
        font-size: 12px !important;
        line-height: 1.5 !important;
      }
      
      #${elementId} section {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 16px !important;
      }
      
      #${elementId} .space-y-3 > div,
      #${elementId} .space-y-2 > div {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 12px !important;
      }
      
      #${elementId} * {
        visibility: visible !important;
      }
      
      #${elementId} .no-print {
        display: none !important;
      }
      
      #${elementId} .page-break-indicator {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  return () => {
    document.head.removeChild(style);
  };
};
