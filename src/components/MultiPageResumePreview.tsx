
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResumeData } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';
import PersonalInfoHeader from './PersonalInfoHeader';
import SectionRenderer from './SectionRenderer';
import { calculateSmartPageBreaks } from '@/utils/smartPageBreakCalculator';
import { useRealContentMeasurement } from '@/hooks/useRealContentMeasurement';

interface MultiPageResumePreviewProps {
  data: ResumeData;
}

interface PageContent {
  pageNumber: number;
  sections: Array<{
    sectionId: string;
    items?: string[];
    height: number;
    isPartial?: boolean;
    startIndex?: number;
    endIndex?: number;
  }>;
  totalHeight: number;
  hasHeader: boolean;
}

const MultiPageResumePreview: React.FC<MultiPageResumePreviewProps> = ({ data }) => {
  const theme = data.theme || DEFAULT_THEMES[0];
  const [pages, setPages] = useState<PageContent[]>([]);
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

  const visibleSections = getVisibleSections();
  const { measurements, isReady } = useRealContentMeasurement(data, visibleSections);

  useEffect(() => {
    if (!isReady || measurements.size === 0) return;

    const calculatePages = () => {
      const pageLayouts = calculateSmartPageBreaks(data, visibleSections, measurements);
      setPages(pageLayouts);
    };

    calculatePages();
  }, [data, measurements, isReady, visibleSections]);

  // Show loading state while measurements are being calculated
  if (!isReady || pages.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center text-sm text-gray-600 mb-4">
          Calculating optimal page layout...
        </div>
        
        <Card className="shadow-lg border border-gray-200 bg-white">
          <CardContent className="p-0">
            <div 
              className="bg-white text-gray-900 mx-auto relative resume-page animate-pulse"
              style={{ 
                width: '794px', 
                minHeight: `${A4_HEIGHT_PX}px`,
                maxWidth: '100%'
              }}
            >
              <PersonalInfoHeader personalInfo={data.personalInfo} theme={theme} />
              <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-gray-600 mb-4">
        Showing {pages.length} page{pages.length > 1 ? 's' : ''} with smart content breaks
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
                      <SectionRenderer 
                        sectionId={sectionData.sectionId} 
                        data={data} 
                        theme={theme}
                        items={sectionData.items}
                        startIndex={sectionData.startIndex}
                        endIndex={sectionData.endIndex}
                      />
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
