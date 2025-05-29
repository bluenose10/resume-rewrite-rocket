
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';

interface InterestsSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const InterestsSection: React.FC<InterestsSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Interests & Hobbies" theme={theme}>
      <div className="flex flex-wrap gap-1">
        {data.interests.map((interest, index) => (
          <span 
            key={index}
            className="text-sm"
            style={{ color: theme.text }}
          >
            {interest}{index < data.interests.length - 1 && ', '}
          </span>
        ))}
      </div>
    </ResumeSection>
  );
};

export default InterestsSection;
