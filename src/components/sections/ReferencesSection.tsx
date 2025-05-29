
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';

interface ReferencesSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const ReferencesSection: React.FC<ReferencesSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="References" theme={theme}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.references.map((ref) => (
          <div key={ref.id}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: theme.text }}>
              {ref.name}
            </h3>
            <p className="text-sm mb-1" style={{ color: theme.text }}>
              {ref.title}
            </p>
            <p className="text-sm mb-1" style={{ color: theme.text }}>{ref.company}</p>
            <p className="text-sm mb-1" style={{ color: theme.text }}>{ref.relationship}</p>
            <p className="text-sm mb-1" style={{ color: theme.text }}>{ref.email}</p>
            <p className="text-sm" style={{ color: theme.text }}>{ref.phone}</p>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

export default ReferencesSection;
