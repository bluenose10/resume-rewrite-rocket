import React, { useRef, useEffect, useState } from 'react';
import { ResumeData, ColorTheme } from '@/types/resume';
import PersonalInfoHeader from './PersonalInfoHeader';
import SectionRenderer from './SectionRenderer';
import { DEFAULT_THEMES } from '@/constants/themes';

interface MultiPageResumePreviewProps {
  data: ResumeData;
}

interface PageContent {
  sections: string[];
  height: number;
}

const MultiPageResumePreview: React.FC<MultiPageResumePreviewProps> = ({ data }) => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const measureRef = useRef<HTMLDivElement>(null);
  const theme = data.theme || DEFAULT_THEMES[0];

  // A4 dimensions at 96 DPI: 794px × 1123px
  const PAGE_WIDTH = 794;
  const PAGE_HEIGHT = 1123;
  const PAGE_MARGIN = 40;
  const CONTENT_HEIGHT = PAGE_HEIGHT - (PAGE_MARGIN * 2);

  const visibleSections = data.sectionConfig?.filter(section => section.visible) || [];

  useEffect(() => {
    if (!measureRef.current) return;

    const calculatePages = () => {
      const newPages: PageContent[] = [];
      let currentPage: PageContent = { sections: [], height: 0 };

      // Always start with personal info header
      const headerHeight = 120; // Estimated header height
      currentPage.height += headerHeight;

      visibleSections.forEach((sectionConfig) => {
        const sectionId = sectionConfig.id;
        
        // Skip if section has no content
        if (!hasSectionContent(sectionId, data)) return;

        // Create a temporary element to measure section height
        const tempDiv = document.createElement('div');
        tempDiv.style.width = `${PAGE_WIDTH - (PAGE_MARGIN * 2)}px`;
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.top = '-9999px';
        
        // Render section content to measure
        const sectionElement = document.createElement('div');
        sectionElement.className = 'space-y-3';
        tempDiv.appendChild(sectionElement);
        document.body.appendChild(tempDiv);

        // Estimate section height (this is a simplified calculation)
        const estimatedHeight = estimateSectionHeight(sectionId, data);
        
        document.body.removeChild(tempDiv);

        // Check if section fits on current page
        if (currentPage.height + estimatedHeight > CONTENT_HEIGHT && currentPage.sections.length > 0) {
          // Start new page
          newPages.push(currentPage);
          currentPage = { sections: [sectionId], height: estimatedHeight };
        } else {
          // Add to current page
          currentPage.sections.push(sectionId);
          currentPage.height += estimatedHeight;
        }
      });

      // Add the last page if it has content
      if (currentPage.sections.length > 0) {
        newPages.push(currentPage);
      }

      // Ensure at least one page
      if (newPages.length === 0) {
        newPages.push({ sections: [], height: 0 });
      }

      setPages(newPages);
    };

    calculatePages();
  }, [data, visibleSections]);

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

  const estimateSectionHeight = (sectionId: string, data: ResumeData): number => {
    // Rough height estimates for different sections
    const baseHeight = 60; // Section title + spacing
    
    switch (sectionId) {
      case 'personalStatement':
      case 'summary':
        return baseHeight + Math.ceil((data[sectionId]?.length || 0) / 100) * 20;
      case 'experience':
        return baseHeight + data.experience.length * 120;
      case 'education':
        return baseHeight + data.education.length * 80;
      case 'projects':
        return baseHeight + data.projects.length * 100;
      case 'skills':
        return baseHeight + Math.ceil(data.skills.length / 6) * 30;
      case 'achievements':
        return baseHeight + data.achievements.length * 70;
      case 'certifications':
        return baseHeight + data.certifications.length * 60;
      case 'languages':
        return baseHeight + Math.ceil(data.languages.length / 2) * 30;
      case 'volunteerExperience':
        return baseHeight + data.volunteerExperience.length * 100;
      case 'publications':
        return baseHeight + data.publications.length * 80;
      case 'references':
        return baseHeight + data.references.length * 80;
      case 'interests':
        return baseHeight + Math.ceil(data.interests.length / 8) * 25;
      default:
        return baseHeight;
    }
  };

  return (
    <div className="space-y-8">
      <div ref={measureRef} className="space-y-8">
        {pages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            className="relative bg-white shadow-lg border border-gray-200 mx-auto"
            style={{
              width: `${PAGE_WIDTH}px`,
              minHeight: `${PAGE_HEIGHT}px`,
              padding: `${PAGE_MARGIN}px`,
            }}
          >
            {/* Page content */}
            <div className="space-y-6">
              {/* Personal info header on first page */}
              {pageIndex === 0 && (
                <PersonalInfoHeader personalInfo={data.personalInfo} theme={theme} />
              )}

              {/* Page sections */}
              <div className="space-y-4">
                {page.sections.map((sectionId) => (
                  <SectionRenderer
                    key={sectionId}
                    sectionId={sectionId}
                    data={data}
                    theme={theme}
                  />
                ))}
              </div>
            </div>

            {/* Page number */}
            <div 
              className="absolute bottom-4 right-4 text-xs text-gray-400"
              style={{ color: theme.text }}
            >
              Page {pageIndex + 1} of {pages.length}
            </div>
          </div>
        ))}
      </div>

      {pages.length === 0 && (
        <div
          className="bg-white shadow-lg border border-gray-200 mx-auto flex items-center justify-center text-gray-500"
          style={{
            width: `${PAGE_WIDTH}px`,
            height: `${PAGE_HEIGHT}px`,
          }}
        >
          <div className="text-center">
            <p className="text-lg">Start adding content to see your resume preview</p>
            <p className="text-sm mt-2">Fill in the form on the left to begin</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiPageResumePreview;
