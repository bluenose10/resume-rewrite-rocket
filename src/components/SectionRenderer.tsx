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
            <p className="text-sm leading-relaxed font-medium" style={{ color: theme.text }}>
              {data.personalStatement}
            </p>
          </ResumeSection>
        );

      case 'summary':
        return (
          <ResumeSection title="Professional Summary" theme={theme}>
            <p className="text-sm leading-relaxed font-medium" style={{ color: theme.text }}>
              {data.summary}
            </p>
          </ResumeSection>
        );

      case 'experience':
        return (
          <ResumeSection title="Professional Experience" theme={theme}>
            <div className="space-y-8">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-3 pl-6 relative" style={{ borderColor: theme.primary }}>
                  <div className="absolute w-3 h-3 rounded-full -left-1.5 top-1" style={{ backgroundColor: theme.primary }}></div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold leading-tight mb-1" style={{ color: theme.text }}>
                        {exp.position}
                      </h3>
                      <p className="text-base font-semibold" style={{ color: theme.primary }}>
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded-full ml-4" style={{ color: theme.text }}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </div>
                  </div>
                  {exp.description && (
                    <ul className="space-y-2 mt-4">
                      {formatDescriptionAsBullets(exp.description).map((bullet, index) => (
                        <li key={index} className="text-sm leading-relaxed flex items-start">
                          <span 
                            className="mr-3 mt-2 w-2 h-2 rounded-full flex-shrink-0"
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
            <div className="space-y-6">
              {data.projects.map((project) => (
                <div key={project.id} className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderColor: theme.primary }}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold" style={{ color: theme.text }}>
                      {project.name}
                    </h3>
                    {project.link && (
                      <a 
                        href={project.link} 
                        className="text-sm font-semibold hover:underline transition-colors ml-4 bg-white px-3 py-1 rounded-full"
                        style={{ color: theme.primary }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-sm leading-relaxed mb-3" style={{ color: theme.text }}>
                      {project.description}
                    </p>
                  )}
                  {project.technologies && (
                    <p className="text-sm font-medium" style={{ color: theme.secondary }}>
                      <span className="font-bold">Technologies:</span> {project.technologies}
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
            <div className="space-y-5">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start bg-gray-50 p-4 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold" style={{ color: theme.text }}>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-base font-semibold mt-1" style={{ color: theme.primary }}>
                      {edu.institution}
                    </p>
                    {edu.gpa && (
                      <p className="text-sm mt-2 font-medium" style={{ color: theme.text }}>
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                  <div className="text-sm font-semibold bg-white px-3 py-1 rounded-full ml-4" style={{ color: theme.text }}>
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
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 text-sm font-medium bg-gray-100 rounded-full border-2"
                  style={{ color: theme.text, borderColor: theme.primary }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </ResumeSection>
        );

      case 'achievements':
        return (
          <ResumeSection title="Achievements & Awards" theme={theme}>
            <div className="space-y-5">
              {data.achievements.map((achievement) => (
                <div key={achievement.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold" style={{ color: theme.text }}>
                      {achievement.title}
                    </h3>
                    <div className="text-sm font-semibold bg-white px-3 py-1 rounded-full ml-4" style={{ color: theme.text }}>
                      {formatDate(achievement.date)}
                    </div>
                  </div>
                  <p className="text-base font-semibold mb-2" style={{ color: theme.primary }}>
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
            <div className="space-y-5">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start bg-gray-50 p-4 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold" style={{ color: theme.text }}>
                      {cert.name}
                    </h3>
                    <p className="text-base font-semibold mt-1" style={{ color: theme.primary }}>
                      {cert.issuer}
                    </p>
                    {cert.credentialId && (
                      <p className="text-sm mt-2 font-medium" style={{ color: theme.text }}>
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-right ml-4">
                    <div className="bg-white px-3 py-1 rounded-full mb-1" style={{ color: theme.text }}>
                      {formatDate(cert.date)}
                    </div>
                    {cert.expiryDate && (
                      <div className="text-sm" style={{ color: theme.secondary }}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-bold" style={{ color: theme.text }}>
                    {lang.language}
                  </span>
                  <span className="text-sm font-medium" style={{ color: theme.primary }}>
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
                <div key={vol.id} className="border-l-3 pl-6 relative" style={{ borderColor: theme.primary }}>
                  <div className="absolute w-3 h-3 rounded-full -left-1.5 top-1" style={{ backgroundColor: theme.primary }}></div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold" style={{ color: theme.text }}>
                        {vol.role}
                      </h3>
                      <p className="text-base font-semibold mt-1" style={{ color: theme.primary }}>
                        {vol.organization}
                      </p>
                    </div>
                    <div className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded-full ml-4" style={{ color: theme.text }}>
                      {formatDateRange(vol.startDate, vol.endDate, vol.current)}
                    </div>
                  </div>
                  {vol.description && (
                    <ul className="space-y-2 mt-4">
                      {formatDescriptionAsBullets(vol.description).map((bullet, index) => (
                        <li key={index} className="text-sm leading-relaxed flex items-start">
                          <span 
                            className="mr-3 mt-2 w-2 h-2 rounded-full flex-shrink-0"
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
            <div className="space-y-5">
              {data.publications.map((pub) => (
                <div key={pub.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold" style={{ color: theme.text }}>
                      {pub.title}
                    </h3>
                    {pub.link && (
                      <a 
                        href={pub.link} 
                        className="text-sm font-semibold hover:underline transition-colors ml-4 bg-white px-3 py-1 rounded-full"
                        style={{ color: theme.primary }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    )}
                  </div>
                  <p className="text-sm mb-2 font-medium" style={{ color: theme.text }}>
                    <span className="font-bold">Authors:</span> {pub.authors}
                  </p>
                  <p className="text-sm font-medium" style={{ color: theme.secondary }}>
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
                <div key={ref.id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2" style={{ color: theme.text }}>
                    {ref.name}
                  </h3>
                  <p className="text-sm font-semibold mb-1" style={{ color: theme.primary }}>
                    {ref.title}
                  </p>
                  <p className="text-sm mb-1 font-medium" style={{ color: theme.text }}>{ref.company}</p>
                  <p className="text-sm mb-2 font-medium" style={{ color: theme.text }}>{ref.relationship}</p>
                  <p className="text-sm mb-1 font-medium" style={{ color: theme.text }}>{ref.email}</p>
                  <p className="text-sm font-medium" style={{ color: theme.text }}>{ref.phone}</p>
                </div>
              ))}
            </div>
          </ResumeSection>
        );

      case 'interests':
        return (
          <ResumeSection title="Interests & Hobbies" theme={theme}>
            <div className="flex flex-wrap gap-2">
              {data.interests.map((interest, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 text-sm font-medium bg-gray-100 rounded-full border-2"
                  style={{ color: theme.text, borderColor: theme.primary }}
                >
                  {interest}
                </span>
              ))}
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
