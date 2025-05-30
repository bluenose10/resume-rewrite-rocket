
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { formatDateRange } from '@/utils/resumeHelpers';
import { sanitizeHtml, isHtmlContent } from '@/utils/htmlUtils';

interface VolunteerExperienceSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const VolunteerExperienceSection: React.FC<VolunteerExperienceSectionProps> = ({ data, theme }) => {
  const renderDescription = (description: string) => {
    if (isHtmlContent(description)) {
      return (
        <div 
          className="text-sm leading-normal resume-content mt-1" 
          style={{ color: theme.text }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
        />
      );
    }
    
    return (
      <div className="mt-1">
        <p className="text-sm leading-normal whitespace-pre-line" style={{ color: theme.text }}>
          {description}
        </p>
      </div>
    );
  };

  return (
    <ResumeSection title="Volunteer Experience" theme={theme}>
      <div className="space-y-3">
        {data.volunteerExperience.map((vol) => (
          <div key={vol.id}>
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1">
                <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
                  {vol.role}
                </h3>
                <p className="text-sm" style={{ color: theme.text }}>
                  {vol.organization}
                </p>
              </div>
              <div className="text-sm" style={{ color: theme.text }}>
                {formatDateRange(vol.startDate, vol.endDate, vol.current)}
              </div>
            </div>
            {vol.description && renderDescription(vol.description)}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

export default VolunteerExperienceSection;
