
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import FormattedText from '@/components/ui/FormattedText';

interface PersonalStatementSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const PersonalStatementSection: React.FC<PersonalStatementSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Personal Statement" theme={theme}>
      <FormattedText 
        content={data.personalStatement}
        className="text-sm leading-normal"
        style={{ color: theme.text }}
      />
    </ResumeSection>
  );
};

export default PersonalStatementSection;
