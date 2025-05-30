
import html2canvas from 'html2canvas';

export const createAllPagesCanvas = async (
  pageCards: NodeListOf<Element>, 
  qualitySettings: { scale: number; compression: number }
): Promise<HTMLCanvasElement> => {
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

export const generatePageCanvas = async (
  pageContent: HTMLElement,
  qualitySettings: { scale: number; compression: number }
): Promise<HTMLCanvasElement> => {
  return await html2canvas(pageContent, {
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
};
