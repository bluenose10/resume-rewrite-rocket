
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
const SAFETY_MARGIN = 100; // Increased safety margin
const USABLE_HEIGHT = A4_HEIGHT_PX - (PAGE_PADDING * 2) - SAFETY_MARGIN;

export const calculateOptimalPageBreaks = (
  data: ResumeData,
  visibleSections: string[]
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
  const baseHeight = 100; // Increased base height for title + spacing
  
  switch (sectionId) {
    case 'personalStatement':
      // Estimate based on text length
      const statementLength = data.personalStatement?.length || 0;
      return baseHeight + Math.max(120, Math.ceil(statementLength / 100) * 40);
    case 'summary':
      const summaryLength = data.summary?.length || 0;
      return baseHeight + Math.max(120, Math.ceil(summaryLength / 100) * 40);
    case 'experience':
      // More generous estimates for experience items
      const expItems = data.experience?.length || 0;
      const avgExpHeight = expItems > 0 ? 180 : 0; // Increased from 160
      return baseHeight + (expItems * avgExpHeight);
    case 'projects':
      const projItems = data.projects?.length || 0;
      const avgProjHeight = projItems > 0 ? 200 : 0; // Increased from 180
      return baseHeight + (projItems * avgProjHeight);
    case 'education':
      const eduItems = data.education?.length || 0;
      const avgEduHeight = eduItems > 0 ? 140 : 0; // Increased from 120
      return baseHeight + (eduItems * avgEduHeight);
    case 'skills':
      // Estimate based on number of skills
      const skillsCount = data.skills?.length || 0;
      return baseHeight + Math.max(100, Math.ceil(skillsCount / 10) * 60);
    case 'achievements':
      const achItems = data.achievements?.length || 0;
      const avgAchHeight = achItems > 0 ? 80 : 0; // Increased from 60
      return baseHeight + (achItems * avgAchHeight);
    case 'certifications':
      const certItems = data.certifications?.length || 0;
      const avgCertHeight = certItems > 0 ? 100 : 0; // Increased from 80
      return baseHeight + (certItems * avgCertHeight);
    case 'languages':
      const langItems = data.languages?.length || 0;
      return baseHeight + Math.max(100, langItems * 40);
    case 'volunteerExperience':
      const volItems = data.volunteerExperience?.length || 0;
      const avgVolHeight = volItems > 0 ? 160 : 0; // Increased from 140
      return baseHeight + (volItems * avgVolHeight);
    case 'publications':
      const pubItems = data.publications?.length || 0;
      const avgPubHeight = pubItems > 0 ? 120 : 0; // Increased from 100
      return baseHeight + (pubItems * avgPubHeight);
    case 'references':
      const refItems = data.references?.length || 0;
      const avgRefHeight = refItems > 0 ? 180 : 0; // Increased from 160
      return baseHeight + (refItems * avgRefHeight);
    case 'interests':
      const interestItems = data.interests?.length || 0;
      return baseHeight + Math.max(100, Math.ceil(interestItems / 5) * 60);
    default:
      return baseHeight + 60; // Default generous estimate
  }
};
