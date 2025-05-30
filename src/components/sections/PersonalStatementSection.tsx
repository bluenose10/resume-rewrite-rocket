
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { sanitizeHtml } from '@/utils/htmlSanitizer';

interface PersonalStatementSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const PersonalStatementSection: React.FC<PersonalStatementSectionProps> = ({ data, theme }) => {
  const sanitizedContent = sanitizeHtml(data.personalStatement);
  
  return (
    <ResumeSection title="Personal Statement" theme={theme}>
      <div 
        className="text-sm leading-normal" 
        style={{ color: theme.text }}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </ResumeSection>
  );
};

export default PersonalStatementSection;
