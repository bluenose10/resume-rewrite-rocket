
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { sanitizeHtml } from '@/utils/htmlSanitizer';

interface SummarySectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const SummarySection: React.FC<SummarySectionProps> = ({ data, theme }) => {
  const sanitizedContent = sanitizeHtml(data.summary);
  
  return (
    <ResumeSection title="Professional Summary" theme={theme}>
      <div 
        className="text-sm leading-normal" 
        style={{ color: theme.text }}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </ResumeSection>
  );
};

export default SummarySection;
