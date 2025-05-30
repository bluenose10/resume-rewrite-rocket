
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';

interface PersonalStatementSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const PersonalStatementSection: React.FC<PersonalStatementSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Personal Statement" theme={theme}>
      <p className="text-sm leading-normal" style={{ color: theme.text }}>
        {data.personalStatement}
      </p>
    </ResumeSection>
  );
};

export default PersonalStatementSection;
