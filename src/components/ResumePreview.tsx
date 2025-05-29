
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';

interface ResumePreviewProps {
  data: ResumeData;
  onDownload: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, onDownload }) => {
  const theme = data.theme || DEFAULT_THEMES[1];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const formatDateRange = (startDate: string, endDate: string, current: boolean) => {
    const start = formatDate(startDate);
    const end = current ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  const formatDescriptionAsBullets = (description: string) => {
    if (!description) return [];
    
    const sentences = description
      .split(/[.;]\s*|\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    return sentences;
  };

  return (
    <div className="space-y-6 font-inter">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Resume Preview</h2>
        <Button 
          onClick={onDownload} 
          className="flex items-center gap-2 shadow-lg"
          style={{ backgroundColor: theme.primary, color: 'white' }}
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="shadow-lg border border-gray-200 bg-white">
        <CardContent className="p-0" id="resume-content">
          <div className="max-w-4xl mx-auto bg-white text-gray-900">
            {/* Professional Header */}
            <div className="px-8 py-6 text-center" style={{ borderBottom: `3px solid ${theme.primary}` }}>
              <h1 className="text-2xl font-bold tracking-wide mb-3" style={{ color: theme.text }}>
                {data.personalInfo.firstName} {data.personalInfo.lastName}
              </h1>
              
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm" style={{ color: theme.text }}>
                {data.personalInfo.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" style={{ color: theme.primary }} />
                    <span>{data.personalInfo.email}</span>
                  </div>
                )}
                {data.personalInfo.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" style={{ color: theme.primary }} />
                    <span>{data.personalInfo.phone}</span>
                  </div>
                )}
                {data.personalInfo.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" style={{ color: theme.primary }} />
                    <span>{data.personalInfo.location}</span>
                  </div>
                )}
                {data.personalInfo.linkedin && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-3 w-3" style={{ color: theme.primary }} />
                    <span className="truncate max-w-36">{data.personalInfo.linkedin}</span>
                  </div>
                )}
                {data.personalInfo.github && (
                  <div className="flex items-center gap-1">
                    <Github className="h-3 w-3" style={{ color: theme.primary }} />
                    <span className="truncate max-w-36">{data.personalInfo.github}</span>
                  </div>
                )}
                {data.personalInfo.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" style={{ color: theme.primary }} />
                    <span className="truncate max-w-36">{data.personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-8 py-6 space-y-5">
              {/* Professional Summary */}
              {data.summary && (
                <section>
                  <h2 
                    className="text-sm font-bold uppercase tracking-wide mb-2 pb-1"
                    style={{ 
                      color: theme.primary,
                      borderBottom: `1px solid ${theme.primary}`
                    }}
                  >
                    Professional Summary
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
                    {data.summary}
                  </p>
                </section>
              )}

              {/* Work Experience */}
              {data.experience.length > 0 && (
                <section>
                  <h2 
                    className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                    style={{ 
                      color: theme.primary,
                      borderBottom: `1px solid ${theme.primary}`
                    }}
                  >
                    Professional Experience
                  </h2>
                  <div className="space-y-4">
                    {data.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: theme.text }}>
                              {exp.position}
                            </h3>
                            <p className="text-sm font-semibold" style={{ color: theme.secondary }}>
                              {exp.company}
                            </p>
                          </div>
                          <div className="text-xs font-medium" style={{ color: theme.text }}>
                            {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                          </div>
                        </div>
                        {exp.description && (
                          <ul className="ml-4 space-y-0.5">
                            {formatDescriptionAsBullets(exp.description).map((bullet, index) => (
                              <li key={index} className="text-xs leading-relaxed flex items-start">
                                <span 
                                  className="mr-2 mt-1.5 text-xs"
                                  style={{ color: theme.primary }}
                                >
                                  •
                                </span>
                                <span style={{ color: theme.text }}>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {data.projects.length > 0 && (
                <section>
                  <h2 
                    className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                    style={{ 
                      color: theme.primary,
                      borderBottom: `1px solid ${theme.primary}`
                    }}
                  >
                    Projects
                  </h2>
                  <div className="space-y-3">
                    {data.projects.map((project) => (
                      <div key={project.id}>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-sm font-bold" style={{ color: theme.text }}>
                            {project.name}
                          </h3>
                          {project.link && (
                            <a 
                              href={project.link} 
                              className="text-xs font-medium hover:underline transition-colors"
                              style={{ color: theme.primary }}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Project
                            </a>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-xs leading-relaxed mb-1" style={{ color: theme.text }}>
                            {project.description}
                          </p>
                        )}
                        {project.technologies && (
                          <p className="text-xs" style={{ color: theme.secondary }}>
                            <span className="font-semibold">Technologies:</span> {project.technologies}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <section>
                  <h2 
                    className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
                    style={{ 
                      color: theme.primary,
                      borderBottom: `1px solid ${theme.primary}`
                    }}
                  >
                    Education
                  </h2>
                  <div className="space-y-2">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-bold" style={{ color: theme.text }}>
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </h3>
                          <p className="text-sm font-semibold" style={{ color: theme.secondary }}>
                            {edu.institution}
                          </p>
                          {edu.gpa && (
                            <p className="text-xs" style={{ color: theme.text }}>
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                        <div className="text-xs font-medium" style={{ color: theme.text }}>
                          {formatDateRange(edu.startDate, edu.endDate, false)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Technical Skills */}
              {data.skills.length > 0 && (
                <section>
                  <h2 
                    className="text-sm font-bold uppercase tracking-wide mb-2 pb-1"
                    style={{ 
                      color: theme.primary,
                      borderBottom: `1px solid ${theme.primary}`
                    }}
                  >
                    Technical Skills
                  </h2>
                  <div className="text-xs leading-relaxed" style={{ color: theme.text }}>
                    {data.skills.join(' • ')}
                  </div>
                </section>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumePreview;
