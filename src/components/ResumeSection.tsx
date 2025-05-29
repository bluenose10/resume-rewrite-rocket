
import React from 'react';
import { ColorTheme } from '@/types/resume';

interface ResumeSectionProps {
  title: string;
  theme: ColorTheme;
  children: React.ReactNode;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({ title, theme, children }) => {
  return (
    <section className="mb-6">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <h2 
            className="text-sm font-bold uppercase tracking-wide"
            style={{ color: theme.primary }}
          >
            {title}
          </h2>
          <div 
            className="flex-1 h-px"
            style={{ backgroundColor: theme.primary }}
          />
        </div>
      </div>
      <div>
        {children}
      </div>
    </section>
  );
};

export default ResumeSection;
