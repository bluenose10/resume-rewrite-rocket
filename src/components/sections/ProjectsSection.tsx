
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import FormattedText from '@/components/ui/FormattedText';

interface ProjectsSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Projects" theme={theme}>
      <div className="space-y-3">
        {data.projects.map((project) => (
          <div key={project.id}>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
                {project.name}
              </h3>
              {project.link && (
                <a 
                  href={project.link} 
                  className="text-sm hover:underline"
                  style={{ color: theme.text }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project
                </a>
              )}
            </div>
            {project.description && (
              <div className="mb-1">
                <FormattedText 
                  content={project.description}
                  className="text-sm leading-normal"
                  style={{ color: theme.text }}
                />
              </div>
            )}
            {project.technologies && (
              <p className="text-sm" style={{ color: theme.text }}>
                <span className="font-medium">Technologies:</span> {project.technologies}
              </p>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

export default ProjectsSection;
