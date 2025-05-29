
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { formatDateRange } from '@/utils/resumeHelpers';

interface EducationSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const EducationSection: React.FC<EducationSectionProps> = ({ data, theme }) => {
  const getClassificationDisplay = (classification: string) => {
    switch (classification) {
      case 'first':
        return '1st';
      case 'upper-second':
        return '2:1';
      case 'lower-second':
        return '2:2';
      case 'third':
        return '3rd';
      case 'pass':
        return 'Pass';
      default:
        return '';
    }
  };

  return (
    <ResumeSection title="Education" theme={theme}>
      <div className="space-y-2">
        {data.education.map((edu) => {
          const classificationText = getClassificationDisplay(edu.classification);
          const degreeText = `${edu.degree}${edu.field ? ` ${edu.field}` : ''}${classificationText ? `, ${classificationText}` : ''}`;
          
          return (
            <div key={edu.id} className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
                  {degreeText}
                </h3>
                <p className="text-sm" style={{ color: theme.text }}>
                  {edu.institution}
                </p>
              </div>
              <div className="text-sm" style={{ color: theme.text }}>
                {formatDateRange(edu.startDate, edu.endDate, false)}
              </div>
            </div>
          );
        })}
      </div>
    </ResumeSection>
  );
};

export default EducationSection;
