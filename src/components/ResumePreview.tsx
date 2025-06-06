
import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import ExportOptionsModal from './ExportOptionsModal';
import SimpleResumePreview from './SimpleResumePreview';
import { generatePDF } from '@/utils/pdfGenerator';
import { ExportOptions } from '@/types/export';
import { useToast } from '@/hooks/use-toast';

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview: React.FC<ResumePreviewProps> = React.memo(({ data }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (options: ExportOptions) => {
    setIsExporting(true);
    try {
      const fileName = `${data.personalInfo.firstName || 'Resume'}_${data.personalInfo.lastName || 'Document'}.${options.format}`;
      const pdfUrl = await generatePDF('resume-content', fileName, options);
      
      // Open the PDF in a new tab
      window.open(pdfUrl, '_blank');
      
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Resume Preview</h2>
        <ExportOptionsModal onExport={handleExport} isExporting={isExporting} />
      </div>

      <div id="resume-content" className="overflow-x-auto">
        <SimpleResumePreview data={data} />
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
