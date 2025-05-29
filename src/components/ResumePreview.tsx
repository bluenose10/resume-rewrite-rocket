
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resume Preview</h2>
        <Button onClick={onDownload} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-8" id="resume-content">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {data.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {data.personalInfo.email}
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {data.personalInfo.phone}
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {data.personalInfo.location}
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin className="h-4 w-4" />
                  {data.personalInfo.linkedin}
                </div>
              )}
              {data.personalInfo.github && (
                <div className="flex items-center gap-1">
                  <Github className="h-4 w-4" />
                  {data.personalInfo.github}
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {data.personalInfo.website}
                </div>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {data.summary && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
                EXPERIENCE
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
                PROJECTS
              </h2>
              <div className="space-y-4">
                {data.projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} className="text-blue-600 text-sm hover:underline">
                          View Project
                        </a>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-gray-700 mb-2">{project.description}</p>
                    )}
                    {project.technologies && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Technologies:</span> {project.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
                EDUCATION
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </h3>
                        <p className="text-blue-600 font-medium">{edu.institution}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {formatDateRange(edu.startDate, edu.endDate, false)}
                        </p>
                        {edu.gpa && (
                          <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
                SKILLS
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumePreview;
