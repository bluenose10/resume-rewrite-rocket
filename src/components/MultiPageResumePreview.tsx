
import React, { useRef, useEffect, useState } from 'react';
import { ResumeData, ColorTheme } from '@/types/resume';
import PersonalInfoHeader from './PersonalInfoHeader';
import SectionRenderer from './SectionRenderer';
import { DEFAULT_THEMES } from '@/constants/themes';

interface MultiPageResumePreviewProps {
  data: ResumeData;
}

const MultiPageResumePreview: React.FC<MultiPageResumePreviewProps> = ({ data }) => {
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const theme = data.theme || DEFAULT_THEMES[0];

  // A4 dimensions at 96 DPI: 794px × 1123px
  const PAGE_WIDTH = 794;
  const PAGE_HEIGHT = 1123;
  const PAGE_MARGIN = 40;
  const CONTENT_HEIGHT = PAGE_HEIGHT - (PAGE_MARGIN * 2);

  const visibleSections = data.sectionConfig?.filter(section => section.visible) || [];

  useEffect(() => {
    if (!contentRef.current) return;

    const createPages = () => {
      const newPages: React.ReactNode[] = [];
      let currentPageContent: React.ReactNode[] = [];
      let currentPageHeight = 0;

      // Add header to first page
      const headerHeight = 120; // Estimated header height
      currentPageContent.push(
        <PersonalInfoHeader key="header" personalInfo={data.personalInfo} theme={theme} />
      );
      currentPageHeight += headerHeight;

      // Add each visible section
      visibleSections.forEach((sectionConfig) => {
        const sectionId = sectionConfig.id;
        
        // Skip if section has no content
        if (!hasSectionContent(sectionId, data)) return;

        // Estimate section height based on content
        const sectionHeight = estimateSectionHeight(sectionId, data);

        // Check if section fits on current page
        if (currentPageHeight + sectionHeight > CONTENT_HEIGHT && currentPageContent.length > 1) {
          // Create current page and start new one
          newPages.push(createPage(currentPageContent, newPages.length));
          currentPageContent = [];
          currentPageHeight = 0;
        }

        // Add section to current page
        currentPageContent.push(
          <SectionRenderer
            key={sectionId}
            sectionId={sectionId}
            data={data}
            theme={theme}
          />
        );
        currentPageHeight += sectionHeight;
      });

      // Add the last page if it has content
      if (currentPageContent.length > 0) {
        newPages.push(createPage(currentPageContent, newPages.length));
      }

      // Ensure at least one page exists
      if (newPages.length === 0) {
        newPages.push(createEmptyPage());
      }

      setPages(newPages);
    };

    createPages();
  }, [data, visibleSections, theme]);

  const createPage = (content: React.ReactNode[], pageIndex: number) => (
    <div
      key={pageIndex}
      className="relative bg-white shadow-lg border border-gray-200 mx-auto"
      style={{
        width: `${PAGE_WIDTH}px`,
        minHeight: `${PAGE_HEIGHT}px`,
        padding: `${PAGE_MARGIN}px`,
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

  const estimateSectionHeight = (sectionId: string, data: ResumeData): number => {
    // Simplified height estimates
    const baseHeight = 80; // Section title + spacing
    
    switch (sectionId) {
      case 'personalStatement':
      case 'summary':
        const text = data[sectionId as keyof ResumeData] as string;
        return baseHeight + Math.ceil((text?.length || 0) / 80) * 20;
      case 'experience':
        return baseHeight + data.experience.length * 100;
      case 'education':
        return baseHeight + data.education.length * 60;
      case 'projects':
        return baseHeight + data.projects.length * 80;
      case 'skills':
        return baseHeight + Math.ceil(data.skills.length / 8) * 25;
      case 'achievements':
        return baseHeight + data.achievements.length * 50;
      case 'certifications':
        return baseHeight + data.certifications.length * 50;
      case 'languages':
        return baseHeight + Math.ceil(data.languages.length / 3) * 25;
      case 'volunteerExperience':
        return baseHeight + data.volunteerExperience.length * 80;
      case 'publications':
        return baseHeight + data.publications.length * 60;
      case 'references':
        return baseHeight + data.references.length * 60;
      case 'interests':
        return baseHeight + Math.ceil(data.interests.length / 10) * 20;
      default:
        return baseHeight;
    }
  };

  return (
    <div className="space-y-8" ref={contentRef}>
      {pages}
    </div>
  );
};

export default MultiPageResumePreview;
