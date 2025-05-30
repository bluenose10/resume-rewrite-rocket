
export const generatePDF = async (elementId: string, filename: string = 'resume.pdf') => {
  try {
    // Show loading indicator
    console.log('Starting PDF generation...');
    
    // Dynamic import to reduce bundle size
    const { default: html2canvas } = await import('html2canvas');
    const { default: jsPDF } = await import('jspdf');

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Resume element not found');
    }

    // Optimize element for PDF generation
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'visible';

    // Create canvas from HTML element with better settings for professional output
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      removeContainer: false,
      imageTimeout: 15000,
      logging: false
    });

    // Restore original overflow
    document.body.style.overflow = originalOverflow;

    // Calculate PDF dimensions for better quality
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate scale to fit content properly
    const scale = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
    const scaledWidth = (imgWidth * 0.264583) * scale;
    const scaledHeight = (imgHeight * 0.264583) * scale;
    
    // Center the content
    const x = (pdfWidth - scaledWidth) / 2;
    const y = 5; // Small top margin

    // Add metadata
    pdf.setProperties({
      title: filename.replace('.pdf', ''),
      author: 'AI Resume Builder',
      subject: 'Professional Resume',
      creator: 'Lovable AI Resume Builder'
    });

    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight, undefined, 'FAST');
    
    console.log('PDF generation completed successfully');
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};
