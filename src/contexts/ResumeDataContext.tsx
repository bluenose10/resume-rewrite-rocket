import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useResumeStats } from '@/hooks/useResumeStats';
import { optimizeResumeContent } from '@/services/openaiService';
import { generateEnhancedPDF } from '@/utils/enhancedPdfGenerator';
import { ResumeData, SectionConfig } from '@/types/resume';
import { DEFAULT_SECTION_ORDER } from '@/constants/sectionConfig';

interface ResumeDataContextType {
  resumeData: ResumeData;
  isOptimizing: boolean;
  handleDataChange: (data: ResumeData) => void;
  handleSectionReorder: (newOrder: SectionConfig[]) => void;
  handleToggleVisibility: (sectionId: string) => void;
  handleResetLayout: () => void;
  handleOptimize: () => Promise<void>;
  handleDownload: () => Promise<void>;
}

const ResumeDataContext = createContext<ResumeDataContextType | undefined>(undefined);

export const useResumeData = () => {
  const context = useContext(ResumeDataContext);
  if (!context) {
    throw new Error('useResumeData must be used within a ResumeDataProvider');
  }
  return context;
};

interface ResumeDataProviderProps {
  children: React.ReactNode;
}

export const ResumeDataProvider: React.FC<ResumeDataProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const { incrementResumeCount } = useResumeStats();
  const [isOptimizing, setIsOptimizing] = useState(false);
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
    personalStatement: '',
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: [],
    achievements: [],
    certifications: [],
    languages: [],
    volunteerExperience: [],
    references: [],
    publications: [],
    interests: [],
    sectionOrder: DEFAULT_SECTION_ORDER.map(s => s.id),
    sectionConfig: DEFAULT_SECTION_ORDER
  });

  const handleDataChange = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleSectionReorder = (newOrder: SectionConfig[]) => {
    setResumeData(prev => ({
      ...prev,
      sectionConfig: newOrder,
      sectionOrder: newOrder.map(s => s.id)
    }));
  };

  const handleToggleVisibility = (sectionId: string) => {
    setResumeData(prev => ({
      ...prev,
      sectionConfig: prev.sectionConfig?.map(section => 
        section.id === sectionId 
          ? { ...section, visible: !section.visible }
          : section
      ) || DEFAULT_SECTION_ORDER
    }));
  };

  const handleResetLayout = () => {
    setResumeData(prev => ({
      ...prev,
      sectionConfig: [...DEFAULT_SECTION_ORDER],
      sectionOrder: DEFAULT_SECTION_ORDER.map(s => s.id)
    }));
    toast({
      title: "Layout Reset",
      description: "Section layout has been reset to default order."
    });
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
      await generateEnhancedPDF('resume-content', fileName);
      
      await incrementResumeCount();
      
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

  const value = {
    resumeData,
    isOptimizing,
    handleDataChange,
    handleSectionReorder,
    handleToggleVisibility,
    handleResetLayout,
    handleOptimize,
    handleDownload
  };

  return (
    <ResumeDataContext.Provider value={value}>
      {children}
    </ResumeDataContext.Provider>
  );
};
