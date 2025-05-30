
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { formatDateRange } from '@/utils/resumeHelpers';

interface EducationSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const EducationSection: React.FC<EducationSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Education" theme={theme}>
      <div className="space-y-3">
        {data.education.map((edu) => (
          <div key={edu.id} className="section-item">
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1">
                <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
                  {edu.degree} in {edu.field}
                </h3>
                <p className="text-sm" style={{ color: theme.primary }}>
                  {edu.institution}
                </p>
                {edu.classification && (
                  <p className="text-sm" style={{ color: theme.text }}>
                    {edu.classification}
                  </p>
                )}
              </div>
              <div className="text-sm" style={{ color: theme.text }}>
                {formatDateRange(edu.startDate, edu.endDate, false)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

export default EducationSection;
