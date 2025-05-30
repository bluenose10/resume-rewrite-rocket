
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResumeData } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';
import PersonalInfoHeader from './PersonalInfoHeader';
import SectionRenderer from './SectionRenderer';

interface MultiPageResumePreviewProps {
  data: ResumeData;
}

interface PageContent {
  pageNumber: number;
  sections: string[];
  height: number;
}

const MultiPageResumePreview: React.FC<MultiPageResumePreviewProps> = ({ data }) => {
  const theme = data.theme || DEFAULT_THEMES[0];
  const [pages, setPages] = useState<PageContent[]>([]);
  const A4_HEIGHT_PX = 1123; // A4 height in pixels at 96 DPI
  const PAGE_PADDING = 40; // Padding for each page
  const USABLE_HEIGHT = A4_HEIGHT_PX - (PAGE_PADDING * 2);

  const isVisible = (sectionId: string) => {
    const sectionConfig = data.sectionConfig?.find(s => s.id === sectionId);
    return sectionConfig?.visible !== false;
  };

  const hasContent = (sectionId: string) => {
    switch (sectionId) {
      case 'personalStatement': return !!data.personalStatement;
      case 'summary': return !!data.summary;
      case 'experience': return data.experience?.length > 0;
      case 'projects': return data.projects?.length > 0;
      case 'education': return data.education?.length > 0;
      case 'skills': return data.skills?.length > 0;
      case 'achievements': return data.achievements?.length > 0;
      case 'certifications': return data.certifications?.length > 0;
      case 'languages': return data.languages?.length > 0;
      case 'volunteerExperience': return data.volunteerExperience?.length > 0;
      case 'publications': return data.publications?.length > 0;
      case 'references': return data.references?.length > 0;
      case 'interests': return data.interests?.length > 0;
      default: return false;
    }
  };

  const getSectionOrder = () => {
    if (data.sectionOrder && data.sectionConfig) {
      return data.sectionOrder;
    }
    return [
      'personalStatement', 'summary', 'experience', 'projects', 'education',
      'skills', 'achievements', 'certifications', 'languages',
      'volunteerExperience', 'publications', 'references', 'interests'
    ];
  };

  const getVisibleSections = () => {
    return getSectionOrder().filter(sectionId => 
      isVisible(sectionId) && hasContent(sectionId)
    );
  };

  useEffect(() => {
    const calculatePages = () => {
      const sections = getVisibleSections();
      const newPages: PageContent[] = [];
      let currentPage: PageContent = { pageNumber: 1, sections: [], height: 180 }; // Start with header height
      
      // Add header to first page
      sections.forEach((sectionId, index) => {
        const estimatedSectionHeight = estimateSectionHeight(sectionId);
        
        // Check if section fits on current page (with some buffer)
        if (currentPage.height + estimatedSectionHeight + 50 > USABLE_HEIGHT && currentPage.sections.length > 0) {
          // Start new page
          newPages.push(currentPage);
          currentPage = { 
            pageNumber: newPages.length + 1, 
            sections: [sectionId], 
            height: estimatedSectionHeight + 20 
          };
        } else {
          // Add to current page
          currentPage.sections.push(sectionId);
          currentPage.height += estimatedSectionHeight + 20;
        }
      });
      
      // Add the last page if it has content
      if (currentPage.sections.length > 0) {
        newPages.push(currentPage);
      }
      
      setPages(newPages);
    };

    calculatePages();
  }, [data]);

  const estimateSectionHeight = (sectionId: string): number => {
    // Estimate section heights based on content
    const baseHeight = 80; // Title + spacing
    
    switch (sectionId) {
      case 'personalStatement':
      case 'summary':
        return baseHeight + 60; // Text content
      case 'experience':
        return baseHeight + (data.experience?.length || 0) * 120;
      case 'projects':
        return baseHeight + (data.projects?.length || 0) * 100;
      case 'education':
        return baseHeight + (data.education?.length || 0) * 80;
      case 'skills':
        return baseHeight + 60;
      case 'achievements':
        return baseHeight + (data.achievements?.length || 0) * 40;
      case 'certifications':
        return baseHeight + (data.certifications?.length || 0) * 60;
      case 'languages':
        return baseHeight + (data.languages?.length || 0) * 30;
      case 'volunteerExperience':
        return baseHeight + (data.volunteerExperience?.length || 0) * 100;
      case 'publications':
        return baseHeight + (data.publications?.length || 0) * 80;
      case 'references':
        return baseHeight + (data.references?.length || 0) * 120;
      case 'interests':
        return baseHeight + 60;
      default:
        return baseHeight;
    }
  };

  if (pages.length === 0) {
    return <div className="text-center py-8">Loading preview...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page counter */}
      <div className="text-center text-sm text-gray-600 mb-4">
        Showing {pages.length} page{pages.length > 1 ? 's' : ''}
      </div>
      
      {/* Render each page */}
      <div className="space-y-8">
        {pages.map((page, pageIndex) => (
          <Card key={page.pageNumber} className="shadow-lg border border-gray-200 bg-white relative">
            <CardContent className="p-0">
              {/* Page number indicator */}
              <div className="absolute -top-6 right-0 text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                Page {page.pageNumber} of {pages.length}
              </div>
              
              {/* A4-sized page container */}
              <div 
                className="bg-white text-gray-900 mx-auto relative"
                style={{ 
                  width: '794px', 
                  minHeight: `${A4_HEIGHT_PX}px`,
                  maxWidth: '100%'
                }}
              >
                {/* Header only on first page */}
                {pageIndex === 0 && (
                  <PersonalInfoHeader personalInfo={data.personalInfo} theme={theme} />
                )}
                
                {/* Page content */}
                <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                  {page.sections.map((sectionId) => (
                    <div key={sectionId} className="resume-section">
                      <SectionRenderer sectionId={sectionId} data={data} theme={theme} />
                    </div>
                  ))}
                </div>
                
                {/* Page break line (except for last page) */}
                {pageIndex < pages.length - 1 && (
                  <div className="absolute bottom-0 left-0 right-0 border-b-2 border-dashed border-blue-300"></div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MultiPageResumePreview;
