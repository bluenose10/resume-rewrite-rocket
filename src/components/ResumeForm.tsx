import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ColorThemeSelector from './ColorThemeSelector';
import PersonalInfoForm from './forms/PersonalInfoForm';
import PersonalStatementForm from './forms/PersonalStatementForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import ProjectsForm from './forms/ProjectsForm';
import AchievementsForm from './forms/AchievementsForm';
import { ResumeData, ColorTheme, PersonalInfo, Experience, Education, Project, Achievement, SectionConfig } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';

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
  const { toast } = useToast();
  
  const getInitialResumeData = (): ResumeData => {
    return initialData || {
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
      theme: DEFAULT_THEMES[1]
    };
  };

  const [resumeData, setResumeData] = useState<ResumeData>(getInitialResumeData());
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  // Sync form state when initialData changes
  useEffect(() => {
    if (initialData) {
      setResumeData(initialData);
    }
  }, [initialData]);

  const updateData = (updates: Partial<ResumeData>) => {
    const updated = { ...resumeData, ...updates };
    setResumeData(updated);
    onDataChange(updated);
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    updateData({
      personalInfo: { ...resumeData.personalInfo, [field]: value }
    });
  };

  const updatePersonalStatement = (value: string) => {
    updateData({ personalStatement: value });
  };

  const updateSummary = (value: string) => {
    updateData({ summary: value });
  };

  const updateTheme = (theme: ColorTheme) => {
    updateData({ theme });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    updateData({ experience: [...resumeData.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    updateData({
      experience: resumeData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    updateData({
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      classification: ''
    };
    updateData({ education: [...resumeData.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    updateData({
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    updateData({
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    updateData({ projects: [...resumeData.projects, newProject] });
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    updateData({
      projects: resumeData.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    });
  };

  const removeProject = (id: string) => {
    updateData({
      projects: resumeData.projects.filter(proj => proj.id !== id)
    });
  };

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
      organization: ''
    };
    updateData({ achievements: [...resumeData.achievements, newAchievement] });
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    updateData({
      achievements: resumeData.achievements.map(ach => 
        ach.id === id ? { ...ach, [field]: value } : ach
      )
    });
  };

  const removeAchievement = (id: string) => {
    updateData({
      achievements: resumeData.achievements.filter(ach => ach.id !== id)
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      updateData({ skills: [...resumeData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    updateData({ skills: resumeData.skills.filter((_, i) => i !== index) });
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      updateData({ interests: [...resumeData.interests, newInterest.trim()] });
      setNewInterest('');
    }
  };

  const removeInterest = (index: number) => {
    updateData({ interests: resumeData.interests.filter((_, i) => i !== index) });
  };

  // Helper function to check if section is visible
  const isSectionVisible = (sectionId: string) => {
    const section = sectionConfig.find(s => s.id === sectionId);
    return section ? section.visible : true; // Default to visible if not found
  };

  // Render section based on visibility
  const renderSection = (sectionId: string, component: React.ReactNode) => {
    return isSectionVisible(sectionId) ? component : null;
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Color Theme Selection - Always visible */}
      <ColorThemeSelector
        selectedTheme={resumeData.theme || DEFAULT_THEMES[1]}
        onThemeChange={updateTheme}
      />

      {/* Personal Information - Always visible */}
      <PersonalInfoForm
        personalInfo={resumeData.personalInfo}
        onPersonalInfoChange={updatePersonalInfo}
      />

      {/* Personal Statement and Summary */}
      {(isSectionVisible('personalStatement') || isSectionVisible('summary')) && (
        <PersonalStatementForm
          personalStatement={resumeData.personalStatement}
          summary={resumeData.summary}
          onPersonalStatementChange={updatePersonalStatement}
          onSummaryChange={updateSummary}
        />
      )}

      {/* Experience - Required section */}
      {renderSection('experience', (
        <ExperienceForm
          experience={resumeData.experience}
          onAdd={addExperience}
          onUpdate={updateExperience}
          onRemove={removeExperience}
        />
      ))}

      {/* Education - Required section */}
      {renderSection('education', (
        <EducationForm
          education={resumeData.education}
          onAdd={addEducation}
          onUpdate={updateEducation}
          onRemove={removeEducation}
        />
      ))}

      {/* Projects */}
      {renderSection('projects', (
        <ProjectsForm
          projects={resumeData.projects}
          onAdd={addProject}
          onUpdate={updateProject}
          onRemove={removeProject}
        />
      ))}

      {/* Skills and Interests */}
      {(isSectionVisible('skills') || isSectionVisible('interests')) && (
        <SkillsForm
          skills={resumeData.skills}
          interests={resumeData.interests}
          newSkill={newSkill}
          newInterest={newInterest}
          onNewSkillChange={setNewSkill}
          onNewInterestChange={setNewInterest}
          onAddSkill={addSkill}
          onAddInterest={addInterest}
          onRemoveSkill={removeSkill}
          onRemoveInterest={removeInterest}
        />
      )}

      {/* Achievements */}
      {renderSection('achievements', (
        <AchievementsForm
          achievements={resumeData.achievements}
          onAdd={addAchievement}
          onUpdate={updateAchievement}
          onRemove={removeAchievement}
        />
      ))}

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
