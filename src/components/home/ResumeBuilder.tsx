
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import SectionLayoutManager from '@/components/SectionLayoutManager';
import { ResumeData, SectionConfig } from '@/types/resume';

interface ResumeBuilderProps {
  resumeData: ResumeData;
  isOptimizing: boolean;
  onBack: () => void;
  onDataChange: (data: ResumeData) => void;
  onSectionReorder: (newOrder: SectionConfig[]) => void;
  onToggleVisibility: (sectionId: string) => void;
  onResetLayout: () => void;
  onOptimize: () => void;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  resumeData,
  isOptimizing,
  onBack,
  onDataChange,
  onSectionReorder,
  onToggleVisibility,
  onResetLayout,
  onOptimize,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            ← Back to Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            AI-Powered Resume Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional, ATS-friendly resume with AI optimization. 
            Fill in your information and let our AI enhance your content for maximum impact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="lg:max-h-screen lg:overflow-y-auto lg:pr-4">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-6">
                <ResumeForm
                  initialData={resumeData}
                  onDataChange={onDataChange}
                  onOptimize={onOptimize}
                  isOptimizing={isOptimizing}
                />
              </TabsContent>
              <TabsContent value="layout" className="space-y-6">
                <SectionLayoutManager
                  sections={resumeData.sectionConfig || []}
                  onReorder={onSectionReorder}
                  onToggleVisibility={onToggleVisibility}
                  onResetLayout={onResetLayout}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:sticky lg:top-8">
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
