
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import CVUploadRedesign from '@/components/cv/CVUploadRedesign';
import { useResumeFormData } from '@/hooks/useResumeFormData';
import { ResumeData } from '@/types/resume';

const ResumeBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');
  const { resumeData, updateResumeData } = useResumeFormData();

  const handleResumeDataExtracted = (extractedData: ResumeData) => {
    // Update the resume data with extracted content
    updateResumeData(extractedData);
    // Switch to the edit tab so user can review and modify
    setActiveTab('create');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resume Builder
        </h1>
        <p className="text-gray-600">
          Create a new resume from scratch or upload your existing CV for AI-powered redesign.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create/Edit Resume</TabsTrigger>
          <TabsTrigger value="upload">Upload & Redesign CV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResumeForm />
            <ResumePreview data={resumeData} />
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="mt-6">
          <CVUploadRedesign onResumeDataExtracted={handleResumeDataExtracted} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
