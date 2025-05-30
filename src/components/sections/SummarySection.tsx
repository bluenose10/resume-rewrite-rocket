
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { sanitizeHtml, isHtmlContent } from '@/utils/htmlUtils';

interface SummarySectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const SummarySection: React.FC<SummarySectionProps> = ({ data, theme }) => {
  const renderContent = () => {
    if (isHtmlContent(data.summary)) {
      return (
        <div 
          className="text-sm leading-normal resume-content" 
          style={{ color: theme.text }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.summary) }}
        />
      );
    }
    
    return (
      <p className="text-sm leading-normal" style={{ color: theme.text }}>
        {data.summary}
      </p>
    );
  };

  return (
    <ResumeSection title="Professional Summary" theme={theme}>
      {renderContent()}
    </ResumeSection>
  );
};

export default SummarySection;
