
import { ResumeData } from '@/types/resume';

interface PageSection {
  sectionId: string;
  items?: string[];
  estimatedHeight: number;
  canSplit: boolean;
}

interface PageLayout {
  pageNumber: number;
  sections: PageSection[];
  totalHeight: number;
  hasHeader: boolean;
}

const A4_HEIGHT_PX = 1123;
const PAGE_PADDING = 48;
const HEADER_HEIGHT = 200;
const SECTION_SPACING = 32;
const USABLE_HEIGHT = A4_HEIGHT_PX - (PAGE_PADDING * 2);

export const calculateOptimalPageBreaks = (
  data: ResumeData,
  visibleSections: string[],
  measurements: Map<string, { height: number; canSplit: boolean }>
): PageLayout[] => {
  const pages: PageLayout[] = [];
  let currentPage: PageLayout = {
    pageNumber: 1,
    sections: [],
    totalHeight: HEADER_HEIGHT,
    hasHeader: true
  };

  visibleSections.forEach((sectionId) => {
    const sectionHeight = getSectionHeight(sectionId, data);
    
    // Simple page break logic - if section doesn't fit, move to next page
    if (currentPage.totalHeight + sectionHeight + SECTION_SPACING > USABLE_HEIGHT && currentPage.sections.length > 0) {
      pages.push(currentPage);
      currentPage = {
        pageNumber: pages.length + 1,
        sections: [],
        totalHeight: 32, // Small top margin for subsequent pages
        hasHeader: false
      };
    }
    
    currentPage.sections.push({
      sectionId,
      estimatedHeight: sectionHeight,
      canSplit: false
    });
    currentPage.totalHeight += sectionHeight + SECTION_SPACING;
  });
  
  if (currentPage.sections.length > 0) {
    pages.push(currentPage);
  }
  
  return pages;
};

const getSectionHeight = (sectionId: string, data: ResumeData): number => {
  const baseHeight = 80; // Title + spacing
  
  switch (sectionId) {
    case 'personalStatement':
    case 'summary':
      return baseHeight + 100;
    case 'experience':
      return baseHeight + (data.experience?.length || 0) * 160;
    case 'projects':
      return baseHeight + (data.projects?.length || 0) * 180;
    case 'education':
      return baseHeight + (data.education?.length || 0) * 120;
    case 'skills':
      return baseHeight + 100;
    case 'achievements':
      return baseHeight + (data.achievements?.length || 0) * 60;
    case 'certifications':
      return baseHeight + (data.certifications?.length || 0) * 80;
    case 'languages':
      return baseHeight + 80;
    case 'volunteerExperience':
      return baseHeight + (data.volunteerExperience?.length || 0) * 140;
    case 'publications':
      return baseHeight + (data.publications?.length || 0) * 100;
    case 'references':
      return baseHeight + (data.references?.length || 0) * 160;
    case 'interests':
      return baseHeight + 80;
    default:
      return baseHeight;
  }
};
