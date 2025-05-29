
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

  return (
    <div className="space-y-6 font-inter">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Resume Preview</h2>
        <Button onClick={onDownload} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="shadow-xl border-0 bg-white">
        <CardContent className="p-0" id="resume-content">
          {/* Modern Header with Gradient Background */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-t-lg">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-3 tracking-tight">
                {data.personalInfo.firstName} {data.personalInfo.lastName}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {data.personalInfo.email && (
                  <div className="flex items-center gap-2 text-slate-200">
                    <Mail className="h-4 w-4 text-blue-400" />
                    <span>{data.personalInfo.email}</span>
                  </div>
                )}
                {data.personalInfo.phone && (
                  <div className="flex items-center gap-2 text-slate-200">
                    <Phone className="h-4 w-4 text-blue-400" />
                    <span>{data.personalInfo.phone}</span>
                  </div>
                )}
                {data.personalInfo.location && (
                  <div className="flex items-center gap-2 text-slate-200">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span>{data.personalInfo.location}</span>
                  </div>
                )}
                {data.personalInfo.linkedin && (
                  <div className="flex items-center gap-2 text-slate-200">
                    <Linkedin className="h-4 w-4 text-blue-400" />
                    <span className="truncate">{data.personalInfo.linkedin}</span>
                  </div>
                )}
                {data.personalInfo.github && (
                  <div className="flex items-center gap-2 text-slate-200">
                    <Github className="h-4 w-4 text-blue-400" />
                    <span className="truncate">{data.personalInfo.github}</span>
                  </div>
                )}
                {data.personalInfo.website && (
                  <div className="flex items-center gap-2 text-slate-200">
                    <Globe className="h-4 w-4 text-blue-400" />
                    <span className="truncate">{data.personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8 max-w-4xl mx-auto">
            {/* Professional Summary */}
            {data.summary && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold text-slate-900 tracking-wide">
                    PROFESSIONAL SUMMARY
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                </div>
                <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <p className="text-slate-700 leading-relaxed text-sm">{data.summary}</p>
                </div>
              </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 tracking-wide">
                    PROFESSIONAL EXPERIENCE
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                </div>
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={exp.id} className="relative">
                      {index > 0 && <div className="absolute -top-3 left-4 w-px h-3 bg-slate-200"></div>}
                      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">{exp.position}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600 font-medium text-base">{exp.company}</span>
                              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                              <span className="text-sm text-slate-600 font-medium">
                                {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-slate-700 leading-relaxed text-sm mt-3">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 tracking-wide">
                    KEY PROJECTS
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                </div>
                <div className="grid gap-4 md:grid-cols-1">
                  {data.projects.map((project) => (
                    <div key={project.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                        {project.link && (
                          <a 
                            href={project.link} 
                            className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors border-b border-blue-200 hover:border-blue-400"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-slate-700 mb-3 text-sm leading-relaxed">{project.description}</p>
                      )}
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs font-medium text-slate-600 mr-2">Technologies:</span>
                          {project.technologies.split(',').map((tech, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-200"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 tracking-wide">
                    EDUCATION
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                </div>
                <div className="space-y-4">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </h3>
                          <p className="text-blue-600 font-medium">{edu.institution}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm text-slate-600 font-medium">
                            {formatDateRange(edu.startDate, edu.endDate, false)}
                          </p>
                          {edu.gpa && (
                            <p className="text-sm text-slate-600 mt-1">
                              <span className="font-medium">GPA:</span> {edu.gpa}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 tracking-wide">
                    TECHNICAL SKILLS
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                </div>
                <div className="bg-slate-50 p-6 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-white text-slate-700 px-4 py-2 rounded-full text-sm font-medium border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumePreview;
