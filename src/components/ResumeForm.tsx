
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import ColorThemeSelector from './ColorThemeSelector';
import PersonalInfoForm from './forms/PersonalInfoForm';
import FormSectionRenderer from './forms/FormSectionRenderer';
import LoadingSkeleton from './LoadingSkeleton';
import { ResumeData, SectionConfig } from '@/types/resume';
import { useResumeFormData } from '@/hooks/useResumeFormData';
import { useAutoSave } from '@/hooks/useAutoSave';

interface ResumeFormProps {
  initialData?: ResumeData;
  sectionConfig?: SectionConfig[];
  onDataChange: (data: ResumeData) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ 
  initialData, 
  sectionConfig = [],
  onDataChange, 
  onOptimize, 
  isOptimizing 
}) => {
  const formData = useResumeFormData({ initialData, onDataChange });
  
  // Auto-save functionality
  useAutoSave({ data: formData.resumeData });

  // Use the sectionConfig from props (which comes from the parent's state)
  // rather than the one from formData to ensure immediate updates
  const currentSectionConfig = sectionConfig.length > 0 ? sectionConfig : formData.resumeData.sectionConfig || [];

  if (isOptimizing) {
    return (
      <div className="space-y-6 max-w-2xl">
        <LoadingSkeleton type="optimization" />
        <div className="text-center text-gray-600">
          <p>Our AI is optimizing your resume content...</p>
          <p className="text-sm mt-1">This usually takes 10-30 seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Color Theme Selection - Always visible */}
      <ColorThemeSelector
        selectedTheme={formData.resumeData.theme}
        onThemeChange={formData.updateTheme}
      />

      {/* Personal Information - Always visible */}
      <PersonalInfoForm
        personalInfo={formData.resumeData.personalInfo}
        onPersonalInfoChange={formData.updatePersonalInfo}
      />

      {/* Dynamic Sections based on visibility */}
      <FormSectionRenderer
        sectionConfig={currentSectionConfig}
        formData={formData}
      />

      {/* Optimize Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={onOptimize} 
            disabled={isOptimizing}
            className="w-full"
            size="lg"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {isOptimizing ? 'Optimizing Resume...' : 'Optimize Resume with AI'}
          </Button>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Our AI will enhance your content for better ATS compatibility and impact
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeForm;
