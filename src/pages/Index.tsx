
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useResumeStats } from '@/hooks/useResumeStats';
import { optimizeResumeContent } from '@/services/openaiService';
import { generatePDF } from '@/utils/pdfGenerator';
import { ResumeData, SectionConfig } from '@/types/resume';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import ResumeBuilder from '@/components/home/ResumeBuilder';

const DEFAULT_SECTION_ORDER: SectionConfig[] = [
  { id: 'personalStatement', title: 'Personal Statement', visible: true },
  { id: 'summary', title: 'Professional Summary', visible: true },
  { id: 'experience', title: 'Work Experience', visible: true, required: true },
  { id: 'projects', title: 'Projects', visible: true },
  { id: 'education', title: 'Education', visible: true, required: true },
  { id: 'skills', title: 'Technical Skills', visible: true },
  { id: 'achievements', title: 'Achievements & Awards', visible: false },
  { id: 'certifications', title: 'Certifications & Licenses', visible: false },
  { id: 'languages', title: 'Languages', visible: false },
  { id: 'volunteerExperience', title: 'Volunteer Experience', visible: false },
  { id: 'publications', title: 'Publications', visible: false },
  { id: 'references', title: 'References', visible: false },
  { id: 'interests', title: 'Interests & Hobbies', visible: false },
];

const Index = () => {
  const { toast } = useToast();
  const { stats, incrementResumeCount } = useResumeStats();
  const [showBuilder, setShowBuilder] = useState(false);
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
  
  const [isOptimizing, setIsOptimizing] = useState(false);

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
      await generatePDF('resume-content', fileName);
      
      // Increment the resume count when PDF is downloaded
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

  if (showBuilder) {
    return (
      <ResumeBuilder
        resumeData={resumeData}
        isOptimizing={isOptimizing}
        onBack={() => setShowBuilder(false)}
        onDataChange={handleDataChange}
        onSectionReorder={handleSectionReorder}
        onToggleVisibility={handleToggleVisibility}
        onResetLayout={handleResetLayout}
        onOptimize={handleOptimize}
      />
    );
  }

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      {/* Mobile-optimized background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-brand-cyan/20 rounded-full opacity-30 floating-particle"></div>
        <div className="absolute top-10 sm:top-20 -left-10 sm:-left-20 w-30 sm:w-60 h-30 sm:h-60 bg-brand-medium-blue/30 rounded-full opacity-40 floating-particle"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-20 sm:w-40 h-20 sm:h-40 bg-brand-cyan/25 rounded-full opacity-35 floating-particle"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-brand-cyan/10 rounded-full opacity-20"></div>
        <div className="absolute top-3/4 -left-20 sm:-left-40 w-36 sm:w-72 h-36 sm:h-72 bg-brand-medium-blue/20 rounded-full opacity-25 floating-particle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-28 sm:w-56 h-28 sm:h-56 bg-brand-cyan/15 rounded-full opacity-30 floating-particle"></div>
      </div>
      
      {/* All sections with mobile-first design */}
      <div className="relative z-10">
        <HeroSection 
          onStartBuilding={() => setShowBuilder(true)}
          totalResumes={stats.totalResumes}
        />
        <FeaturesSection />
        <HowItWorksSection onStartBuilding={() => setShowBuilder(true)} />
        <TestimonialsSection />
        <CTASection onStartBuilding={() => setShowBuilder(true)} />
      </div>
    </div>
  );
};

export default Index;
