
import { ResumeData } from '@/types/resume';

interface SectionMeasurement {
  sectionId: string;
  height: number;
  items?: Array<{ id: string; height: number }>;
  canSplit: boolean;
}

interface PageSection {
  sectionId: string;
  items?: string[];
  height: number;
  isPartial?: boolean;
  startIndex?: number;
  endIndex?: number;
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
const SECTION_SPACING = 24;
const SAFETY_MARGIN = 50; // Extra space to prevent overflow
const USABLE_HEIGHT = A4_HEIGHT_PX - (PAGE_PADDING * 2) - SAFETY_MARGIN;

export const calculateSmartPageBreaks = (
  data: ResumeData,
  visibleSections: string[],
  measurements: Map<string, SectionMeasurement>
): PageLayout[] => {
  const pages: PageLayout[] = [];
  let currentPage: PageLayout = {
    pageNumber: 1,
    sections: [],
    totalHeight: HEADER_HEIGHT + SECTION_SPACING,
    hasHeader: true
  };

  for (const sectionId of visibleSections) {
    const measurement = measurements.get(sectionId);
    if (!measurement) continue;

    const sectionWithSpacing = measurement.height + SECTION_SPACING;
    
    // Check if section fits on current page
    if (currentPage.totalHeight + sectionWithSpacing <= USABLE_HEIGHT) {
      // Section fits completely
      currentPage.sections.push({
        sectionId,
        height: measurement.height
      });
      currentPage.totalHeight += sectionWithSpacing;
    } else {
      // Section doesn't fit - need to handle splitting or move to next page
      if (measurement.canSplit && measurement.items) {
        // Try to split the section
        const splitResult = splitSectionAcrossPages(
          measurement,
          currentPage,
          data,
          pages.length + 1
        );
        
        if (splitResult.currentPageSection) {
          currentPage.sections.push(splitResult.currentPageSection);
          currentPage.totalHeight += splitResult.currentPageSection.height + SECTION_SPACING;
        }
        
        // Start new page if needed
        if (splitResult.nextPageSection) {
          pages.push(currentPage);
          currentPage = {
            pageNumber: pages.length + 1,
            sections: [splitResult.nextPageSection],
            totalHeight: SECTION_SPACING + splitResult.nextPageSection.height + SECTION_SPACING,
            hasHeader: false
          };
        }
      } else {
        // Cannot split - move entire section to next page
        if (currentPage.sections.length > 0) {
          pages.push(currentPage);
          currentPage = {
            pageNumber: pages.length + 1,
            sections: [],
            totalHeight: SECTION_SPACING,
            hasHeader: false
          };
        }
        
        // Add section to new page
        currentPage.sections.push({
          sectionId,
          height: measurement.height
        });
        currentPage.totalHeight += sectionWithSpacing;
      }
    }
  }
  
  if (currentPage.sections.length > 0) {
    pages.push(currentPage);
  }
  
  return pages;
};

const splitSectionAcrossPages = (
  measurement: SectionMeasurement,
  currentPage: PageLayout,
  data: ResumeData,
  nextPageNumber: number
): {
  currentPageSection?: PageSection;
  nextPageSection?: PageSection;
} => {
  if (!measurement.items || measurement.items.length <= 1) {
    return { nextPageSection: { sectionId: measurement.sectionId, height: measurement.height } };
  }

  const availableHeight = USABLE_HEIGHT - currentPage.totalHeight - SECTION_SPACING;
  const sectionHeaderHeight = 60; // Approximate height of section title + line
  
  if (availableHeight < sectionHeaderHeight + 100) {
    // Not enough space even for header + one item
    return { nextPageSection: { sectionId: measurement.sectionId, height: measurement.height } };
  }

  // Calculate how many items can fit on current page
  let itemsOnCurrentPage = 0;
  let heightOnCurrentPage = sectionHeaderHeight;
  
  for (const item of measurement.items) {
    if (heightOnCurrentPage + item.height <= availableHeight) {
      heightOnCurrentPage += item.height;
      itemsOnCurrentPage++;
    } else {
      break;
    }
  }

  if (itemsOnCurrentPage === 0) {
    // No items fit, move entire section to next page
    return { nextPageSection: { sectionId: measurement.sectionId, height: measurement.height } };
  }

  if (itemsOnCurrentPage === measurement.items.length) {
    // All items fit on current page
    return { currentPageSection: { sectionId: measurement.sectionId, height: measurement.height } };
  }

  // Split section
  const itemIds = getSectionItemIds(measurement.sectionId, data);
  const currentPageItems = itemIds.slice(0, itemsOnCurrentPage);
  const nextPageItems = itemIds.slice(itemsOnCurrentPage);
  
  const remainingHeight = measurement.height - heightOnCurrentPage + sectionHeaderHeight;

  return {
    currentPageSection: {
      sectionId: measurement.sectionId,
      items: currentPageItems,
      height: heightOnCurrentPage,
      isPartial: true,
      startIndex: 0,
      endIndex: itemsOnCurrentPage - 1
    },
    nextPageSection: {
      sectionId: measurement.sectionId,
      items: nextPageItems,
      height: remainingHeight,
      isPartial: true,
      startIndex: itemsOnCurrentPage,
      endIndex: itemIds.length - 1
    }
  };
};

const getSectionItemIds = (sectionId: string, data: ResumeData): string[] => {
  switch (sectionId) {
    case 'experience':
      return data.experience?.map(exp => exp.id) || [];
    case 'projects':
      return data.projects?.map(project => project.id) || [];
    case 'education':
      return data.education?.map(edu => edu.id) || [];
    case 'achievements':
      return data.achievements?.map(achievement => achievement.id) || [];
    case 'certifications':
      return data.certifications?.map(cert => cert.id) || [];
    case 'volunteerExperience':
      return data.volunteerExperience?.map(vol => vol.id) || [];
    case 'publications':
      return data.publications?.map(pub => pub.id) || [];
    case 'references':
      return data.references?.map(ref => ref.id) || [];
    default:
      return [];
  }
};
