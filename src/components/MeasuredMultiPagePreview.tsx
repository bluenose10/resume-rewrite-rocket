
import React, { useRef, useEffect, useState } from 'react';
import { ResumeData, ColorTheme } from '@/types/resume';
import PersonalInfoHeader from './PersonalInfoHeader';
import SectionRenderer from './SectionRenderer';
import { DEFAULT_THEMES } from '@/constants/themes';
import { 
  PAGE_HEIGHT, 
  PAGE_MARGIN, 
  CONTENT_HEIGHT, 
  measureElement, 
  canSectionSplit,
  splitLongSection 
} from '@/utils/pageBreakUtils';

interface MeasuredMultiPagePreviewProps {
  data: ResumeData;
}

const MeasuredMultiPagePreview: React.FC<MeasuredMultiPagePreviewProps> = ({ data }) => {
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const measuringRef = useRef<HTMLDivElement>(null);
  const theme = data.theme || DEFAULT_THEMES[0];

  const visibleSections = data.sectionConfig?.filter(section => section.visible) || [];

  useEffect(() => {
    if (!measuringRef.current) return;

    const createMeasuredPages = async () => {
      console.log('Starting measured page creation...');
      
      // First, render all content in a hidden measuring container
      const measuringContainer = measuringRef.current!;
      measuringContainer.innerHTML = '';
      measuringContainer.style.position = 'absolute';
      measuringContainer.style.left = '-9999px';
      measuringContainer.style.width = `${794}px`; // A4 width
      measuringContainer.style.visibility = 'hidden';

      // Create header
      const headerContainer = document.createElement('div');
      headerContainer.className = 'header-container';
      measuringContainer.appendChild(headerContainer);

      // Create section containers
      const sectionContainers: { id: string; element: HTMLElement }[] = [];
      
      visibleSections.forEach((sectionConfig) => {
        if (hasSectionContent(sectionConfig.id, data)) {
          const sectionContainer = document.createElement('div');
          sectionContainer.className = `section-container section-${sectionConfig.id}`;
          sectionContainer.setAttribute('data-section-id', sectionConfig.id);
          measuringContainer.appendChild(sectionContainer);
          sectionContainers.push({ id: sectionConfig.id, element: sectionContainer });
        }
      });

      // Force a render cycle to get measurements
      await new Promise(resolve => setTimeout(resolve, 100));

      // Measure header
      const headerHeight = measureElement(headerContainer);
      console.log(`Header height: ${headerHeight}px`);

      // Measure sections
      const measuredSections = sectionContainers.map(({ id, element }) => ({
        id,
        element,
        height: measureElement(element),
        canSplit: canSectionSplit(id)
      }));

      console.log('Measured sections:', measuredSections.map(s => ({ id: s.id, height: s.height })));

      // Now create pages based on measurements
      const newPages: React.ReactNode[] = [];
      let currentPageContent: React.ReactNode[] = [];
      let currentPageHeight = 0;
      let pageNumber = 0;

      // Add header to first page
      currentPageContent.push(
        <PersonalInfoHeader key="header" personalInfo={data.personalInfo} theme={theme} />
      );
      currentPageHeight += headerHeight;

      // Process each measured section
      for (const section of measuredSections) {
        console.log(`Processing section ${section.id} (${section.height}px)`);

        // Check if section fits on current page
        if (currentPageHeight + section.height > CONTENT_HEIGHT && currentPageContent.length > 1) {
          // Create current page and start new one
          console.log(`Creating page ${pageNumber + 1} with ${currentPageContent.length} items`);
          newPages.push(createPage(currentPageContent, pageNumber));
          pageNumber++;
          currentPageContent = [];
          currentPageHeight = 0;
        }

        // If section is too tall for a page and can be split
        if (section.height > CONTENT_HEIGHT && section.canSplit) {
          const availableHeight = CONTENT_HEIGHT - currentPageHeight;
          const splitResult = splitLongSection(section.element, section.id, availableHeight);
          
          if (splitResult) {
            // Add first part to current page
            currentPageContent.push(
              <div key={`${section.id}-part1`} dangerouslySetInnerHTML={{ __html: splitResult.firstPart.innerHTML }} />
            );
            
            // Create page and start new one with remaining content
            newPages.push(createPage(currentPageContent, pageNumber));
            pageNumber++;
            currentPageContent = [
              <div key={`${section.id}-part2`} dangerouslySetInnerHTML={{ __html: splitResult.remainingPart.innerHTML }} />
            ];
            currentPageHeight = measureElement(splitResult.remainingPart);
          } else {
            // Can't split, add whole section
            currentPageContent.push(
              <SectionRenderer key={section.id} sectionId={section.id} data={data} theme={theme} />
            );
            currentPageHeight += section.height;
          }
        } else {
          // Add section to current page
          currentPageContent.push(
            <SectionRenderer key={section.id} sectionId={section.id} data={data} theme={theme} />
          );
          currentPageHeight += section.height;
        }
      }

      // Add the last page if it has content
      if (currentPageContent.length > 0) {
        console.log(`Creating final page ${pageNumber + 1} with ${currentPageContent.length} items`);
        newPages.push(createPage(currentPageContent, pageNumber));
      }

      // Ensure at least one page exists
      if (newPages.length === 0) {
        newPages.push(createEmptyPage());
      }

      console.log(`Created ${newPages.length} total pages`);
      setPages(newPages);

      // Clean up measuring container
      measuringContainer.style.position = '';
      measuringContainer.style.left = '';
      measuringContainer.style.visibility = '';
      measuringContainer.innerHTML = '';
    };

    createMeasuredPages();
  }, [data, visibleSections, theme]);

  const createPage = (content: React.ReactNode[], pageIndex: number) => (
    <div
      key={pageIndex}
      className="resume-page relative bg-white shadow-lg border border-gray-200 mx-auto"
      style={{
        width: `794px`,
        minHeight: `${PAGE_HEIGHT}px`,
        padding: `${PAGE_MARGIN}px`,
        pageBreakAfter: 'always'
      }}
    >
      <div className="space-y-6">
        {content}
      </div>
      
      {/* Page number */}
      <div 
        className="absolute bottom-4 right-4 text-xs text-gray-400"
        style={{ color: theme.text }}
      >
        Page {pageIndex + 1}
      </div>
    </div>
  );

  const createEmptyPage = () => (
    <div
      key="empty"
      className="resume-page bg-white shadow-lg border border-gray-200 mx-auto flex items-center justify-center text-gray-500"
      style={{
        width: `794px`,
        height: `${PAGE_HEIGHT}px`,
      }}
    >
      <div className="text-center">
        <p className="text-lg">Start adding content to see your resume preview</p>
        <p className="text-sm mt-2">Fill in the form on the left to begin</p>
      </div>
    </div>
  );

  const hasSectionContent = (sectionId: string, data: ResumeData): boolean => {
    switch (sectionId) {
      case 'personalStatement':
        return !!data.personalStatement?.trim();
      case 'summary':
        return !!data.summary?.trim();
      case 'experience':
        return data.experience.length > 0;
      case 'education':
        return data.education.length > 0;
      case 'projects':
        return data.projects.length > 0;
      case 'skills':
        return data.skills.length > 0;
      case 'achievements':
        return data.achievements.length > 0;
      case 'certifications':
        return data.certifications.length > 0;
      case 'languages':
        return data.languages.length > 0;
      case 'volunteerExperience':
        return data.volunteerExperience.length > 0;
      case 'publications':
        return data.publications.length > 0;
      case 'references':
        return data.references.length > 0;
      case 'interests':
        return data.interests.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hidden measuring container */}
      <div ref={measuringRef} className="sr-only" />
      
      {/* Actual pages */}
      {pages}
    </div>
  );
};

export default MeasuredMultiPagePreview;
