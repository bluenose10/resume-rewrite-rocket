
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';

interface SkillsSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Technical Skills" theme={theme}>
      <div className="flex flex-wrap gap-1">
        {data.skills.map((skill, index) => (
          <span 
            key={index}
            className="text-sm"
            style={{ color: theme.text }}
          >
            {skill}{index < data.skills.length - 1 && ', '}
          </span>
        ))}
      </div>
    </ResumeSection>
  );
};

export default SkillsSection;
