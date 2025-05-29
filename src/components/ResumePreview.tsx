import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResumeData } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';
import ExportOptionsModal from './ExportOptionsModal';
import { generateEnhancedPDF, ExportOptions } from '@/utils/enhancedPdfGenerator';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const { toast } = useToast();
  const theme = data.theme || DEFAULT_THEMES[0];
  const [isExporting, setIsExporting] = React.useState(false);

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

  const handleExport = async (options: ExportOptions) => {
    setIsExporting(true);
    try {
      const fileName = `${data.personalInfo.firstName || 'Resume'}_${data.personalInfo.lastName || 'Document'}.${options.format}`;
      await generateEnhancedPDF('resume-content', fileName, options);
      
      toast({
        title: "Export Successful!",
        description: `Your resume has been exported as ${options.format.toUpperCase()}.`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const isVisible = (sectionId: string) => {
    const sectionConfig = data.sectionConfig?.find(s => s.id === sectionId);
    return sectionConfig?.visible !== false;
  };

  const hasContent = (sectionId: string) => {
    switch (sectionId) {
      case 'personalStatement': return !!data.personalStatement;
      case 'summary': return !!data.summary;
      case 'experience': return data.experience?.length > 0;
      case 'projects': return data.projects?.length > 0;
      case 'education': return data.education?.length > 0;
      case 'skills': return data.skills?.length > 0;
      case 'achievements': return data.achievements?.length > 0;
      case 'certifications': return data.certifications?.length > 0;
      case 'languages': return data.languages?.length > 0;
      case 'volunteerExperience': return data.volunteerExperience?.length > 0;
      case 'publications': return data.publications?.length > 0;
      case 'references': return data.references?.length > 0;
      case 'interests': return data.interests?.length > 0;
      default: return false;
    }
  };

  const renderSection = (sectionId: string) => {
    if (!isVisible(sectionId) || !hasContent(sectionId)) return null;

    switch (sectionId) {
      case 'personalStatement':
        return (
          <section key={sectionId}>
            <h2 
              className="text-sm font-bold uppercase tracking-wide mb-2 pb-1"
              style={{ 
                color: theme.primary,
                borderBottom: `1px solid ${theme.primary}`
              }}
            >
              Personal Statement
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
              {data.personalStatement}
            </p>
          </section>
        );

      case 'summary':
        return (
          <section key={sectionId}>
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
        );

      case 'experience':
        return (
          <section key={sectionId}>
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
        );

      case 'projects':
        return (
          <section key={sectionId}>
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
        );

      case 'education':
        return (
          <section key={sectionId}>
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
        );

      case 'skills':
        return (
          <section key={sectionId}>
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
        );

      case 'achievements':
        return (
          <section key={sectionId}>
            <h2 
              className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
              style={{ 
                color: theme.primary,
                borderBottom: `1px solid ${theme.primary}`
              }}
            >
              Achievements & Awards
            </h2>
            <div className="space-y-3">
              {data.achievements.map((achievement) => (
                <div key={achievement.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold" style={{ color: theme.text }}>
                      {achievement.title}
                    </h3>
                    <div className="text-xs font-medium" style={{ color: theme.text }}>
                      {formatDate(achievement.date)}
                    </div>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: theme.secondary }}>
                    {achievement.organization}
                  </p>
                  {achievement.description && (
                    <p className="text-xs leading-relaxed" style={{ color: theme.text }}>
                      {achievement.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        return (
          <section key={sectionId}>
            <h2 
              className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
              style={{ 
                color: theme.primary,
                borderBottom: `1px solid ${theme.primary}`
              }}
            >
              Certifications & Licenses
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: theme.text }}>
                      {cert.name}
                    </h3>
                    <p className="text-sm font-semibold" style={{ color: theme.secondary }}>
                      {cert.issuer}
                    </p>
                    {cert.credentialId && (
                      <p className="text-xs" style={{ color: theme.text }}>
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                  <div className="text-xs font-medium text-right" style={{ color: theme.text }}>
                    <div>{formatDate(cert.date)}</div>
                    {cert.expiryDate && (
                      <div className="text-xs" style={{ color: theme.secondary }}>
                        Expires: {formatDate(cert.expiryDate)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'languages':
        return (
          <section key={sectionId}>
            <h2 
              className="text-sm font-bold uppercase tracking-wide mb-2 pb-1"
              style={{ 
                color: theme.primary,
                borderBottom: `1px solid ${theme.primary}`
              }}
            >
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {data.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span className="text-sm font-medium" style={{ color: theme.text }}>
                    {lang.language}
                  </span>
                  <span className="text-xs" style={{ color: theme.secondary }}>
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'volunteerExperience':
        return (
          <section key={sectionId}>
            <h2 
              className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
              style={{ 
                color: theme.primary,
                borderBottom: `1px solid ${theme.primary}`
              }}
            >
              Volunteer Experience
            </h2>
            <div className="space-y-4">
              {data.volunteerExperience.map((vol) => (
                <div key={vol.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: theme.text }}>
                        {vol.role}
                      </h3>
                      <p className="text-sm font-semibold" style={{ color: theme.secondary }}>
                        {vol.organization}
                      </p>
                    </div>
                    <div className="text-xs font-medium" style={{ color: theme.text }}>
                      {formatDateRange(vol.startDate, vol.endDate, vol.current)}
                    </div>
                  </div>
                  {vol.description && (
                    <ul className="ml-4 space-y-0.5">
                      {formatDescriptionAsBullets(vol.description).map((bullet, index) => (
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
        );

      case 'publications':
        return (
          <section key={sectionId}>
            <h2 
              className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
              style={{ 
                color: theme.primary,
                borderBottom: `1px solid ${theme.primary}`
              }}
            >
              Publications
            </h2>
            <div className="space-y-3">
              {data.publications.map((pub) => (
                <div key={pub.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold" style={{ color: theme.text }}>
                      {pub.title}
                    </h3>
                    {pub.link && (
                      <a 
                        href={pub.link} 
                        className="text-xs font-medium hover:underline transition-colors"
                        style={{ color: theme.primary }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    )}
                  </div>
                  <p className="text-xs mb-1" style={{ color: theme.text }}>
                    <span className="font-semibold">Authors:</span> {pub.authors}
                  </p>
                  <p className="text-xs" style={{ color: theme.secondary }}>
                    {pub.publication} • {formatDate(pub.date)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'references':
        return (
          <section key={sectionId}>
            <h2 
              className="text-sm font-bold uppercase tracking-wide mb-3 pb-1"
              style={{ 
                color: theme.primary,
                borderBottom: `1px solid ${theme.primary}`
              }}
            >
              References
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.references.map((ref) => (
                <div key={ref.id} className="text-xs">
                  <h3 className="text-sm font-bold" style={{ color: theme.text }}>
                    {ref.name}
                  </h3>
                  <p className="font-semibold" style={{ color: theme.secondary }}>
                    {ref.title}
                  </p>
                  <p style={{ color: theme.text }}>{ref.company}</p>
                  <p style={{ color: theme.text }}>{ref.relationship}</p>
                  <p style={{ color: theme.text }}>{ref.email}</p>
                  <p style={{ color: theme.text }}>{ref.phone}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'interests':
        return (
          <section key={sectionId}>
            <h2 
              className="text-sm font-bold uppercase tracking-wide mb-2 pb-1"
              style={{ 
                color: theme.primary,
                borderBottom: `1px solid ${theme.primary}`
              }}
            >
              Interests & Hobbies
            </h2>
            <div className="text-xs leading-relaxed" style={{ color: theme.text }}>
              {data.interests.join(' • ')}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const getSectionOrder = () => {
    if (data.sectionOrder && data.sectionConfig) {
      return data.sectionOrder;
    }
    // Default order if not specified
    return [
      'personalStatement', 'summary', 'experience', 'projects', 'education',
      'skills', 'achievements', 'certifications', 'languages',
      'volunteerExperience', 'publications', 'references', 'interests'
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Resume Preview</h2>
        <ExportOptionsModal onExport={handleExport} isExporting={isExporting} />
      </div>

      <Card className="shadow-lg border border-gray-200 bg-white">
        <CardContent className="p-0" id="resume-content">
          <div className="max-w-4xl mx-auto bg-white text-gray-900">
            {/* Professional Header */}
            <div className="px-8 py-6 text-center">
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
              {getSectionOrder().map(sectionId => renderSection(sectionId))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumePreview;
