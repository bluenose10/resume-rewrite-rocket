
import React from 'react';
import { ColorTheme } from '@/types/resume';

interface ResumeSectionProps {
  title: string;
  theme: ColorTheme;
  children: React.ReactNode;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({ title, theme, children }) => {
  return (
    <section className="mb-5">
      {/* Section title - ALL CAPS, small size, with clean line */}
      <div className="mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: theme.primary }}>
          {title}
        </h2>
        <div className="w-full h-px bg-gray-300"></div>
      </div>
      
      {/* Content */}
      <div>
        {children}
      </div>
    </section>
  );
};

export default ResumeSection;
