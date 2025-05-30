
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResumeData } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';
import PersonalInfoHeader from './PersonalInfoHeader';
import SectionRenderer from './SectionRenderer';
import { calculateOptimalPageBreaks } from '@/utils/pageBreakCalculator';
import { useContentMeasurement } from '@/hooks/useContentMeasurement';

interface MultiPageResumePreviewProps {
  data: ResumeData;
}

interface PageContent {
  pageNumber: number;
  sections: Array<{
    sectionId: string;
    items?: string[];
    estimatedHeight: number;
    canSplit: boolean;
  }>;
  totalHeight: number;
  hasHeader: boolean;
}

const MultiPageResumePreview: React.FC<MultiPageResumePreviewProps> = ({ data }) => {
  const theme = data.theme || DEFAULT_THEMES[0];
  const [pages, setPages] = useState<PageContent[]>([]);
  const { measureContent, measurements } = useContentMeasurement();
  const A4_HEIGHT_PX = 1123;
  const PAGE_PADDING = 40;

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
      const visibleSections = getVisibleSections();
      const pageLayouts = calculateOptimalPageBreaks(data, visibleSections, measurements);
      setPages(pageLayouts);
    };

    calculatePages();
  }, [data, measurements]);

  const renderSectionWithItems = (sectionId: string, items?: string[]) => {
    if (!items) {
      return <SectionRenderer sectionId={sectionId} data={data} theme={theme} />;
    }

    // Create filtered data for partial section rendering
    const filteredData = { ...data };
    const itemIndices = items.map(item => parseInt(item));

    switch (sectionId) {
      case 'experience':
        filteredData.experience = data.experience?.filter((_, index) => itemIndices.includes(index)) || [];
        break;
      case 'projects':
        filteredData.projects = data.projects?.filter((_, index) => itemIndices.includes(index)) || [];
        break;
      case 'education':
        filteredData.education = data.education?.filter((_, index) => itemIndices.includes(index)) || [];
        break;
      case 'volunteerExperience':
        filteredData.volunteerExperience = data.volunteerExperience?.filter((_, index) => itemIndices.includes(index)) || [];
        break;
      case 'achievements':
        filteredData.achievements = data.achievements?.filter((_, index) => itemIndices.includes(index)) || [];
        break;
      case 'certifications':
        filteredData.certifications = data.certifications?.filter((_, index) => itemIndices.includes(index)) || [];
        break;
      case 'publications':
        filteredData.publications = data.publications?.filter((_, index) => itemIndices.includes(index)) || [];
        break;
      case 'references':
        filteredData.references = data.references?.filter((_, index) => itemIndices.includes(index)) || [];
        break;
    }

    return <SectionRenderer sectionId={sectionId} data={filteredData} theme={theme} />;
  };

  if (pages.length === 0) {
    return <div className="text-center py-8">Calculating optimal page layout...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page counter */}
      <div className="text-center text-sm text-gray-600 mb-4">
        Showing {pages.length} page{pages.length > 1 ? 's' : ''} - Optimized for printing
      </div>
      
      {/* Render each page */}
      <div className="space-y-8">
        {pages.map((page, pageIndex) => (
          <Card key={page.pageNumber} className="shadow-lg border border-gray-200 bg-white relative page-break-after">
            <CardContent className="p-0">
              {/* Page number indicator */}
              <div className="absolute -top-6 right-0 text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                Page {page.pageNumber} of {pages.length}
              </div>
              
              {/* A4-sized page container with improved CSS */}
              <div 
                className="bg-white text-gray-900 mx-auto relative resume-page"
                style={{ 
                  width: '794px', 
                  minHeight: `${A4_HEIGHT_PX}px`,
                  maxWidth: '100%',
                  pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto',
                  pageBreakInside: 'avoid'
                }}
              >
                {/* Header only on first page */}
                {page.hasHeader && (
                  <PersonalInfoHeader personalInfo={data.personalInfo} theme={theme} />
                )}
                
                {/* Page content with better spacing */}
                <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                  {page.sections.map((sectionData, sectionIndex) => (
                    <div 
                      key={`${sectionData.sectionId}-${sectionIndex}`} 
                      className="resume-section page-break-inside-avoid"
                      style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                    >
                      {renderSectionWithItems(sectionData.sectionId, sectionData.items)}
                    </div>
                  ))}
                </div>
                
                {/* Page break indicator (except for last page) */}
                {pageIndex < pages.length - 1 && (
                  <div className="absolute bottom-0 left-0 right-0 border-b-2 border-dashed border-blue-300 no-print">
                    <div className="text-center text-xs text-blue-500 bg-white px-2 -mb-2 mx-auto w-20">
                      Page Break
                    </div>
                  </div>
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
