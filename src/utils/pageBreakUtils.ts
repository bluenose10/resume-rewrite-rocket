
export interface PageBreakResult {
  pages: React.ReactNode[];
  totalPages: number;
}

export const PAGE_HEIGHT = 1123; // A4 height in pixels
export const PAGE_MARGIN = 40;
export const CONTENT_HEIGHT = PAGE_HEIGHT - (PAGE_MARGIN * 2);

export const measureElement = (element: HTMLElement): number => {
  const rect = element.getBoundingClientRect();
  return rect.height;
};
