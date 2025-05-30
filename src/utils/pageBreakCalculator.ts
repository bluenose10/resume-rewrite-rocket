
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
const PAGE_PADDING = 40;
const HEADER_HEIGHT = 180;
const SECTION_SPACING = 24;
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
    totalHeight: HEADER_HEIGHT, // Start with header on first page
    hasHeader: true
  };

  visibleSections.forEach((sectionId) => {
    const sectionHeight = getSectionHeight(sectionId, data, measurements);
    const sectionData = getSectionData(sectionId, data);
    
    // Check if section can be split
    const canSplitSection = canSplitSectionItems(sectionId, sectionData);
    
    if (canSplitSection && sectionData.items && sectionData.items.length > 1) {
      // Handle splittable sections (like experience, projects)
      const itemHeight = sectionHeight / sectionData.items.length;
      let remainingItems = [...sectionData.items];
      
      while (remainingItems.length > 0) {
        const availableHeight = USABLE_HEIGHT - currentPage.totalHeight - SECTION_SPACING;
        const itemsToFit = Math.max(1, Math.floor(availableHeight / itemHeight));
        const itemsForThisPage = remainingItems.splice(0, Math.min(itemsToFit, remainingItems.length));
        
        const partialHeight = itemsForThisPage.length * itemHeight + 60; // Add section header
        
        if (currentPage.totalHeight + partialHeight > USABLE_HEIGHT && currentPage.sections.length > 0) {
          // Start new page
          pages.push(currentPage);
          currentPage = {
            pageNumber: pages.length + 1,
            sections: [],
            totalHeight: 20, // No header on subsequent pages
            hasHeader: false
          };
        }
        
        currentPage.sections.push({
          sectionId,
          items: itemsForThisPage,
          estimatedHeight: partialHeight,
          canSplit: true
        });
        currentPage.totalHeight += partialHeight + SECTION_SPACING;
      }
    } else {
      // Handle non-splittable sections
      if (currentPage.totalHeight + sectionHeight + SECTION_SPACING > USABLE_HEIGHT && currentPage.sections.length > 0) {
        // Start new page
        pages.push(currentPage);
        currentPage = {
          pageNumber: pages.length + 1,
          sections: [],
          totalHeight: 20,
          hasHeader: false
        };
      }
      
      currentPage.sections.push({
        sectionId,
        estimatedHeight: sectionHeight,
        canSplit: false
      });
      currentPage.totalHeight += sectionHeight + SECTION_SPACING;
    }
  });
  
  // Add the last page
  if (currentPage.sections.length > 0) {
    pages.push(currentPage);
  }
  
  return pages;
};

const getSectionHeight = (
  sectionId: string,
  data: ResumeData,
  measurements: Map<string, { height: number; canSplit: boolean }>
): number => {
  const measured = measurements.get(sectionId);
  if (measured) return measured.height;
  
  // Enhanced estimation with better accuracy
  const baseHeight = 60; // Title + spacing
  
  switch (sectionId) {
    case 'personalStatement':
    case 'summary':
      const textLength = (sectionId === 'personalStatement' ? data.personalStatement : data.summary)?.length || 0;
      return baseHeight + Math.max(60, Math.ceil(textLength / 80) * 20);
    case 'experience':
      return baseHeight + (data.experience?.length || 0) * 140;
    case 'projects':
      return baseHeight + (data.projects?.reduce((acc, proj) => {
        const descLength = proj.description?.length || 0;
        return acc + 80 + Math.ceil(descLength / 100) * 20;
      }, 0) || 0);
    case 'education':
      return baseHeight + (data.education?.length || 0) * 90;
    case 'skills':
      return baseHeight + 80;
    case 'achievements':
      return baseHeight + (data.achievements?.length || 0) * 50;
    case 'certifications':
      return baseHeight + (data.certifications?.length || 0) * 70;
    case 'languages':
      return baseHeight + Math.ceil((data.languages?.length || 0) / 2) * 30;
    case 'volunteerExperience':
      return baseHeight + (data.volunteerExperience?.reduce((acc, vol) => {
        const descLength = vol.description?.length || 0;
        return acc + 80 + Math.ceil(descLength / 100) * 20;
      }, 0) || 0);
    case 'publications':
      return baseHeight + (data.publications?.length || 0) * 90;
    case 'references':
      return baseHeight + (data.references?.length || 0) * 140;
    case 'interests':
      return baseHeight + 70;
    default:
      return baseHeight;
  }
};

const getSectionData = (sectionId: string, data: ResumeData) => {
  switch (sectionId) {
    case 'experience':
      return { items: data.experience?.map((_, i) => i.toString()) || [] };
    case 'projects':
      return { items: data.projects?.map((_, i) => i.toString()) || [] };
    case 'education':
      return { items: data.education?.map((_, i) => i.toString()) || [] };
    case 'volunteerExperience':
      return { items: data.volunteerExperience?.map((_, i) => i.toString()) || [] };
    case 'achievements':
      return { items: data.achievements?.map((_, i) => i.toString()) || [] };
    case 'certifications':
      return { items: data.certifications?.map((_, i) => i.toString()) || [] };
    case 'publications':
      return { items: data.publications?.map((_, i) => i.toString()) || [] };
    case 'references':
      return { items: data.references?.map((_, i) => i.toString()) || [] };
    default:
      return { items: [] };
  }
};

const canSplitSectionItems = (sectionId: string, sectionData: any): boolean => {
  return ['experience', 'projects', 'education', 'volunteerExperience', 'achievements', 'certifications', 'publications', 'references'].includes(sectionId) && 
         sectionData.items && sectionData.items.length > 1;
};
