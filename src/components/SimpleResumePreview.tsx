
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="space-y-4">
      <Card className="shadow-lg border border-gray-200 bg-white">
        <CardContent className="p-0">
          <div 
            className="bg-white text-gray-900 mx-auto relative resume-page"
            style={{ 
              width: '794px', 
              maxWidth: '100%'
            }}
          >
            <PersonalInfoHeader personalInfo={data.personalInfo} theme={theme} />
            
            <div className="px-6 py-4 space-y-4">
              {visibleSections.map((sectionId) => (
                <div key={sectionId} className="resume-section">
                  <SectionRenderer 
                    sectionId={sectionId} 
                    data={data} 
                    theme={theme}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleResumePreview;
