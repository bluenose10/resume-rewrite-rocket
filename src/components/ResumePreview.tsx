
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
}

interface ResumePreviewProps {
  data: ResumeData;
  onDownload: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, onDownload }) => {
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
    
    // Split by periods, semicolons, or line breaks and filter empty strings
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
        <Button onClick={onDownload} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="shadow-lg border border-gray-200 bg-white">
        <CardContent className="p-0" id="resume-content">
          <div className="max-w-4xl mx-auto bg-white">
            {/* Header Section */}
            <div className="text-center py-8 px-8 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-wide">
                {data.personalInfo.firstName} {data.personalInfo.lastName}
              </h1>
              
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
                {data.personalInfo.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4 text-red-600" />
                    <span>{data.personalInfo.email}</span>
                  </div>
                )}
                {data.personalInfo.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-red-600" />
                    <span>{data.personalInfo.phone}</span>
                  </div>
                )}
                {data.personalInfo.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span>{data.personalInfo.location}</span>
                  </div>
                )}
                {data.personalInfo.linkedin && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-4 w-4 text-red-600" />
                    <span className="truncate max-w-48">{data.personalInfo.linkedin}</span>
                  </div>
                )}
                {data.personalInfo.github && (
                  <div className="flex items-center gap-1">
                    <Github className="h-4 w-4 text-red-600" />
                    <span className="truncate max-w-48">{data.personalInfo.github}</span>
                  </div>
                )}
                {data.personalInfo.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-red-600" />
                    <span className="truncate max-w-48">{data.personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Professional Summary */}
              {data.summary && (
                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-red-600 inline-block">
                    PROFESSIONAL SUMMARY
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-sm">{data.summary}</p>
                </section>
              )}

              {/* Experience */}
              {data.experience.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 border-red-600 inline-block">
                    WORK EXPERIENCE
                  </h2>
                  <div className="space-y-5">
                    {data.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                            <p className="text-sm font-semibold text-gray-700">{exp.company}</p>
                          </div>
                          <div className="text-sm text-gray-600 text-right">
                            {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                          </div>
                        </div>
                        {exp.description && (
                          <ul className="ml-4 space-y-1">
                            {formatDescriptionAsBullets(exp.description).map((bullet, index) => (
                              <li key={index} className="text-sm text-gray-700 leading-relaxed flex items-start">
                                <span className="text-red-600 mr-2 mt-1.5 text-xs">•</span>
                                <span>{bullet}</span>
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
                  <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 border-red-600 inline-block">
                    PROJECTS
                  </h2>
                  <div className="space-y-4">
                    {data.projects.map((project) => (
                      <div key={project.id}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-base font-bold text-gray-900">{project.name}</h3>
                          {project.link && (
                            <a 
                              href={project.link} 
                              className="text-red-600 text-sm font-medium hover:text-red-800 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Project
                            </a>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-700 mb-2 leading-relaxed">{project.description}</p>
                        )}
                        {project.technologies && (
                          <p className="text-sm text-gray-600">
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
                  <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 border-red-600 inline-block">
                    EDUCATION
                  </h2>
                  <div className="space-y-3">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-bold text-gray-900">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </h3>
                          <p className="text-sm font-semibold text-gray-700">{edu.institution}</p>
                          {edu.gpa && (
                            <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDateRange(edu.startDate, edu.endDate, false)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {data.skills.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 border-red-600 inline-block">
                    TECHNICAL SKILLS
                  </h2>
                  <div className="text-sm text-gray-700 leading-relaxed">
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
