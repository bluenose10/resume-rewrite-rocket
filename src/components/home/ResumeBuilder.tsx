
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Eye, Edit3, Upload } from 'lucide-react';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import SectionLayoutManager from '@/components/SectionLayoutManager';
import ResumeHelpModal from '@/components/help/ResumeHelpModal';
import CVUploadModal from '@/components/CVUploadModal';
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
  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(false);

  const handleCVUploadSuccess = (uploadedCvId: string) => {
    // TODO: Implement CV redesign functionality
    console.log('CV uploaded with ID:', uploadedCvId);
    // This will be connected to the redesign engine in the next phase
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Mobile Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              ← Back to Home
            </Button>
            
            {/* Help buttons and CV Upload */}
            <div className="flex items-center gap-2">
              <CVUploadModal onUploadSuccess={handleCVUploadSuccess}>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Existing CV
                </Button>
              </CVUploadModal>
              
              <div className="hidden sm:flex items-center gap-2">
                <ResumeHelpModal />
              </div>
              
              {/* Mobile Preview Toggle */}
              <div className="lg:hidden">
                <Sheet open={showPreview} onOpenChange={setShowPreview}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-[90vw] p-0">
                    <div className="h-full overflow-y-auto p-4">
                      <ResumePreview data={resumeData} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
          
          {/* Mobile help buttons and CV Upload */}
          <div className="sm:hidden flex items-center gap-2 mt-3">
            <CVUploadModal onUploadSuccess={handleCVUploadSuccess}>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload CV
              </Button>
            </CVUploadModal>
            <ResumeHelpModal />
          </div>
        </div>

        {/* Mobile Title */}
        <div className="text-center mb-6 sm:mb-12 px-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2 sm:mb-4">
            AI-Powered Resume Builder
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional, ATS-friendly resume with AI optimization. 
            Fill in your information and let our AI enhance your content for maximum impact.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 items-start">
          <div className="lg:max-h-screen lg:overflow-y-auto lg:pr-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content" className="text-sm sm:text-base">Content</TabsTrigger>
                <TabsTrigger value="layout" className="text-sm sm:text-base">Layout</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-6">
                <ResumeForm
                  initialData={resumeData}
                  sectionConfig={resumeData.sectionConfig}
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

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="content" className="text-sm flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                <span className="hidden sm:inline">Content</span>
                <span className="sm:hidden">Edit</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="text-sm flex items-center gap-2">
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">Layout</span>
                <span className="sm:hidden">Layout</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-6">
              <ResumeForm
                initialData={resumeData}
                sectionConfig={resumeData.sectionConfig}
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
      </div>
    </div>
  );
};

export default ResumeBuilder;
