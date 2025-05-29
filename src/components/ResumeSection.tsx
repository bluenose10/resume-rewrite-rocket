
import React from 'react';
import { ColorTheme } from '@/types/resume';

interface ResumeSectionProps {
  title: string;
  theme: ColorTheme;
  children: React.ReactNode;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({ title, theme, children }) => {
  return (
    <section>
      <h2 
        className="text-sm font-bold uppercase tracking-wide mb-2 pb-1"
        style={{ 
          color: theme.primary,
          borderBottom: `1px solid ${theme.primary}`
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
};

export default ResumeSection;
