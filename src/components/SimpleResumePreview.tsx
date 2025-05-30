
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

  const visibleSections = getVisibleSections();

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
            page-break-inside: avoid;
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
          }
          
          .page-break-before {
            page-break-before: always;
          }
        }
      `}</style>
      
      <div className="space-y-8">
        <div 
          className="resume-page bg-white shadow-lg border border-gray-200 mx-auto relative"
          style={{ 
            width: '794px', 
            maxWidth: '100%',
            padding: '40px'
          }}
        >
          <PersonalInfoHeader personalInfo={data.personalInfo} theme={theme} />
          
          <div className="space-y-6 mt-6">
            {visibleSections.map((sectionId, index) => {
              const needsPageBreak = index > 0 && (
                sectionId === 'experience' || 
                sectionId === 'education' || 
                sectionId === 'projects'
              );
              
              return (
                <div 
                  key={sectionId} 
                  className={`resume-section ${needsPageBreak ? 'page-break-before' : ''}`}
                >
                  <SectionRenderer 
                    sectionId={sectionId} 
                    data={data} 
                    theme={theme}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleResumePreview;
