
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResumeData } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';
import ExportOptionsModal from './ExportOptionsModal';
import PersonalInfoHeader from './PersonalInfoHeader';
import SectionRenderer from './SectionRenderer';
import { generateEnhancedPDF, ExportOptions } from '@/utils/enhancedPdfGenerator';
import { useToast } from '@/hooks/use-toast';

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const { toast } = useToast();
  const theme = data.theme || DEFAULT_THEMES[0];
  const [isExporting, setIsExporting] = React.useState(false);

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
    return <SectionRenderer key={sectionId} sectionId={sectionId} data={data} theme={theme} />;
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
            <PersonalInfoHeader personalInfo={data.personalInfo} theme={theme} />
            <div className="px-8 py-4">
              {getSectionOrder().map(sectionId => renderSection(sectionId))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumePreview;
