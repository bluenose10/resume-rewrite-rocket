
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { formatDate } from '@/utils/resumeHelpers';

interface PublicationsSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const PublicationsSection: React.FC<PublicationsSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Publications" theme={theme}>
      <div className="space-y-2">
        {data.publications.map((pub) => (
          <div key={pub.id}>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
                {pub.title}
              </h3>
              {pub.link && (
                <a 
                  href={pub.link} 
                  className="text-sm hover:underline"
                  style={{ color: theme.text }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              )}
            </div>
            <p className="text-sm mb-1" style={{ color: theme.text }}>
              <span className="font-medium">Authors:</span> {pub.authors}
            </p>
            <p className="text-sm" style={{ color: theme.text }}>
              {pub.publication} • {formatDate(pub.date)}
            </p>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

export default PublicationsSection;
