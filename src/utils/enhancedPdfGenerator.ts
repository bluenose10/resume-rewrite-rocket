
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

    // Optimize element for PDF generation
    const originalStyle = element.style.cssText;
    element.style.width = '794px'; // A4 width in pixels at 96 DPI
    element.style.maxWidth = '794px';
    element.style.backgroundColor = '#ffffff';

    // Generate high-quality canvas
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

    // Restore original styles
    element.style.cssText = originalStyle;

    if (options.format === 'png' || options.format === 'jpeg') {
      // Export as image
      const link = document.createElement('a');
      link.download = filename.replace('.pdf', `.${options.format}`);
      link.href = canvas.toDataURL(`image/${options.format}`, qualitySettings.compression);
      link.click();
      return;
    }

    // Generate PDF
    const imgData = canvas.toDataURL('image/png', qualitySettings.compression);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [paperSize.width, paperSize.height],
      compress: true
    });

    const pdfWidth = paperSize.width - (margin * 2);
    const pdfHeight = paperSize.height - (margin * 2);
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate optimal scaling
    const scale = Math.min(
      pdfWidth / (imgWidth * 0.264583),
      pdfHeight / (imgHeight * 0.264583)
    );
    
    const scaledWidth = (imgWidth * 0.264583) * scale;
    const scaledHeight = (imgHeight * 0.264583) * scale;
    
    // Center content with margins
    const x = margin + (pdfWidth - scaledWidth) / 2;
    const y = margin;

    // Add watermark for professional touch
    pdf.setFontSize(8);
    pdf.setTextColor(200, 200, 200);
    pdf.text('Generated with AI Resume Builder', margin, paperSize.height - 5);

    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight, undefined, 'FAST');
    
    // Add metadata
    pdf.setProperties({
      title: filename.replace('.pdf', ''),
      author: 'AI Resume Builder',
      subject: 'Professional Resume',
      creator: 'Lovable AI Resume Builder',
      keywords: 'resume, cv, professional, career'
    });

    pdf.save(filename);
  } catch (error) {
    console.error('Enhanced PDF generation error:', error);
    throw new Error('Failed to generate professional PDF. Please try again.');
  }
};

export const optimizeResumeForPrint = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Add print-specific styles
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
        line-height: 1.4 !important;
      }
      
      #${elementId} * {
        visibility: visible !important;
      }
      
      #${elementId} .no-print {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  return () => {
    document.head.removeChild(style);
  };
};
