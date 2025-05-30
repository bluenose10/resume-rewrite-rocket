
export interface PageBreakResult {
  pages: React.ReactNode[];
  totalPages: number;
}

export interface MeasuredSection {
  id: string;
  element: HTMLElement;
  height: number;
  canSplit: boolean;
}

export const PAGE_HEIGHT = 1123; // A4 height in pixels
export const PAGE_MARGIN = 40;
export const CONTENT_HEIGHT = PAGE_HEIGHT - (PAGE_MARGIN * 2);

export const measureElement = (element: HTMLElement): number => {
  const rect = element.getBoundingClientRect();
  return rect.height;
};

export const canSectionSplit = (sectionId: string): boolean => {
  // Sections that can be split across pages
  const splittableSections = [
    'experience', 
    'education', 
    'projects', 
    'achievements', 
    'certifications', 
    'volunteerExperience',
    'publications',
    'references'
  ];
  return splittableSections.includes(sectionId);
};

export const splitLongSection = (
  sectionElement: HTMLElement, 
  sectionId: string, 
  availableHeight: number
): { firstPart: HTMLElement; remainingPart: HTMLElement } | null => {
  if (!canSectionSplit(sectionId)) return null;

  const items = sectionElement.querySelectorAll('.section-item');
  if (items.length <= 1) return null;

  let currentHeight = 0;
  let splitIndex = 0;

  // Find where to split based on available height
  for (let i = 0; i < items.length; i++) {
    const itemHeight = measureElement(items[i] as HTMLElement);
    if (currentHeight + itemHeight > availableHeight && i > 0) {
      splitIndex = i;
      break;
    }
    currentHeight += itemHeight;
    splitIndex = i + 1;
  }

  if (splitIndex === 0 || splitIndex >= items.length) return null;

  // Clone the section element
  const firstPart = sectionElement.cloneNode(true) as HTMLElement;
  const remainingPart = sectionElement.cloneNode(true) as HTMLElement;

  // Remove items from first part after split index
  const firstItems = firstPart.querySelectorAll('.section-item');
  for (let i = splitIndex; i < firstItems.length; i++) {
    firstItems[i].remove();
  }

  // Remove items from remaining part before split index
  const remainingItems = remainingPart.querySelectorAll('.section-item');
  for (let i = 0; i < splitIndex; i++) {
    remainingItems[i].remove();
  }

  return { firstPart, remainingPart };
};
