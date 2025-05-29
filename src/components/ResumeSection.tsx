
import React from 'react';
import { ColorTheme } from '@/types/resume';

interface ResumeSectionProps {
  title: string;
  theme: ColorTheme;
  children: React.ReactNode;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({ title, theme, children }) => {
  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 
          className="text-lg font-bold uppercase tracking-wide mb-2"
          style={{ color: theme.primary }}
        >
          {title}
        </h2>
        <div 
          className="w-full h-px"
          style={{ backgroundColor: theme.primary }}
        />
      </div>
      <div className="pl-1">
        {children}
      </div>
    </section>
  );
};

export default ResumeSection;
