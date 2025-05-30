
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { sanitizeHtml, isHtmlContent } from '@/utils/htmlUtils';

interface PersonalStatementSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const PersonalStatementSection: React.FC<PersonalStatementSectionProps> = ({ data, theme }) => {
  const renderContent = () => {
    if (isHtmlContent(data.personalStatement)) {
      return (
        <div 
          className="text-sm leading-normal resume-content" 
          style={{ color: theme.text }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.personalStatement) }}
        />
      );
    }
    
    return (
      <p className="text-sm leading-normal" style={{ color: theme.text }}>
        {data.personalStatement}
      </p>
    );
  };

  return (
    <ResumeSection title="Personal Statement" theme={theme}>
      {renderContent()}
    </ResumeSection>
  );
};

export default PersonalStatementSection;
