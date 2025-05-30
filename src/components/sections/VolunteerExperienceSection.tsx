
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { formatDateRange } from '@/utils/resumeHelpers';
import FormattedText from '@/components/ui/FormattedText';

interface VolunteerExperienceSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const VolunteerExperienceSection: React.FC<VolunteerExperienceSectionProps> = ({ data, theme }) => {
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
            {vol.description && (
              <div className="mt-1">
                <FormattedText 
                  content={vol.description}
                  className="text-sm leading-normal"
                  style={{ color: theme.text }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

export default VolunteerExperienceSection;
