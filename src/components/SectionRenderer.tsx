
import React from 'react';
import ResumeSection from './ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { formatDate, formatDateRange, formatDescriptionAsBullets } from '@/utils/resumeHelpers';

interface SectionRendererProps {
  sectionId: string;
  data: ResumeData;
  theme: ColorTheme;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ sectionId, data, theme }) => {
  const renderSectionContent = () => {
    switch (sectionId) {
      case 'personalStatement':
        return (
          <ResumeSection title="Personal Statement" theme={theme}>
            <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
              {data.personalStatement}
            </p>
          </ResumeSection>
        );

      case 'summary':
        return (
          <ResumeSection title="Professional Summary" theme={theme}>
            <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
              {data.summary}
            </p>
          </ResumeSection>
        );

      case 'experience':
        return (
          <ResumeSection title="Professional Experience" theme={theme}>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-bold leading-tight" style={{ color: theme.text }}>
                        {exp.position}
                      </h3>
                      <p className="text-sm font-semibold mt-1" style={{ color: theme.secondary }}>
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-right ml-4" style={{ color: theme.text }}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </div>
                  </div>
                  {exp.description && (
                    <ul className="ml-4 space-y-1 mt-3">
                      {formatDescriptionAsBullets(exp.description).map((bullet, index) => (
                        <li key={index} className="text-sm leading-relaxed flex items-start">
                          <span 
                            className="mr-3 mt-2 w-1 h-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: theme.primary }}
                          />
                          <span style={{ color: theme.text }}>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </ResumeSection>
        );

      case 'projects':
        return (
          <ResumeSection title="Projects" theme={theme}>
            <div className="space-y-5">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold" style={{ color: theme.text }}>
                      {project.name}
                    </h3>
                    {project.link && (
                      <a 
                        href={project.link} 
                        className="text-sm font-medium hover:underline transition-colors ml-4"
                        style={{ color: theme.primary }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-sm leading-relaxed mb-2" style={{ color: theme.text }}>
                      {project.description}
                    </p>
                  )}
                  {project.technologies && (
                    <p className="text-sm" style={{ color: theme.secondary }}>
                      <span className="font-semibold">Technologies:</span> {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ResumeSection>
        );

      case 'education':
        return (
          <ResumeSection title="Education" theme={theme}>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-base font-bold" style={{ color: theme.text }}>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-sm font-semibold mt-1" style={{ color: theme.secondary }}>
                      {edu.institution}
                    </p>
                    {edu.gpa && (
                      <p className="text-sm mt-1" style={{ color: theme.text }}>
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                  <div className="text-sm font-medium ml-4" style={{ color: theme.text }}>
                    {formatDateRange(edu.startDate, edu.endDate, false)}
                  </div>
                </div>
              ))}
            </div>
          </ResumeSection>
        );

      case 'skills':
        return (
          <ResumeSection title="Technical Skills" theme={theme}>
            <div className="text-sm leading-relaxed" style={{ color: theme.text }}>
              {data.skills.join(' • ')}
            </div>
          </ResumeSection>
        );

      case 'achievements':
        return (
          <ResumeSection title="Achievements & Awards" theme={theme}>
            <div className="space-y-4">
              {data.achievements.map((achievement) => (
                <div key={achievement.id}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold" style={{ color: theme.text }}>
                      {achievement.title}
                    </h3>
                    <div className="text-sm font-medium ml-4" style={{ color: theme.text }}>
                      {formatDate(achievement.date)}
                    </div>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: theme.secondary }}>
                    {achievement.organization}
                  </p>
                  {achievement.description && (
                    <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
                      {achievement.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ResumeSection>
        );

      case 'certifications':
        return (
          <ResumeSection title="Certifications & Licenses" theme={theme}>
            <div className="space-y-4">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-base font-bold" style={{ color: theme.text }}>
                      {cert.name}
                    </h3>
                    <p className="text-sm font-semibold mt-1" style={{ color: theme.secondary }}>
                      {cert.issuer}
                    </p>
                    {cert.credentialId && (
                      <p className="text-sm mt-1" style={{ color: theme.text }}>
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                  <div className="text-sm font-medium text-right ml-4" style={{ color: theme.text }}>
                    <div>{formatDate(cert.date)}</div>
                    {cert.expiryDate && (
                      <div className="text-sm mt-1" style={{ color: theme.secondary }}>
                        Expires: {formatDate(cert.expiryDate)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ResumeSection>
        );

      case 'languages':
        return (
          <ResumeSection title="Languages" theme={theme}>
            <div className="grid grid-cols-2 gap-3">
              {data.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span className="text-sm font-medium" style={{ color: theme.text }}>
                    {lang.language}
                  </span>
                  <span className="text-sm" style={{ color: theme.secondary }}>
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </ResumeSection>
        );

      case 'volunteerExperience':
        return (
          <ResumeSection title="Volunteer Experience" theme={theme}>
            <div className="space-y-6">
              {data.volunteerExperience.map((vol) => (
                <div key={vol.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-bold" style={{ color: theme.text }}>
                        {vol.role}
                      </h3>
                      <p className="text-sm font-semibold mt-1" style={{ color: theme.secondary }}>
                        {vol.organization}
                      </p>
                    </div>
                    <div className="text-sm font-medium ml-4" style={{ color: theme.text }}>
                      {formatDateRange(vol.startDate, vol.endDate, vol.current)}
                    </div>
                  </div>
                  {vol.description && (
                    <ul className="ml-4 space-y-1 mt-3">
                      {formatDescriptionAsBullets(vol.description).map((bullet, index) => (
                        <li key={index} className="text-sm leading-relaxed flex items-start">
                          <span 
                            className="mr-3 mt-2 w-1 h-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: theme.primary }}
                          />
                          <span style={{ color: theme.text }}>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </ResumeSection>
        );

      case 'publications':
        return (
          <ResumeSection title="Publications" theme={theme}>
            <div className="space-y-4">
              {data.publications.map((pub) => (
                <div key={pub.id}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold" style={{ color: theme.text }}>
                      {pub.title}
                    </h3>
                    {pub.link && (
                      <a 
                        href={pub.link} 
                        className="text-sm font-medium hover:underline transition-colors ml-4"
                        style={{ color: theme.primary }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    )}
                  </div>
                  <p className="text-sm mb-1" style={{ color: theme.text }}>
                    <span className="font-semibold">Authors:</span> {pub.authors}
                  </p>
                  <p className="text-sm" style={{ color: theme.secondary }}>
                    {pub.publication} • {formatDate(pub.date)}
                  </p>
                </div>
              ))}
            </div>
          </ResumeSection>
        );

      case 'references':
        return (
          <ResumeSection title="References" theme={theme}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.references.map((ref) => (
                <div key={ref.id}>
                  <h3 className="text-base font-bold mb-1" style={{ color: theme.text }}>
                    {ref.name}
                  </h3>
                  <p className="text-sm font-semibold mb-1" style={{ color: theme.secondary }}>
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

      case 'interests':
        return (
          <ResumeSection title="Interests & Hobbies" theme={theme}>
            <div className="text-sm leading-relaxed" style={{ color: theme.text }}>
              {data.interests.join(' • ')}
            </div>
          </ResumeSection>
        );

      default:
        return null;
    }
  };

  return renderSectionContent();
};

export default SectionRenderer;
