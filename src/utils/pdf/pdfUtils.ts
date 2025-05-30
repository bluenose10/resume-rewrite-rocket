
import jsPDF from 'jspdf';
import { ExportOptions } from '@/types/export';
import { PAPER_SIZES, MARGIN_SIZES } from './pdfConfig';

export const createPDFDocument = (options: ExportOptions): jsPDF => {
  const paperSize = PAPER_SIZES[options.paperSize];
  
  return new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [paperSize.width, paperSize.height],
    compress: true
  });
};

export const addImageToPDF = (
  pdf: jsPDF,
  imgData: string,
  options: ExportOptions,
  qualitySettings: { scale: number; compression: number },
  canvas: HTMLCanvasElement
): void => {
  const paperSize = PAPER_SIZES[options.paperSize];
  const margin = MARGIN_SIZES[options.margins];
  
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
};

export const addPDFMetadata = (pdf: jsPDF, filename: string): void => {
  pdf.setProperties({
    title: filename.replace('.pdf', ''),
    author: 'AI Resume Builder',
    subject: 'Professional Resume',
    creator: 'Lovable AI Resume Builder',
    keywords: 'resume, cv, professional, career'
  });
};
