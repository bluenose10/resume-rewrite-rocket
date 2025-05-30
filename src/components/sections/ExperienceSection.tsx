
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { formatDateRange } from '@/utils/resumeHelpers';
import FormattedText from '@/components/ui/FormattedText';

interface ExperienceSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Work Experience" theme={theme}>
      <div className="space-y-3">
        {data.experience.map((exp) => (
          <div key={exp.id}>
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1">
                <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
                  {exp.position}
                </h3>
                <p className="text-sm" style={{ color: theme.text }}>
                  {exp.company}
                </p>
              </div>
              <div className="text-sm" style={{ color: theme.text }}>
                {formatDateRange(exp.startDate, exp.endDate, exp.current)}
              </div>
            </div>
            {exp.description && (
              <div className="mt-1">
                <FormattedText 
                  content={exp.description}
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

export default ExperienceSection;
