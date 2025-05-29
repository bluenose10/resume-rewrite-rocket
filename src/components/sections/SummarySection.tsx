
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';

interface SummarySectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const SummarySection: React.FC<SummarySectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Professional Summary" theme={theme}>
      <p className="text-sm leading-normal" style={{ color: theme.text }}>
        {data.summary}
      </p>
    </ResumeSection>
  );
};

export default SummarySection;
