
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import FormattedText from '@/components/ui/FormattedText';

interface SummarySectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const SummarySection: React.FC<SummarySectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Professional Summary" theme={theme}>
      <FormattedText 
        content={data.summary}
        className="text-sm leading-normal"
        style={{ color: theme.text }}
      />
    </ResumeSection>
  );
};

export default SummarySection;
