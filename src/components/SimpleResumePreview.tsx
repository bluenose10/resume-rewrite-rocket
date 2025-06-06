
import React from 'react';
import { ResumeData } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';
import PersonalInfoHeader from './PersonalInfoHeader';
import SectionRenderer from './SectionRenderer';

interface SimpleResumePreviewProps {
  data: ResumeData;
}

const SimpleResumePreview: React.FC<SimpleResumePreviewProps> = ({ data }) => {
  const theme = data.theme || DEFAULT_THEMES[0];

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

  // Divide sections into pages (simplified approach)
  const organizeSectionsIntoPages = (sections: string[]) => {
    // Major sections that should always start a new page if they don't fit completely
    const majorSections = ['experience', 'education', 'projects', 'skills'];
    
    const pages: string[][] = [[]];
    let currentPageIndex = 0;
    let currentPageSize = 0;
    
    sections.forEach((sectionId) => {
      // Estimate section size (this is simplified)
      let sectionSize = 0;
      
      switch(sectionId) {
        case 'experience':
          sectionSize = (data.experience?.length || 0) * 50;
          break;
        case 'education':
          sectionSize = (data.education?.length || 0) * 40;
          break;
        case 'projects':
          sectionSize = (data.projects?.length || 0) * 45;
          break;
        case 'skills':
          sectionSize = 30 + (data.skills?.length || 0) * 5;
          break;
        case 'summary':
        case 'personalStatement':
          sectionSize = 40;
          break;
        default:
          sectionSize = 30;
      }
      
      // If section won't fit on current page or is a major section that should start a new page
      if (currentPageSize + sectionSize > 500 || 
          (majorSections.includes(sectionId) && currentPageSize > 200)) {
        currentPageIndex++;
        pages[currentPageIndex] = [sectionId];
        currentPageSize = sectionSize;
      } else {
        if (!pages[currentPageIndex]) {
          pages[currentPageIndex] = [];
        }
        pages[currentPageIndex].push(sectionId);
        currentPageSize += sectionSize;
      }
    });
    
    return pages;
  };

  const visibleSections = getVisibleSections();
  const pagesOfSections = organizeSectionsIntoPages(visibleSections);

  return (
    <div className="resume-container">
      <style>{`
        @media print {
          .resume-container {
            width: 794px !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          
          .resume-page {
            width: 794px !important;
            padding: 40px !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: always;
            break-after: page;
          }
          
          .resume-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .section-item {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .page-break-after {
            page-break-after: always;
            break-after: page;
          }
          
          .page-break-before {
            page-break-before: always;
            break-before: page;
          }
          
          .last-page {
            page-break-after: avoid;
            break-after: auto;
          }
        }
      `}</style>
      
      <div className="space-y-8">
        {pagesOfSections.map((pageSections, pageIndex) => (
          <div 
            key={`page-${pageIndex}`}
            className={`resume-page bg-white shadow-lg border border-gray-200 mx-auto relative ${
              pageIndex === pagesOfSections.length - 1 ? 'last-page' : ''
            }`}
            style={{ 
              width: '794px', 
              maxWidth: '100%',
              padding: '40px',
              marginBottom: '30px'
            }}
          >
            {/* Only show header on the first page */}
            {pageIndex === 0 && (
              <PersonalInfoHeader personalInfo={data.personalInfo} theme={theme} />
            )}
            
            <div className="space-y-6 mt-6">
              {pageSections.map((sectionId) => (
                <div 
                  key={sectionId} 
                  className="resume-section"
                >
                  <SectionRenderer 
                    sectionId={sectionId} 
                    data={data} 
                    theme={theme}
                  />
                </div>
              ))}
            </div>
            
            {/* Add page numbers */}
            <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
              Page {pageIndex + 1} of {pagesOfSections.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleResumePreview;
