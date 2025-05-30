
export interface ExportOptions {
  format: 'pdf' | 'png' | 'jpeg';
  quality: 'standard' | 'high' | 'ultra';
  paperSize: 'a4' | 'letter' | 'legal';
  margins: 'none' | 'small' | 'medium' | 'large';
}
