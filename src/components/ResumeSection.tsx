
import React from 'react';
import { ColorTheme } from '@/types/resume';

interface ResumeSectionProps {
  title: string;
  theme: ColorTheme;
  children: React.ReactNode;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({ title, theme, children }) => {
  return (
    <section className="mb-10">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <h2 
            className="text-xl font-bold uppercase tracking-widest"
            style={{ color: theme.primary }}
          >
            {title}
          </h2>
          <div 
            className="flex-1 h-0.5"
            style={{ backgroundColor: theme.primary }}
          />
        </div>
      </div>
      <div className="ml-2">
        {children}
      </div>
    </section>
  );
};

export default ResumeSection;
