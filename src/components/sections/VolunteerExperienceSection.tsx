
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { formatDateRange, formatDescriptionAsBullets } from '@/utils/resumeHelpers';

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
              <ul className="mt-1 space-y-0.5">
                {formatDescriptionAsBullets(vol.description).map((bullet, index) => (
                  <li key={index} className="text-sm leading-normal flex items-start">
                    <span className="mr-2 mt-1 w-1 h-1 bg-black rounded-full flex-shrink-0"></span>
                    <span style={{ color: theme.text }}>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

export default VolunteerExperienceSection;
