
import React, { useState } from 'react';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import { useToast } from '@/hooks/use-toast';
import { optimizeResumeContent } from '@/services/openaiService';
import { generatePDF } from '@/utils/pdfGenerator';

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

const Index = () => {
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: []
  });
  
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleDataChange = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleOptimize = async () => {
    if (!resumeData.summary && resumeData.experience.length === 0 && resumeData.projects.length === 0) {
      toast({
        title: "No Content to Optimize",
        description: "Please add some content to your resume before optimizing.",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      console.log('Starting resume optimization...');
      const optimizedContent = await optimizeResumeContent(resumeData);
      console.log('Optimization completed:', optimizedContent);

      // Update resume data with optimized content
      const updatedData = { ...resumeData };
      
      if (optimizedContent.summary) {
        updatedData.summary = optimizedContent.summary;
      }

      if (optimizedContent.experience && optimizedContent.experience.length > 0) {
        updatedData.experience = updatedData.experience.map((exp, index) => ({
          ...exp,
          description: optimizedContent.experience[index]?.description || exp.description
        }));
      }

      if (optimizedContent.projects && optimizedContent.projects.length > 0) {
        updatedData.projects = updatedData.projects.map((proj, index) => ({
          ...proj,
          description: optimizedContent.projects[index]?.description || proj.description
        }));
      }

      setResumeData(updatedData);
      
      toast({
        title: "Resume Optimized!",
        description: "Your resume content has been enhanced for better ATS compatibility and impact."
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to optimize resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const fileName = `${resumeData.personalInfo.firstName || 'Resume'}_${resumeData.personalInfo.lastName || 'Document'}.pdf`;
      await generatePDF('resume-content', fileName);
      
      toast({
        title: "PDF Downloaded!",
        description: "Your resume has been saved as a PDF file."
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Resume Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional, ATS-friendly resume with AI optimization. 
            Fill in your information and let our AI enhance your content for maximum impact.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <div className="lg:max-h-screen lg:overflow-y-auto lg:pr-4">
            <ResumeForm
              onDataChange={handleDataChange}
              onOptimize={handleOptimize}
              isOptimizing={isOptimizing}
            />
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8">
            <ResumePreview
              data={resumeData}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
