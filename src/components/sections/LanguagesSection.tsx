
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';

interface LanguagesSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Languages" theme={theme}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {data.languages.map((lang) => (
          <div key={lang.id} className="flex justify-between">
            <span className="text-sm" style={{ color: theme.text }}>
              {lang.language}
            </span>
            <span className="text-sm" style={{ color: theme.text }}>
              {lang.proficiency}
            </span>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

export default LanguagesSection;
