
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
  const { measurements } = useContentMeasurement();
  const A4_HEIGHT_PX = 1123;

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

  if (pages.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">Loading resume preview...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-gray-600 mb-4">
        Showing {pages.length} page{pages.length > 1 ? 's' : ''}
      </div>
      
      <div className="space-y-8">
        {pages.map((page, pageIndex) => (
          <Card key={page.pageNumber} className="shadow-lg border border-gray-200 bg-white relative">
            <CardContent className="p-0">
              <div className="absolute -top-6 right-0 text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                Page {page.pageNumber} of {pages.length}
              </div>
              
              <div 
                className="bg-white text-gray-900 mx-auto relative resume-page"
                style={{ 
                  width: '794px', 
                  minHeight: `${A4_HEIGHT_PX}px`,
                  maxWidth: '100%'
                }}
              >
                {page.hasHeader && (
                  <PersonalInfoHeader personalInfo={data.personalInfo} theme={theme} />
                )}
                
                <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                  {page.sections.map((sectionData, sectionIndex) => (
                    <div 
                      key={`${sectionData.sectionId}-${sectionIndex}`} 
                      className="resume-section"
                    >
                      <SectionRenderer sectionId={sectionData.sectionId} data={data} theme={theme} />
                    </div>
                  ))}
                </div>
                
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
