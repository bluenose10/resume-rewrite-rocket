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
      margin-bottom: 24px;
    }
    
    .resume-item {
      page-break-inside: avoid;
      break-inside: avoid;
      margin-bottom: 16px;
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

    // Find all page cards in the multi-page preview
    const pageCards = element.querySelectorAll('.space-y-8 > .shadow-lg');
    
    if (pageCards.length === 0) {
      throw new Error('No pages found in resume preview');
    }

    console.log(`Found ${pageCards.length} pages to export`);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [paperSize.width, paperSize.height],
      compress: true
    });

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
      const canvas = await html2canvas(pageContent, {
        scale: qualitySettings.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        scrollX: 0,
        scrollY: 0,
        removeContainer: false,
        imageTimeout: 15000,
        logging: false
      });

      // Restore original styles
      pageContent.style.cssText = originalStyle;

      // Add to PDF
      const imgData = canvas.toDataURL('image/png', qualitySettings.compression);
      
      // Calculate dimensions to fit page with margins
      const pdfWidth = paperSize.width - (margin * 2);
      const pdfHeight = paperSize.height - (margin * 2);
      
      // Convert canvas to mm and scale to fit
      const pixelsToMm = 0.264583;
      const canvasWidthMm = canvas.width * pixelsToMm;
      const canvasHeightMm = canvas.height * pixelsToMm;
      
      const scale = Math.min(pdfWidth / canvasWidthMm, pdfHeight / canvasHeightMm);
      const scaledWidth = canvasWidthMm * scale;
      const scaledHeight = canvasHeightMm * scale;
      
      // Center the content
      const x = margin + (pdfWidth - scaledWidth) / 2;
      const y = margin;

      pdf.addImage(
        imgData, 
        'PNG', 
        x,
        y,
        scaledWidth,
        scaledHeight,
        undefined,
        'FAST'
      );

      console.log(`Added page ${pageIndex + 1} to PDF`);
    }

    // Remove page break styles
    removePageBreakStyles(pageBreakStyle);

    // Handle non-PDF formats
    if (options.format === 'png' || options.format === 'jpeg') {
      // For images, create a single canvas with all pages
      const allPagesCanvas = await createAllPagesCanvas(pageCards, qualitySettings);
      const link = document.createElement('a');
      link.download = filename.replace('.pdf', `.${options.format}`);
      link.href = allPagesCanvas.toDataURL(`image/${options.format}`, qualitySettings.compression);
      link.click();
      return;
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
    
    console.log(`Successfully generated ${pageCards.length}-page PDF: ${filename}`);
  } catch (error) {
    console.error('Enhanced PDF generation error:', error);
    throw new Error('Failed to generate professional PDF. Please try again.');
  }
};

const createAllPagesCanvas = async (pageCards: NodeListOf<Element>, qualitySettings: any) => {
  const totalHeight = pageCards.length * 1123;
  const canvas = document.createElement('canvas');
  canvas.width = 794 * qualitySettings.scale;
  canvas.height = totalHeight * qualitySettings.scale;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < pageCards.length; i++) {
    const pageContent = pageCards[i].querySelector('[style*="width: 794px"]') as HTMLElement;
    if (pageContent) {
      const pageCanvas = await html2canvas(pageContent, {
        scale: qualitySettings.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123
      });
      
      ctx.drawImage(pageCanvas, 0, i * 1123 * qualitySettings.scale);
    }
  }
  
  return canvas;
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
