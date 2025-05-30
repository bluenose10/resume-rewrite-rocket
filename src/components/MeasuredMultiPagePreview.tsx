
import React, { useRef, useEffect, useState } from 'react';
import { ResumeData, ColorTheme } from '@/types/resume';
import PersonalInfoHeader from './PersonalInfoHeader';
import SectionRenderer from './SectionRenderer';
import { DEFAULT_THEMES } from '@/constants/themes';
import { 
  PAGE_HEIGHT, 
  PAGE_MARGIN, 
  CONTENT_HEIGHT 
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
      
      const measuringContainer = measuringRef.current!;
      
      // Clear and setup measuring container
      measuringContainer.innerHTML = '';
      measuringContainer.style.position = 'absolute';
      measuringContainer.style.left = '-9999px';
      measuringContainer.style.width = `794px`; // A4 width
      measuringContainer.style.visibility = 'hidden';
      measuringContainer.style.display = 'block';

      // Create a temporary React root for measuring
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(measuringContainer);

      // Render all content for measurement
      const MeasuringContent = () => (
        <div className="space-y-6" style={{ padding: `${PAGE_MARGIN}px` }}>
          <div ref={(el) => el && el.setAttribute('data-section', 'header')}>
            <PersonalInfoHeader personalInfo={data.personalInfo} theme={theme} />
          </div>
          {visibleSections.map((sectionConfig) => {
            if (hasSectionContent(sectionConfig.id, data)) {
              return (
                <div key={sectionConfig.id} ref={(el) => el && el.setAttribute('data-section', sectionConfig.id)}>
                  <SectionRenderer sectionId={sectionConfig.id} data={data} theme={theme} />
                </div>
              );
            }
            return null;
          })}
        </div>
      );

      root.render(<MeasuringContent />);

      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // Measure the rendered content
      const headerElement = measuringContainer.querySelector('[data-section="header"]') as HTMLElement;
      const sectionElements = Array.from(measuringContainer.querySelectorAll('[data-section]')).filter(
        el => el.getAttribute('data-section') !== 'header'
      ) as HTMLElement[];

      const headerHeight = headerElement ? headerElement.getBoundingClientRect().height : 0;
      console.log(`Header height: ${headerHeight}px`);

      const sectionMeasurements = sectionElements.map(el => ({
        id: el.getAttribute('data-section')!,
        element: el,
        height: el.getBoundingClientRect().height
      }));

      console.log('Section measurements:', sectionMeasurements.map(s => ({ id: s.id, height: s.height })));

      // Create pages based on measurements
      const newPages: React.ReactNode[] = [];
      let currentPageContent: React.ReactNode[] = [];
      let currentPageHeight = 0;
      let pageNumber = 0;

      // Add header to first page
      currentPageContent.push(
        <PersonalInfoHeader key="header" personalInfo={data.personalInfo} theme={theme} />
      );
      currentPageHeight += headerHeight;

      // Process each section
      for (const measurement of sectionMeasurements) {
        console.log(`Processing section ${measurement.id} (${measurement.height}px)`);

        // Check if section fits on current page
        if (currentPageHeight + measurement.height > CONTENT_HEIGHT && currentPageContent.length > 1) {
          // Create current page and start new one
          console.log(`Creating page ${pageNumber + 1} with ${currentPageContent.length} items`);
          newPages.push(createPage(currentPageContent, pageNumber, theme));
          pageNumber++;
          currentPageContent = [];
          currentPageHeight = 0;
        }

        // Add section to current page
        currentPageContent.push(
          <SectionRenderer key={measurement.id} sectionId={measurement.id} data={data} theme={theme} />
        );
        currentPageHeight += measurement.height;
      }

      // Add the last page if it has content
      if (currentPageContent.length > 0) {
        console.log(`Creating final page ${pageNumber + 1} with ${currentPageContent.length} items`);
        newPages.push(createPage(currentPageContent, pageNumber, theme));
      }

      // Ensure at least one page exists
      if (newPages.length === 0) {
        newPages.push(createEmptyPage(theme));
      }

      console.log(`Created ${newPages.length} total pages`);
      setPages(newPages);

      // Clean up
      root.unmount();
      measuringContainer.style.position = '';
      measuringContainer.style.left = '';
      measuringContainer.style.visibility = '';
      measuringContainer.style.display = '';
    };

    createMeasuredPages();
  }, [data, visibleSections, theme]);

  const createPage = (content: React.ReactNode[], pageIndex: number, theme: ColorTheme) => (
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

  const createEmptyPage = (theme: ColorTheme) => (
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
