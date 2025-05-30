
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { formatDateRange, preserveUserFormatting } from '@/utils/resumeHelpers';

interface ExperienceSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Professional Experience" theme={theme}>
      <div className="space-y-4">
        {data.experience.map((exp) => (
          <div key={exp.id} className="section-item">
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1">
                <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
                  {exp.position}
                </h3>
                <p className="text-sm font-medium" style={{ color: theme.primary }}>
                  {exp.company}
                </p>
              </div>
              <div className="text-sm" style={{ color: theme.text }}>
                {formatDateRange(exp.startDate, exp.endDate, exp.current)}
              </div>
            </div>
            
            {exp.description && (
              <div className="text-sm leading-normal whitespace-pre-line" style={{ color: theme.text }}>
                {preserveUserFormatting(exp.description)}
              </div>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

export default ExperienceSection;
