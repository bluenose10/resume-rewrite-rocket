
import React from 'react';
import { ColorTheme } from '@/types/resume';

interface ResumeSectionProps {
  title: string;
  theme: ColorTheme;
  children: React.ReactNode;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({ title, theme, children }) => {
  return (
    <section className="mb-6 resume-section">
      {/* Section title - ALL CAPS, small size, with clean line */}
      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: theme.primary }}>
          {title}
        </h2>
        <div className="w-full h-px bg-gray-300"></div>
      </div>
      
      {/* Content with better spacing */}
      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
};

export default ResumeSection;
